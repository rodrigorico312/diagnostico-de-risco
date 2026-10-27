export type AtlasView='historia'|'mapa'|'eleicoes';
export function atlasView(params:URLSearchParams):AtlasView {
 const v=params.get('visao');if(v==='historia'||v==='mapa'||v==='eleicoes')return v;
 if(params.has('municipio')||params.has('turno'))return 'eleicoes';
 if(params.has('escala')||params.has('camada')||params.has('tela'))return 'mapa';
 return 'historia';
}
export function atlasHref(view:AtlasView,params:Record<string,string>={}){const p=new URLSearchParams({visao:view,...params});return '/atlas/?'+p.toString();}
