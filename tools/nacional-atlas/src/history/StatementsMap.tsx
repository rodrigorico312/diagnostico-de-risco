import {useEffect,useMemo,useRef,useState} from 'react';
import L from 'leaflet';
import type {FeatureCollection} from 'geojson';
import 'leaflet/dist/leaflet.css';
import type {HistoryEvent} from './types';

export default function StatementsMap({events,selectedId,onOpen}:{events:HistoryEvent[];selectedId:string;onOpen:(id:string)=>void}){
 const root=useRef<HTMLDivElement>(null),map=useRef<L.Map|null>(null),layers=useRef<L.LayerGroup|null>(null),callback=useRef(onOpen),previousPlaces=useRef('');callback.current=onOpen;
 const [geo,setGeo]=useState<FeatureCollection|null>(null),[error,setError]=useState(''),[tileError,setTileError]=useState(false);
 const available=useMemo(()=>new Set(geo?.features.map(f=>String(f.properties?.id))??[]),[geo]);
 const located=geo?events.filter(e=>e.place&&available.has(e.place.municipalityCode)).length:null;
 useEffect(()=>{const controller=new AbortController();fetch(import.meta.env.BASE_URL+'history-data/places.geojson',{signal:controller.signal}).then(async r=>{if(!r.ok)throw Error('A referência territorial não carregou. Os documentos continuam disponíveis na lista.');const g=await r.json();if(g.type!=='FeatureCollection'||!Array.isArray(g.features))throw Error('Formato geográfico inválido.');return g as FeatureCollection;}).then(setGeo).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>controller.abort();},[]);
 useEffect(()=>{
  if(!root.current)return;
  const m=L.map(root.current,{zoomControl:true,minZoom:2,maxZoom:18,scrollWheelZoom:false}).setView([-14,-52],4);map.current=m;layers.current=L.layerGroup().addTo(m);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{className:'statement-map-tiles',maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> colaboradores'}).addTo(m);
  tiles.on('tileerror',()=>setTileError(true));L.control.scale({imperial:false}).addTo(m);
  const observer=new ResizeObserver(()=>m.invalidateSize());observer.observe(root.current);
  return()=>{observer.disconnect();m.remove();map.current=null;layers.current=null;};
 },[]);
 useEffect(()=>{
  if(!geo||!layers.current||!map.current)return;
  const group=layers.current,m=map.current;group.clearLayers();
  const grouped=new Map<string,HistoryEvent[]>();
  for(const event of events){const code=event.place?.municipalityCode;if(code&&available.has(code)){const list=grouped.get(code)??[];list.push(event);grouped.set(code,list);}}
  const active=geo.features.filter(f=>grouped.has(String(f.properties?.id)));
  const activeCollection:FeatureCollection={type:'FeatureCollection',features:active};
  for(const feature of active){
   const code=String(feature.properties?.id),records=grouped.get(code)!,highlight=records.some(e=>e.id===selectedId);
   const polygon=L.geoJSON(feature,{style:{color:'#98bbcd',weight:1.2,fillColor:'#446b7e',fillOpacity:.3}}).addTo(group);
   const center=polygon.getBounds().getCenter();
   const marker=L.circleMarker(center,{radius:highlight?12:9,color:highlight?'#d8f49d':'#9ed4d2',weight:2,fillColor:highlight?'#d8f49d':'#274958',fillOpacity:.92}).addTo(group);
   const label=document.createElement('span');label.textContent=`${records[0].place!.label} · ${records.length} ${records.length===1?'registro':'registros'} · referência municipal`;marker.bindTooltip(label);
   const popup=document.createElement('div');popup.className='statement-map-popup';const title=document.createElement('b');title.textContent=records[0].place!.label;popup.append(title);
   const precision=document.createElement('p');precision.textContent='Referência municipal; este ponto não indica o prédio ou endereço do acontecimento.';popup.append(precision);
   for(const record of records){const button=document.createElement('button');button.type='button';button.textContent=record.year+' · '+record.statement!.speaker;button.addEventListener('click',()=>callback.current(record.id));popup.append(button);}
   marker.bindPopup(popup);marker.on('click',()=>{if(records.length===1)callback.current(records[0].id);});
  }
  const key=[...grouped.keys()].sort().join(',');
  if(key!==previousPlaces.current){previousPlaces.current=key;if(active.length)m.fitBounds(L.geoJSON(activeCollection).getBounds(),{padding:[40,40],maxZoom:7,animate:false});else m.setView([-14,-52],4);}
 },[geo,events,selectedId,available]);
 return <section className="statements-map" aria-label="Mapa de referências municipais das falas e publicações"><div ref={root} className="statements-map-canvas"/><div className="statements-map-note"><b>Onde esses registros se situam</b><span>{located===null?'Carregando a malha municipal…':`${located} de ${events.length} ${events.length===1?'registro':'registros'} com referência cartográfica · ${events.length-located} sem localização no mapa`}</span><span>Malha atual do IBGE. Ponto = centro do enquadramento municipal, sem precisão de endereço. Não representa fronteiras históricas.</span><a href="https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio" target="_blank" rel="noreferrer">Consultar malha de origem</a></div>{error&&<p role="status">{error}</p>}{tileError&&<p role="status">Parte do mapa-base não carregou. As referências municipais e a lista permanecem disponíveis.</p>}</section>;
}
