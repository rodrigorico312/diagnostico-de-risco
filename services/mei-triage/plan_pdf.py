"""Session PDF, generated locally with ReportLab. No external document service."""
from pathlib import Path
from io import BytesIO
from datetime import datetime,timezone,timedelta
from xml.sax.saxutils import escape
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor,white
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=Path(__file__).parent
FONT_PATHS=[Path('/usr/share/fonts/truetype/dejavu'),Path('C:/Windows/Fonts')]
LABELS={
'simei_check':('Enquadramento atual',{'yes':'MEI','no':'Não é MEI hoje','unknown':'Ainda precisa conferir'}),
'debt':('Dívidas em aberto',{'yes':'Encontrou débitos','no':'Não encontrou após conferir','unknown':'Ainda precisa conferir'}),
'debt_period':('Vencimentos dos débitos',{'before':'Até 13/10/2026','after':'Depois de 13/10/2026','both':'Antes e depois do corte','unknown':'Ainda precisa separar'}),
'installment':('Parcelamento',{'yes':'Tem acordo','no':'Não tem','unknown':'Ainda precisa conferir'}),
'installment_channel':('Canal do parcelamento',{'rfb':'Receita Federal','pgfn':'PGFN / Regularize','both':'Nos dois órgãos','unknown':'Ainda precisa identificar'}),
'lawsuit':('Processo judicial',{'yes':'Há processo','no':'Não identificou processo','unknown':'Ainda precisa conferir'}),
'payments':('Guias mensais atuais',{'yes':'Em dia','no':'Há atraso','unknown':'Ainda precisa conferir'})}
def fonts():
 if 'MeiSans' in pdfmetrics.getRegisteredFontNames():return
 for folder in FONT_PATHS:
  regular=folder/('arial.ttf' if folder.name=='Fonts' else 'DejaVuSans.ttf')
  bold=folder/('arialbd.ttf' if folder.name=='Fonts' else 'DejaVuSans-Bold.ttf')
  if regular.exists() and bold.exists():
   pdfmetrics.registerFont(TTFont('MeiSans',str(regular)))
   pdfmetrics.registerFont(TTFont('MeiSansBold',str(bold)))
   pdfmetrics.registerFontFamily('MeiSans',normal='MeiSans',bold='MeiSansBold')
   return
 raise RuntimeError('PDF font unavailable')
def safe(text):return escape(str(text)).replace('\n','<br/>')
def linked(label,url):
 return '<link href="'+escape(url,{'\"':'&quot;'})+'" color="#163f68"><u>'+safe(label)+'</u></link>'
