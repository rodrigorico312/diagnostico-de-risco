import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {activeMedieval,medievalSnapshot,safeSourceUrl} from '../src/history/medieval';
import type {MedievalData,MedievalRecord} from '../src/history/medieval';
const data:MedievalData=JSON.parse(readFileSync(new URL('../public/history-data/medieval-pt.json',import.meta.url),'utf8'));
const record:MedievalRecord={id:'test',name:'Teste',originalName:'Test',type:'Reino',region:'Teste',status:'Rascunho',confidence:'Baixa',sources:[],formed:1000,dissolved:1300,snapshots:[{year:1250,geometry:{type:'Polygon',coordinates:[]}},{year:1100,geometry:{type:'Polygon',coordinates:[]}}]};
test('mapa nunca antecipa um desenho futuro nem mantém entidade fora do período',()=>{
 assert.equal(activeMedieval(record,999),false);assert.equal(activeMedieval(record,1300),true);assert.equal(activeMedieval(record,1301),false);
 assert.equal(medievalSnapshot(record,1050),undefined);assert.equal(medievalSnapshot(record,1200)?.year,1100);assert.equal(medievalSnapshot(record,1250)?.year,1250);assert.equal(medievalSnapshot(record,1400),undefined);
});
test('catálogo em português mantém IDs, datas, desenhos e referência integral ao insumo',()=>{
 const raw=JSON.parse(readFileSync(new URL('../public/invadergis/data/records/polity.json',import.meta.url),'utf8')) as {id:string;formed:number;dissolved:number;polygon_snapshots:{year:number;polygon:unknown}[];provenance:{sources_used:string[]}}[];
 assert.equal(data.records.length,raw.length);assert.equal(new Set(data.records.map(r=>r.id)).size,raw.length);assert.match(data.meta.inputSha256,/^[a-f0-9]{64}$/);
 for(const [i,p] of raw.entries()){const r=data.records[i];assert.equal(r.id,p.id);assert.equal(r.formed,p.formed??null);assert.equal(r.dissolved,p.dissolved??null);assert.deepEqual(r.sources,p.provenance.sources_used);assert.ok(r.snapshots.every(s=>(p.polygon_snapshots??[]).some(original=>original.year===s.year)));assert.ok(r.name&&r.type&&r.region);}
 assert.equal(data.records.find(r=>r.id==='holy_roman_empire')?.name,'Sacro Império Romano-Germânico');
 const geometryRaw=readFileSync(new URL('../public/invadergis/data/layers/polities.geojson',import.meta.url));
 const geometry=JSON.parse(geometryRaw.toString('utf8'));
 assert.equal(data.meta.geometrySha256,createHash('sha256').update(geometryRaw).digest('hex'));
 for(const r of data.records){const original=geometry.features.filter((f:{properties:{id:string}})=>f.properties.id===r.id);assert.deepEqual(r.snapshots,original.map((f:{properties:{snapshotYear:number};geometry:unknown})=>({year:f.properties.snapshotYear,geometry:f.geometry})));}
 for(const r of data.records)for(const snap of r.snapshots){const rings=snap.geometry.type==='Polygon'?snap.geometry.coordinates:snap.geometry.type==='MultiPolygon'?snap.geometry.coordinates.flat():[];for(const ring of rings)for(const point of ring){assert.ok(Number.isFinite(point[0])&&Number.isFinite(point[1]));assert.ok(Math.abs(point[0])<=180&&Math.abs(point[1])<=90);}}
});
test('fontes de terceiros não podem executar protocolos ativos como links',()=>{
 assert.equal(safeSourceUrl('javascript:alert(1)'),null);assert.equal(safeSourceUrl('data:text/html,test'),null);assert.equal(safeSourceUrl('https://example.org/source'),'https://example.org/source');
});
