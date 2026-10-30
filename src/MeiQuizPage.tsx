import { useEffect, useRef, useState } from 'react';
import { usePageSeo } from './usePageSeo';
import './mei-quiz.css';
type Address = {street_type:string|null;street:string|null;number:string|null;complement:string|null;neighborhood:string|null;city:string|null;state:string|null;postal_code:string|null};
type Cadastro = {cnpj:string;name:string;opened_at:string|null;address?:Address|null;status:string|null;simei:boolean|null;provider:string;url:string;reference_date:string|null};
type Case = {needs_refresh?:boolean;cnpj:string;state:string;source:{cadastro?:Cadastro|null;cadastro_status?:string;checked_at?:string;official?:{status:string;url:string}};answers:Record<string,string>;revision:number;questions:string[];plan:{title:string;scope?:string;complete:boolean;steps:{title:string;text:string;url:string}[]}};
const questionData:Record<string,{title:string;help:string;choices:[string,string][]}>= {
 identity:{title:'É esta a empresa?',help:'',choices:[['yes','Sim, é esta empresa'],['no','Corrigir CNPJ']]},
 debt:{title:'Há dívidas em aberto?',help:'A consulta cadastral não mostra dívidas. Se ainda não conferiu as guias nos portais, escolha “Não sei”.',choices:[['yes','Sim'],['no','Não, já conferi'],['unknown','Não sei']]},
 installment:{title:'Tem parcelamento do MEI?',help:'Parcelas de um acordo e DAS mensal corrente precisam ser conferidos separadamente. Este quiz não acessa o seu acordo.',choices:[['yes','Sim'],['no','Não'],['unknown','Não sei']]},
 lawsuit:{title:'Há processo judicial sobre a dívida?',help:'Se um profissional cuida de algum processo, confira com ele. A existência de ação pode mudar as providências necessárias.',choices:[['yes','Sim'],['no','Não'],['unknown','Não sei']]},
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
export default function MeiQuizPage(){
 const [cnpj,setCnpj]=useState(''),[current,setCurrent]=useState<Case|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(''),[editing,setEditing]=useState<string|null>(null),[slow,setSlow]=useState(false);
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
 useEffect(()=>{if(current?.state==='ready')heading.current?.focus();},[active,current?.state]);
 async function start(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError('');setSlow(false);epoch.current++;try{const d=await api('start',{cnpj});setCurrent(d);setCnpj(d.cnpj);setEditing(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function answer(value:string){if(!current||!active||busy)return;if(active==='identity'&&value==='no'){await reset();return;}setBusy(true);setError('');try{setCurrent(await api('answer',{question:active,value,revision:current.revision}));setEditing(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function reset(){if(busy)return;setBusy(true);setError('');epoch.current++;try{await api('delete',{});setCurrent(null);setCnpj('');setEditing(null);setSlow(false);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 function download(){if(!current)return;const lines=['MINHA CONFERÊNCIA DO MEI',format(current.cnpj),current.source.cadastro?.name||'Identidade não recuperada','Preparada em '+new Date().toLocaleString('pt-BR'),'','Fonte cadastral: '+(current.source.cadastro?.provider||'Não disponível'),'Consulta oficial do Simei: não validada automaticamente','Enquadramento auxiliar: '+(current.source.cadastro?.simei===true?'Indica MEI':current.source.cadastro?.simei===false?'Não indica MEI':'Não informado'),'Abertura: '+date(current.source.cadastro?.opened_at),'Endereço: '+(addressLines(current.source.cadastro?.address).join(', ')||'Não informado pela fonte'),'Valores de dívida: não consultados','',...order.map(k=>questionData[k].title+' '+questionData[k].choices.find(([v])=>v===current.answers[k])?.[1]),'',...current.plan.steps.flatMap(s=>[s.title,s.text,new URL(s.url,window.location.origin).href,'']),current.plan.scope||''];const url=URL.createObjectURL(new Blob(['﻿'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='minha-conferencia-mei.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const data=current?.source.cadastro;
 return <div className="mq">
  <a className="mq-skip" href="#quiz">Ir para a consulta</a>
  <header className="mq-header">
   <a href="/" aria-label="Página inicial da Nacional"><img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" width="170" height="44" /></a>
   <details className="mq-tools" key={active || current?.state || 'start'}>
    <summary>Ajuda</summary>
    <div className="mq-tools-panel">
     <h2>Sobre esta consulta</h2>
     <p>Buscamos o cadastro público na BrasilAPI / Minha Receita. O enquadramento oficial no MEI e os valores das dívidas precisam ser conferidos nos portais.</p>
     {data && <dl><div><dt>Fonte do cadastro</dt><dd><a href={data.url} target="_blank" rel="noreferrer">{data.provider}</a></dd></div><div><dt>Consulta realizada</dt><dd>{date(current?.source.checked_at)}</dd></div><div><dt>Data-base</dt><dd>{date(data.reference_date)}</dd></div><div><dt>Abertura da empresa</dt><dd>{date(data.opened_at)}</dd></div><div><dt>Situação cadastral</dt><dd>{data.status || 'Não informada'}</dd></div></dl>}
     <p>A sessão expira em 24 horas. Você pode apagar esta conferência ou trocar o CNPJ.</p>
     {current?.plan.scope && <p>{current.plan.scope}</p>}
     <nav aria-label="Ajuda da consulta">
      <a href="/guia-mei?material=1">Ler o guia completo</a>
      <a href="/guias/mei/guia-mei-v002.pdf">Baixar o guia em PDF</a>
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
   </section> : q ? <section className="mq-card" aria-busy={busy}>
    <span className="mq-step">Pergunta {order.indexOf(active!) + 1}</span>
    <h1 ref={heading} tabIndex={-1}>{q.title}</h1>
    {active === 'identity' && data && <div className="mq-company">
     <h2>{data.name}</h2>
     <p>{format(data.cnpj)}</p>
     <dl className="mq-company-details">
      <div><dt>Abertura</dt><dd>{date(data.opened_at)}</dd></div>
      <div><dt>{data.address && (!data.address.street || !data.address.number) ? 'Endereço disponível (parcial)' : 'Endereço'}</dt><dd>{addressLines(data.address).length ? addressLines(data.address).map((line,i)=><span key={i}>{line}</span>) : 'Não informado pela fonte'}</dd></div>
      <div><dt>Enquadramento preliminar</dt><dd>{data.simei===true?'A base consultada indica MEI':data.simei===false?'A base consultada não indica MEI':'A base não informou o enquadramento'}</dd></div>
     </dl>
     <p className="mq-official-pending">Confirmação oficial na Receita: pendente.</p>
    </div>}
    {!data && active === order[0] && <p className="mq-inline-note">Não conseguimos recuperar o cadastro. Responda o que souber ou corrija o CNPJ em “Ajuda”.</p>}
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
    <p className="mq-result-scope">Orientação inicial. O resultado não confirma perdão de dívida.</p>
    <div className="mq-plan">{current.plan.steps.map((step, i) => <details className="mq-plan-step" key={step.title} open={i === 0 ? true : undefined}>
     <summary><span>{i + 1}.</span><h2>{step.title}</h2></summary>
     <div><p>{step.text}</p><a href={step.url} target={step.url.startsWith('https') ? '_blank' : undefined} rel="noreferrer">Abrir orientação</a></div>
    </details>)}</div>
    <button type="button" className="mq-primary" onClick={download}>Salvar meu plano</button>
    <details className="mq-review"><summary>Revisar respostas</summary>{order.map(key => <div className="mq-answer" key={key}><strong>{questionData[key].title}</strong><span>{questionData[key].choices.find(([value]) => value === current.answers[key])?.[1]}</span><button type="button" disabled={busy} onClick={() => setEditing(key)}>Corrigir</button></div>)}</details>
    <details className="mq-optional"><summary>Prefere acompanhamento?</summary><p>O guia é gratuito. Se quiser ajuda individual, você pode conhecer o atendimento da Nacional.</p><a href="/solicitar-atendimento?origem=Quiz%20MEI">Conhecer o atendimento</a></details>
   </section>}
   {error && <div className="mq-error" role="alert">{error}</div>}
  </main>
 </div>;
}
