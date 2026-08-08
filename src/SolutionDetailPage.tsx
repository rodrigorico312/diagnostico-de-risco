import { useEffect, useRef, useState } from "react";
import "./preview-home.css";
import "./solution-page.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { usePageSeo } from "./usePageSeo";
import ResponsiveInfoCard from "./ResponsiveInfoCard";

const WHATSAPP_NUMBER = "5593992101980";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type SolutionItem = {
  title: string;
  text: string;
};

type SolutionConfig = {
  category: string;
  title: string;
  lead: string;
  context: string;
  situations: string[];
  analysis: SolutionItem[];
  deliveries: SolutionItem[];
  faqs: SolutionItem[];
  whatsappMessage: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export const solutionPages: Record<string, SolutionConfig> = {
  "abrir-ou-regularizar-empresa": {
    category: "Abertura e regularização",
    title: "Abra ou regularize sua empresa com o caminho definido.",
    lead:
      "A Nacional define atividade, endereço, licenças, tributação e emissão de notas para o CNPJ começar — ou voltar a funcionar — com segurança.",
    context:
      "Esta solução reúne constituição, alterações e regularização. O ponto de partida muda conforme a empresa ainda vai nascer ou já possui cadastro, pendências e histórico.",
    situations: [
      "Você vai abrir o primeiro CNPJ e precisa definir atividade, formato e tributação.",
      "A empresa existe, mas está parada, inapta ou com obrigações pendentes.",
      "O CNPJ precisa alterar endereço, atividades, nome, capital ou quadro societário.",
      "A operação precisa emitir notas, obter inscrições ou organizar licenças.",
    ],
    analysis: [
      { title: "Operação real", text: "Entendemos o que a empresa fará, para quem venderá e como receberá." },
      { title: "CNAEs e estrutura", text: "Definimos atividades, natureza jurídica, endereço e composição adequados." },
      { title: "Tributação", text: "Comparamos o enquadramento possível antes de a operação começar." },
      { title: "Pendências e licenças", text: "Mapeamos cadastros, obrigações, alvarás e etapas necessárias." },
    ],
    deliveries: [
      { title: "Roteiro de abertura ou regularização", text: "Etapas, documentos, responsáveis e dependências organizados." },
      { title: "Cadastros empresariais", text: "CNPJ, registros, inscrições e alterações compatíveis com o caso." },
      { title: "Preparação para emitir notas", text: "Orientação sobre habilitações fiscais e emissão aplicável à atividade." },
      { title: "Início acompanhado", text: "Direcionamento das primeiras obrigações, impostos e rotinas após a conclusão." },
    ],
    faqs: [
      { title: "Quanto tempo leva?", text: "Quando toda a documentação solicitada pela Nacional está correta, a atividade é compatível com o endereço e não existem pendências ou exigências externas, o processo pode ser agilizado e, em casos viáveis, concluído em menos de 24 horas. O prazo final ainda depende do município, das licenças necessárias e do tempo de análise dos órgãos envolvidos." },
      { title: "É possível regularizar um CNPJ com dívidas?", text: "Em muitos casos, sim. Primeiro separamos pendências cadastrais, obrigações omitidas e débitos para definir a ordem correta de tratamento." },
      { title: "Preciso escolher o regime tributário antes?", text: "A análise tributária deve acontecer junto da abertura ou da retomada. A escolha depende da atividade, faturamento, folha, margem e operação real." },
    ],
    whatsappMessage: "Olá, quero analisar a abertura ou regularização da minha empresa.",
  },
  "trocar-de-contador": {
    category: "Transição contábil",
    title: "Troque de contador sem perder o controle da empresa.",
    lead:
      "A Nacional organiza documentos, acessos e responsabilidades para a troca acontecer sem deixar a empresa no escuro.",
    context:
      "Trocar de contador não é apenas mudar quem envia as guias. É receber o histórico, conferir a situação atual e estabelecer uma nova rotina de comunicação e acompanhamento.",
    situations: [
      "Você não recebe retorno ou não entende o que está sendo feito pela contabilidade.",
      "Documentos, demonstrações, guias ou obrigações não estão organizados.",
      "A empresa cresceu e o acompanhamento atual deixou de atender à operação.",
      "Existem pendências e ninguém consegue explicar a origem ou o próximo passo.",
    ],
    analysis: [
      { title: "Situação fiscal", text: "Verificamos pendências, obrigações e pontos que precisam de continuidade." },
      { title: "Documentos e saldos", text: "Conferimos arquivos contábeis, fiscais, trabalhistas e demonstrações disponíveis." },
      { title: "Acessos e procurações", text: "Organizamos portais, certificados, autorizações e responsabilidades." },
      { title: "Plano de transição", text: "Definimos datas, entregas e comunicação com a contabilidade anterior." },
    ],
    deliveries: [
      { title: "Checklist de transferência", text: "Relação objetiva do que precisa ser recebido e validado." },
      { title: "Diagnóstico inicial", text: "Leitura da situação encontrada e priorização de eventuais correções." },
      { title: "Nova rotina de atendimento", text: "Canais, prazos e responsabilidades definidos desde o começo." },
      { title: "Continuidade das obrigações", text: "Planejamento para reduzir riscos durante a mudança de escritório." },
    ],
    faqs: [
      { title: "Preciso avisar o contador atual antes?", text: "A transição exige comunicação profissional e organização da entrega de documentos. A Nacional orienta o momento e as informações necessárias." },
      { title: "Posso trocar mesmo com pendências?", text: "Sim. As pendências precisam ser identificadas e registradas para que o novo acompanhamento comece com prioridades claras." },
      { title: "A empresa fica sem atendimento durante a troca?", text: "O planejamento busca justamente evitar essa lacuna. Datas, competências e responsabilidades são alinhadas para preservar a continuidade." },
    ],
    whatsappMessage: "Olá, quero conversar sobre a troca de contador da minha empresa.",
    primaryLabel: "Iniciar diagnóstico de troca",
    primaryHref: "/trocar-contador",
  },
  "revisar-impostos-e-riscos": {
    category: "Revisão fiscal e tributária",
    title: "Revise impostos e riscos antes que um erro vire custo.",
    lead:
      "A Nacional confere regime, notas e apurações para separar riscos, correções e oportunidades reais.",
    context:
      "Uma revisão responsável não começa prometendo economia. Começa confrontando documentos, atividade e tratamento fiscal para entender o que está correto e o que precisa ser ajustado.",
    situations: [
      "O imposto aumentou e a empresa não recebeu uma explicação clara.",
      "Existem dúvidas sobre CNAE, regime tributário, notas ou classificação fiscal.",
      "A operação mudou, mas a forma de apurar impostos continuou a mesma.",
      "A empresa recebeu aviso, cobrança ou identificou divergências nas obrigações.",
    ],
    analysis: [
      { title: "Regime e atividade", text: "Conferimos enquadramento, CNAEs, faturamento e forma de operação." },
      { title: "Documentos fiscais", text: "Analisamos notas, cadastros, produtos, serviços e tratamentos aplicados." },
      { title: "Apurações e obrigações", text: "Comparamos guias, declarações e informações transmitidas." },
      { title: "Risco e oportunidade", text: "Separamos correções necessárias de possibilidades que exigem validação." },
    ],
    deliveries: [
      { title: "Diagnóstico fundamentado", text: "Achados organizados com contexto, evidências e impacto estimado quando possível." },
      { title: "Mapa de riscos", text: "Pontos classificados por urgência, exposição e dependência documental." },
      { title: "Oportunidades verificáveis", text: "Alternativas legais que façam sentido para a realidade analisada." },
      { title: "Plano de ação", text: "Ordem recomendada para corrigir, documentar e acompanhar cada ponto." },
    ],
    faqs: [
      { title: "Toda revisão encontra imposto pago a mais?", text: "Não. A revisão pode confirmar que o tratamento está correto, encontrar riscos, apontar correções ou identificar oportunidades. O resultado depende dos documentos e da operação." },
      { title: "É possível revisar períodos anteriores?", text: "Sim, observados o tipo de tributo, a documentação disponível e os prazos aplicáveis. O período adequado é definido após a avaliação inicial." },
      { title: "A revisão altera alguma declaração automaticamente?", text: "Não. Primeiro apresentamos o diagnóstico. Qualquer correção ou retificação deve ser avaliada e autorizada de forma específica." },
    ],
    whatsappMessage: "Olá, quero solicitar uma revisão dos impostos e riscos da minha empresa.",
  },
  "organizar-numeros-e-retiradas": {
    category: "Contábil e financeiro",
    title: "Organize pró-labore, lucros e números com segurança.",
    lead:
      "A Nacional organiza caixa, contabilidade e retiradas para transformar movimentação em informação confiável.",
    context:
      "Não basta olhar o saldo bancário. É preciso entender resultado, obrigações, retiradas, capital de giro e o que pode ser comprovado por meio da contabilidade.",
    situations: [
      "As contas da empresa e dos sócios estão misturadas.",
      "Não existe regra clara para pró-labore, distribuição de lucros ou reembolsos.",
      "O empresário fatura, mas não consegue enxergar o lucro real da operação.",
      "Bancos, crédito ou decisões pessoais exigem comprovação de renda organizada.",
    ],
    analysis: [
      { title: "Movimentação financeira", text: "Entendemos entradas, saídas, contas e separação entre empresa e sócios." },
      { title: "Resultado contábil", text: "Conferimos registros, demonstrações e capacidade de sustentar retiradas." },
      { title: "Pró-labore e lucros", text: "Organizamos a natureza de cada retirada e seus efeitos tributários." },
      { title: "Informação para decidir", text: "Definimos números e documentos que precisam acompanhar a gestão." },
    ],
    deliveries: [
      { title: "Política de retiradas", text: "Critérios para pró-labore, lucros, reembolsos e transferências aos sócios." },
      { title: "Demonstrações organizadas", text: "Balanço, DRE e documentação contábil compatível com a realidade registrada." },
      { title: "Leitura de resultados", text: "Visão mais clara de receita, custos, despesas e desempenho da empresa." },
      { title: "Documentação de renda", text: "Base contábil para cadastros, bancos e decisões que exigem comprovação." },
    ],
    faqs: [
      { title: "Todo valor transferido ao sócio é lucro?", text: "Não. A retirada precisa ser identificada conforme sua natureza: pró-labore, distribuição de lucros, reembolso, empréstimo ou outra situação documentada." },
      { title: "Distribuição de lucros é sempre isenta?", text: "A isenção depende do resultado apurado, da escrituração e das regras tributárias aplicáveis. A documentação contábil é essencial para sustentar o tratamento." },
      { title: "Balanço e DRE ajudam a conseguir crédito?", text: "Podem ajudar a demonstrar situação patrimonial e resultado, mas cada instituição possui critérios próprios. Os documentos precisam refletir registros consistentes." },
    ],
    whatsappMessage: "Olá, quero organizar os números, o pró-labore e as retiradas da minha empresa.",
  },
};

type SolutionDetailPageProps = {
  slug: string;
};

export default function SolutionDetailPage({ slug }: SolutionDetailPageProps) {
  const content = solutionPages[slug] ?? solutionPages["abrir-ou-regularizar-empresa"];
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const contactUrl = whatsappLink(content.whatsappMessage);

  usePageSeo({
    title: `${content.category} | Nacional Contabilidade`,
    description: content.lead,
    path: `/solucoes/${slug}`,
  });

  useEffect(() => {
    const update = () => {
      setShowWhatsapp(Boolean(heroRef.current && heroRef.current.getBoundingClientRect().bottom < 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="preview-home solution-page">
      <SiteHeader contactUrl={contactUrl} navigationId="solution-navigation" />

      <section className="solution-hero" ref={heroRef}>
        <div className="preview-container solution-hero__grid">
          <div className="solution-hero__content">
            <a className="solution-breadcrumb" href="/#situacoes">← Voltar para soluções</a>
            <h1>{content.title}</h1>
            <p className="solution-hero__lead">{content.lead}</p>
            <div className="preview-actions">
              <a className="preview-button preview-button--primary" href={content.primaryHref ?? contactUrl} target={content.primaryHref ? undefined : "_blank"} rel={content.primaryHref ? undefined : "noreferrer"}>
                {content.primaryLabel ?? "Conversar sobre minha empresa"}
              </a>
              {content.primaryHref && (
                <a className="preview-button preview-button--text" href={contactUrl} target="_blank" rel="noreferrer">Falar com a Nacional</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="solution-section solution-when">
        <div className="preview-container solution-section__heading">
          <h2>Quando esta solução faz sentido</h2>
          <p>Reconheça os sinais mais comuns antes de escolher o próximo passo.</p>
        </div>
        <div className="preview-container solution-signal-list">
          {content.situations.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      {slug === "abrir-ou-regularizar-empresa" && (
        <section className="solution-address-bridge" aria-labelledby="solution-address-title">
          <div className="preview-container solution-address-bridge__grid">
            <div>
              <p className="preview-kicker">Se você não tem endereço empresarial</p>
              <h2 id="solution-address-title">A Nacional também disponibiliza endereço fiscal em Santarém.</h2>
            </div>
            <div>
              <p>
                Uma alternativa para prestadores de serviços, empresas online e atividades que precisam avaliar uma estrutura compatível para solicitar inscrição estadual.
              </p>
              <a className="preview-button preview-button--primary" href="/endereco-fiscal-santarem#planos">
                Conhecer planos e condições
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="solution-section solution-analysis">
        <div className="preview-container solution-section__heading solution-section__heading--light">
          <h2>O que a Nacional analisa</h2>
          <p>O diagnóstico vem antes da execução para que cada decisão tenha contexto.</p>
        </div>
        <div className="preview-container solution-analysis__grid">
          {content.analysis.map((item, index) => (
            <ResponsiveInfoCard key={item.title} number={String(index + 1).padStart(2, "0")} title={item.title} text={item.text} tone="dark" />
          ))}
        </div>
      </section>

      <section className="solution-section solution-deliveries">
        <div className="preview-container solution-section__heading">
          <h2>O que você recebe</h2>
          <p>Entregas organizadas para a empresa saber o que foi feito e o que acontece depois.</p>
        </div>
        <div className="preview-container solution-deliveries__grid">
          {content.deliveries.map((item) => (
            <ResponsiveInfoCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </section>

      <section className="solution-section solution-faq">
        <div className="preview-container solution-section__heading">
          <h2>Dúvidas frequentes</h2>
          <p>Respostas diretas antes de iniciar o diagnóstico.</p>
        </div>
        <div className="preview-container solution-faq__list">
          {content.faqs.map((item) => (
            <details key={item.title}>
              <summary>{item.title}</summary>
              <p>{item.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="solution-final">
        <div className="preview-container solution-final__grid">
          <div>
            <p className="preview-kicker">Próximo passo</p>
            <h2>Explique o momento da sua empresa.</h2>
          </div>
          <div>
            <p>A Nacional avalia o contexto e indica a forma mais segura de conduzir esta solução.</p>
            <a className="preview-button preview-button--light" href={contactUrl} target="_blank" rel="noreferrer">Solicitar diagnóstico</a>
          </div>
        </div>
      </section>

      <SiteFooter contactUrl={contactUrl} />

      {showWhatsapp && (
        <a className="preview-whatsapp-float" href={contactUrl} target="_blank" rel="noreferrer" aria-label="Falar com a Nacional Contabilidade no WhatsApp">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
            <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
          </svg>
          <span>Falar no WhatsApp</span>
        </a>
      )}
    </main>
  );
}
