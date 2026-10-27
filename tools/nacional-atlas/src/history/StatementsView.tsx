import {lazy,Suspense} from 'react';
import {ArrowUpRight,FileText,MessageSquare} from 'lucide-react';
import type {HistoryEvent} from './types';
import './statements.css';
const StatementsMap=lazy(()=>import('./StatementsMap'));

export default function StatementsView({events,selectedId,onOpen,onReset}:{events:HistoryEvent[];selectedId:string;onOpen:(id:string)=>void;onReset:()=>void}){
 return <section className="statements-view"><div className="history-section-heading"><div><span className="eyebrow">PALAVRAS, DOCUMENTOS E CONTEXTO</span><h2>O que foi dito — e o que podemos demonstrar</h2><p>Leia o trecho, identifique quem falou e siga as fontes e os acontecimentos relacionados. A seleção é editorial e não representa a frequência de declarações de cada político.</p><a className="history-method-link" href={import.meta.env.BASE_URL+'history-data/statements-audit.json'} target="_blank" rel="noreferrer">Conferência dos trechos e hashes das fontes <ArrowUpRight size={13}/></a></div></div>
  <Suspense fallback={<p>Carregando o mapa das referências municipais…</p>}><StatementsMap events={events} selectedId={selectedId} onOpen={onOpen}/></Suspense>
  <div className="statements-list" aria-label="Falas e publicações neste recorte">{events.map(event=><article key={event.id} className={selectedId===event.id?'selected':''}><span className="statement-label">{event.statement!.kind==='speech'?<MessageSquare size={14}/>:<FileText size={14}/>} {event.statement!.kind==='speech'?'Fala':'Publicação'} · {event.date?.split('-').reverse().join('/')}</span><h3>{event.label}</h3><blockquote>{event.statement!.excerpt}</blockquote><p>{event.statement!.speaker} · {event.place?.label??'Município não identificado'}</p><button onClick={()=>onOpen(event.id)}>Ler fonte, contexto e conexões <ArrowUpRight size={14}/></button></article>)}</div>
  {!events.length&&<div className="history-empty"><h3>Sem falas ou publicações neste recorte</h3><p>A base ainda é pequena. Ausência de registros não significa que não houve declarações nesse período.</p><button onClick={onReset}>Ver toda a seleção</button></div>}
 </section>;
}
