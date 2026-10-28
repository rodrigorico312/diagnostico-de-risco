import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory,historyExport,readHistoryView} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
const event=(id:string)=>data.events.find(e=>e.id==='military:'+id)!;

test('trilhas: cada percurso mantém ordem temporal e não repete marcos',()=>{
 assert.equal(data.trails?.length,5);
 for(const trail of data.trails!){
  const dates=trail.steps.map(s=>{const e=data.events.find(e=>e.id===s.event)!;return e.date??`${e.year}-01-01`;});
  assert.deepEqual(dates,[...dates].sort());
  assert.equal(new Set(trail.steps.map(s=>s.event)).size,trail.steps.length);
 }
 assert.equal(readHistoryView(new URLSearchParams('h_tela=trails')).tab,'trails');
});
test('trilhas: recusa destinos ausentes, repetição e ordem invertida',()=>{
 const invalid=structuredClone(data);invalid.trails![0].steps[0].event='inexistente';
 assert.throws(()=>checkHistory(invalid),/Percurso/);
 const duplicate=structuredClone(data);duplicate.trails![0].steps[1]=duplicate.trails![0].steps[0];
 assert.throws(()=>checkHistory(duplicate),/Percurso/);
 const reversed=structuredClone(data);reversed.trails![0].steps.reverse();
 assert.throws(()=>checkHistory(reversed),/Percurso/);
});
test('8 de janeiro: distingue relato, defesa, voto e decisão inclusive no CSV',()=>{
 for(const id of ['camp2022','naime-marco','dutra-maio','dutra-setembro']){
  assert.equal(event(id).recordNature,'testimony');
  assert.match(historyExport(event(id),data).natureza_registro,/versão atribuída/);
 }
 assert.equal(event('defesas2025').recordNature,'defense');
 assert.equal(event('fux2025').recordNature,'vote');
 assert.equal(event('condenacao2025').recordNature,'judgment');
 assert.equal(event('pm2026').recordNature,'judgment');
 assert.match(event('naime-marco').limits,/AP 2417/);
 assert.match(event('dutra-setembro').limits,/não demonstra troca de tiros/);
 assert.ok(event('condenacao2025').sources.includes('military:acordao2668'));
});
test('cronologia: não mistura eleição de 2022 com 2026 nem a República com 1964',()=>{
 assert.equal(60345999-58206354,2139645);
 assert.equal(event('eleicao2022').date,'2022-10-30');
 assert.match(event('eleicao2022').summary,/2\.139\.645/);
 assert.match(event('eleicao2022').limits,/não Flávio/);
 assert.match(event('civil1894').limits,/não é o mesmo regime/);
 assert.match(event('civil1985').limits,/não elegeu diretamente/);
});
