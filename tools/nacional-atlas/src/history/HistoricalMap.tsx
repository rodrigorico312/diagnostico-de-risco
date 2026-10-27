import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowUpRight,BookOpen,Expand,Globe2,RotateCcw,Share2,X} from 'lucide-react';
import {medievalYear} from './timeNavigation';
import PortugueseMap from './PortugueseMap';
import './historical-map.css';

const assetBase=import.meta.env.BASE_URL+'invadergis/';
export default function HistoricalMap({onBrazil}:{onBrazil:()=>void}){
 const initial=useMemo(()=>medievalYear(new URLSearchParams(location.search).get('m_ano')),[]);
 const [year,setYear]=useState(initial),[ready,setReady]=useState(false),[slow,setSlow]=useState(false),[generation,setGeneration]=useState(0),[expanded,setExpanded]=useState(false),[guide,setGuide]=useState(false),[notice,setNotice]=useState('');
 const [mode,setMode]=useState<'pt'|'original'>('pt');
 const [yearInput,setYearInput]=useState(String(initial));
 const frame=useRef<HTMLIFrameElement>(null),section=useRef<HTMLElement>(null);
 const [frameYear,setFrameYear]=useState(initial);
 const src=assetBase+'?embedded=1#year='+frameYear+'&theme=dark';
 useEffect(()=>{
  if(mode!=='original')return;
  const timeout=setTimeout(()=>setSlow(true),30000);
  const receive=(e:MessageEvent)=>{
   if(e.origin!==location.origin||e.source!==frame.current?.contentWindow||e.data?.type!=='invadergis:state')return;
   if(typeof e.data.year!=='number'||e.data.year<500||e.data.year>1500)return;
   setReady(true);setSlow(false);clearTimeout(timeout);setYear(e.data.year);
   const u=new URL(location.href);u.searchParams.set('m_ano',String(e.data.year));history.replaceState(null,'',u);
  };
  addEventListener('message',receive);
  return()=>{clearTimeout(timeout);removeEventListener('message',receive);};
 },[generation,mode]);
 useEffect(()=>{setYearInput(String(year));const u=new URL(location.href);u.searchParams.set('m_ano',String(year));history.replaceState(null,'',u);},[year]);
 useEffect(()=>{const changed=()=>setExpanded(document.fullscreenElement===section.current);document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 function chooseYear(next:number){if(mode==='pt')setYear(medievalYear(next));else frame.current?.contentWindow?.postMessage({type:'nacional:year',year:medievalYear(next)},location.origin);}
 async function expand(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(section.current?.requestFullscreen)await section.current.requestFullscreen();else setNotice('A expansão não está disponível neste navegador. Continue explorando nesta página.');}catch{setNotice('A expansão não está disponível neste navegador. Você pode continuar explorando nesta página.');}}
 async function share(){try{await navigator.clipboard.writeText(location.href);setNotice('Link deste ano copiado. Posição do mapa e seleções internas não são incluídas.');}catch{setNotice('Copie o endereço desta página para compartilhar o ano selecionado.');}}
 return <section className="historical-map" ref={section} aria-label="Mapa histórico integrado">
  <div className="historical-map-heading"><div><span className="history-eyebrow"><Globe2 size={14}/> MAPA HISTÓRICO · LEITURA EM PORTUGUÊS</span><h2>Quem aparece neste território e nesta época?</h2><p>500–1500 · limite do catálogo InvaderGIS instalado, concentrado na Europa e com registros de outras regiões. A linha do tempo brasileira é uma seleção independente e vai além de 1500. Este mapa não reconstitui todos os povos nem o povoamento do Brasil.</p></div><div className="historical-map-actions"><button aria-expanded={guide} onClick={()=>setGuide(v=>!v)}><BookOpen size={15}/> Como explorar</button><button aria-label="Copiar link do ano histórico" onClick={()=>void share()}><Share2 size={16}/></button><button aria-label={expanded?'Sair da tela cheia':'Expandir mapa histórico'} onClick={()=>void expand()}><Expand size={17}/></button></div></div>
  {guide&&<div className="historical-map-guide"><p><b>1. Escolha um ano:</b> esta base está limitada a 500–1500. A régua brasileira de acontecimentos tem outra cobertura e não muda automaticamente este mapa.</p><p><b>2. Clique em uma área colorida:</b> leia a ficha em português. O fundo do continente é apenas referência geográfica; não significa área habitada ou desabitada.</p><p><b>3. Confira o desenho e a fonte:</b> o polígono mostrado é o último disponível até aquele ano. Pode haver intervalos, sobreposições e referências incompletas.</p><p><b>4. Para o Brasil:</b> abra a trilha brasileira. Há fontes arqueológicas anteriores à chegada portuguesa, mas esta base não oferece os respectivos limites territoriais históricos.</p></div>}
  <div className="historical-map-mode"><button aria-pressed={mode==='pt'} onClick={()=>setMode('pt')}>Leitura em português</button><button aria-pressed={mode==='original'} onClick={()=>{if(mode!=='original'){setFrameYear(year);setReady(false);setSlow(false);setMode('original');}}}>Explorador original · inglês</button><button onClick={onBrazil}>Trilha brasileira · antes e depois de 1500 <ArrowUpRight size={13}/></button></div>
  <div className="historical-map-toolbar"><span><i className={mode==='pt'||ready?'ready':''}/>{mode==='pt'||ready?'Ano escolhido':'Carregando'} <b>{year}</b></span><form className="medieval-year" onSubmit={e=>{e.preventDefault();if(yearInput.trim())chooseYear(Number(yearInput));}}><label>Ano <input aria-label="Ano do mapa histórico" type="number" min={500} max={1500} step={1} required value={yearInput} disabled={mode==='original'&&!ready} onChange={e=>setYearInput(e.target.value)}/></label><button disabled={mode==='original'&&!ready} type="submit">Aplicar</button></form><input className="medieval-range" aria-label="Percorrer anos do mapa histórico" type="range" min={500} max={1500} value={year} disabled={mode==='original'&&!ready} onChange={e=>chooseYear(Number(e.target.value))}/><div>{[500,800,1000,1200,1500].map(y=><button key={y} disabled={mode==='original'&&!ready} aria-pressed={year===y} onClick={()=>chooseYear(y)}>{y}</button>)}</div></div>
  {mode==='original'&&slow&&<div className="historical-map-notice" role="status">O carregamento está demorando. <button onClick={()=>{setFrameYear(year);setReady(false);setSlow(false);setGeneration(v=>v+1);}}><RotateCcw size={14}/> Tentar novamente</button></div>}
  {mode==='pt'?<PortugueseMap year={year} onBrazil={onBrazil}/>:<><p className="historical-map-notice">Modo avançado original: interface auxiliar e narrativas em inglês. A leitura em português acima traduz os nomes e campos estruturados, não todo o corpus.</p><iframe key={generation} ref={frame} src={src} title="Explorador original em inglês: territórios entre 500 e 1500" className="historical-map-frame" allow="fullscreen" onLoad={()=>frame.current?.contentWindow?.postMessage({type:'nacional:init'},location.origin)}/></>}
  <footer className="historical-map-credits"><p>Motor e base: <a href="https://github.com/g-lanza/InvaderGIS" target="_blank" rel="noreferrer">InvaderGIS · Gavin Lanza e colaboradores</a>. Adaptação para estudo pessoal, sem finalidade comercial. Base experimental: a validação encontrou referências e vínculos incompletos. Não auditada integralmente pelo Nacional Atlas.</p><div><a href={import.meta.env.BASE_URL+'history-data/medieval-pt.json'} download>Catálogo em português</a><a href={assetBase+'LICENSE.txt'} target="_blank" rel="noreferrer">Licenças</a><a href={assetBase+'ATTRIBUTIONS.txt'} target="_blank" rel="noreferrer">Fontes e créditos</a><a href={assetBase+'validation.txt'} target="_blank" rel="noreferrer">Validação</a><a href={assetBase+'integration.json'} target="_blank" rel="noreferrer">Versão e alterações</a></div></footer>
  {notice&&<div className="historical-map-notice" role="status">{notice}<button aria-label="Fechar aviso do mapa" onClick={()=>setNotice('')}><X size={14}/></button></div>}
 </section>;
}
