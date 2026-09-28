import "./preview-home.css";
import "./solution-page.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { usePageSeo } from "./usePageSeo";
import ResponsiveInfoCard from "./ResponsiveInfoCard";
import { buildServiceRequestUrl } from "./lead-routing";

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
  primaryLabel?: string;
  primaryHref?: string;
};

export const solutionPages: Record<string, SolutionConfig> = {
  "diagnostico-fiscal-cadastral": {
    category: "Diagnóstico fiscal e cadastral",
    title: "Entenda o que está irregular antes de começar a corrigir.",
    lead:
      "A Nacional levanta omissões, pendências, divergências e impedimentos para definir um plano de regularização compatível com a realidade da empresa.",
    context:
      "O diagnóstico é uma etapa técnica própria. Ele separa o que é cadastral, declaratório, fiscal e documental antes de qualquer transmissão, retificação ou promessa de resultado.",
    situations: [
      "O CNPJ está inapto, suspenso ou possui omissões que ninguém conseguiu explicar.",
      "A empresa precisa saber quais declarações, inscrições ou períodos estão pendentes.",
      "Existem cobranças, divergências ou avisos nos portais fiscais.",
      "O histórico da empresa está desorganizado e não há segurança para começar a corrigir.",
    ],
    analysis: [
      { title: "Situação cadastral", text: "Verificamos CNPJ, inscrições, cadastros e impedimentos identificados nos órgãos aplicáveis." },
      { title: "Obrigações e omissões", text: "Levantamos declarações, escriturações e competências que exigem tratamento." },
      { title: "Débitos e divergências", text: "Separamos valores declarados, pagamentos, cobranças e inconsistências aparentes." },
      { title: "Documentos e operação", text: "Confrontamos o histórico disponível com a atividade e a movimentação informada." },
    ],
    deliveries: [
      { title: "Relatório de diagnóstico", text: "Problemas encontrados, evidências disponíveis e limitações documentais registradas." },
      { title: "Mapa de prioridades", text: "Pendências classificadas por urgência, impacto e dependência de informação." },
      { title: "Plano de regularização", text: "Ordem recomendada das correções e documentos necessários para cada etapa." },
      { title: "Proposta de execução", text: "Escopo e investimento apresentados separadamente quando a Nacional puder conduzir a solução." },
    ],
    faqs: [
      { title: "O diagnóstico é cobrado?", text: "Após a triagem comercial, os casos que exigem análise técnica recebem uma proposta própria de diagnóstico. A execução das correções não está automaticamente incluída." },
      { title: "O diagnóstico já deixa a empresa regular?", text: "Não. Ele identifica o cenário e define o caminho. Transmissões, retificações, defesas e demais providências dependem de contratação e autorização específicas." },
      { title: "Quais documentos podem ser solicitados?", text: "A relação depende do caso e pode envolver extratos, notas, declarações anteriores, contratos, acessos, notificações e documentos cadastrais." },
    ],
  },
  "regularizar-cnpj-inscricao": {
    category: "Regularização empresarial",
    title: "Regularize CNPJ e inscrições com as pendências na ordem certa.",
    lead:
      "A Nacional identifica por que a empresa está irregular e conduz as etapas cadastrais e fiscais compatíveis com o caso.",
    context:
      "CNPJ inapto, inscrição estadual irregular e impedimentos para emitir documentos podem ter causas diferentes. O trabalho começa pela identificação da origem, sem presumir que uma única transmissão resolverá tudo.",
    situations: [
      "O CNPJ aparece como inapto, suspenso ou possui omissões em aberto.",
      "A inscrição estadual está irregular ou a empresa não consegue operar normalmente.",
      "A empresa precisa retomar atividades, emitir documentos ou obter certidões.",
      "Existem alterações cadastrais, declarações e débitos que precisam ser tratados em conjunto.",
    ],
    analysis: [
      { title: "Origem da irregularidade", text: "Identificamos atos, omissões, exigências e eventos que afetaram os cadastros." },
      { title: "Obrigações relacionadas", text: "Verificamos quais declarações e competências precisam ser entregues ou corrigidas." },
      { title: "Cadastros e licenças", text: "Mapeamos CNPJ, inscrição estadual, município e demais registros aplicáveis." },
      { title: "Sequência de regularização", text: "Definimos o que depende do cliente, da Nacional e da análise dos órgãos públicos." },
    ],
    deliveries: [
      { title: "Mapa das pendências", text: "Relação objetiva do que impede ou limita a regularidade da empresa." },
      { title: "Execução contratada", text: "Protocolos, transmissões e ajustes previstos no escopo aprovado." },
      { title: "Acompanhamento do processo", text: "Controle das etapas que dependem de processamento ou decisão externa." },
      { title: "Orientação pós-regularização", text: "Próximas obrigações e cuidados para preservar a situação cadastral alcançada." },
    ],
    faqs: [
      { title: "Uma declaração atrasada regulariza o CNPJ imediatamente?", text: "Nem sempre. É necessário verificar todas as omissões e o tempo de processamento de cada sistema. Outras pendências podem permanecer mesmo após uma transmissão." },
      { title: "A Nacional garante o deferimento?", text: "Não. A Nacional organiza e conduz as providências contratadas, mas decisões cadastrais e fiscais dependem dos órgãos competentes e das informações apresentadas." },
      { title: "É possível regularizar uma empresa que teve movimento?", text: "Sim, desde que a realidade da operação possa ser reconstruída e declarada com suporte documental. Movimento conhecido não deve ser tratado como período zerado." },
    ],
  },
  "notificacoes-intimacoes": {
    category: "Notificações e intimações",
    title: "Recebeu uma notificação? Organize o caso antes de responder.",
    lead:
      "A Nacional analisa o documento, o prazo e as informações relacionadas para definir o suporte técnico e os próximos passos.",
    context:
      "Avisos, termos de intimação, cobranças e autuações exigem leitura cuidadosa. A resposta adequada depende do órgão, do fato apontado, dos documentos disponíveis e do prazo em andamento.",
    situations: [
      "A empresa recebeu uma intimação e não sabe quais documentos apresentar.",
      "Existe prazo em andamento para explicar divergências ou corrigir obrigações.",
      "Uma cobrança parece incompatível com declarações ou pagamentos realizados.",
      "O caso exige organizar informações contábeis e fiscais antes de qualquer manifestação.",
    ],
    analysis: [
      { title: "Documento e prazo", text: "Identificamos o órgão, a exigência, a ciência e a data limite informada." },
      { title: "Origem da divergência", text: "Relacionamos a notificação com declarações, pagamentos e documentos disponíveis." },
      { title: "Suporte técnico", text: "Definimos cálculos, relatórios, retificações ou esclarecimentos necessários ao caso." },
      { title: "Competências envolvidas", text: "Indicamos quando a atuação exige parceria jurídica ou outro especialista." },
    ],
    deliveries: [
      { title: "Leitura técnica do caso", text: "Resumo do que foi exigido, prazo identificado e informações faltantes." },
      { title: "Checklist documental", text: "Relação dos arquivos e evidências necessários para sustentar a providência." },
      { title: "Plano de resposta", text: "Medidas técnicas recomendadas conforme o escopo e os limites profissionais aplicáveis." },
      { title: "Acompanhamento contratado", text: "Controle das providências executadas e dos retornos recebidos durante o trabalho." },
    ],
    faqs: [
      { title: "Devo esperar para procurar ajuda?", text: "Não é recomendável ignorar o documento. Informe a data da ciência e o prazo logo na solicitação para que a viabilidade do atendimento seja avaliada." },
      { title: "Toda notificação exige uma defesa?", text: "Não. Alguns casos pedem esclarecimento, entrega, retificação ou pagamento. A medida depende do conteúdo do documento e da análise do histórico." },
      { title: "Quando um advogado pode ser necessário?", text: "Quando o caso ultrapassa a análise contábil e fiscal ou exige atuação jurídica, a Nacional informa essa necessidade e pode trabalhar de forma coordenada com profissional habilitado." },
    ],
  },
  "regularizar-obrigacoes": {
    category: "Regularização de obrigações",
    title: "Corrija omissões e períodos anteriores com base na operação real.",
    lead:
      "A Nacional levanta as competências pendentes, verifica os documentos disponíveis e estrutura a regularização das obrigações contratadas.",
    context:
      "Empresa sem movimento e empresa que operou sem escrituração exigem trabalhos diferentes. Declarações zeradas só são compatíveis com períodos efetivamente sem fatos a informar.",
    situations: [
      "Existem PGDAS-D, DEFIS, DCTFWeb ou escriturações omitidas.",
      "Declarações anteriores foram entregues com dados incompletos ou incompatíveis.",
      "A empresa movimentou contas ou exerceu atividade sem organização documental adequada.",
      "Períodos antigos precisam ser reconstruídos para regularizar o cadastro ou responder a uma cobrança.",
    ],
    analysis: [
      { title: "Obrigação e competência", text: "Confirmamos quais entregas são aplicáveis e quais períodos estão em aberto." },
      { title: "Movimentação existente", text: "Separamos receitas, transferências, aportes e outras entradas conforme os documentos." },
      { title: "Fontes de informação", text: "Confrontamos extratos, notas, relatórios, declarações e registros disponíveis." },
      { title: "Risco da correção", text: "Avaliamos efeitos declaratórios, débitos, multas e limitações antes de transmitir." },
    ],
    deliveries: [
      { title: "Levantamento por período", text: "Competências, obrigações e documentos necessários organizados em uma sequência de trabalho." },
      { title: "Reconstrução possível", text: "Apuração realizada com as informações suficientes e compatíveis com a realidade identificada." },
      { title: "Transmissões autorizadas", text: "Entregas e retificações previstas no escopo, após validação das informações pelo cliente." },
      { title: "Registro de limitações", text: "Pendências documentais e pontos que impedem uma conclusão segura formalmente indicados." },
    ],
    faqs: [
      { title: "Posso entregar tudo zerado para ativar o CNPJ?", text: "Somente quando o período foi efetivamente sem movimento e isso é compatível com os fatos disponíveis. Se houve atividade, a regularização precisa refletir a operação reconstruída." },
      { title: "A ausência de nota fiscal significa ausência de receita?", text: "Não necessariamente. Recebimentos, contratos, extratos e outros elementos podem demonstrar atividade. Cada entrada precisa ser identificada de acordo com sua natureza." },
      { title: "E se não existirem documentos suficientes?", text: "A Nacional informa a limitação e não transmite informações sem suporte adequado. O cliente recebe orientação sobre o que precisa localizar ou esclarecer." },
    ],
  },
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
  },
};

