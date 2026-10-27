import {lazy,Suspense,useEffect,useState} from 'react';
import {BookOpen,Globe2,MapPinned,Waypoints} from 'lucide-react';
import {atlasView,atlasHref,type AtlasView} from './routing';
import './style.css';
const History=lazy(()=>import('../history/App'));
const World=lazy(()=>import('../world/App'));
const Elections=lazy(()=>import('../para/App'));
const tabs:[AtlasView,string,typeof BookOpen][]=[['historia','História e poder',BookOpen],['mapa','Mundo e Brasil',Globe2],['eleicoes','Eleições no mapa',MapPinned]];
export default function Atlas(){
 const [view,setView]=useState(()=>atlasView(new URLSearchParams(location.search))),[revision,setRevision]=useState(0);
 useEffect(()=>{const pop=()=>{setView(atlasView(new URLSearchParams(location.search)));setRevision(v=>v+1);};addEventListener('popstate',pop);return()=>removeEventListener('popstate',pop);},[]);
 function navigate(v:AtlasView){if(v===view)return;history.pushState(null,'',atlasHref(v,v==='eleicoes'?{municipio:'05355',turno:'2'}:{}));setView(v);setRevision(n=>n+1);window.scrollTo({top:0});}
 useEffect(()=>{document.title=(view==='historia'?'História e poder':view==='mapa'?'Mundo e Brasil':'Eleições')+' · Nacional Atlas';},[view]);
 return <div className="unified-atlas"><header className="atlas-global-header"><a className="atlas-brand" href="/atlas/" onClick={e=>{e.preventDefault();navigate('historia');}}><span className="brand-mark"><Waypoints size={24}/></span><div>NACIONAL <b>ATLAS</b><small>TERRITÓRIOS, HISTÓRIA E POSSIBILIDADES</small></div></a><nav aria-label="Áreas do Nacional Atlas">{tabs.map(([id,label,Icon])=><a href={atlasHref(id,id==='eleicoes'?{municipio:'05355',turno:'2'}:{})} aria-current={view===id?'page':undefined} key={id} onClick={e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();navigate(id);}}}><Icon size={17}/><span>{label}</span></a>)}</nav></header><Suspense fallback={<div className="atlas-module-loading">Carregando esta área do atlas…</div>}>{view==='historia'?<History key={'h'+revision}/>:view==='mapa'?<World embedded key={'w'+revision}/>:<Elections embedded key={'e'+revision}/>}</Suspense></div>;
}
