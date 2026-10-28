import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory,historyExport,initialFilters,matchesHistory} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
const event=(id:string)=>data.events.find(e=>e.id==='teori:'+id)!;

test('Teori: nomeação, posse, morte e manifestação do MPF conservam suas próprias datas',()=>{
 assert.equal(checkHistory(data),data);
 assert.equal(event('posse2012').date,'2012-11-29');
 assert.equal(event('morte2017').date,'2017-01-19');
 assert.equal(event('mpf2019').date,'2019-01-22');
 assert.match(event('mpf2019').decision,/18:08/);
 assert.equal(data.appointments.find(a=>a.id==='teori:teori2012')!.appointedBy,'Dilma Rousseff');
 assert.equal(event('morte2017').place!.municipalityCode,'3303807');
 assert.ok(data.events.filter(e=>matchesHistory(e,{...initialFilters,person:'Teori Zavascki'})).length>=8);
});

test('Teori: apuração técnica e promoção de arquivamento não são sentenças',()=>{
 for(const id of ['cenipa2018','mpf2019'])assert.equal(event(id).recordNature,'investigation');
 assert.match(historyExport(event('mpf2019'),data).natureza_registro,/Investigação/);
 assert.match(event('mpf2019').limits,/não sentença/);
 assert.match(event('mpf2019').limits,/íntegra da decisão judicial e sua data não foram obtidas/);
 assert.match(event('cenipa2018').limits,/HTTP 403/);
 const source=data.sources.find(s=>s.id==='teori:promocao2019')!;
 assert.match(source.note!,/cópia|Cópia/);assert.match(source.note!,/Aos Fatos/);
});

test('Teori: trilha distingue continuidade dos acordos, relatoria e vaga na Corte',()=>{
 const trail=data.trails!.find(t=>t.id==='teori-zavascki')!;
 assert.equal(trail.steps.length,9);
 assert.equal(event('homologacao2017').date,'2017-01-30');
 assert.equal(event('fachin2017').date,'2017-02-02');
 assert.match(event('fachin2017').summary,/sucessões diferentes/);
 assert.ok(trail.steps.some(s=>s.event==='stf:moraes-nomeacao2017'));
 assert.ok(event('morte2017').studyLinks!.some(s=>s.event==='teori:mpf2019'));
});
