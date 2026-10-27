import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowUpRight,BookOpen,Expand,Globe2,RotateCcw,Share2,X} from 'lucide-react';
import {medievalYear} from './timeNavigation';
import './historical-map.css';

const assetBase=import.meta.env.BASE_URL+'invadergis/';
export default function HistoricalMap(){
 const initial=useMemo(()=>medievalYear(new URLSearchParams(location.search).get('m_ano')),[]);
 const [year,setYear]=useState(initial),[ready,setReady]=useState(false),[slow,setSlow]=useState(false),[generation,setGeneration]=useState(0),[expanded,setExpanded]=useState(false),[guide,setGuide]=useState(false),[notice,setNotice]=useState('');
 const frame=useRef<HTMLIFrameElement>(null),section=useRef<HTMLElement>(null);
 const src=useMemo(()=>assetBase+'?embedded=1#year='+initial+'&theme=dark',[initial]);
 useEffect(()=>{
  const timeout=setTimeout(()=>setSlow(true),30000);
  const receive=(e:MessageEvent)=>{
   if(e.origin!==location.origin||e.source!==frame.current?.contentWindow||e.data?.type!=='invadergis:state')return;
   if(typeof e.data.year!=='number'||e.data.year<500||e.data.year>1500)return;
   setReady(true);setSlow(false);clearTimeout(timeout);setYear(e.data.year);
   const u=new URL(location.href);u.searchParams.set('m_ano',String(e.data.year));history.replaceState(null,'',u);
  };
  addEventListener('message',receive);
  return()=>{clearTimeout(timeout);removeEventListener('message',receive);};
 },[generation]);
 useEffect(()=>{const changed=()=>setExpanded(document.fullscreenElement===section.current);document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 function chooseYear(next:number){frame.current?.contentWindow?.postMessage({type:'nacional:year',year:medievalYear(next)},location.origin);}
 async function expand(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(section.current?.requestFullscreen)await section.current.requestFullscreen();else window.open(assetBase+'#year='+year+'&theme=dark','_blank','noopener');}catch{setNotice('Use “Abrir mapa” para explorar em uma tela separada.');}}
 async function share(){try{await navigator.clipboard.writeText(location.href);setNotice('Link deste ano copiado. Posição do mapa e seleções internas não são incluídas.');}catch{setNotice('Copie o endereço desta página para compartilhar o ano selecionado.');}}
 return <section className="historical-map" ref={section} aria-label="Mapa histórico integrado">
  <div className="historical-map-heading"><div><span className="history-eyebrow"><Globe2 size={14}/> LABORATÓRIO HISTÓRICO · INVADERGIS</span><h2>Veja o mundo mudar com o tempo.</h2><p>500–1500 · Europa medieval e regiões próximas. Base de terceiros, com referências próprias; não é a cronologia brasileira nem uma reconstrução completa de todos os povos.</p></div><div className="historical-map-actions"><button aria-expanded={guide} onClick={()=>setGuide(v=>!v)}><BookOpen size={15}/> Como explorar</button><button aria-label="Copiar link do ano histórico" onClick={()=>void share()}><Share2 size={16}/></button><button aria-label={expanded?'Sair da tela cheia':'Expandir mapa histórico'} onClick={()=>void expand()}><Expand size={17}/></button></div></div>
  {guide&&<div className="historical-map-guide"><p><b>1. Viaje no tempo:</b> use a régua de anos na parte inferior do mapa ou os atalhos abaixo. As camadas mudam conforme o período.</p><p><b>2. Investigue:</b> clique em um território ou marcador. Use <b>Conexões / Network</b> para relações, <b>Governantes / Lineage</b> para governantes e <b>Fontes / Sources</b> para referências.</p><p><b>3. Compare:</b> o painel <b>Comparar / Compare</b> permite colocar registros lado a lado. A interface e os textos da base original estão em inglês; alguns controles principais foram traduzidos.</p><p>As fronteiras são reconstruções da base histórica. Ausência no mapa não significa ausência de povos, ocupação ou acontecimentos.</p></div>}
  <div className="historical-map-toolbar"><span><i className={ready?'ready':''}/>{ready?'Explorando':'Carregando'} <b>{year}</b></span><div>{[500,800,1000,1200,1500].map(y=><button key={y} disabled={!ready} aria-pressed={year===y} onClick={()=>chooseYear(y)}>{y}</button>)}</div><a href={assetBase+'#year='+year+'&theme=dark'} target="_blank" rel="noreferrer">Abrir mapa <ArrowUpRight size={13}/></a></div>
  {slow&&<div className="historical-map-notice" role="status">O carregamento está demorando. Você pode tentar novamente ou abrir o mapa separado. <button onClick={()=>{setReady(false);setSlow(false);setGeneration(v=>v+1);}}><RotateCcw size={14}/> Tentar novamente</button></div>}
  <iframe key={generation} ref={frame} src={src} title="InvaderGIS: territórios, acontecimentos e governantes entre 500 e 1500" className="historical-map-frame" allow="fullscreen" onLoad={()=>frame.current?.contentWindow?.postMessage({type:'nacional:init'},location.origin)}/>
  <footer className="historical-map-credits"><p>Motor e base: <a href="https://github.com/g-lanza/InvaderGIS" target="_blank" rel="noreferrer">InvaderGIS · Gavin Lanza e colaboradores</a>. Adaptação para estudo pessoal, sem finalidade comercial. Base experimental: a validação encontrou referências e vínculos incompletos. Não auditada integralmente pelo Nacional Atlas.</p><div><a href={assetBase+'LICENSE.txt'} target="_blank" rel="noreferrer">Licenças</a><a href={assetBase+'ATTRIBUTIONS.txt'} target="_blank" rel="noreferrer">Fontes e créditos</a><a href={assetBase+'validation.txt'} target="_blank" rel="noreferrer">Validação</a><a href={assetBase+'integration.json'} target="_blank" rel="noreferrer">Versão e alterações</a></div></footer>
  {notice&&<div className="historical-map-notice" role="status">{notice}<button aria-label="Fechar aviso do mapa" onClick={()=>setNotice('')}><X size={14}/></button></div>}
 </section>;
}
