import {ArrowRight,ArrowUpRight,BookOpen,Landmark,Users} from 'lucide-react';
import type {HistoryData} from './types';
import './court.css';

const milestones=[
 {id:'stf:casa1808',label:'1808',title:'Antecedente português',text:'Dom João organiza a Casa da Suplicação do Brasil. Ainda era uma monarquia.'},
 {id:'justice:justice-stj-imperio',label:'1828–1829',title:'Tribunal do Império',text:'Lei de Dom Pedro I organiza o Supremo Tribunal de Justiça, instalado em 1829.'},
 {id:'stf:decreto848',label:'1890',title:'Organização republicana',text:'A denominação aparece em junho. Em outubro, o Decreto 848 organiza o STF no governo Deodoro.'},
 {id:'justice:justice-stf-republica',label:'1891',title:'Constituição e instalação',text:'Constituição em 24 de fevereiro; instalação do tribunal em 28 de fevereiro, com 15 juízes.'},
] as const;

export default function CourtOrigins({data,onOpen,onCase,onTrail}:{data:HistoryData;onOpen:(id:string)=>void;onCase:(id:string)=>void;onTrail:(id:string)=>void}){
 const study=data.cases?.find(c=>c.id==='stf-origem');
 if(!study)return null;
 const sources=new Map(data.sources.map(s=>[s.id,s]));
 const sourceLink=(id:string)=>{const s=sources.get(id);return s?<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={12}/></a>:null;};
 return <section className="court-origins" aria-label="Origem e transformações do STF">
  <header><span className="history-eyebrow"><Landmark size={15}/> ORIGEM, GOVERNO E LIMITES</span><h2>Quem criou o STF?</h2><p>O tribunal republicano foi organizado no Governo Provisório de <strong>Deodoro da Fonseca</strong>, em 1890, e instalado em 1891. A história começa antes, com instituições da monarquia.</p></header>
  <div className="court-milestones">{milestones.map(m=><button key={m.id} onClick={()=>onOpen(m.id)} aria-label={'Estudar '+m.label+': '+m.title}><span>{m.label}</span><h3>{m.title}</h3><p>{m.text}</p><small>Abrir marco e fontes <ArrowRight size={13}/></small></button>)}</div>
  <div className="court-origin-document"><span>NO DOCUMENTO DE 1890</span><blockquote>“A Justiça Federal será exercida: a) Por um Supremo Tribunal Federal”</blockquote><p>Decreto 848, art. 1º. O ato traz os nomes de Deodoro da Fonseca e Campos Salles. A sessão de instalação veio depois.</p>{sourceLink('stf:decreto848')}</div>
  <div className="court-fact-grid">{['esquerda','moraes'].map(id=>{const claim=study.claims.find(c=>c.id===id);return claim?<article key={id}><span className="court-fact-label">VERIFICAÇÃO HISTÓRICA</span><h3>{claim.claim}</h3><p>{claim.assessment}</p><div className="court-source-links">{claim.sources.filter((_,i)=>i<2).map(sourceLink)}</div></article>:null;})}</div>
  <div className="court-actions"><button onClick={()=>onCase(study.id)}><Users size={16}/> Governo, participantes e verificações <ArrowRight size={14}/></button><button onClick={()=>onTrail(study.trail)}><BookOpen size={16}/> Percorrer a história do STF <ArrowRight size={14}/></button></div>
  <details className="court-reading"><summary>Como investigar alianças, pressões e possíveis abusos</summary><p>Campos Sales, Rui Barbosa, Benjamin Constant, Quintino Bocaiúva e Eduardo Wandenkolk participaram do governo, em funções e períodos diferentes. O painel identifica esses vínculos sem atribuir a todos a autoria de cada ato ou partidos que só surgiram depois.</p><p>Há intervenções documentadas: o afastamento de seis ministros por Vargas em 1931, a ampliação de cadeiras pelo AI-2 em 1965 e as aposentadorias forçadas de 1969. Abra a trilha para examinar cada contexto.</p><p>Para avaliar atos atuais, confira competência, defesa, fundamentação, recursos e resposta dos órgãos de controle. A existência de limites legais não comprova seu cumprimento. Nomeação presidencial ou decisão favorável isolada também não demonstram comando partidário.</p><p>As críticas documentadas à imparcialidade, inclusive o precedente italiano de 2026 já disponível no Atlas, devem ser examinadas no processo correspondente. Generalizar para todos os ministros ou todo o Judiciário exige evidência própria.</p><div className="court-source-links">{['stf:cf-atual','stf:cpc','networks:cassazione-resumo'].map(sourceLink)}</div></details>
 </section>;
}
