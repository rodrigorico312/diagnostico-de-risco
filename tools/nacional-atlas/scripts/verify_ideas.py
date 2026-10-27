"""Verify only the three curated text excerpts and two original-video metadata sets.

No video speech is transcribed or inferred. Failures remain in the public report.
Run separately from builds: python scripts/verify_ideas.py
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request,urlopen
import datetime,hashlib,json,re,unicodedata

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'research/ideas.json').read_text(encoding='utf-8'))
sources={s['id']:s for s in data['sources']}
class Text(HTMLParser):
    def __init__(self): super().__init__(convert_charrefs=True);self.parts=[];self.blocked=0
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'):self.blocked+=1
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.blocked=max(0,self.blocked-1)
    def handle_data(self,value):
        if not self.blocked:self.parts.append(value)
def normalize(value): return ' '.join(unicodedata.normalize('NFKC',value).replace('\u00ad','').split()).casefold()
records=[]
for e in data['events']:
    statement=e.get('statement')
    video=e['id'] in ('fraga-ancap-2012','fraga-bitcoin-2012')
    if not statement and not video:continue
    source=statement['source'] if statement else e['sources'][0]
    url=sources[source]['url']
    result={'event':'ideas:'+e['id'],'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'video_metadata_only' if video else 'literal_excerpt'}
    try:
        with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 NacionalAtlas-SourceVerification/1.0'}),timeout=25) as response:
            raw=response.read();result.update(httpStatus=response.status,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw))
        html=raw.decode('utf-8','replace')
        if video:
            def field(name):
                found=re.search('"'+name+'"\\s*:\\s*"([^"]+)"',html)
                if not found: raise ValueError('Metadado ausente: '+name)
                return json.loads('"'+found.group(1)+'"')
            title,author,stamp=field('title'),field('ownerChannelName'),field('publishDate')
            expected='Anarcocapitalismo: o futuro' if e['id']=='fraga-ancap-2012' else 'Bitcoin seja louvado'
            utc=datetime.datetime.fromisoformat(stamp).astimezone(datetime.timezone.utc)
            result.update(title=title,channel=author,publishedAtOriginal=stamp,publishedAtUTC=utc.isoformat(),speechTranscribed=False,verified=title==expected and author=='Daniel Fraga' and utc.date().isoformat()==e['date'])
        else:
            parser=Text();parser.feed(html)
            result.update(quotationFound=normalize(statement['excerpt']) in normalize(' '.join(parser.parts)))
            result['verified']=result['quotationFound']
    except Exception as error:result.update(verified=False,error=str(error))
    records.append(result)
out={'method':'Confere ocorrência de três trechos literais em HTML e título, canal e data de publicação de dois vídeos. Não avalia a veracidade das alegações, não transcreve áudio e não audita integralmente as vinte novas referências. Data dos vídeos normalizada para UTC. Hash é do conteúdo recebido na consulta.','records':records}
(ROOT/'public/history-data/ideas-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps([{'event':r['event'],'verified':r['verified'],'scope':r['scope'],'error':r.get('error')} for r in records],ensure_ascii=True))
if not all(r['verified'] for r in records): raise SystemExit(1)
