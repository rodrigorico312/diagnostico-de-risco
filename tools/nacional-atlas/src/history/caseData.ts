import type {CaseActor,CaseRelation,HistoryData,HistoryCase} from './types';

export const caseBasisLabels={documented:'Documento consultado',reported:'Relatado pela imprensa'};
export const claimLabels={documented:'Documento consultado',reported:'Notícia · original pendente',interpretation:'Distinção / leitura delimitada',pending:'Em aberto'};
const fold=(text:string)=>text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('pt-BR');
export function caseActorMatches(actor:CaseActor,query:string){return fold([actor.name,actor.role,actor.action].join(' ')).includes(fold(query.trim()));}
export function caseRelations(c:HistoryCase,actor:string,basis:string){return c.relations.filter(r=>(actor==='all'||r.from===actor||r.to===actor)&&(basis==='all'||r.basis===basis));}
export function caseRelationExport(relation:CaseRelation,c:HistoryCase,data:HistoryData){return {caso:c.title,origem:c.actors.find(a=>a.id===relation.from)?.name??'',destino:c.actors.find(a=>a.id===relation.to)?.name??'',relacao:relation.label,periodo:relation.period,base:caseBasisLabels[relation.basis],alcance:relation.detail,fontes:relation.sources.map(id=>data.sources.find(s=>s.id===id)?.url??'').join('; '),revisao:c.asOf,limite:c.limits};}

export function checkCases(data:HistoryData){
 const cases=data.cases??[],eventIds=new Set(data.events.map(e=>e.id)),sourceById=new Map(data.sources.map(s=>[s.id,s])),trailIds=new Set(data.trails?.map(t=>t.id));
 const unique=(ids:string[])=>new Set(ids).size===ids.length;
 const supported=(row:{sources:string[];basis?:string;status?:string},allowed:Set<string>)=>row.sources.length>0&&row.sources.every(id=>allowed.has(id)&&sourceById.has(id))&&((row.basis??row.status)!=='documented'||row.sources.some(id=>['primary','institutional'].includes(sourceById.get(id)!.kind)));
 if(!unique(cases.map(c=>c.id)))throw Error('Casos com identificadores duplicados.');
 for(const c of cases){
  const actorIds=new Set(c.actors.map(a=>a.id)),allowed=new Set(c.sources);
  if(!c.title||!c.summary||!/^\d{4}-\d{2}-\d{2}$/.test(c.asOf)||!c.material||!c.limits||!c.gaps.length||!trailIds.has(c.trail)||!c.events.length||!unique(c.events)||c.events.some(id=>!eventIds.has(id))||!c.sources.length||c.sources.some(id=>!sourceById.has(id)))throw Error('Caso sem contexto ou referência resolvida.');
  if(!c.actors.length||!unique(c.actors.map(a=>a.id))||c.actors.some(a=>!a.name||!a.role||!a.action||!['documented','reported'].includes(a.basis)||!supported(a,allowed)))throw Error('Participante sem função ou evidência válida.');
  if(!unique(c.relations.map(r=>r.id))||c.relations.some(r=>r.from===r.to||!actorIds.has(r.from)||!actorIds.has(r.to)||!r.label||!r.detail||!r.period||!['documented','reported'].includes(r.basis)||!supported(r,allowed)))throw Error('Relação sem origem, destino ou evidência válida.');
  if(!c.claims.length||!unique(c.claims.map(claim=>claim.id))||c.claims.some(claim=>!claim.claim||!claim.assessment||!Object.hasOwn(claimLabels,claim.status)||claim.sources.some(id=>!allowed.has(id))||(claim.status==='pending'?(!claim.needed||!claim.origin):!supported(claim,allowed))))throw Error('Afirmação sem verificação ou pendência identificada.');
 }
 return data;
}
