import { useEffect, useState, type ReactNode } from "react";
import rawContent from "./mei-guide-content.json";
import { decodeDraft, emptyDraft, MEI_DRAFT_KEY, noteLabels, recommendedSections, worksheetText, type Draft, type GuideProfile, type NoteKey } from "./mei-guide-state";
import { usePageSeo } from "./usePageSeo";
import "./mei-guide.css";

type Segment = { text: string; href?: string; strong?: boolean; citation?: boolean };
type Block = { id: string; kind: string; title: string; content: Segment[] };
type Section = { id: string; number: string; title: string; intro: Segment[]; blocks: Block[] };
type Question = { id: string; question: string; correct: string; explanation: string; href: string; label: string };
type Content = {
  checkedDate: string; sections: Section[]; quiz: Question[];
  glossary: { term: string; content: Segment[]; href?: string }[];
  sources: { id: string; title: string; href: string }[];
};
const content = rawContent as Content;
const checkItems = content.sections.flatMap(s => s.blocks.filter(b => b.kind === "check"));
const profileChoices: { id: GuideProfile; title: string; text: string; icon: string }[] = [
  { id: "active", title: "Continuo como MEI", text: "Dívida antiga e guias que continuam vencendo.", icon: "01" },
  { id: "agreement", title: "Tenho parcelamento", text: "Componentes do saldo e próximos passos do acordo.", icon: "02" },
  { id: "closed", title: "Baixei ou saí do MEI", text: "Histórico, datas e efeitos da alteração.", icon: "03" },
  { id: "unknown", title: "Ainda não sei minha situação", text: "Comece pelas consultas e entenda o resultado.", icon: "?" },
];

function Link({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("https://");
  return <a href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}{external && <span className="mg-external" aria-label="abre em nova aba"> ↗</span>}</a>;
}
function Inline({ value }: { value: Segment[] }) {
  return <>{value.map((part, index) => {
    const value = part.strong ? <strong>{part.text}</strong> : part.text;
    return part.href ? <Link key={index} href={part.href} className={part.citation ? "mg-citation" : undefined}>{value}</Link> : <span key={index}>{value}</span>;
  })}</>;
}
function readDraft() {
  try { return decodeDraft(window.localStorage.getItem(MEI_DRAFT_KEY)); } catch { return emptyDraft(); }
}

