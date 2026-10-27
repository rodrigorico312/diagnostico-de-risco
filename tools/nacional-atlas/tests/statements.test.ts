import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory,historyExport,initialFilters,matchesHistory,readHistoryView} from '../src/history/data';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
const vote=data.events.find(e=>e.id==='statements:bolsonaro-ustra-2016')!;

test('declaração de voto tem trecho vinculado ao documento e data sem horário inventado',()=>{
 assert.equal(vote.date,'2016-04-17');assert.ok(!vote.date.includes('T'));
 assert.equal(vote.statement?.kind,'speech');assert.match(vote.statement!.excerpt,/pavor de Dilma Rousseff/);
 assert.ok(vote.sources.includes(vote.statement!.source));assert.match(vote.statement!.roleAtTime,/PSC-RJ/);
 assert.ok(data.events.find(e=>e.id==='statements:ustra-tjsp-2012')!.limits.includes('Não é condenação criminal'));
 assert.ok(vote.limits.includes('Não demonstra que Ustra torturou pessoalmente Dilma'));
});
test('trilha atravessa períodos e preserva reconhecimento judicial e desdobramento parlamentar',()=>{
 const links=vote.studyLinks!.map(l=>l.event);
 for(const id of ['ustra-comando-1970','dilma-prisao-1970','ustra-tjsp-2012','ustra-stj-2014','etica-bolsonaro-2016'])assert.ok(links.includes('statements:'+id));
 assert.ok(data.events.find(e=>e.id==='statements:ulysses-discurso-1988')!.related.includes('foundations:f-constituicao1988'));
 assert.equal(checkHistory(data),data);
});
test('fala não se confunde com verdade das alegações; falta de fonte bloqueia a base',()=>{
 const broken=structuredClone(data);broken.events.find(e=>e.id===vote.id)!.statement!.source='missing';
 assert.throws(()=>checkHistory(broken),/vínculo documental/);
 const brokenTrail=structuredClone(data);brokenTrail.events.find(e=>e.id===vote.id)!.studyLinks![0].event='missing';
 assert.throws(()=>checkHistory(brokenTrail),/Trilha/);
});
test('busca encontra palavras do trecho; tipo, município e data filtram juntos',()=>{
 assert.ok(matchesHistory(vote,{...initialFilters,query:'pavor de dilma',kind:'speech',place:'5300108',year:'2016'}));
 assert.ok(!matchesHistory(vote,{...initialFilters,kind:'publication'}));
 assert.ok(!matchesHistory(vote,{...initialFilters,place:'3550308'}));
 assert.equal(readHistoryView(new URLSearchParams('h_tela=statements&h_kind=speech')).tab,'statements');
});
test('localização é municipal; malha e contagens não inventam pontos de endereço',()=>{
 const geo=JSON.parse(fs.readFileSync('public/history-data/places.geojson','utf8'));
 assert.deepEqual(geo.features.map((f:any)=>f.properties.id).sort(),['3550308','5300108']);
 assert.match(geo.metadata.precision,/não endereço exato/);assert.equal(geo.metadata.sourceFileSha256.length,64);
 for(const e of data.events.filter(e=>e.statement)){assert.ok(geo.features.some((f:any)=>f.properties.id===e.place?.municipalityCode));assert.ok(!('latitude' in e.place!));}
});
test('exportação separa trecho, atribuição e limites sem anotações pessoais',()=>{
 const row=historyExport(vote,data);assert.equal(row.tipo_registro,'Falas');assert.equal(row.codigo_ibge,'5300108');
 assert.equal(row.trecho_original,vote.statement!.excerpt);assert.match(row.fonte_trecho,/camara.leg.br/);
 assert.equal(row.precisao_localizacao,'Referência municipal, não endereço exato');
});
