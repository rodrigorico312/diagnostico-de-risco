import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
const c=data.cases!.find(c=>c.id==='stf-origem')!;

test('STF: distingue antecedente, denominação, organização e instalação',()=>{
 assert.equal(checkHistory(data),data);
 for(const [id,date] of [['stf:casa1808','1808-05-10'],['justice:justice-stj-imperio','1828-09-18'],['stf:decreto510','1890-06-22'],['stf:decreto848','1890-10-11'],['justice:justice-stf-republica','1891-02-28'],['stf:moraes-nomeacao2017','2017-02-22']])assert.equal(data.events.find(e=>e.id===id)!.date,date);
 assert.equal(c.actors.length,12);assert.equal(c.relations.length,12);
 assert.equal(data.trails!.find(t=>t.id===c.trail)!.steps.length,19);
 assert.equal(data.meta.updatedAt,'28/10/2026');
});

test('STF: contraposição documental exige documento, e incerteza exige lacuna',()=>{
 for(const id of ['esquerda','moraes','todos'])assert.equal(c.claims.find(r=>r.id===id)!.status,'refuted');
 const invalid=structuredClone(data),study=invalid.cases!.find(c=>c.id==='stf-origem')!;
 const press=data.sources.find(s=>s.kind==='press')!.id;
 study.sources.push(press);study.claims.find(claim=>claim.id==='esquerda')!.sources=[press];
 assert.throws(()=>checkHistory(invalid),/Afirmação/);
 for(const id of ['plano','ditadura']){const claim=c.claims.find(r=>r.id===id)!;assert.equal(claim.status,'pending');assert.ok(claim.needed&&claim.origin);}
});

test('STF: composição histórica e papéis de governo não viram controle atual',()=>{
 assert.equal(data.appointments.length,16);
 assert.match(c.claims.find(r=>r.id==='todos')!.assessment,/não é a composição atual/);
 assert.match(c.actors.find(a=>a.id==='benjamin')!.action,/antes do Decreto 848/);
 assert.match(c.actors.find(a=>a.id==='sayao')!.role,/interino/);
 assert.match(c.actors.find(a=>a.id==='freitas')!.role,/eleito/);
 assert.match(c.claims.find(r=>r.id==='controle')!.assessment,/processo civil/);
 assert.match(c.claims.find(r=>r.id==='controle')!.assessment,/não prova seu cumprimento/);
});
