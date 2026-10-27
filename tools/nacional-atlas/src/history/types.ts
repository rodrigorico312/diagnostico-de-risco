export interface HistorySource{id:string;title:string;url:string;kind:'primary'|'institutional'|'research'|'press';checkedAt:string;note?:string}
export interface HistoricalStatement{kind:'speech'|'publication';speaker:string;roleAtTime:string;venue:string;excerpt:string;source:string;locator:string;declaredContext:string;intentLimit:string}
export interface HistoryPlace{municipalityCode:string;label:string;basis:string}
export interface HistoryEvent{id:string;year:number;date?:string;label:string;period:string;topics:string[];actors:string[];summary:string;context:string;decision:string;effects:string[];interpretation?:string;limits:string;sources:string[];evidence:'documented'|'reported'|'question';related:string[];area:string;approximate?:boolean;statement?:HistoricalStatement;place?:HistoryPlace;studyLinks?:{event:string;label:string}[]}
export interface Appointment{id:string;name:string;appointedBy:string;year:number;source:string;notes:string}
export interface HistoryData{meta:{updatedAt:string;scope:string;limitations:string[];checks:{name:string;passed:boolean}[];inputHashes:Record<string,string>};sources:HistorySource[];events:HistoryEvent[];appointments:Appointment[]}
export interface HistoryFilters{query:string;period:string;decade:string;year:string;topic:string;person:string;evidence:string;kind:string;place:string}
