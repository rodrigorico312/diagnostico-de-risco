import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {attachAreas,geographicGroups,initial,matches,sum,sectionsToPlaces} from '../src/para/data';
import type {Geo,Place,Section} from '../src/para/types';
const read=(name:string)=>JSON.parse(fs.readFileSync('public/para-data/'+name,'utf8'));
const geo:Geo={municipios:read('municipios.geojson'),bairros:read('bairros.geojson'),territorios:read('territorios.json')};
const raw:Place[]=read('locals.json'),places=attachAreas(raw,geo.territorios);
test('48 bairros de Santarém conservam somente votos posicionados, incluindo áreas sem escola',()=>{
 for(const turn of [1,2]){
  const rows=places.filter(p=>p.turno===turn&&p.municipioTse==='05355');
  const groups=geographicGroups(rows,geo,'1506807');
  assert.equal(groups.length,48);
  assert.ok(groups.some(g=>g.locais===0));
  assert.deepEqual(sum(groups),sum(rows.filter(p=>p.areaIbgeId!==null)));
  assert.deepEqual(sum([...groups,...rows.filter(p=>!p.areaIbgeId)]),sum(rows));
  assert.equal(new Set(groups.flatMap(g=>g.places.map(p=>p.localId))).size,groups.reduce((n,g)=>n+g.locais,0));
 }
});
test('nome cadastral não desloca votos para o polígono de outro bairro',()=>{
 const rows=places.filter(p=>p.turno===2&&p.municipioTse==='05355');
 const place=rows.find(p=>p.localidadeNome==='Mapiri')!;
 assert.notEqual(place.bairroGeografico,'Mapiri');
 const groups=geographicGroups(rows,geo,'1506807');
 assert.ok(groups.find(g=>g.id===place.areaIbgeId)!.places.includes(place));
 assert.ok(!groups.find(g=>g.name==='Mapiri')!.places.includes(place));
});
test('Alter vila usa dois endereços explícitos e não inclui a escola na rodovia',()=>{
 for(const t of [1,2]){
  const rows=places.filter(p=>matches(p,{...initial,city:'05355',area:'alter-vila'},t));
  assert.equal(rows.length,2);
  assert.deepEqual(rows.map(p=>p.localId).sort(),['05355-104-1317','05355-104-1988']);
  assert.ok(rows.every(p=>p.endereco==='VILA DE ALTER DO CHÃO'||p.endereco==='COMUNIDADE UNIÃO DE ALTER DO CHÃO'));
  if(t===2){assert.equal(sum(rows).lula,1472);assert.equal(sum(rows).flavio,1029);}
 }
 assert.equal(geo.territorios.features.find(f=>f.properties?.id==='alter-vila')!.geometry,null);
});
test('distrito de Alter é um recorte distinto da vila, com fonte e malha verificáveis',()=>{
 const district=places.filter(p=>matches(p,{...initial,city:'05355',area:'150680710'},2));
 assert.equal(district.length,25);
 assert.ok(district.some(p=>p.localId==='05355-104-1350'));
 const feature=geo.territorios.features.find(f=>f.properties?.id==='150680710')!;
 assert.ok(feature.geometry);
 const catalog=read('territorios.json');
 assert.ok(catalog.source.url.startsWith('https://geoftp.ibge.gov.br/'));
 assert.match(catalog.source.sha256,/^[a-f0-9]{64}$/);
});
test('filtro geográfico preserva o detalhe de seção e a comparação de turnos',()=>{
 const sections:Section[]=attachAreas(read('municipios/05355.json').sections,geo.territorios);
 for(const t of [1,2]){
  const fromSections=sectionsToPlaces(sections.filter(s=>s.turno===t));
  const f={...initial,city:'05355',area:'alter-vila'};
  assert.deepEqual(sum(fromSections.filter(p=>matches(p,f,t))),sum(places.filter(p=>matches(p,f,t))));
 }
 assert.deepEqual(sum(places.filter(p=>matches(p,{...initial,city:'04804'},2))),sum(raw.filter(p=>p.municipioTse==='04804'&&p.turno===2)));
 assert.equal(geographicGroups(places,geo,'1501451').length,0);
});