export default function MeiGuidePage() {
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);
  usePageSeo({ title: "Guia gratuito do MEI: dívidas e próximos passos | Nacional", description: "Entenda sua situação, acesse os portais oficiais e organize as informações do MEI com exemplos, checklist e ficha para preencher.", path: "/guia-mei" });

  useEffect(() => {
    if (!draft.remember) return;
    try { window.localStorage.setItem(MEI_DRAFT_KEY, JSON.stringify(draft)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [draft]);

  const suggested = recommendedSections(draft.profiles);
  const completed = checkItems.filter(b => draft.checked[b.id]);
  function toggleProfile(id: GuideProfile) {
    setDraft(previous => ({ ...previous, profiles: previous.profiles.includes(id) ? previous.profiles.filter(p => p !== id) : [...previous.profiles, id] }));
  }
  function toggleCheck(id: string) {
    setDraft(previous => ({ ...previous, checked: { ...previous.checked, [id]: !previous.checked[id] } }));
  }
  function updateNote(key: NoteKey, value: string) {
    setDraft(previous => ({ ...previous, notes: { ...previous.notes, [key]: value } }));
  }
  function remember(value: boolean) {
    setDraft(previous => ({ ...previous, remember: value }));
    if (!value) { try { window.localStorage.removeItem(MEI_DRAFT_KEY); } catch { /* Page remains usable without storage. */ } }
  }
  function downloadNotes() {
    const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Fortaleza" }).format(new Date());
    const blob = new Blob(["\uFEFF", worksheetText(draft, completed.map(b => b.title), date)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "minha-ficha-mei.txt"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Sua ficha foi preparada para baixar. Guarde o arquivo no seu aparelho.");
  }
  function clearNotes() {
    setDraft(previous => ({ ...previous, notes: emptyDraft().notes }));
    setNotice("Os quatro campos da ficha foram limpos.");
  }

  return <div className="mei-guide">
    <a className="mg-skip" href="#conteudo-guia">Ir para o conteúdo do guia</a>
    <header className="mg-header">
      <div className="mg-wrap mg-header-inner">
        <a href="/" aria-label="Página inicial da Nacional"><img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" width="170" height="44" /></a>
        <nav aria-label="Atalhos do guia"><a href="/guia-mei">Consulta guiada</a><a href="#minha-ficha">Minha ficha</a><a className="mg-download-link" href="/guias/mei/guia-mei-v002.pdf" download>Baixar guia em PDF <span aria-hidden="true">↓</span></a></nav>
      </div>
    </header>

    <main id="conteudo-guia">
      <section className="mg-hero mg-wrap" aria-labelledby="guia-title">
        <div>
          <div className="mg-eyebrow"><span /> ORIENTAÇÃO GRATUITA · MEI</div>
          <h1 id="guia-title">Entenda a dívida.<br /><em>Encontre seu próximo passo.</em></h1>
          <p className="mg-hero-text">Um guia para consultar, entender e organizar a situação do seu MEI. Com explicações por caso, links oficiais e espaço para suas anotações.</p>
          <div className="mg-actions"><a className="mg-button mg-primary" href="#comecar">Escolher meu caminho <span aria-hidden="true">↓</span></a><a className="mg-text-button" href="#consultas">Ir direto às consultas ↗</a></div>
          <p className="mg-date">Conteúdo conferido em <time dateTime="2026-10-26">{content.checkedDate}</time> <span>•</span> Acesso livre, sem cadastro</p>
        </div>
        <div className="mg-hero-paper" aria-label="Como usar o guia">
          <span className="mg-paper-tag">DO DOCUMENTO À PROVIDÊNCIA</span>
          <h2>Você conduz<br />a conferência.</h2>
          <ol><li><span>1</span><div><strong>Consulte</strong><p>Acesse a informação na fonte.</p></div></li><li><span>2</span><div><strong>Entenda</strong><p>Veja o que o resultado significa.</p></div></li><li><span>3</span><div><strong>Organize</strong><p>Anote o que falta e o próximo passo.</p></div></li></ol>
          <div className="mg-paper-note">Os links abrem os portais oficiais. Suas anotações ficam com você.</div>
        </div>
      </section>

      <section className="mg-start" id="comecar" aria-labelledby="caminho-title">
        <div className="mg-wrap">
          <div className="mg-section-heading"><div><span className="mg-eyebrow">SEU PONTO DE PARTIDA</span><h2 id="caminho-title">Qual situação combina com você?</h2></div><p>Pode marcar mais de uma. As opções organizam a leitura e não decidem o direito ao benefício.</p></div>
          <div className="mg-profile-grid">{profileChoices.map(choice => <button type="button" className={`mg-profile ${draft.profiles.includes(choice.id) ? "is-selected" : ""}`} key={choice.id} aria-pressed={draft.profiles.includes(choice.id)} onClick={() => toggleProfile(choice.id)}><span className="mg-profile-icon">{choice.icon}</span><strong>{choice.title}</strong><span>{choice.text}</span><span className="mg-profile-state">{draft.profiles.includes(choice.id) ? "Selecionado ✓" : "Escolher caminho +"}</span></button>)}</div>
          <div className="mg-recommendation" aria-live="polite"><strong>{draft.profiles.length ? "Sua sequência de leitura:" : "Se ainda não sabe por onde começar:"}</strong><div>{suggested.map(id => { const section = content.sections.find(s => s.id === id)!; return <a href={`#${id}`} key={id}>{section.title} <span aria-hidden="true">→</span></a>; })}</div></div>
        </div>
      </section>

      <div className="mg-wrap mg-layout">
        <aside className="mg-sidebar" aria-label="Índice de conteúdo">
          <div className="mg-sticky"><span className="mg-eyebrow">NESTE GUIA</span><nav>{content.sections.map(s => <a href={`#${s.id}`} key={s.id}><span>{s.number}</span>{s.title}</a>)}<a href="#quiz"><span>06</span>Confira seu entendimento</a><a href="#minha-ficha"><span>07</span>Preencha sua ficha</a></nav><div className="mg-progress"><strong>{completed.length} de {checkItems.length} itens conferidos</strong><progress value={completed.length} max={checkItems.length} aria-label="Itens de conferência marcados" /><p>Marque enquanto lê. É um registro da sua conferência.</p></div></div>
        </aside>
        <div className="mg-reading">
          <details className="mg-glossary"><summary>Antes de começar: o que significam DAS, Simei e PGFN?</summary><dl>{content.glossary.map(item => <div key={item.term}><dt>{item.href ? <Link href={item.href}>{item.term}</Link> : item.term}</dt><dd><Inline value={item.content} /></dd></div>)}</dl></details>
          {content.sections.map(section => <section className="mg-reading-section" id={section.id} aria-labelledby={`${section.id}-title`} key={section.id}>
            <div className="mg-reading-heading"><span>{section.number}</span><h2 id={`${section.id}-title`}>{section.title}</h2></div>
            <p className="mg-section-intro"><Inline value={section.intro} /></p>
            {section.blocks.map(block => {
              if (block.kind === "heading") return <h3 key={block.id}><Inline value={[{ text: block.title }]} /></h3>;
              if (block.kind === "box") return <aside className="mg-explainer" key={block.id}><h3>{block.title}</h3><p><Inline value={block.content} /></p></aside>;
              if (block.kind === "check") return <div className={`mg-check ${draft.checked[block.id] ? "is-checked" : ""}`} key={block.id}><label htmlFor={block.id}><input id={block.id} type="checkbox" checked={Boolean(draft.checked[block.id])} onChange={() => toggleCheck(block.id)} /><strong>{block.title}</strong></label><p><Inline value={block.content} /></p></div>;
              return <p key={block.id}><Inline value={block.content} /></p>;
            })}
          </section>)}

          <section className="mg-reading-section mg-quiz" id="quiz" aria-labelledby="quiz-title">
            <div className="mg-reading-heading"><span>06</span><h2 id="quiz-title">Veja se a lógica ficou clara</h2></div>
            <p>Escolha uma resposta e leia a explicação. Você também pode abrir todas as respostas sem preencher o quiz.</p>
            {content.quiz.map((q, index) => <fieldset key={q.id}><legend><span>{index + 1}.</span> {q.question}</legend><div className="mg-quiz-options">{[["true", "Verdadeiro"], ["false", "Falso"]].map(([value, label]) => <label key={value} className={answers[q.id] === value ? "is-selected" : ""}><input type="radio" name={`quiz-${q.id}`} value={value} checked={answers[q.id] === value} onChange={() => setAnswers(previous => ({ ...previous, [q.id]: value }))} />{label}</label>)}</div>{(showAnswers || answers[q.id]) && <div className="mg-answer" aria-live="polite"><strong>{answers[q.id] ? (answers[q.id] === q.correct ? "Isso mesmo. " : "Vamos revisar. ") : "Resposta: "}{q.correct === "true" ? "Verdadeiro." : "Falso."}</strong><p>{q.explanation}</p><Link href={q.href}>{q.label}</Link></div>}</fieldset>)}
            <button type="button" className="mg-button mg-secondary" onClick={() => setShowAnswers(previous => !previous)}>{showAnswers ? "Recolher gabarito completo" : "Ver todas as respostas comentadas"}</button>
            <p className="mg-small">Este exercício confere aprendizado. Ele não calcula elegibilidade ou substitui os documentos do seu caso.</p>
          </section>

          <section className="mg-reading-section mg-worksheet" id="minha-ficha" aria-labelledby="ficha-title">
            <div className="mg-reading-heading"><span>07</span><h2 id="ficha-title">Meu próximo passo, por escrito</h2></div>
            <p>Anote enquanto consulta. Os campos não são enviados à Nacional e não exigem nome, e-mail ou CNPJ.</p>
            <div className="mg-field-grid">{(Object.keys(noteLabels) as NoteKey[]).map(key => <label className="mg-field" htmlFor={`nota-${key}`} key={key}><span>{noteLabels[key]}</span><textarea id={`nota-${key}`} rows={4} maxLength={4000} value={draft.notes[key]} onChange={event => updateNote(key,event.target.value)} placeholder={key === "pendencia" ? "Ex.: falta o demonstrativo que separa os componentes do acordo." : "Registre o que encontrou…"} /><div className="mg-print-value">{draft.notes[key] || "Não preenchido."}</div></label>)}</div>
            <label className="mg-remember"><input type="checkbox" checked={draft.remember} onChange={event => remember(event.target.checked)} /><span>Guardar meu rascunho neste navegador <small>Use esta opção apenas se o aparelho for seu.</small></span></label>
            <p className="mg-small" aria-live="polite">{storageError ? "Não foi possível guardar neste navegador. Você pode baixar a ficha para preservar as anotações." : draft.remember ? "Rascunho guardado automaticamente neste navegador." : "Sem armazenamento ativado: ao sair ou recarregar, as anotações desta visita podem ser perdidas. Baixe sua ficha para guardar."}</p>
            <div className="mg-actions mg-sheet-actions"><button className="mg-button mg-primary" type="button" onClick={downloadNotes}>Baixar minha ficha (.txt) ↓</button><button className="mg-button mg-secondary" type="button" onClick={() => window.print()}>Imprimir minha ficha</button><button className="mg-text-button" type="button" onClick={clearNotes}>Limpar os quatro campos</button></div>
            <p role="status" className="mg-status">{notice}</p>
            <p className="mg-small">A ficha organiza informações. Itens marcados e respostas do quiz não são uma aprovação do benefício.</p>
          </section>

          <section className="mg-sources" aria-labelledby="fontes-title"><h2 id="fontes-title">Fontes para conferir e continuar</h2><p>Os portais já estão ligados nos textos acima. Aqui você também encontra a base consultada em {content.checkedDate}.</p><ul>{content.sources.map(source => <li key={source.id}><Link href={source.href}>[{source.id}] {source.title}</Link></li>)}</ul></section>
          <aside className="mg-optional"><div><span className="mg-eyebrow">AJUDA É UMA ESCOLHA</span><h2>Prefere ajuda com o seu caso?</h2><p>Use o guia no seu ritmo e os canais oficiais indicados. Se não tiver tempo ou precisar de acompanhamento individual, você também pode solicitar atendimento.</p></div><a href="/solicitar-atendimento?origem=Guia%20MEI" className="mg-text-button">Conhecer o atendimento da Nacional ↗</a></aside>
        </div>
      </div>
    </main>
    <footer className="mg-footer mg-wrap"><span>Nacional Contabilidade · Guia gratuito do MEI</span><a href="/politica-de-privacidade">Política de privacidade</a></footer>
  </div>;
}
