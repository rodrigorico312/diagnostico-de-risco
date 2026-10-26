import type {FeatureCollection} from 'geojson';
export interface Observation {value:number|null;year:string|null}
export interface Metric {id:string;name:string;unit:string;definition:string;sourceUrl:string;polarity?:string;coverage?:unknown;[key:string]:unknown}
export interface Territory {id:string;name:string;uf?:string;values:Record<string,Observation>;[key:string]:unknown}
export interface ContextData {meta:Record<string,unknown>;metrics:Metric[];countries?:Territory[];municipalities?:Territory[];sources?:unknown[];[key:string]:unknown}
export interface Bundle {world:ContextData;brazil:ContextData;worldGeo:FeatureCollection;brazilGeo:FeatureCollection}
export type Scope='world'|'brazil';
export type View='map'|'compare'|'budget'|'sources';
