import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory,historyExport,initialFilters,matchesHistory,readHistoryView} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
test('ideias: nove entradas com documentos, limites e marcos que existem',()=>{
 assert.equal(data.profiles?.length,9);assert.equal(checkHistory(data),data);
 for(const p of data.profiles!){assert.ok(p.claims.length&&p.questions.length&&p.limits&&p.events.length);for(const id of p.events)assert.ok(data.events.some(e=>e.id===id));for(const c of p.claims)assert.ok(c.sources.every(id=>p.sources.includes(id)));}
 const broken=structuredClone(data);broken.profiles![0].claims[0].sources=['missing'];assert.throws(()=>checkHistory(broken),/Perfil/);
});
test('ideias: data anual não vira dia inventado e continua pesquisável e exportável',()=>{
 const e=data.events.find(e=>e.id==='ideas:olavo-individuo-1994')!;
 assert.equal(e.date,undefined);assert.equal(e.statement?.datePrecision,'year');assert.ok(matchesHistory(e,{...initialFilters,person:'Olavo de Carvalho',year:'1994',kind:'publication'}));
 assert.equal(historyExport(e,data).data,'');assert.match(historyExport(e,data).precisao_data,/Ano da obra/);
 const broken=structuredClone(data);delete broken.events.find(v=>v.id===e.id)!.statement!.datePrecision;assert.throws(()=>checkHistory(broken),/vínculo/);
 assert.equal(readHistoryView(new URLSearchParams('h_tela=ideas&h_autor=olavo')).tab,'ideas');
});
test('ideias: vídeos não recebem transcrição fictícia nem localização privada',()=>{
 for(const id of ['fraga-ancap-2012','fraga-bitcoin-2012']){const e=data.events.find(e=>e.id==='ideas:'+id)!;assert.equal(e.statement,undefined);assert.equal(e.place,undefined);assert.match(e.limits,/transcrição/);assert.match(e.limits,/UTC/);}
 assert.ok(data.profiles!.find(p=>p.id==='fraga')!.claims.some(c=>c.status==='reported'));
});
test('ideias: correntes socialistas e nazismo não são fundidos por um nome',()=>{
 assert.notEqual(data.profiles!.find(p=>p.id==='bernstein')!.tradition,data.profiles!.find(p=>p.id==='lenin')!.tradition);
 const hitler=data.profiles!.find(p=>p.id==='hitler')!;assert.match(hitler.intro,/racista e antissemita/);assert.match(hitler.limits,/não define sozinho/);
 const wannsee=data.events.find(e=>e.id==='ideas:wannsee-1942')!;assert.ok(!wannsee.actors.includes('Adolf Hitler'));assert.match(wannsee.limits,/não participou/);
 assert.equal(data.events.find(e=>e.id==='ideas:lenin-redacao-1917')!.year,1917);assert.equal(data.events.find(e=>e.id==='ideas:lenin-publicacao-1918')!.year,1918);
});
