import type {Geometry} from 'geojson';
export interface MedievalRecord{id:string;name:string;originalName:string;type:string;region:string;formed:number|null;dissolved:number|null;status:string;confidence:string;sources:string[];snapshots:{year:number;geometry:Geometry}[]}
export interface MedievalData{meta:{startYear:number;endYear:number;upstream:string;commit:string;inputSha256:string;geometrySha256:string;translation:string;geometry:string};records:MedievalRecord[];sources:{id:string;title:string;author:string;year:number;url:string}[]}
export function activeMedieval(record:MedievalRecord,year:number){return typeof record.formed==='number'&&record.formed<=year&&(typeof record.dissolved!=='number'||record.dissolved>=year);}
export function medievalSnapshot(record:MedievalRecord,year:number){if(!activeMedieval(record,year))return undefined;return record.snapshots.filter(s=>s.year<=year).sort((a,b)=>b.year-a.year)[0];}
export function safeSourceUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:'?u.href:null;}catch{return null;}}