def build_pdf(row,plan):
 fonts();out=BytesIO();navy=HexColor('#163f68');muted=HexColor('#516575')
 styles={
 'title':ParagraphStyle('title',fontName='MeiSansBold',fontSize=23,leading=29,textColor=navy,spaceAfter=16),
 'heading':ParagraphStyle('heading',fontName='MeiSansBold',fontSize=16,leading=22,textColor=navy,spaceAfter=12),
 'body':ParagraphStyle('body',fontName='MeiSans',fontSize=10,leading=15,spaceAfter=9),
 'small':ParagraphStyle('small',fontName='MeiSans',fontSize=8,leading=12,textColor=muted,spaceAfter=7),
 'step':ParagraphStyle('step',fontName='MeiSans',fontSize=10,leading=15,leftIndent=20,firstLineIndent=-20,spaceAfter=12),
 'note':ParagraphStyle('note',fontName='MeiSans',fontSize=9,leading=14,textColor=muted,spaceAfter=10)}
 doc=SimpleDocTemplate(out,pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=78,bottomMargin=50,title='Meu plano do MEI',author='Nacional Contabilidade')
 def para(text,style='body'):return Paragraph(text,styles[style])
 def decorate(c,doc):
  c.saveState();logo=ROOT/'assets/nacional-logo.png'
  if logo.exists():c.drawImage(str(logo),48,791,width=130,height=34,mask='auto',preserveAspectRatio=True)
  else:c.setFont('MeiSansBold',10);c.setFillColor(navy);c.drawString(48,805,'NACIONAL CONTABILIDADE')
  c.setStrokeColor(HexColor('#dfe6eb'));c.line(48,780,547,780)
  c.setFont('MeiSans',8);c.setFillColor(muted);c.drawString(48,29,'Guarde este plano e os extratos dos órgãos.')
  c.drawRightString(547,29,str(doc.page));c.restoreState()
 data=row.get('source',{}).get('cadastro') or {};cnpj=row['cnpj']
 formatted=cnpj[:2]+'.'+cnpj[2:5]+'.'+cnpj[5:8]+'/'+cnpj[8:12]+'-'+cnpj[12:] if len(cnpj)==14 else cnpj
 story=[para('Meu plano do MEI','title'),para(safe(data.get('name') or 'Empresa consultada'),'heading'),para('CNPJ '+safe(formatted)),
 para('Preparado em '+datetime.now(timezone(timedelta(hours=-3))).strftime('%d/%m/%Y')+' | Orientações revisadas em 30/10/2026','small'),
 para('Use os próximos passos para conferir guias, guardar os documentos e acompanhar o que depende de cada órgão. Os links deste PDF são clicáveis.'),
 Spacer(1,12),para('Suas respostas','heading')]
 rows=[]
 for key,(label,choices) in LABELS.items():
  if key in row.get('answers',{}):rows.append([para(safe(label),'small'),para(safe(choices.get(row['answers'][key],'A conferir')),'small')])
 if rows:
  table=Table(rows,colWidths=[210,285],hAlign='LEFT')
  table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),HexColor('#f5f8fa')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
  story+=[table,Spacer(1,20)]
 story.append(para('O que fazer','heading'))
 for i,item in enumerate(plan['steps'],1):story.append(para(str(i)+'. '+safe(item['title'])))
 for i,item in enumerate(plan['steps'],1):
  story += [PageBreak(),para(str(i)+'. '+safe(item['title']),'heading'),para(safe(item['text'])),Spacer(1,8)]
  for n,instruction in enumerate(item.get('instructions',[]),1):
   link=instruction.get('link')
   text=(linked(link['label'],link['url'])+'. ' if link else '')+safe(instruction['text'])
   story.append(para(str(n)+'. '+text,'step'))
  if item.get('example'):story += [Spacer(1,6),para('<b>Exemplo</b><br/>'+safe(item['example']),'note')]
  t=item.get('table')
  if t:
   grid=[[para('<b>'+safe(x)+'</b>','small') for x in t['headers']]]+[[para(safe(x),'small') for x in row] for row in t['rows']]
   tb=Table(grid,colWidths=[245,245],repeatRows=1,hAlign='LEFT')
   tb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#eaf2f8')),('GRID',(0,0),(-1,-1),.4,HexColor('#dfe6eb')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
   story += [tb,Spacer(1,12)]
  for note in item.get('notes',[]):story.append(para(safe(note),'note'))
  for link in item.get('links',[]):story.append(para(linked(link['label'],link['url']),'small'))
 story += [PageBreak(),para('Documentos para guardar','heading')]
 for text in ['Histórico de opções do Simples e SIMEI.','Extratos dos anos com pendências na Receita.','Relatórios completos das inscrições na PGFN, se houver.','Demonstrativo do parcelamento e comprovantes das parcelas, se houver.','DAS mensais e comprovantes de pagamento, separados por competência.']:
  story.append(para('□ '+safe(text)))
 story += [Spacer(1,18),para('Fontes e atualização','heading')]
 for link in plan.get('sources',[]):story.append(para(linked(link['label'],link['url']),'small'))
 story += [Spacer(1,18),para(safe(plan['scope']),'small'),para(linked('Voltar ao quiz da Nacional','https://www.nacionalcon.com/guia-mei'),'small')]
 doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
 return out.getvalue()
