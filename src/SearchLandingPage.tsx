import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { usePageSeo } from "./usePageSeo";
import ResponsiveInfoCard from "./ResponsiveInfoCard";
import { buildServiceRequestUrl } from "./lead-routing";
import "./preview-home.css";
import "./solution-page.css";
import "./search-landing-page.css";

type ContentItem = { title: string; text: string };
type RelatedLink = { label: string; href: string; text: string };

type SearchLandingConfig = {
  path: string;
  category: string;
  title: string;
  description: string;
  lead: string;
  context: string;
  situations: string[];
  analysis: ContentItem[];
  deliveries: ContentItem[];
  faqs: ContentItem[];
  related: RelatedLink[];
};

export const searchLandingPages: Record<string, SearchLandingConfig> = {
  "/contabilidade-em-santarem": {
    path: "/contabilidade-em-santarem",
    category: "Contabilidade em Santarém",
    title: "Contabilidade em Santarém para empresas que querem clareza e controle.",
    description: "Contabilidade em Santarém para empresas que precisam organizar impostos, obrigações, demonstrações e decisões com acompanhamento próximo.",
    lead: "Atendimento online para organizar o contábil, fiscal, tributário e financeiro da empresa.",
    context: "O trabalho começa pela realidade da empresa: atividade, regime tributário, faturamento, notas, equipe, movimentação financeira e objetivos dos sócios.",
    situations: [
      "A empresa precisa de acompanhamento mensal para impostos, obrigações e documentos.",
      "O empresário quer entender melhor lucro, caixa, pró-labore e distribuição de resultados.",
      "Existem pendências, atrasos ou informações desencontradas entre a operação e a contabilidade.",
      "A empresa cresceu e precisa de números mais confiáveis para decidir.",
    ],
    analysis: [
      { title: "Cadastro e regime", text: "Conferimos atividades, enquadramento, inscrições e forma de tributação." },
      { title: "Rotina fiscal", text: "Organizamos notas, apuração de impostos, declarações e vencimentos." },
      { title: "Contabilidade", text: "Estruturamos registros, conciliações, balanço e DRE compatíveis com a movimentação." },
      { title: "Sócios e decisões", text: "Acompanhamos retiradas, documentos e informações usadas na gestão." },
    ],
    deliveries: [
      { title: "Calendário mensal", text: "Impostos, obrigações e solicitações organizados por competência." },
      { title: "Demonstrações contábeis", text: "Balanço, DRE e relatórios produzidos a partir dos registros da empresa." },
      { title: "Acompanhamento tributário", text: "Leitura recorrente do enquadramento, das alíquotas e das mudanças que afetam a operação." },
      { title: "Documentação organizada", text: "Certidões, comprovantes, declarações e documentos empresariais reunidos para consulta." },
    ],
    faqs: [
      { title: "O atendimento é presencial?", text: "O atendimento da Nacional é 100% online, com reuniões agendadas e envio digital de documentos." },
      { title: "A Nacional atende somente empresas de Santarém?", text: "Não. A base da Nacional está em Santarém, mas o atendimento contábil é realizado para empresas de todo o Brasil." },
      { title: "É possível trocar de contador sem parar a empresa?", text: "Sim. A transição é planejada para reunir documentos, acessos, responsabilidades e pendências sem interromper a operação." },
    ],
    related: [
      { label: "Abrir empresa em Santarém", href: "/abrir-empresa-em-santarem", text: "Planeje atividade, endereço e tributação antes do protocolo." },
      { label: "Trocar de contador", href: "/solucoes/trocar-de-contador", text: "Organize a transição contábil e os acessos da empresa." },
      { label: "Endereço fiscal", href: "/endereco-fiscal-santarem", text: "Conheça as opções de endereço empresarial em Santarém." },
    ],
  },
  "/abrir-empresa-em-santarem": {
    path: "/abrir-empresa-em-santarem",
    category: "Abertura de empresa em Santarém",
    title: "Abra sua empresa em Santarém com o caminho definido.",
    description: "Abertura de empresa em Santarém com análise de CNAEs, endereço, regime tributário, registros e preparação para emissão de notas fiscais.",
    lead: "Atividade, endereço e tributação são definidos antes do protocolo do CNPJ.",
    context: "Com a documentação solicitada completa e sem impedimentos nos órgãos envolvidos, alguns processos podem ser agilizados e concluídos em menos de 24 horas. O prazo final depende das análises públicas aplicáveis a cada atividade.",
    situations: [
      "Você vai prestar serviços, vender produtos ou iniciar uma operação online.",
      "Precisa emitir nota fiscal para clientes, plataformas, empresas ou órgãos públicos.",
      "Ainda não sabe qual atividade, natureza jurídica ou regime tributário escolher.",
      "Não quer usar o endereço residencial no cadastro da empresa.",
    ],
    analysis: [
      { title: "Modelo da operação", text: "Entendemos o que será vendido, como a empresa receberá e onde funcionará." },
      { title: "CNAEs e licenças", text: "Selecionamos atividades e verificamos cadastros e autorizações relacionados ao caso." },
      { title: "Tributação inicial", text: "Comparamos possibilidades antes de iniciar o faturamento e a emissão de notas." },
      { title: "Endereço empresarial", text: "Avaliamos o endereço informado ou a compatibilidade do endereço fiscal da Nacional." },
    ],
    deliveries: [
      { title: "Roteiro de constituição", text: "Documentos, etapas, custos públicos e dependências explicados antes do início." },
      { title: "Registros e cadastros", text: "Condução do processo empresarial conforme a atividade e os órgãos envolvidos." },
      { title: "Preparação para notas", text: "Orientação para habilitação e emissão do documento fiscal aplicável à operação." },
      { title: "Primeiro mês acompanhado", text: "Direcionamento sobre impostos, pró-labore, documentos e rotina após a abertura." },
    ],
    faqs: [
      { title: "Quanto tempo leva para abrir a empresa?", text: "Quando a documentação está completa e não existem impedimentos nas consultas e aprovações públicas, o processo pode ser agilizado e, em alguns casos, concluído em menos de 24 horas." },
      { title: "Posso abrir a empresa usando meu endereço residencial?", text: "A viabilidade depende da atividade, do imóvel e das regras aplicáveis. Quando o empresário não quer ou não pode usar o endereço residencial, a Nacional também oferece endereço fiscal em Santarém." },
      { title: "A abertura já define quanto a empresa pagará de imposto?", text: "Ela define a estrutura inicial, mas a carga efetiva depende do regime, da atividade, do faturamento e da forma como a operação acontece." },
    ],
    related: [
      { label: "Endereço fiscal em Santarém", href: "/endereco-fiscal-santarem", text: "Compare planos com e sem necessidade de inscrição estadual." },
      { label: "Contabilidade em Santarém", href: "/contabilidade-em-santarem", text: "Conheça o acompanhamento mensal depois da abertura." },
      { label: "Abertura e regularização", href: "/solucoes/abrir-ou-regularizar-empresa", text: "Veja o processo completo da Nacional." },
    ],
  },
  "/endereco-fiscal-para-prestadores-de-servicos": {
    path: "/endereco-fiscal-para-prestadores-de-servicos",
    category: "Endereço fiscal para serviços",
    title: "Endereço fiscal para prestadores de serviços em Santarém.",
    description: "Endereço fiscal em Santarém para prestadores de serviços, profissionais e empresas online, sujeito à análise de compatibilidade da atividade.",
    lead: "Para empresas online ou que não recebem público em uma sede própria.",
    context: "Antes da contratação, a Nacional verifica a atividade e o uso pretendido. O endereço fiscal não substitui automaticamente licenças, estrutura operacional ou exigências específicas do negócio.",
    situations: [
      "Você trabalha de forma online e não recebe clientes em casa.",
      "Presta serviços nas instalações do cliente ou em locais contratados por atendimento.",
      "Precisa separar o endereço pessoal do cadastro público da empresa.",
      "Vai abrir ou alterar um CNPJ de prestação de serviços em Santarém.",
    ],
    analysis: [
      { title: "Atividade", text: "Verificamos os serviços declarados e a compatibilidade do uso do endereço." },
      { title: "Cadastros", text: "Identificamos os registros municipais, fiscais e empresariais relacionados à operação." },
      { title: "Forma de atendimento", text: "Entendemos se a atividade é online, externa ou envolve atendimento no local." },
      { title: "Documentos", text: "Definimos o que precisa acompanhar a abertura ou a alteração do endereço." },
    ],
    deliveries: [
      { title: "Autorização de uso", text: "Documentação vinculada ao plano e à finalidade contratada." },
      { title: "Recebimento de correspondências", text: "Organização do recebimento conforme as condições do serviço." },
      { title: "Orientação cadastral", text: "Direcionamento para usar o endereço nos registros compatíveis." },
      { title: "Planos flexíveis", text: "Opções mensais, semestrais e anuais, com valor equivalente a partir de R$ 140 por mês no plano anual." },
    ],
    faqs: [
      { title: "Qualquer prestador de serviços pode contratar?", text: "A contratação depende da análise da atividade e do modo de funcionamento. Algumas atividades exigem estrutura, licença ou endereço operacional específico." },
      { title: "O endereço fiscal é um escritório para atendimento?", text: "Não. A finalidade principal é cadastral e fiscal. O atendimento presencial ou uso operacional precisa ser avaliado separadamente." },
      { title: "Posso receber correspondências?", text: "Sim, dentro das condições definidas no plano contratado e das regras de comunicação adotadas pela Nacional." },
    ],
    related: [
      { label: "Planos de endereço fiscal", href: "/endereco-fiscal-santarem", text: "Veja valores, condições e diferenças entre os planos." },
      { label: "Abrir empresa em Santarém", href: "/abrir-empresa-em-santarem", text: "Organize a constituição do CNPJ junto com a análise do endereço." },
      { label: "Contabilidade em Santarém", href: "/contabilidade-em-santarem", text: "Mantenha impostos, registros e documentos acompanhados." },
    ],
  },
  "/endereco-fiscal-para-ecommerce": {
    path: "/endereco-fiscal-para-ecommerce",
    category: "Endereço fiscal para e-commerce",
    title: "Endereço fiscal para e-commerce em Santarém.",
    description: "Endereço fiscal em Santarém para e-commerce e comércio online, com avaliação de atividade, inscrição estadual e exigências cadastrais.",
    lead: "Organize cadastro, notas, estoque e inscrição estadual antes de começar a vender.",
    context: "O endereço fiscal pode atender determinadas operações online, mas não deve ser contratado sem verificar se haverá estoque, circulação de mercadorias, placa, fiscalização ou outras exigências ligadas à inscrição estadual.",
    situations: [
      "Você vende em marketplace, loja virtual ou redes sociais e precisa formalizar o negócio.",
      "A operação não possui loja aberta ao público, mas precisa emitir nota de mercadoria.",
      "O endereço residencial não é adequado para aparecer no cadastro do CNPJ.",
      "A empresa precisa solicitar ou manter inscrição estadual no Pará.",
    ],
    analysis: [
      { title: "Fluxo das mercadorias", text: "Entendemos compra, estoque, expedição, devoluções e local de operação." },
      { title: "Inscrição estadual", text: "Avaliamos o cadastro estadual e as exigências relacionadas à atividade comercial." },
      { title: "Notas e tributos", text: "Mapeamos emissão fiscal, regime tributário e operações que afetam o ICMS." },
      { title: "Endereço compatível", text: "Conferimos se o uso cadastral proposto é compatível com a estrutura necessária." },
    ],
    deliveries: [
      { title: "Análise de compatibilidade", text: "Validação inicial do modelo do e-commerce antes da contratação do endereço." },
      { title: "Documentação de uso", text: "Instrumentos e orientações vinculados ao plano aprovado." },
      { title: "Apoio cadastral", text: "Direcionamento para abertura, alteração e inscrições relacionadas ao caso." },
      { title: "Plano adequado à operação", text: "Enquadramento entre a modalidade sem inscrição estadual e a estrutura com exigências estaduais." },
    ],
    faqs: [
      { title: "Todo e-commerce precisa de inscrição estadual?", text: "A necessidade depende das atividades e das operações realizadas. Comércio de mercadorias normalmente exige uma análise estadual específica." },
      { title: "Posso manter estoque no endereço fiscal?", text: "Não de forma automática. Estoque, expedição e uso operacional precisam ser informados e avaliados antes da contratação." },
      { title: "O plano com inscrição estadual custa mais?", text: "Sim. Ele envolve uma estrutura e documentação diferentes. Na Nacional, o plano anual tem valor equivalente a R$ 350 por mês, pago antecipadamente." },
    ],
    related: [
      { label: "Endereço com inscrição estadual", href: "/endereco-fiscal-com-inscricao-estadual-para", text: "Entenda a modalidade voltada a operações sujeitas ao cadastro estadual." },
      { label: "Planos de endereço fiscal", href: "/endereco-fiscal-santarem", text: "Compare todas as modalidades e condições." },
      { label: "Abrir empresa em Santarém", href: "/abrir-empresa-em-santarem", text: "Defina a estrutura do CNPJ antes de começar a vender." },
    ],
  },
  "/endereco-fiscal-com-inscricao-estadual-para": {
    path: "/endereco-fiscal-com-inscricao-estadual-para",
    category: "Endereço fiscal com inscrição estadual no Pará",
    title: "Endereço fiscal com inscrição estadual no Pará.",
    description: "Endereço fiscal em Santarém para empresas que precisam avaliar inscrição estadual no Pará, com análise de atividade, estrutura e documentação.",
    lead: "A operação e as exigências estaduais são analisadas antes da contratação.",
    context: "A contratação depende da atividade, do fluxo de mercadorias e das exigências aplicáveis ao cadastro estadual. A Nacional analisa o caso antes de confirmar a modalidade adequada.",
    situations: [
      "A empresa venderá mercadorias e precisa solicitar inscrição estadual no Pará.",
      "O CNPJ de comércio online não terá loja aberta ao público.",
      "Uma alteração de endereço precisa preservar a regularidade do cadastro estadual.",
      "A operação precisa organizar documentação, identificação e condições para fiscalização.",
    ],
    analysis: [
      { title: "CNAEs e produtos", text: "Conferimos atividades, mercadorias e a forma como a empresa realizará as vendas." },
      { title: "Estrutura necessária", text: "Avaliamos identificação, documentos, estoque e demais condições informadas para a operação." },
      { title: "Cadastro estadual", text: "Mapeamos as etapas e informações relacionadas à inscrição estadual no Pará." },
      { title: "Risco e manutenção", text: "Orientamos sobre uso correto do endereço e atualização dos cadastros empresariais." },
    ],
    deliveries: [
      { title: "Avaliação prévia", text: "Análise do modelo da empresa antes da contratação e do pedido cadastral." },
      { title: "Documentação da modalidade", text: "Instrumentos compatíveis com o uso aprovado e o período contratado." },
      { title: "Apoio no processo", text: "Orientação para constituição, alteração ou regularização da empresa." },
      { title: "Planos com antecedência", text: "Mensal de R$ 450; trimestral equivalente a R$ 420; semestral a R$ 400; anual a R$ 350 por mês, com períodos antecipados." },
    ],
    faqs: [
      { title: "O endereço garante a aprovação da inscrição estadual?", text: "Não. O deferimento depende da análise do órgão competente e das condições da empresa. A Nacional organiza e acompanha o processo, mas não controla a decisão pública." },
      { title: "Por que essa modalidade tem valor diferente?", text: "Ela envolve análise, documentação e condições adicionais relacionadas à atividade comercial e ao cadastro estadual." },
      { title: "Os planos trimestral, semestral e anual são pagos mês a mês?", text: "Não. Os períodos com valor reduzido são pagos antecipadamente, conforme o prazo contratado." },
    ],
    related: [
      { label: "Endereço fiscal para e-commerce", href: "/endereco-fiscal-para-ecommerce", text: "Veja como endereço, estoque e venda online se relacionam." },
      { label: "Todos os planos", href: "/endereco-fiscal-santarem", text: "Compare a modalidade de serviços com a opção que envolve inscrição estadual." },
      { label: "Abrir empresa em Santarém", href: "/abrir-empresa-em-santarem", text: "Planeje a empresa antes de solicitar os cadastros." },
    ],
  },
};

