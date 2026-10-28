import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {HistoryData} from '../src/history/types';
import {checkHistory,readHistoryView} from '../src/history/data';
import {caseActorMatches,caseRelationExport,caseRelations} from '../src/history/caseData';
const data:HistoryData=JSON.parse(fs.readFileSync('public/history-data/index.json','utf8'));
const c=data.cases!.find(c=>c.id==='tagliaferro')!;
test('participantes: relações explícitas resolvem nomes, datas, fontes e percurso',()=>{
 assert.equal(checkHistory(data),data);
 assert.equal(c.actors.length,13);assert.equal(c.relations.length,10);
 assert.ok(data.trails!.some(t=>t.id===c.trail));
 assert.equal(readHistoryView(new URLSearchParams('h_tela=cases')).tab,'cases');
 for(const r of c.relations){const output=caseRelationExport(r,c,data);assert.ok(output.origem&&output.destino&&output.periodo);assert.match(output.fontes,/^https:\/\//);assert.ok(!('notes' in output));}
});
test('participantes: busca por função e filtros não criam relações',()=>{
 assert.ok(caseActorMatches(c.actors.find(a=>a.id==='cristina')!,'CHEFE DE GABINETE'));
 const selected=caseRelations(c,'tagliaferro','documented');
 assert.ok(selected.length>0);assert.ok(selected.every(r=>(r.from==='tagliaferro'||r.to==='tagliaferro')&&r.basis==='documented'));
 assert.equal(caseRelations(c,'cristina','documented').length,0);
 assert.equal(caseRelations(c,'inexistente','all').length,0);
});
test('participantes: notícia não pode ser promovida a vínculo documental',()=>{
 const missing=structuredClone(data);missing.cases![0].relations[0].to='ausente';
 assert.throws(()=>checkHistory(missing),/Relação/);
 const promoted=structuredClone(data);promoted.cases![0].relations.find(r=>r.id==='pedidos')!.basis='documented';
 assert.throws(()=>checkHistory(promoted),/Relação/);
 const unsupported=structuredClone(data);unsupported.cases![0].claims.find(claim=>claim.id==='fonte')!.needed='';
 assert.throws(()=>checkHistory(unsupported),/Afirmação/);
});
test('investigação: não confunde precedente, sentença específica ou identidade de fonte',()=>{
 assert.equal(data.events.find(e=>e.id==='networks:noticia2026')!.evidence,'reported');
 const precedent=data.events.find(e=>e.id==='networks:cassacao2026')!;
 assert.equal(precedent.evidence,'documented');assert.match(precedent.limits,/distinto/);
 assert.equal(c.claims.find(claim=>claim.id==='fonte')!.status,'pending');
 assert.equal(c.claims.find(claim=>claim.id==='paises')!.status,'pending');
 assert.ok(!c.relations.some(r=>r.from==='tagliaferro'&&r.to==='glenn'));
 assert.equal(data.events.find(e=>e.id==='networks:nota2024')!.recordNature,'institutional_response');
 assert.equal(data.events.find(e=>e.id==='networks:recebimento2025')!.date,'2025-11-14');
});
