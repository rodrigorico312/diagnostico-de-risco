import { useEffect, useRef, useState } from 'react';
import { usePageSeo } from './usePageSeo';
import './mei-quiz.css';
type Address = {street_type:string|null;street:string|null;number:string|null;complement:string|null;neighborhood:string|null;city:string|null;state:string|null;postal_code:string|null};
type Cadastro = {cnpj:string;name:string;opened_at:string|null;address?:Address|null;status:string|null;simei:boolean|null;provider:string;url:string;reference_date:string|null};
type PortalLink = {label:string;url:string};
type Guide = {id?:string;title:string;text:string;instructions?:{text:string;link?:PortalLink}[];notes?:string[];example?:string;table?:{headers:string[];rows:string[][]};links?:PortalLink[];url?:string};
type Case = {guidance?:Record<string,{intro:string;cards:Guide[]}>;feedback?:Record<string,Guide|null>;needs_refresh?:boolean;cnpj:string;state:string;source:{cadastro?:Cadastro|null;cadastro_status?:string;checked_at?:string;official?:{status:string;url:string}};answers:Record<string,string>;revision:number;questions:string[];plan:{title:string;scope?:string;complete:boolean;steps:Guide[];sources?:PortalLink[];reviewed_at?:string;content_version?:number}};
const OPTANTES='https://consopt.www8.receita.fazenda.gov.br/consultaoptantes';
const questionData:Record<string,{title:string;help:string;choices:[string,string][]}>= {
 simei_check:{title:'Este CNPJ é MEI hoje?',help:'Veja a linha “Situação no SIMEI”. “Optante pelo SIMEI” significa que é MEI. Ser optante apenas pelo Simples Nacional não basta para confirmar MEI. Se o portal não abrir ou você não conseguir conferir, escolha “Ainda não consegui verificar”.',choices:[['yes','Sim, aparece “Optante pelo SIMEI”'],['no','Não, aparece “Não optante pelo SIMEI”'],['unknown','Ainda não consegui verificar']]},
 identity:{title:'É esta a empresa?',help:'',choices:[['yes','Sim, é esta empresa'],['no','Corrigir CNPJ']]},
 debt_period:{title:'Quando essas guias venciam?',help:'Use o vencimento original, não a data de uma guia atualizada. Confira no extrato e escolha Não sei se ainda não separou os períodos.',choices:[['before','Até 13/10/2026'],['after','Depois de 13/10/2026'],['both','Há vencimentos antes e depois'],['unknown','Ainda não sei']]},
 installment_channel:{title:'Onde foi feito o parcelamento?',help:'Veja o órgão no comprovante do acordo. Receita Federal e PGFN têm canais de consulta diferentes.',choices:[['rfb','Na Receita Federal'],['pgfn','Na PGFN / Regularize'],['both','Tenho acordos nos dois'],['unknown','Ainda não sei']]},
 debt:{title:'Há dívidas em aberto?',help:'Confira as instruções abaixo para consultar a Receita e a PGFN. Se uma consulta ainda está faltando, escolha “Não sei”.',choices:[['yes','Sim'],['no','Não, já conferi'],['unknown','Não sei']]},
 installment:{title:'Tem parcelamento do MEI?',help:'Parcelas de um acordo e DAS mensal corrente precisam ser conferidos separadamente. A prestação do acordo paga uma dívida antiga.',choices:[['yes','Sim'],['no','Não'],['unknown','Não sei']]},
 lawsuit:{title:'Há processo judicial sobre a dívida?',help:'Se um profissional cuida de algum processo, confira com ele. Uma ação sua para discutir a dívida e uma execução fiscal têm procedimentos diferentes.',choices:[['yes','Sim'],['no','Não'],['unknown','Não sei']]},
 payments:{title:'As guias mensais atuais estão em dia?',help:'Considere as guias correntes, sem confundir com parcelas de acordo. A resposta ajuda a organizar sua conferência.',choices:[['yes','Sim'],['no','Há guias atrasadas'],['unknown','Ainda não conferi']]},
};
async function api(op:string,body?:unknown):Promise<Case> {
 const r=await fetch('/api/mei?op='+op,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
 const data=await r.json(); if(!r.ok)throw Object.assign(new Error(data.detail||'Não foi possível consultar. Tente novamente.'),{status:r.status});return data;
}
function date(value?:string|null){if(!value)return 'Não informada pela fonte';const d=new Date(value.length===10?value+'T12:00:00':value);return Number.isNaN(d.getTime())?'Não informada pela fonte':d.toLocaleDateString('pt-BR');}
function format(value:string){return value.length===14?value.slice(0,2)+'.'+value.slice(2,5)+'.'+value.slice(5,8)+'/'+value.slice(8,12)+'-'+value.slice(12):value;}
function addressLines(value?:Address|null){
 if(!value)return [];
 const street=value.street && value.street_type && !value.street.toUpperCase().startsWith(value.street_type.toUpperCase()+' ') ? value.street_type+' '+value.street : value.street;
 const first=[street,value.number].filter(Boolean).join(', ');
 const city=[value.city,value.state].filter(Boolean).join(' / ');
 const postal=value.postal_code?.length===8?value.postal_code.slice(0,5)+'-'+value.postal_code.slice(5):value.postal_code;
 return [first,value.complement,value.neighborhood,[city,postal?'CEP '+postal:null].filter(Boolean).join(' · ')].filter((v):v is string=>Boolean(v));
}
function GuideContent({guide}:{guide:Guide}){
 return <div className="mq-guide-content">
  <p>{guide.text}</p>
  {!!guide.instructions?.length && <ol className="mq-instructions">{guide.instructions.map((item,i)=><li key={i}>{item.link && <><a href={item.link.url} target="_blank" rel="noopener noreferrer">{item.link.label}</a>. </>}{item.text}</li>)}</ol>}
  {guide.example && <p className="mq-example"><strong>Exemplo:</strong> {guide.example}</p>}
  {guide.table && <div className="mq-table-wrap"><table><thead><tr>{guide.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{guide.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
  {guide.notes?.map((text,i)=><p className="mq-guide-note" key={i}>{text}</p>)}
  {!!guide.links?.length && <ul className="mq-portal-links">{guide.links.map(link=><li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}</ul>}
  {!guide.instructions && guide.url && <a href={guide.url} target="_blank" rel="noopener noreferrer">Consultar no portal</a>}
 </div>;
}
export default function MeiQuizPage(){
 const [cnpj,setCnpj]=useState(''),[current,setCurrent]=useState<Case|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(''),[editing,setEditing]=useState<string|null>(null),[slow,setSlow]=useState(false);
 const [feedback,setFeedback]=useState<Guide|null>(null),[pdfBusy,setPdfBusy]=useState(false);
 const [copyState,setCopyState]=useState<'idle'|'copied'|'failed'>('idle');
 const copyFallback=useRef<HTMLInputElement>(null);
 const alive=useRef(true), epoch=useRef(0),heading=useRef<HTMLHeadingElement>(null);
 usePageSeo({title:'Consulta guiada do MEI | Nacional Contabilidade',description:'Informe o CNPJ, confirme os dados e encontre os próximos passos para organizar a situação do MEI. Gratuito, sem cadastro.',path:'/guia-mei'});
 useEffect(()=>{alive.current=true;const version=epoch.current;api('current').then(async d=>{if(!alive.current||epoch.current!==version)return;if(d.needs_refresh)d=await api('start',{cnpj:d.cnpj});if(alive.current&&epoch.current===version){setCurrent(d);setCnpj(d.cnpj);}}).catch(e=>{if(e.status!==404&&alive.current)setError(e.message);}).finally(()=>{if(alive.current)setBusy(false);});return()=>{alive.current=false;};},[]);
 useEffect(()=>{
  if(!current||!['queued','working'].includes(current.state))return;
  const version=epoch.current;let stopped=false;const began=Date.now();let timer:ReturnType<typeof setTimeout>;
  async function poll(){try{const d=await api('current');if(stopped||epoch.current!==version)return;setCurrent(d);setError('');if(d.state==='ready')return;}catch(e){if(stopped)return;setError((e as Error).message);}if(Date.now()-began>60000)setSlow(true);timer=setTimeout(poll,Date.now()-began>15000?5000:2000);}
  timer=setTimeout(poll,1600);return()=>{stopped=true;clearTimeout(timer);};
 },[current?.state,current?.cnpj]);
 const order=current?.questions||[], next=order.find(k=>!current?.answers[k]),active=editing||next, q=active?questionData[active]:null;
 useEffect(()=>{if(current?.state==='ready')heading.current?.focus();},[active,current?.state,feedback]);
 useEffect(()=>{setCopyState('idle');},[current?.cnpj,active]);
 useEffect(()=>{if(copyState==='failed'){copyFallback.current?.focus();copyFallback.current?.select();}},[copyState]);
 async function copyCnpj(){if(!current)return;try{await navigator.clipboard.writeText(current.cnpj);setCopyState('copied');}catch{setCopyState('failed');}}
 async function start(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError('');setSlow(false);epoch.current++;try{const d=await api('start',{cnpj});setCurrent(d);setCnpj(d.cnpj);setEditing(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function answer(value:string){if(!current||!active||busy)return;if(active==='identity'&&value==='no'){await reset();return;}setBusy(true);setError('');try{const result=await api('answer',{question:active,value,revision:current.revision});setCurrent(result);setFeedback(result.feedback?.[active]||null);setEditing(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function reset(){if(busy)return;setBusy(true);setError('');epoch.current++;try{await api('delete',{});setCurrent(null);setCnpj('');setEditing(null);setFeedback(null);setSlow(false);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function download(){
  if(pdfBusy)return;setPdfBusy(true);setError('');
  try{
   const response=await fetch('/api/mei?op=pdf',{credentials:'same-origin',cache:'no-store'});
   if(!response.ok){const body=await response.json();throw new Error(body.detail||'Não foi possível preparar seu PDF. Tente novamente.');}
   if(!response.headers.get('content-type')?.startsWith('application/pdf'))throw new Error('Não foi possível preparar seu PDF. Tente novamente.');
   const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download='meu-plano-mei.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){setError((e as Error).message);}finally{setPdfBusy(false);}
 }
 const data=current?.source.cadastro;
 return <div className="mq">
  <a className="mq-skip" href="#quiz">Ir para a consulta</a>
  <header className="mq-header">
   <a href="/" aria-label="Página inicial da Nacional"><img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" width="170" height="44" /></a>
   <details className="mq-tools" key={active || current?.state || 'start'}>
    <summary>Ajuda</summary>
    <div className="mq-tools-panel">
     <h2>Sobre esta consulta</h2>
     <p>Este roteiro organiza seus próximos passos a partir das suas respostas. Os dados básicos da empresa vêm da BrasilAPI / Minha Receita. Os extratos e os pagamentos são conferidos nos portais indicados em cada etapa.</p>
     {data && <dl><div><dt>Fonte do cadastro</dt><dd><a href={data.url} target="_blank" rel="noreferrer">{data.provider}</a></dd></div><div><dt>Consulta realizada</dt><dd>{date(current?.source.checked_at)}</dd></div><div><dt>Data-base</dt><dd>{date(data.reference_date)}</dd></div><div><dt>Abertura da empresa</dt><dd>{date(data.opened_at)}</dd></div><div><dt>Situação cadastral</dt><dd>{data.status || 'Não informada'}</dd></div></dl>}
     <p>A sessão expira em 24 horas. Você pode apagar esta conferência ou trocar o CNPJ.</p>
     {current?.plan.scope && <p>{current.plan.scope}</p>}
     <nav aria-label="Ajuda da consulta">
      <a href="/politica-de-privacidade">Privacidade</a>
      {current && <><button type="button" disabled={busy} onClick={reset}>Trocar CNPJ</button><button type="button" disabled={busy} onClick={reset}>Apagar esta conferência</button></>}
     </nav>
    </div>
   </details>
  </header>
  <main id="quiz" className="mq-main">
   {!current ? <section className="mq-card mq-intro" aria-busy={busy}>
    <h1 ref={heading} tabIndex={-1}>Qual é o CNPJ?</h1>
    <form onSubmit={start}>
     <label className="mq-visually-hidden" htmlFor="cnpj">CNPJ da empresa</label>
     <input autoComplete="off" autoCapitalize="characters" spellCheck={false} id="cnpj" name="cnpj" maxLength={24} value={cnpj} onChange={e => setCnpj(e.target.value.toUpperCase())} placeholder="00.000.000/0001-00" required />
     <button className="mq-primary" disabled={busy || !cnpj.trim()}>{busy ? 'Abrindo…' : 'Continuar'}</button>
    </form>
   </section> : ['queued', 'working'].includes(current.state) ? <section className="mq-card" role="status">
    <h1 ref={heading} tabIndex={-1}>Buscando a empresa…</h1>
    {slow && <p>A consulta está demorando um pouco. Aguarde ou tente novamente mais tarde.</p>}
   </section> : feedback ? <section className="mq-card mq-feedback">
    <span className="mq-step">Seu próximo passo</span>
    <h1 ref={heading} tabIndex={-1}>{feedback.title}</h1>
    <GuideContent guide={feedback} />
    <button type="button" className="mq-primary" onClick={()=>setFeedback(null)}>Continuar</button>
   </section> : q ? <section className="mq-card" aria-busy={busy}>
    <span className="mq-step">Pergunta {order.indexOf(active!) + 1}</span>
    <h1 ref={heading} tabIndex={-1}>{q.title}</h1>
    {active === 'identity' && data && <div className="mq-company">
     <h2>{data.name}</h2>
     <p>{format(data.cnpj)}</p>
     <dl className="mq-company-details">
      <div><dt>Abertura</dt><dd>{date(data.opened_at)}</dd></div>
      <div><dt>{data.address && (!data.address.street || !data.address.number) ? 'Endereço disponível (parcial)' : 'Endereço'}</dt><dd>{addressLines(data.address).length ? addressLines(data.address).map((line,i)=><span key={i}>{line}</span>) : 'Não informado pela fonte'}</dd></div>
     </dl>
    </div>}
    {!data && active === order[0] && <p className="mq-inline-note">Não conseguimos recuperar o cadastro. Responda o que souber ou corrija o CNPJ em “Ajuda”.</p>}
    {active === 'simei_check' && <div className="mq-registry-check">
     <button type="button" className="mq-copy-cnpj" onClick={copyCnpj} aria-label={'Copiar CNPJ '+format(current.cnpj)}>
      <span>{format(current.cnpj)}</span>
      <small>{copyState==='copied'?'CNPJ copiado':'Clique no CNPJ para copiar'}</small>
     </button>
     <span className="mq-visually-hidden" role="status">{copyState==='copied'?'CNPJ copiado':copyState==='failed'?'Não foi possível copiar automaticamente. O CNPJ está selecionado para copiar manualmente.':''}</span>
     {copyState==='failed' && <div className="mq-copy-fallback"><label htmlFor="cnpj-copy">Copie o CNPJ selecionado:</label><input id="cnpj-copy" ref={copyFallback} readOnly value={current.cnpj} onFocus={e=>e.currentTarget.select()} /></div>}
     <p>Abra a <a href={OPTANTES} target="_blank" rel="noopener noreferrer">Consulta Optantes da Receita</a>, cole o CNPJ e procure “Situação no SIMEI”.</p>
     <p>Depois, volte aqui e escolha o que apareceu.</p>
    </div>}
    {current.guidance?.[active!] && <div className="mq-learning">
     <p>{current.guidance[active!].intro}</p>
     {current.guidance[active!].cards.map(guide=><details className="mq-howto" key={guide.id||guide.title}><summary>{guide.title}</summary><GuideContent guide={guide} /></details>)}
    </div>}
    <div className="mq-choices">{q.choices.map(([value, label]) => <button type="button" key={value} disabled={busy} aria-pressed={current.answers[active!] === value} onClick={() => answer(value)}>{label}</button>)}</div>
    <div className="mq-question-tools">
     {order.indexOf(active!) > 0 && <button type="button" className="mq-back" disabled={busy} onClick={() => setEditing(order[order.indexOf(active!) - 1])}>Voltar</button>}
     {active !== 'identity' && <details className="mq-question-help" key={active}>
      <summary>Entender a pergunta</summary>
      <div><p>{q.help}</p>

      </div>
     </details>}
    </div>
   </section> : <section className="mq-card mq-result">
    <h1 ref={heading} tabIndex={-1}>{current.plan.title}</h1>
    <p className="mq-result-scope">Siga as etapas abaixo. Você pode abrir uma por vez e guardar tudo em PDF.</p>
    <div className="mq-plan">{current.plan.steps.map((step, i) => <details className="mq-plan-step" key={step.title} open={i === 0 ? true : undefined}>
     <summary><span>{i + 1}.</span><h2>{step.title}</h2></summary>
     <GuideContent guide={step} />
    </details>)}</div>
    <button type="button" className="mq-primary" disabled={pdfBusy} onClick={download}>{pdfBusy?'Preparando PDF…':'Baixar meu plano em PDF'}</button>
    <details className="mq-review"><summary>Revisar respostas</summary>{order.map(key => <div className="mq-answer" key={key}><strong>{questionData[key].title}</strong><span>{questionData[key].choices.find(([value]) => value === current.answers[key])?.[1]}</span><button type="button" disabled={busy} onClick={() => {setFeedback(null);setEditing(key);}}>Corrigir</button></div>)}</details>
    {current.plan.sources && <details className="mq-sources"><summary>Fontes e atualização</summary><p>Orientações revisadas em {date(current.plan.reviewed_at)}.</p><ul>{current.plan.sources.map(link=><li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}</ul></details>}
    <details className="mq-optional"><summary>Prefere acompanhamento?</summary><p>O guia é gratuito. Se quiser ajuda individual, você pode conhecer o atendimento da Nacional.</p><a href="/solicitar-atendimento?origem=Quiz%20MEI">Conhecer o atendimento</a></details>
   </section>}
   {error && <div className="mq-error" role="alert">{error}</div>}
  </main>
 </div>;
}