export default function SearchLandingPage({ path }: { path: string }) {
  const content = searchLandingPages[path] ?? searchLandingPages["/contabilidade-em-santarem"];
  const contactUrl = buildServiceRequestUrl({ origem: `Busca organica - ${path}` });

  usePageSeo({ title: `${content.category} | Nacional Contabilidade`, description: content.description, path: content.path });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "ProfessionalService", name: "Nacional Contabilidade", url: "https://www.nacionalcon.com/", telephone: "+55 93 99210-1980", areaServed: ["Santarém", "Pará", "Brasil"] },
        { "@type": "Service", name: content.category, description: content.description, url: `https://www.nacionalcon.com${content.path}`, provider: { "@type": "ProfessionalService", name: "Nacional Contabilidade" } },
        { "@type": "FAQPage", mainEntity: content.faqs.map((item) => ({ "@type": "Question", name: item.title, acceptedAnswer: { "@type": "Answer", text: item.text } })) },
      ],
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [content]);

  return (
    <main className="preview-home solution-page search-landing-page">
      <SiteHeader contactUrl={contactUrl} navigationId="search-landing-navigation" />
      <section className="solution-hero">
        <div className="preview-container solution-hero__grid">
          <div className="solution-hero__content">
            <a className="solution-breadcrumb" href="/">← Voltar para a Nacional</a>
            <h1>{content.title}</h1>
            <p className="solution-hero__lead">{content.lead}</p>
            <div className="preview-actions"><a className="preview-button preview-button--primary" href={contactUrl}>Solicitar atendimento</a></div>
          </div>
        </div>
      </section>

      <section className="solution-section solution-when">
        <div className="preview-container solution-section__heading"><h2>Quando esta solução faz sentido</h2><p>Veja os cenários mais comuns antes de escolher o próximo passo.</p></div>
        <div className="preview-container solution-signal-list">
          {content.situations.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}
        </div>
      </section>

      <section className="solution-section solution-analysis">
        <div className="preview-container solution-section__heading solution-section__heading--light"><h2>O que a Nacional analisa</h2><p>A contratação parte da operação real, não de uma solução pronta para qualquer empresa.</p></div>
        <div className="preview-container solution-analysis__grid">
          {content.analysis.map((item, index) => <ResponsiveInfoCard key={item.title} number={String(index + 1).padStart(2, "0")} title={item.title} text={item.text} tone="dark" />)}
        </div>
      </section>

      <section className="solution-section solution-deliveries">
        <div className="preview-container solution-section__heading"><h2>O que você recebe</h2><p>Entregas explicadas para a empresa saber o que será feito e quais pontos dependem de análise.</p></div>
        <div className="preview-container solution-deliveries__grid">
          {content.deliveries.map((item) => <ResponsiveInfoCard key={item.title} title={item.title} text={item.text} />)}
        </div>
      </section>

      <section className="search-related" aria-labelledby="search-related-title">
        <div className="preview-container">
          <div className="solution-section__heading"><h2 id="search-related-title">Continue por aqui</h2><p>Conteúdos e serviços relacionados ao mesmo momento da empresa.</p></div>
          <div className="search-related__grid">
            {content.related.map((item) => <a href={item.href} key={item.href}><span>{item.label}</span><p>{item.text}</p><strong>Conhecer →</strong></a>)}
          </div>
        </div>
      </section>

      <section className="solution-section solution-faq">
        <div className="preview-container solution-section__heading"><h2>Dúvidas frequentes</h2><p>Respostas diretas para entender limites, condições e próximos passos.</p></div>
        <div className="preview-container solution-faq__list">
          {content.faqs.map((item) => <details key={item.title}><summary>{item.title}</summary><p>{item.text}</p></details>)}
        </div>
      </section>

      <section className="solution-final">
        <div className="preview-container solution-final__grid">
          <div><p className="preview-kicker">Próximo passo</p><h2>Conte o que sua empresa precisa.</h2></div>
          <div><p>A Nacional verifica o contexto e indica o caminho compatível com a sua operação.</p><a className="preview-button preview-button--light" href={contactUrl}>Solicitar atendimento</a></div>
        </div>
      </section>

      <SiteFooter contactUrl={contactUrl} />
    </main>
  );
}
