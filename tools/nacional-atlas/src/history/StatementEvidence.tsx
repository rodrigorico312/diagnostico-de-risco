import {ArrowUpRight,FileText,MessageSquare,Route} from 'lucide-react';
import type {HistoryData,HistoryEvent} from './types';
import './statements.css';

export function StatementEvidence({event,data}:{event:HistoryEvent;data:HistoryData}){
 const statement=event.statement;if(!statement)return null;
 const source=data.sources.find(s=>s.id===statement.source);
 return <section className="statement-evidence" aria-label="Trecho original e contexto da declaração">
  <span className="statement-label">{statement.kind==='speech'?<MessageSquare size={14}/>:<FileText size={14}/>} {statement.kind==='speech'?'FALA DOCUMENTADA':'PUBLICAÇÃO DOCUMENTADA'}</span>
  <blockquote>{statement.excerpt}</blockquote>
  <p className="statement-author"><b>{statement.speaker}</b><span>{statement.roleAtTime}</span><span>{event.date?.split('-').reverse().join('/')} · {statement.venue}</span></p>
  {source&&<a className="statement-original" href={source.url} target="_blank" rel="noreferrer">Consultar registro original <ArrowUpRight size={14}/></a>}
  <small className="statement-locator">Onde encontrar: {statement.locator}</small>
  {source?.note&&<small className="statement-locator">Sobre a fonte: {source.note}</small>}
  <h4>O que o autor declarou nesse contexto</h4><p>{statement.declaredContext}</p>
  <h4>O que falta para explicar a intenção</h4><p>{statement.intentLimit}</p>
  <p className="statement-proof-note">Documentar uma fala comprova sua ocorrência e atribuição. Afirmações feitas pelo autor exigem verificação própria.</p>
 </section>;
}

export function StudyTrail({event,data,onOpen}:{event:HistoryEvent;data:HistoryData;onOpen:(id:string)=>void}){
 if(!event.studyLinks?.length)return null;
 return <section className="statement-trail" aria-label="Trilha de estudo documentada"><h3><Route size={16}/> Aprofundar este episódio</h3><p>Links editoriais para contexto e desdobramentos. A ordem não representa uma cadeia de causas comprovadas.</p>{event.studyLinks.map(link=>{const target=data.events.find(e=>e.id===link.event);return target?<button key={link.event} onClick={()=>onOpen(target.id)}><span>{link.label}</span><b>{target.year} · {target.label}</b><ArrowUpRight size={14}/></button>:null;})}</section>;
}
