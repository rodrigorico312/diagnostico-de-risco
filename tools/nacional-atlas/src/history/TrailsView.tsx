import {ArrowRight,ArrowUpRight,BookOpen,Route,ShieldCheck} from 'lucide-react';
import type {HistoryData} from './types';
import {natureLabels} from './data';
import './trails.css';

export default function TrailsView({data,selectedId,onSelect,onOpen}:{data:HistoryData;selectedId:string;onSelect:(id:string)=>void;onOpen:(id:string)=>void}){
 const trails=data.trails??[];
 const selected=trails.find(t=>t.id===selectedId)??trails[0];
 if(!selected)return <section className="history-empty"><h2>Nenhuma trilha publicada</h2></section>;
 const events=new Map(data.events.map(e=>[e.id,e]));
 const sources=new Map(data.sources.map(s=>[s.id,s]));
 return <section className="history-trails" aria-label="Trilhas históricas documentadas">
  <div className="trail-heading"><span className="history-eyebrow"><Route size={15}/> PERCURSOS DE ESTUDO</span><h2>Uma sequência para entender.<br/><em>Documentos para conferir.</em></h2><p>Escolha um percurso. Cada etapa traz uma pergunta, um registro e os limites do que ele permite concluir.</p></div>
  <div className="trail-options" role="group" aria-label="Escolher trilha histórica">{trails.map(trail=><button key={trail.id} aria-pressed={selected.id===trail.id} onClick={()=>onSelect(trail.id)}><Route size={19}/><span><b>{trail.title}</b><small>{trail.steps.length} etapas · ordem cronológica</small></span><ArrowRight size={17}/></button>)}</div>
  <div className="trail-intro"><div><span className="history-eyebrow">TRILHA ABERTA</span><h3>{selected.title}</h3><p>{selected.intro}</p></div><aside><ShieldCheck size={19}/><p>{selected.limits}</p></aside></div>
  <ol className="trail-steps">{selected.steps.map((step,index)=>{
   const event=events.get(step.event);if(!event)return null;
   return <li key={event.id}><span className="trail-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><article>
    <div className="trail-step-meta"><time dateTime={event.date??String(event.year)}>{event.date?event.date.split('-').reverse().join('/'):event.year}</time><span>{natureLabels[event.recordNature??'historical']}</span></div>
    <p className="trail-question">{step.prompt}</p><h4>{event.label}</h4><p>{event.summary}</p>
    <details><summary>Contexto e limites desta evidência</summary><p>{event.context}</p><p><b>Limite: </b>{event.limits}</p></details>
    <div className="trail-references">{event.sources.map(id=>{const source=sources.get(id);return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={13}/></a>:null;})}</div>
    <button className="trail-open" onClick={()=>onOpen(event.id)}><BookOpen size={15}/> Abrir ficha completa <ArrowRight size={14}/></button>
   </article></li>;
  })}</ol>
  <p className="trail-footer">A ordem é temporal e editorial. Não demonstra uma cadeia causal, aliança permanente ou culpa coletiva. A abertura de uma ficha leva à linha do tempo; volte a Trilhas históricas para continuar o percurso.</p>
 </section>;
}
