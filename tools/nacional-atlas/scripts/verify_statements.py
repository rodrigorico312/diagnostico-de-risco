"""Recheck curated quotations against their primary HTML sources; never generate facts.

Run separately from the build because availability and content of publishers change.
Writes an inspectable report, including retrieval failures and raw-content hashes.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request, urlopen
import datetime,hashlib,json,re,unicodedata

ROOT=Path(__file__).resolve().parents[1]
class Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True);self.parts=[];self.blocked=0
    def handle_starttag(self,tag,attrs):
        if tag in ['script','style']:self.blocked+=1
    def handle_endtag(self,tag):
        if tag in ['script','style']:self.blocked=max(0,self.blocked-1)
    def handle_data(self,data):
        if not self.blocked:self.parts.append(data)
def normalize(text):
    text=' '.join(unicodedata.normalize('NFKC',text).replace('\u00ad','').split()).casefold()
    return re.sub(r'\s+([,.!?:;])',r'\1',text)

data=json.loads((ROOT/'research/statements.json').read_text(encoding='utf8'))
sources={s['id']:s for s in data['sources']};report=[]
for event in data['events']:
    statement=event.get('statement')
    if not statement:continue
    url=sources[statement['source']]['url']
    result={'event':event['id'],'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        with urlopen(Request(url,headers={'User-Agent':'NacionalAtlas-SourceVerification/1.0'}),timeout=25) as response:
            raw=response.read();result.update(status=response.status,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw))
        matched=False
        for encoding in ['utf8','cp1252']:
            extractor=Text();extractor.feed(raw.decode(encoding,errors='replace'))
            if normalize(statement['excerpt']) in normalize(' '.join(extractor.parts)):matched=True;break
        result['quotationFound']=matched
    except Exception as error:
        result.update(quotationFound=None,error=str(error))
    report.append(result)
out=ROOT/'public/history-data/statements-audit.json'
out.write_text(json.dumps({'method':'HTML text extraction; whitespace/NFKC/case normalization and removal of spacing before punctuation. Confirms the excerpt occurs, not the truth of its claims.','records':report},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps([{'event':r['event'],'quotationFound':r['quotationFound'],'status':r.get('status'),'error':r.get('error')} for r in report],ensure_ascii=True))
if not all(r['quotationFound'] is True for r in report):raise SystemExit(1)
