import type {HistoryEvent} from './types';
export function recordYears(events:Pick<HistoryEvent,'year'>[]){return [...new Set(events.map(e=>e.year).filter(Number.isFinite))].sort((a,b)=>a-b);}
export function medievalYear(value:unknown,fallback=1000){const year=typeof value==='number'?value:typeof value==='string'&&value.trim()?Number(value):NaN;return Number.isFinite(year)?Math.min(1500,Math.max(500,Math.round(year))):fallback;}
