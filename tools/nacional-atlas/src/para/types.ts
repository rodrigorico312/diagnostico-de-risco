import type {FeatureCollection} from 'geojson';
export interface Values {lula:number;flavio:number;outros:number;validos:number;brancos:number;nulos:number;nulosUrna:number;nulosTecnicos:number;nominaisOriginais:number;total:number;aptos:number}
export interface OfficialTotal extends Values {secoes:number;locais:number;agregadas:number;semCoordenadaSecoes:number;semCoordenadaVotos:number;semLocalidadeSecoes:number;dataTotalizacao:string}
export interface Municipality {id:string;ibge:string;name:string;region:string;totals:Record<string,OfficialTotal>}
export interface Evidence {id:string;url:string;sha256:string;bytes:number}
export interface Index {meta:{year:number;collectedAt:string;checks:{name:string;passed:boolean}[];sources:Evidence[];aggregation:string;bairroPolicy:string;territoryPolicy:string;coordinatePolicy:string;limitations:string[];buAuxStatus:Record<string,number>};totals:Record<string,OfficialTotal>;municipalities:Municipality[]}
export interface Place extends Values {turno:number;municipioTse:string;municipioIbge:string;municipio:string;region:string;zona:number;localId:string;localNumero:number;local:string;endereco:string;lat:number|null;lon:number|null;latTse:number|null;lonTse:number|null;geoStatus:string;bairroTse:string;localidadeNome:string;localidadeId:string;tipoTerritorio:string;situacaoGeografica:string;areaIbgeId:string|null;bairroGeografico:string|null;areaIds?:string[];secoes:number;sectionNumbers:number[];agregadas:number[]}
export interface Section extends Omit<Place,'secoes'|'sectionNumbers'> {id:string;secao:number;source:string;buUrl:string|null}
export interface Filters {city:string;region:string;query:string;locality:string;zone:string;territory:string;quality:string;section:string;area:string}
export interface Group extends Values {id:string;name:string;city:string;region:string;secoes:number;locais:number;places:Place[]}
export type Metric='winner'|'lula'|'flavio'|'turnout'|'invalid';
export type View='explore'|'compare'|'sources';
export interface Geo {municipios:FeatureCollection;bairros:FeatureCollection;territorios:FeatureCollection}
