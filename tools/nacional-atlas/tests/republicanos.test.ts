import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {initialFilters,matchesHistory,readHistoryView} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
test('republicanos: perfis abrem por URL e levam a marcos pesquisáveis por pessoa',()=>{
 for(const id of ['rui-barbosa','floriano-peixoto','jose-marti']){
  const p=data.profiles!.find(p=>p.id===id)!;assert.ok(p);
  assert.equal(readHistoryView(new URLSearchParams('h_tela=ideas&h_autor='+id)).tab,'ideas');
  assert.ok(p.events.some(id=>matchesHistory(data.events.find(e=>e.id===id)!,{...initialFilters,person:p.actors[0]})));
 }
 assert.equal(data.events.filter(e=>e.id.startsWith('republicanos:')).length,7);
});
test('republicanos: divergência de datas do HC fica explícita e sem dia inventado',()=>{
 const e=data.events.find(e=>e.id==='republicanos:hc1892')!;
 assert.equal(e.year,1892);assert.equal(e.date,undefined);
 assert.match(e.limits,/27\/04\/1892/);assert.match(e.limits,/23\/04/);
 assert.ok(e.actors.includes('Floriano Peixoto')&&e.actors.includes('Rui Barbosa'));
 assert.match(e.decision,/negou/);
});
test('republicanos: edição, publicação, jornal e partido não são confundidos',()=>{
 const obra=data.events.find(e=>e.id==='republicanos:nuestra1891')!;
 assert.equal(obra.date,'1891-01-30');assert.match(obra.limits,/não se afirma que seja a primeira/);
 assert.equal(obra.statement!.source,'republicanos:nuestra');
 const patria=data.events.find(e=>e.id==='republicanos:patria1892')!;
 assert.equal(patria.date,'1892-03-14');assert.match(patria.limits,/não o exemplar original/);
 assert.match(patria.limits,/não é automaticamente a data de fundação/);
 assert.equal(data.sources.find(s=>s.id==='republicanos:patria')!.kind,'research');
 const manifesto=data.events.find(e=>e.id==='republicanos:montecristi1895')!;
 assert.match(manifesto.limits,/íntegra manuscrita não foi examinada/);
 const morte=data.events.find(e=>e.id==='republicanos:marti1895')!;
 assert.equal(morte.date,'1895-05-19');assert.match(morte.limits,/1959/);
});