const interestBySlug: Record<string, string> = {
  "diagnostico-fiscal-cadastral": "Diagnóstico fiscal e cadastral",
  "regularizar-cnpj-inscricao": "Regularização de CNPJ ou inscrição",
  "notificacoes-intimacoes": "Notificação ou fiscalização",
  "regularizar-obrigacoes": "Regularização de obrigações",
  "abrir-ou-regularizar-empresa": "Abrir, alterar ou regularizar empresa",
  "trocar-de-contador": "Trocar de contador",
  "revisar-impostos-e-riscos": "Problema ou revisão tributária",
  "organizar-numeros-e-retiradas": "Organização financeira e resultados",
};

type SolutionDetailPageProps = {
  slug: string;
};

export default function SolutionDetailPage({ slug }: SolutionDetailPageProps) {
  const content = solutionPages[slug] ?? solutionPages["abrir-ou-regularizar-empresa"];
  const contactUrl = buildServiceRequestUrl({
    interesse: interestBySlug[slug],
    origem: `Solucao - ${slug}`,
  });

  usePageSeo({
    title: `${content.category} | Nacional Contabilidade`,
    description: content.lead,
    path: `/solucoes/${slug}`,
  });

  return (
    <main className="preview-home solution-page">
      <SiteHeader contactUrl={contactUrl} navigationId="solution-navigation" />

      <section className="solution-hero">
        <div className="preview-container solution-hero__grid">
          <div className="solution-hero__content">
            <a className="solution-breadcrumb" href="/#solucoes">← Voltar para soluções</a>
            <h1>{content.title}</h1>
            <p className="solution-hero__lead">{content.lead}</p>
            <div className="preview-actions">
              <a className="preview-button preview-button--primary" href={content.primaryHref ?? contactUrl}>
                {content.primaryLabel ?? "Solicitar atendimento"}
              </a>
              {content.primaryHref && (
                <a className="preview-button preview-button--text" href={contactUrl}>Outra necessidade</a>
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
            <a className="preview-button preview-button--light" href={contactUrl}>Solicitar atendimento</a>
          </div>
        </div>
      </section>

      <SiteFooter contactUrl={contactUrl} />

    </main>
  );
}
