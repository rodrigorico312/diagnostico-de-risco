import {useEffect,useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,Pause,Play,RotateCcw} from 'lucide-react';
import type {HistoryEvent} from './types';
import {recordYears} from './timeNavigation';
import './historical-map.css';

export default function Chronoscope({events,year,onSelect,onClear}:{events:HistoryEvent[];year:number;onSelect:(year:number)=>void;onClear:()=>void}){
 const years=useMemo(()=>recordYears(events),[events]);
 const [playing,setPlaying]=useState(false);
 const index=Math.max(0,years.indexOf(year));
 useEffect(()=>{
  if(!playing)return;
  if(index>=years.length-1){setPlaying(false);return;}
  const timer=setTimeout(()=>onSelect(years[index+1]),2200);
  return()=>clearTimeout(timer);
 },[playing,index,years,onSelect]);
 if(!years.length)return null;
 function seek(value:number){setPlaying(false);onSelect(years[value]);}
 return <section className="history-chronoscope" aria-label="Navegar pelos anos com registro">
  <div className="chronoscope-title"><span>EXPLORAR NO TEMPO</span><strong>{years[index]===0?'Antes de 1500':years[index]}</strong><small>{events.filter(e=>e.year===years[index]).length} {events.filter(e=>e.year===years[index]).length===1?'registro':'registros'} neste marco</small></div>
  <div className="chronoscope-track"><div className="chronoscope-controls"><button aria-label="Marco histórico anterior" disabled={index===0} onClick={()=>seek(index-1)}><ChevronLeft size={18}/></button><button aria-label={playing?'Pausar sequência histórica':'Reproduzir sequência histórica'} aria-pressed={playing} disabled={years.length<2} onClick={()=>{if(!playing&&index===years.length-1)onSelect(years[0]);setPlaying(v=>!v);}}>{playing?<Pause size={18}/>:<Play size={18}/>}</button><button aria-label="Próximo marco histórico" disabled={index>=years.length-1} onClick={()=>seek(index+1)}><ChevronRight size={18}/></button><input type="range" min={0} max={Math.max(0,years.length-1)} step={1} value={index} aria-label="Percorrer anos com registros históricos" aria-valuetext={years[index]===0?'Período anterior a 1500':String(years[index])} onChange={e=>seek(Number(e.target.value))}/><button onClick={()=>{setPlaying(false);onClear();}}><RotateCcw size={14}/><span>Todos os anos</span></button></div><p>Cada passo é um ano com registro nesta seleção; o espaçamento não representa a duração entre os acontecimentos.</p></div>
 </section>;
}
