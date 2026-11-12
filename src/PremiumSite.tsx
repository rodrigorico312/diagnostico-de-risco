import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { usePageSeo } from "./usePageSeo";
import { trackLeadEvent } from "./analytics";
import { calculateMei, formatMoney, MEI_REVIEW_DATE, MEI_SOURCES, MEI_YEARS, parseMoney } from "./mei-calculator";
import { meiFaqs, premiumMetadata, premiumServices, serviceDetails } from "./premium-content";
import "./premium-site.css";

export const diagnosticUrl = (source = "Site") => `/solicitar-atendimento?${new URLSearchParams({ diagnostico: "inicial", origem: source })}`;
const whatsappUrl = (subject: string) => `https://wa.me/5593992101980?text=${encodeURIComponent(`Olá! Vim pelo site da Nacional e gostaria de orientação sobre ${subject}. Posso informar minha atividade, cidade e principal dúvida para a triagem inicial.`)}`;

export function Icon({ name = "arrow", className = "" }: { name?: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    diagonal: <><path d="M6 18 18 6M6 6h12v12" /></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1m-4 5v-3"/></>,
    growth: <><path d="M3 17 9 11l4 4 8-10M15 5h6v6M4 21h16"/></>,
    arrows: <><path d="M3 7h17l-4-4m4 4-4 4M21 17H4l4 4m-4-4 4-4"/></>,
    chart: <><path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4"/></>,
    shield: <><path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z"/><path d="m8 12 3 3 5-6"/></>,
    book: <><path d="M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2v15"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    whatsapp: <><path d="M20 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.8-5A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 7c-2 4 2 8 6 8l2-2-3-1-1 1c-2-1-3-2-3-3l1-1Z"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></>,
    pin: <><path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/></>,
    calculator: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1"/></>,
  };
  return <svg className={`nc-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}

export function PremiumHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const main = document.querySelector("main"); if (main && !main.id) main.id = "conteudo";
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); if (open) menuButton.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return <>
    <a className="nc-skip" href="#conteudo">Pular para o conteúdo</a>
    <div className="nc-topline"><div className="nc-container"><span>De Santarém para todo o Brasil.</span><a href="/area-do-cliente"><Icon name="lock"/> Área do cliente</a></div></div>
    <header className="nc-header"><div className="nc-container nc-header-inner">
      <a className="nc-logo" href="/" aria-label="Nacional Contabilidade — página inicial"><img src="/nacional-contabilidade-logo-topbar.png" width="250" height="64" alt="Nacional Contabilidade" /></a>
      <button className="nc-menu-button" type="button" aria-expanded={open} aria-controls="nc-navigation" ref={menuButton} onClick={() => setOpen(!open)}>{open ? "Fechar" : "Menu"}<span aria-hidden="true">{open ? "×" : "☰"}</span></button>
      <nav id="nc-navigation" className={open ? "nc-nav is-open" : "nc-nav"} aria-label="Navegação principal" onClick={e => { if ((e.target as Element).closest("a")) setOpen(false); }}>
        <a href="/#solucoes">Soluções</a><a href="/mei-em-crescimento">MEI em crescimento</a><a href="/conteudos-e-ferramentas">Conteúdos e ferramentas</a><a href="/#sobre">A Nacional</a>
        <a className="nc-button nc-button-small" href={diagnosticUrl("Navegação")}>Diagnóstico gratuito <Icon/></a>
      </nav>
    </div></header>
  </>;
}

export function PremiumFooter() {
  return <footer className="nc-footer"><div className="nc-container">
    <div className="nc-footer-grid"><div className="nc-footer-brand"><a className="nc-logo" href="/"><img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" width="250" height="64" loading="lazy"/></a><p>Clareza para decidir.<br/>Contabilidade para crescer.</p><span><Icon name="pin"/> Santarém · Pará · Brasil</span></div>
      <nav aria-label="Serviços"><h2>Soluções para sua empresa</h2>{premiumServices.slice(0,5).map(s => <a key={s.href} href={s.href}>{s.title}</a>)}<a href="/endereco-fiscal-santarem">Endereço fiscal em Santarém</a></nav>
      <nav aria-label="Conteúdo e institucional"><h2>Explore a Nacional</h2><a href="/calculadora-mei">Calculadora do MEI</a><a href="/guia-mei">Guia gratuito do MEI</a><a href="/blog">Artigos e orientações</a><a href="/ferramentas">Consultas e serviços oficiais</a><a href="/area-do-cliente">Área do cliente</a><a href="/area-da-equipe">Área da equipe</a></nav>
      <div><h2>Vamos conversar?</h2><p>Atendimento online para<br/>empresas de todo o Brasil.</p><a className="nc-text-link" href={whatsappUrl("minha empresa")}>Falar pelo WhatsApp <Icon name="diagonal"/></a><a className="nc-footer-email" href="mailto:rodrigorico312@gmail.com">rodrigorico312@gmail.com</a></div>
    </div>
    <div className="nc-legal"><p>© {new Date().getFullYear()} Nacional Contabilidade</p><p>O Gestor do Lucro Consultoria Ltda. · CNPJ 62.560.654/0001-27 · CRC/PA 024335</p><a href="/politica-de-privacidade">Privacidade</a><button type="button" onClick={() => window.dispatchEvent(new Event("nc:privacy-settings"))}>Preferências de cookies</button></div>
  </div></footer>;
}

function Actions({ source = "Página inicial", calculator = false }: { source?: string; calculator?: boolean }) {
  return <div className="nc-actions"><a className="nc-button" href={diagnosticUrl(source)}>Solicitar diagnóstico gratuito <Icon/></a><a className="nc-text-link" href={calculator ? "/calculadora-mei" : whatsappUrl("o crescimento da minha empresa")}>{calculator ? "Calcular meu faturamento" : "Conversar no WhatsApp"}<Icon name={calculator ? "calculator" : "whatsapp"}/></a></div>;
}

export function Faq({ items = meiFaqs }: { items?: string[][] }) {
  return <div className="nc-faq-list">{items.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>;
}

function GrowthVisual() {
  return <div className="nc-growth-art" aria-label="Ilustração do caminho de crescimento: MEI, estruturação e empresa acompanhada">
    <div className="nc-art-grid" aria-hidden="true"/><div className="nc-art-orbit" aria-hidden="true"/>
    <div className="nc-art-top"><span className="nc-art-symbol">N<span>↗</span></span><span>UM NOVO MOMENTO<br/>PARA SUA EMPRESA</span></div>
    <div className="nc-art-title">Crescer é uma conquista.<br/><em>Ter direção faz a diferença.</em></div>
    <svg viewBox="0 0 520 210" className="nc-growth-line" aria-hidden="true"><defs><linearGradient id="line-gold"><stop stopColor="#8c7748"/><stop offset="1" stopColor="#ead9aa"/></linearGradient></defs><path d="M22 186H500M22 126H500M22 66H500" stroke="white" strokeOpacity=".08"/><path d="M30 179C104 179 100 146 162 144S215 124 254 123 321 92 351 92 420 32 482 25" fill="none" stroke="url(#line-gold)" strokeWidth="3"/><circle cx="30" cy="179" r="5" fill="#C2A65C"/><circle cx="254" cy="123" r="5" fill="#C2A65C"/><circle cx="482" cy="25" r="7" fill="#ead9aa"/></svg>
    <div className="nc-art-stages"><span>Seu começo<strong>MEI</strong></span><span>Seu próximo passo<strong>Estruturação</strong></span><span>Seu novo momento<strong>Acompanhamento</strong></span></div>
    <div className="nc-art-note"><Icon name="shield"/><span>Decisões com contexto.<br/><strong>Um passo de cada vez.</strong></span></div>
  </div>;
}

function Process() {
  return <section className="nc-section nc-process" id="como-funciona"><div className="nc-container"><div className="nc-section-heading"><div><p className="nc-eyebrow">DO PRIMEIRO CONTATO AO PRÓXIMO PASSO</p><h2>Uma conversa clara.<br/>Um caminho bem definido.</h2></div><p>Você entende a situação antes de decidir o que contratar.</p></div><ol className="nc-steps">{[["01", "Você apresenta o cenário", "Conte sobre sua atividade, faturamento e principal dúvida."], ["02", "Avaliamos o ponto de partida", "A avaliação inicial gratuita identifica pontos de atenção e o próximo passo."], ["03", "Combinamos o caminho", "Se houver necessidade, você recebe uma proposta com escopo, prazo e valor."]].map(([n,t,p]) => <li key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></li>)}</ol><p className="nc-process-note">A avaliação inicial se encerra com a orientação preliminar. Análises detalhadas e execução têm escopo e contratação próprios.</p></div></section>;
}

function FinalCta() {
  return <section className="nc-final"><div className="nc-container nc-final-inner"><div><p className="nc-eyebrow">O PRÓXIMO PASSO PODE SER MAIS CLARO</p><h2>Vamos entender o momento<br/>da sua empresa?</h2><p>Comece com uma avaliação inicial gratuita.</p></div><div><a className="nc-button nc-button-gold" href={diagnosticUrl("Chamada final")}>Solicitar meu diagnóstico <Icon/></a><span>Sem compromisso de contratação.</span></div></div></section>;
}

function Home() {
  return <>
    <section className="nc-hero"><div className="nc-container nc-hero-grid"><div className="nc-hero-copy"><p className="nc-eyebrow"><span/> CONTABILIDADE PARA EMPRESAS EM CRESCIMENTO</p><h1>Sua empresa cresceu.<br/>É hora de dar<br/><em>o próximo passo.</em></h1><p>Da evolução do MEI à contabilidade da sua empresa: orientação próxima para organizar os números e decidir com mais clareza.</p><Actions/><div className="nc-hero-trust"><span><Icon name="check"/> Avaliação inicial gratuita</span><span><Icon name="check"/> Atendimento em todo o Brasil</span></div></div><GrowthVisual/></div><div className="nc-container nc-hero-bottom"><span>CONTABILIDADE QUE ACOMPANHA O SEU MOMENTO</span><a href="#solucoes">Conheça nossas soluções <span aria-hidden="true">↓</span></a></div></section>
    <section className="nc-audience"><div className="nc-container"><p>O negócio mudou.<br/><strong>As dúvidas também.</strong></p><div><span>“Meu MEI passou do limite?”</span><span>“Não sei quanto devo pagar de imposto.”</span><span>“Preciso de um contador para crescer?”</span></div><a href="/mei-em-crescimento" aria-label="Ver orientações para MEI em crescimento"><Icon name="diagonal"/></a></div></section>
    <section className="nc-section" id="solucoes"><div className="nc-container"><div className="nc-section-heading"><div><p className="nc-eyebrow">SOLUÇÕES DA NACIONAL</p><h2>Para cada momento,<br/>um acompanhamento adequado.</h2></div><p>Começar, crescer, organizar ou regularizar.<br/>A gente entende o cenário com você.</p></div><div className="nc-services">{premiumServices.map(s => <a className="nc-service" href={s.href} key={s.number}><div><Icon name={s.icon}/><span>{s.number}</span></div><h3>{s.title}</h3><p>{s.text}</p><span className="nc-service-link">Conhecer solução <Icon/></span></a>)}</div></div></section>
    <section className="nc-mei-feature"><div className="nc-container nc-feature-grid"><div><p className="nc-eyebrow">PARA QUEM COMEÇOU COMO MEI</p><h2>Seu crescimento merece<br/>mais do que uma dúvida<br/><em>sobre o limite.</em></h2><p>Entenda quando avaliar a transição, o que muda na rotina e como organizar a empresa para a próxima fase.</p><a className="nc-button" href="/mei-em-crescimento">Conhecer o próximo passo <Icon/></a></div><div className="nc-calculator-teaser"><div className="nc-teaser-label"><Icon name="calculator"/><span>FERRAMENTA GRATUITA</span></div><h3>Seu faturamento<br/>ainda cabe no MEI?</h3><p>Compare o que já faturou e o que prevê receber com o limite do seu ano.</p><div className="nc-teaser-scale" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="nc-teaser-scale-label"><span>Receita acumulada</span><span>Limite do ano</span></div><a href="/calculadora-mei" className="nc-text-link">Usar a calculadora <Icon/></a><small>Sem cadastro. Resultado preliminar.</small></div></div></section>
    <Process/>
    <section className="nc-section nc-about" id="sobre"><div className="nc-container nc-about-grid"><div className="nc-portrait"><img src="/rodrigo-coelho.png" width="843" height="1264" loading="lazy" alt="Rodrigo Coelho, contador responsável pela Nacional"/><div><strong>Rodrigo Coelho</strong><span>Contador · CRC/PA 024335</span></div></div><div><p className="nc-eyebrow">PROXIMIDADE, MESMO À DISTÂNCIA</p><h2>Por trás dos números,<br/>uma conversa de verdade.</h2><p>A Nacional Contabilidade tem presença em Santarém, no Pará, e atende empresas de todo o Brasil de forma online.</p><p>Nosso trabalho começa entendendo a sua operação. A partir daí, conectamos as obrigações do negócio às informações de que você precisa para decidir.</p><ul className="nc-check-list"><li><Icon name="check"/> Orientação em linguagem acessível</li><li><Icon name="check"/> Escopo e responsabilidades definidos</li><li><Icon name="check"/> Acompanhamento compatível com sua empresa</li></ul><a className="nc-text-link" href={whatsappUrl("o acompanhamento da minha empresa")}>Conhecer nosso atendimento <Icon/></a></div></div></section>
    <Resources compact/>
    <FinalCta/>
  </>;
}

function MeiLanding() {
  useEffect(() => { trackLeadEvent("mei_page_view"); }, []);
  return <><section className="nc-hero nc-mei-hero"><div className="nc-container nc-hero-grid"><div className="nc-hero-copy"><p className="nc-eyebrow">MEI EM CRESCIMENTO</p><h1>Sua empresa cresceu.<br/>Sua contabilidade<br/><em>está preparada?</em></h1><p>O faturamento aumentou e as dúvidas vieram junto? Entenda seu momento e solicite uma avaliação inicial gratuita da situação do seu negócio.</p><Actions source="MEI em crescimento" calculator/><div className="nc-hero-trust"><span><Icon name="check"/> Sem compromisso</span><span><Icon name="check"/> Atendimento nacional</span></div></div><div className="nc-mei-panel"><p className="nc-eyebrow">RECONHECE ESSE MOMENTO?</p><h2>Mais vendas.<br/>Novas decisões.</h2><ul>{["O faturamento se aproxima do limite", "Os impostos já não parecem tão simples", "O financeiro precisa de organização", "Você quer crescer com acompanhamento"].map(t=><li key={t}><Icon name="check"/>{t}</li>)}</ul><a className="nc-text-link" href="#duvidas-mei">Entenda o que pode mudar <Icon/></a></div></div></section>
    <section className="nc-section"><div className="nc-container"><div className="nc-section-heading"><div><p className="nc-eyebrow">CRESCER COM CONTEXTO</p><h2>Você não precisa decidir<br/>tudo sozinho.</h2></div><p>O limite de faturamento é uma parte da conversa. A estrutura, as obrigações e a organização também contam.</p></div><div className="nc-editorial-columns">{[["01", "Entenda o faturamento", "Some receitas de todas as atividades e acompanhe a projeção até dezembro. Use a calculadora para uma primeira comparação."], ["02", "Avalie a transição", "Desenquadramento, porte e regime tributário são assuntos diferentes. Os efeitos dependem da sua atividade, das datas e das receitas."], ["03", "Prepare a nova rotina", "Organize documentos, contas e retiradas. Se precisar de acompanhamento mensal, receba uma proposta adequada à operação."]].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div></div></section>
    <section className="nc-tool-strip"><div className="nc-container"><Icon name="calculator"/><div><p className="nc-eyebrow">UM BOM PONTO DE PARTIDA</p><h2>Faça a conta antes da conversa.</h2><p>Receita acumulada, previsão e limite proporcional, em uma simulação gratuita.</p></div><a href="/calculadora-mei" className="nc-button">Calcular meu faturamento <Icon/></a></div></section>
    <Process/><section className="nc-section" id="duvidas-mei"><div className="nc-container nc-faq-grid"><div><p className="nc-eyebrow">DÚVIDAS QUE MERECEM CLAREZA</p><h2>Do MEI para<br/>o próximo momento.</h2><p>Informações para começar.<br/>Análise profissional para decidir.</p></div><Faq/></div></section><FinalCta/>
  </>;
}

function Calculator() {
  const [year, setYear] = useState(2026), [openingYear,setOpeningYear] = useState(""), [month,setMonth] = useState(""), [activity,setActivity] = useState("");
  const [revenue,setRevenue] = useState(""), [expected,setExpected] = useState(""), [error,setError] = useState("");
  const [result,setResult] = useState<ReturnType<typeof calculateMei> & { year: number; revenue: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null), started = useRef(false);
  const clear = () => { setResult(null); setError(""); };
  const submit = (e: FormEvent) => { e.preventDefault(); try { const actual = parseMoney(revenue); const data = calculateMei({ year, openingYear: Number(openingYear), openingMonth: Number(month), activity, revenue: actual, expected: parseMoney(expected) }); setResult({ ...data, year, revenue: actual }); setError(""); trackLeadEvent("calculator_complete", { calculator: "mei", status: data.actual, projection_status: data.projected }); requestAnimationFrame(() => resultRef.current?.focus()); } catch (e) { setError((e as Error).message); setResult(null); } };
  const labels = { within: "Receita informada dentro do limite", excess20: "Receita acima do limite, em até 20%", excessAbove20: "Receita acima do limite em mais de 20%" };
  return <><section className="nc-tool-heading"><div className="nc-container"><a className="nc-breadcrumb" href="/mei-em-crescimento">MEI em crescimento <span aria-hidden="true">/</span> Ferramenta gratuita</a><p className="nc-eyebrow">CALCULADORA DE FATURAMENTO DO MEI</p><h1>Seu próximo passo<br/>começa com <em>clareza.</em></h1><p>Compare suas receitas com o limite aplicável. Sem cadastro e sem enviar os valores da simulação.</p></div></section>
    <section className="nc-calculator-section"><div className="nc-container nc-calculator-layout"><form className="nc-calculator-form" onSubmit={submit} onChange={clear} onFocusCapture={() => { if (!started.current) { started.current = true; trackLeadEvent("calculator_start", { calculator: "mei" }); } }}><div className="nc-form-heading"><span className="nc-icon-box"><Icon name="calculator"/></span><div><h2>Conte sobre seu MEI</h2><p>Preencha os valores em reais.</p></div></div><div className="nc-fields">
      <label>Ano que deseja analisar<select value={year} onChange={e=>setYear(Number(e.target.value))}>{MEI_YEARS.map(y=><option key={y}>{y}</option>)}</select></label>
      <label>Ano de abertura<select required value={openingYear} onChange={e=>setOpeningYear(e.target.value)}><option value="">Selecione</option>{Array.from({length:18},(_,i)=>2026-i).map(y=><option key={y}>{y}</option>)}</select></label>
      <label>Mês de abertura<select required value={month} onChange={e=>setMonth(e.target.value)}><option value="">Selecione</option>{["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></label>
      <label>Atividade exercida<select required value={activity} onChange={e=>setActivity(e.target.value)}><option value="">Selecione</option><option value="comercio">Comércio</option><option value="servicos">Serviços</option><option value="industria">Indústria</option><option value="mista">Atividades combinadas</option><option value="caminhoneiro">MEI Caminhoneiro — exclusivo</option><option value="revisar">Outra / preciso conferir</option></select></label>
      <label className="nc-full-field">Faturamento acumulado no ano (R$)<input required inputMode="decimal" placeholder="Ex.: 60.000,00" value={revenue} maxLength={20} onChange={e=>setRevenue(e.target.value)} aria-describedby="nc-revenue-hint"/><small id="nc-revenue-hint">Total das receitas brutas já realizadas no ano analisado, de todas as atividades.</small></label>
      <label className="nc-full-field">Receita adicional prevista até dezembro (R$)<input required inputMode="decimal" placeholder="Ex.: 15.000,00 — ou 0 se não houver" value={expected} maxLength={20} onChange={e=>setExpected(e.target.value)} aria-describedby="nc-expected-hint"/><small id="nc-expected-hint">Somente o que ainda espera faturar. Para ano encerrado, informe zero.</small></label>
    </div>{activity === "caminhoneiro" && <p className="nc-notice">Limite específico apenas para transportador autônomo de cargas com ocupações exclusivas da Tabela B do Anexo XI. Mudanças de atividade no ano exigem análise individual.</p>}{error && <p className="nc-form-error" role="alert">{error}</p>}<button className="nc-button" type="submit">Ver minha simulação <Icon/></button><p className="nc-form-privacy"><Icon name="lock"/> Os valores são calculados apenas neste navegador.</p></form>
      <div className="nc-calculator-result" ref={resultRef} tabIndex={-1} aria-live="polite">{!result ? <div className="nc-result-empty"><Icon name="chart"/><p className="nc-eyebrow">UMA VISÃO PRELIMINAR</p><h2>Entenda onde<br/>sua empresa está.</h2><p>O resultado apresenta o limite do ano, a situação da receita informada e a projeção para dezembro.</p><ul><li><Icon name="check"/> Proporcionalidade na abertura</li><li><Icon name="check"/> Receita realizada e previsão separadas</li><li><Icon name="check"/> Orientação sobre o excesso</li></ul></div> : <><p className="nc-eyebrow">RESULTADO PRELIMINAR · {result.year}</p><h2>{labels[result.actual]}</h2><p className="nc-result-limit">{formatMoney(result.limit)}<span>Limite {result.firstYear && result.months < 12 ? `proporcional · ${result.months} meses` : "anual"}{result.truck ? " · MEI Caminhoneiro" : ""}</span></p><dl className="nc-result-values"><div><dt>Receita já realizada</dt><dd>{formatMoney(result.revenue)}</dd></div><div><dt>Realizada + prevista</dt><dd>{formatMoney(result.projectedRevenue)}</dd></div><div><dt>{result.excess ? "Excesso já realizado" : "Diferença até o limite"}</dt><dd>{formatMoney(result.excess || result.remaining)}</dd></div></dl><div className="nc-result-explanation"><h3>O que observar agora</h3><p>{result.actual === "within" ? "A receita informada não supera o limite. Isso não confirma o enquadramento: atividades, vínculos, empregados e demais condições também precisam ser conferidos." : result.actual === "excess20" ? "Pela regra geral, o excesso em até 20% exige comunicação e tem efeito no ano seguinte, com apuração sobre a receita excedente. Confira a data e os documentos com um contador." : `Pela regra geral, um excesso superior a 20% pode levar ao desenquadramento retroativo ${result.firstYear ? "à data de abertura" : "a 1º de janeiro do ano do excesso"}, com recálculo de tributos. É necessário conferir receitas e datas.`}</p>{result.actual !== "within" && <p>A comunicação deve observar, em regra, o último dia útil do mês seguinte ao excesso. Não espere a declaração anual para conferir a situação.</p>}<p><strong>Projeção:</strong> {result.projected === "within" ? "o total previsto também está dentro do limite." : "o total previsto supera o limite. Previsão não é excesso já ocorrido e não determina comunicação obrigatória por si só."}</p>{result.activityReview && <p>A ocupação informada precisa de conferência específica. A simulação considera apenas o limite geral de receita.</p>}</div><a className="nc-button" href={diagnosticUrl("Calculadora MEI")}>Pedir avaliação inicial gratuita <Icon/></a><a className="nc-text-link" href={whatsappUrl("o resultado da calculadora do MEI")}>Conversar sobre meu cenário <Icon name="whatsapp"/></a></>}</div>
    </div></section><section className="nc-calculator-notes"><div className="nc-container"><h2>Como interpretar esta simulação</h2><div className="nc-notes-grid"><p>O cálculo compara receita bruta com o teto anual ou proporcional, incluindo o mês da abertura. Os 20% não são um novo limite permitido: servem para distinguir possíveis efeitos do excesso.</p><p>A ferramenta não calcula o imposto devido, não consulta o CNPJ nem avalia todos os impedimentos. O resultado depende da exatidão das informações e não substitui análise profissional.</p></div><p>Regras conferidas em {MEI_REVIEW_DATE}. Esta versão analisa somente 2024 a 2026. A LC 238/2026 prevê alterações futuras, com condições e vigência próprias; não foram aplicadas aos anos anteriores.</p><details><summary>Consultar fontes oficiais e método</summary><ul>{MEI_SOURCES.map(s=><li key={s.url}><a target="_blank" rel="noreferrer" href={s.url}>{s.label} ↗</a></li>)}</ul><p>Limite geral: R$ 81.000 no ano completo ou R$ 6.750 por mês no ano de abertura. MEI Caminhoneiro exclusivo: R$ 251.600 no ano completo ou R$ 20.966,67 por mês na abertura, observada a situação específica. Valores tratados em centavos.</p></details></div></section><FinalCta/></>;
}

function Resources({ compact = false }: { compact?: boolean }) {
  return <section className={`nc-section nc-resources${compact ? "" : " nc-resources-page"}`}><div className="nc-container">{!compact && <p className="nc-breadcrumb"><a href="/">Início</a> / Conteúdos e ferramentas</p>}<div className="nc-section-heading"><div><p className="nc-eyebrow">INFORMAÇÃO PARA DECIDIR MELHOR</p>{compact ? <h2>Um pouco mais de clareza.<br/>Um bom ponto de partida.</h2> : <h1>Conteúdos e ferramentas<br/>para sua empresa.</h1>}</div><a href="/blog" className="nc-text-link">Explorar todos os artigos <Icon/></a></div><div className="nc-resource-grid">
    <a className="nc-resource nc-resource-featured" href="/calculadora-mei"><span className="nc-resource-category">FERRAMENTA GRATUITA</span><Icon name="calculator"/><h3>Faturamento e limite do MEI</h3><p>Uma simulação para entender as receitas da sua empresa.</p><span>Usar calculadora <Icon/></span></a>
    <a className="nc-resource" href="/mei-em-crescimento"><span className="nc-resource-category">MEI EM CRESCIMENTO</span><span className="nc-resource-number" aria-hidden="true">MEI <span>↗</span> ME</span><h3>Sair do MEI: por onde começar?</h3><p>Limites, estrutura e rotina na transição para microempresa.</p><span>Entender a transição <Icon/></span></a>
    <a className="nc-resource" href="/blog/fator-r-simples-nacional"><span className="nc-resource-category">GESTÃO TRIBUTÁRIA</span><div className="nc-resource-bars" aria-hidden="true"><i/><i/><i/><i/></div><h3>O que muda os impostos da empresa?</h3><p>Entenda o fator R e por que o cenário precisa ser analisado.</p><span>Ler orientação <Icon/></span></a>
  </div>{!compact && <div className="nc-resource-extras"><a href="/guia-mei"><Icon name="book"/><span><strong>Guia gratuito do MEI</strong>Orientações e consultas para a sua rotina.</span><Icon/></a><a href="/ferramentas"><Icon name="shield"/><span><strong>Consultas e serviços oficiais</strong>CNPJ, certidões, notas e portais públicos.</span><Icon/></a></div>}</div></section>;
}

function Service({ path }: { path: string }) {
  const data = serviceDetails[path];
  return <><section className="nc-service-hero"><div className="nc-container"><a className="nc-breadcrumb" href="/#solucoes">Início / Soluções</a><p className="nc-eyebrow">{data.eyebrow}</p><h1>{data.lead}</h1><p>{data.description}</p><Actions source={data.eyebrow}/></div></section><section className="nc-section"><div className="nc-container"><div className="nc-section-heading"><div><p className="nc-eyebrow">ACOMPANHAMENTO ADEQUADO À OPERAÇÃO</p><h2>{data.title}</h2></div></div><div className="nc-service-detail-grid">{data.items.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>{path === "/desenquadramento-mei" && <p className="nc-notice">Quanto custa sair do MEI? O valor depende das alterações, registros, pendências e do acompanhamento necessário. Taxas públicas e honorários são discriminados na proposta. Não há economia tributária garantida.</p>}<nav className="nc-related" aria-label="Aprofundar o assunto">{data.related.map(([title,href])=><a key={href} href={href}>{title} <Icon/></a>)}</nav></div></section><Process/><FinalCta/></>;
}

export function PremiumPage({ path = "/" }: { path?: string }) {
  const meta = premiumMetadata[path] || premiumMetadata["/"];
  usePageSeo({ ...meta, path });
  return <div className="nc-site"><PremiumHeader/><main id="conteudo">{path === "/" ? <Home/> : path === "/mei-em-crescimento" ? <MeiLanding/> : path === "/calculadora-mei" ? <Calculator/> : path === "/conteudos-e-ferramentas" ? <><Resources/><FinalCta/></> : <Service path={path}/>}</main><PremiumFooter/></div>;
}
