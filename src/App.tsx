import { type FormEvent, useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e quero falar com a Nacional Contabilidade sobre minha empresa.";
const INSTAGRAM_URL = "https://www.instagram.com/rodrigospcoelho";
const EMAIL = "rodrigorico312@gmail.com";
const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";
const ADDRESS =
  "Av. Plácido de Castro, 1505, Aparecida, Santarém-PA, CEP 68.040-090";

const buildWhatsappUrl = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const whatsappUrl = buildWhatsappUrl();

type LinkKind =
  | "whatsapp"
  | "instagram"
  | "email"
  | "switch"
  | "company"
  | "accounting"
  | "tax"
  | "advisor"
  | "address"
  | "correspondent"
  | "solutions"
  | "tools"
  | "blog"
  | "site";

type LinkItem = {
  title: string;
  text: string;
  href: string;
  kind: LinkKind;
  external?: boolean;
  featured?: boolean;
  ariaLabel?: string;
};

const linkTreeItems: LinkItem[] = [
  {
    title: "Falar no WhatsApp",
    text: "Atendimento com a Nacional Contabilidade",
    href: whatsappUrl,
    kind: "whatsapp",
    external: true,
    featured: true,
    ariaLabel: "Falar com a Nacional Contabilidade no WhatsApp",
  },
  {
    title: "Trocar de contador",
    text: "Migração contábil, documentos, acessos e pendências",
    href: "/trocar-contador",
    kind: "switch",
  },
  {
    title: "Abrir, alterar ou baixar CNPJ",
    text: "Constituição, alteração contratual, regularização e baixa",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre abertura, alteração ou baixa de CNPJ.",
    ),
    kind: "company",
    external: true,
  },
  {
    title: "Contabilidade para empresas",
    text: "Impostos, obrigações, notas e rotina fiscal",
    href: "/contabilidade-empresas",
    kind: "accounting",
  },
  {
    title: "Central do empresário",
    text: "Atalhos, consultas, certidões e ferramentas úteis",
    href: "/ferramentas",
    kind: "tools",
  },
  {
    title: "Blog da Nacional",
    text: "Conteúdos sobre CNPJ, impostos e rotina da empresa",
    href: "/blog",
    kind: "blog",
  },
  {
    title: "Planejamento tributário",
    text: "Análise de regime, operação, riscos e oportunidades",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre planejamento tributário.",
    ),
    kind: "tax",
    external: true,
  },
  {
    title: "Assessoria para contadores",
    text: "Apoio técnico, rotina, mentoria e análise de casos",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e sou contador. Quero falar sobre assessoria e apoio técnico.",
    ),
    kind: "advisor",
    external: true,
  },
  {
    title: "Endereço fiscal em Santarém",
    text: "Endereço fiscal para empresas que precisam de base local",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre endereço fiscal em Santarém.",
    ),
    kind: "address",
    external: true,
  },
  {
    title: "Correspondente empresarial",
    text: "Apoio local em Santarém para demandas empresariais",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre correspondente empresarial em Santarém.",
    ),
    kind: "correspondent",
    external: true,
  },
  {
    title: "Ver soluções",
    text: "Serviços contábeis, fiscais, tributários e financeiros",
    href: "/#servicos",
    kind: "solutions",
  },
  {
    title: "Site da Nacional",
    text: "Conheça a Nacional Contabilidade",
    href: "/",
    kind: "site",
  },
  {
    title: "Instagram",
    text: "@rodrigospcoelho",
    href: INSTAGRAM_URL,
    kind: "instagram",
    external: true,
    ariaLabel: "Abrir Instagram de Rodrigo Coelho",
  },
  {
    title: "Email",
    text: EMAIL,
    href: `mailto:${EMAIL}`,
    kind: "email",
    ariaLabel: "Enviar email para a Nacional Contabilidade",
  },
];

type SwitchAccountantFormData = {
  nome: string;
  whatsapp: string;
  cidade: string;
  empresa: string;
  regime: string;
  segmento: string;
  faturamento: string;
  motivo: string;
  pendencias: string;
  socios: string;
  notas: string;
  funcionarios: string;
  necessidade: string;
  observacao: string;
  website: string;
};

const initialSwitchAccountantForm: SwitchAccountantFormData = {
  nome: "",
  whatsapp: "",
  cidade: "",
  empresa: "",
  regime: "",
  segmento: "",
  faturamento: "",
  motivo: "",
  pendencias: "",
  socios: "",
  notas: "",
  funcionarios: "",
  necessidade: "",
  observacao: "",
  website: "",
};

const taxRegimeOptions = [
  "MEI",
  "Simples Nacional",
  "Lucro Presumido",
  "Lucro Real",
  "Não sei informar",
];

const segmentOptions = [
  "Comércio",
  "Prestação de serviços",
  "Alimentação",
  "Saúde, estética ou bem-estar",
  "Construção ou obras",
  "Transporte ou logística",
  "Negócio digital",
  "Outro segmento",
];

const revenueOptions = [
  "Até R$ 10 mil por mês",
  "De R$ 10 mil a R$ 30 mil por mês",
  "De R$ 30 mil a R$ 80 mil por mês",
  "De R$ 80 mil a R$ 180 mil por mês",
  "Acima de R$ 180 mil por mês",
  "Prefiro falar no atendimento",
];

const switchReasonOptions = [
  "Quero mais retorno e acompanhamento",
  "Tenho pendências ou documentos atrasados",
  "A empresa cresceu e preciso organizar melhor",
  "Tenho dificuldade para falar com o contador atual",
  "Quero revisar impostos, notas ou obrigações",
  "Outro motivo",
];

const pendingOptions = ["Sim", "Não", "Não sei"];

const partnerOptions = [
  "Sem sócios",
  "2 sócios",
  "3 sócios",
  "4 ou mais sócios",
  "Ainda vou definir",
];

const invoiceOptions = [
  "Já emite nota fiscal",
  "Precisa começar a emitir",
  "Emite pouco",
  "Não emite nota ainda",
  "Não sei informar",
];

const employeeOptions = [
  "Não tem funcionários",
  "1 a 3 funcionários",
  "4 a 10 funcionários",
  "Mais de 10 funcionários",
  "Pretende contratar",
];

const accountingNeedOptions = [
  "Quero iniciar contabilidade mensal",
  "Preciso organizar impostos e obrigações",
  "Preciso emitir nota e manter CNPJ em dia",
  "Quero entender melhor caixa, lucro e retirada",
  "Tenho pendências e preciso regularizar",
  "Outro ponto",
];

function formatBrazilPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const toolGroups = [
  {
    title: "CNPJ, Receita Federal e abertura de empresa",
    text: "Atalhos para consulta cadastral, regularidade federal e processos ligados ao CNPJ.",
    links: [
      {
        title: "Consulta CNPJ",
        text: "Comprovante de inscrição e situação cadastral.",
        href: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp",
      },
      {
        title: "e-CAC",
        text: "Acesso a pendências, procurações, situação fiscal e serviços da Receita.",
        href: "https://cav.receita.fazenda.gov.br/autenticacao/login",
      },
      {
        title: "Certidão federal",
        text: "Emissão e consulta de regularidade fiscal na Receita Federal/PGFN.",
        href: "https://www.gov.br/receitafederal/pt-br/servicos/certidoes/emitir-certidao",
      },
    ],
  },
  {
    title: "Simples Nacional e MEI",
    text: "Consultas e serviços usados na rotina de empresas optantes pelo Simples e MEIs.",
    links: [
      {
        title: "Portal do Simples Nacional",
        text: "Página principal com serviços públicos, manuais, notícias e agenda.",
        href: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
      },
      {
        title: "Consulta optantes",
        text: "Consulta se a empresa está no Simples Nacional ou no SIMEI.",
        href: "https://www8.receita.fazenda.gov.br/SimplesNacional/aplicacoes.aspx?id=21",
      },
      {
        title: "PGMEI",
        text: "Geração do DAS mensal do MEI.",
        href: "https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao",
      },
      {
        title: "DASN-SIMEI",
        text: "Declaração anual do MEI.",
        href: "https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/dasnsimei.app/Identificacao",
      },
      {
        title: "Portal do Empreendedor",
        text: "Serviços e orientações oficiais para MEI.",
        href: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
      },
    ],
  },
  {
    title: "Fiscal, notas e atendimento no Pará",
    text: "Links úteis para emissão, consulta e rotina fiscal estadual ou municipal.",
    links: [
      {
        title: "SEFA Pará",
        text: "Serviços da Secretaria de Estado da Fazenda do Pará.",
        href: "https://www.sefa.pa.gov.br/",
      },
      {
        title: "Prefeitura de Santarém",
        text: "Portal de serviços, tributos municipais e nota fiscal.",
        href: "https://santarem.pa.gov.br/",
      },
      {
        title: "ISS Santarém",
        text: "Portal municipal de gestão de ISS e nota fiscal de serviço.",
        href: "https://siapsistemas.com.br/santarempgiss/servlet/mainsantarem",
      },
      {
        title: "Emissor Nacional NFS-e",
        text: "Acesso ao ambiente nacional de nota fiscal de serviço.",
        href: "https://www.nfse.gov.br/EmissorNacional/",
      },
    ],
  },
  {
    title: "Folha, trabalhista e obrigações com funcionários",
    text: "Atalhos para rotinas que aparecem quando a empresa tem empregado ou pretende contratar.",
    links: [
      {
        title: "eSocial",
        text: "Portal oficial para eventos trabalhistas, previdenciários e fiscais.",
        href: "https://www.gov.br/esocial/pt-br",
      },
      {
        title: "FGTS Digital",
        text: "Portal oficial para recolhimento e gestão do FGTS.",
        href: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital",
      },
    ],
  },
];

type BlogSection = {
  heading: string;
  body?: string;
  paragraphs?: string[];
  bullets?: string[];
};

type BlogSource = {
  title: string;
  href: string;
};

type BlogPost = {
  slug: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: BlogSection[];
  checklist: string[];
  sources?: BlogSource[];
};

const blogPosts: BlogPost[] = [
  {
    slug: "mapa-economia-tributaria",
    category: "Economia tributária",
    readTime: "7 min",
    title: "Existem formas legais de pagar menos imposto. O problema é saber onde procurar.",
    excerpt:
      "Um mapa direto de oportunidades fiscais que dependem de enquadramento, documentação e apuração bem feita.",
    intro:
      "Quando se fala em economia tributária, muita gente pensa em jeitinho. Mas a economia mais forte costuma estar no lugar mais simples: na própria legislação.",
    sections: [
      {
        heading: "Não existe regra única para todo CNPJ",
        body:
          "O que existe é um mapa de oportunidades. Cada empresa precisa ser testada contra faturamento, regime tributário, CNAE, notas fiscais, mercadorias, município, inscrição estadual e forma de apuração.",
      },
      {
        heading: "ICMS no DAS para comércio pequeno no Pará",
        paragraphs: [
          "Essa é uma das oportunidades mais interessantes para empresas pequenas do Simples Nacional no Pará. O RICMS/PA prevê isenção da parcela mensal do ICMS dentro do Simples para contribuintes com volume de negócios de até R$ 120.000,00 nos últimos 12 meses.",
          "O detalhe importante é que o benefício não elimina todo o DAS. Ele atinge a parcela estadual do ICMS. Mesmo assim, para uma empresa comercial pequena, essa parcela pode representar economia real no mês.",
        ],
      },
      {
        heading: "Regimes diferenciados de ICMS no Pará",
        paragraphs: [
          "A SEFA/PA possui Regimes Tributários Diferenciados, conhecidos como RTD. Eles não são automáticos: a empresa precisa atender requisitos, pedir concessão ou renovação e manter regularidade fiscal.",
          "A própria SEFA/PA lista regimes para transporte rodoviário de cargas, transporte autônomo, palmito, couro wet blue, produtos farmacêuticos, medicamentos e produtos de informática.",
        ],
      },
      {
        heading: "Fator R no Simples Nacional",
        body:
          "Para algumas atividades de serviço, a folha de pagamento pode mudar o anexo de tributação no Simples Nacional. O ponto central é conferir pró-labore, salários, encargos, receita bruta e anexo correto.",
      },
      {
        heading: "Lucro Presumido: transporte de cargas não é serviço comum",
        body:
          "No Lucro Presumido, uma diferença pequena no enquadramento muda muito imposto. Transporte de cargas, por exemplo, não deve ser tratado como serviço genérico de 32% para todas as bases.",
      },
      {
        heading: "Créditos de PIS e COFINS no Lucro Real",
        body:
          "No regime não cumulativo, empresas no Lucro Real podem ter direito a créditos de PIS e COFINS sobre custos e despesas ligados à atividade. Aqui o cuidado precisa ser alto, porque crédito indevido também gera risco.",
      },
      {
        heading: "O imposto certo começa com diagnóstico",
        body:
          "Antes de pedir restituição, alterar apuração ou prometer economia, é preciso testar a empresa contra as regras. O diagnóstico começa pelos documentos e pela operação real.",
      },
    ],
    checklist: [
      "Notas fiscais dos últimos 12 meses",
      "DAS e extratos do PGDAS-D",
      "EFD, entradas e saídas",
      "CNAEs e regime tributário",
      "Situação fiscal e cadastral",
      "Produtos, NCMs e tipo de operação",
    ],
    sources: [
      {
        title: "Decreto PA nº 1.773/2017 - SEFA/PA",
        href: "https://antigo.sefa.pa.gov.br/legislacao/interna/decreto/dc2017_01773.pdf",
      },
      {
        title: "SEFA/PA - Regimes Tributários Diferenciados do ICMS",
        href: "https://antigo.sefa.pa.gov.br/38-orientacoes/12163-ii-regimes-tributarios-diferenciados-rtd-do-icms",
      },
      {
        title: "Lei Complementar nº 123/2006 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
      },
      {
        title: "Solução de Consulta Cosit nº 232/2024 - Receita Federal",
        href: "https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=75134",
      },
      {
        title: "Lei nº 10.833/2003 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.833.htm",
      },
    ],
  },
  {
    slug: "icms-simples-para",
    category: "ICMS Pará",
    readTime: "5 min",
    title: "Empresas de comércio podem estar pagando ICMS a mais no DAS",
    excerpt:
      "No Pará, existe uma regra estadual que pode zerar a parcela do ICMS no DAS para empresas do Simples com baixo volume de negócios.",
    intro:
      "Muita empresa pequena paga o DAS todo mês sem separar o que é imposto federal, municipal e estadual. Dentro do DAS também pode existir parcela de ICMS.",
    sections: [
      {
        heading: "Qual é a regra?",
        paragraphs: [
          "O RICMS/PA prevê isenção da parcela mensal do ICMS apurada dentro do Simples Nacional para contribuintes que tenham volume de negócios de até R$ 120.000,00 nos últimos 12 meses, incluindo o próprio mês de apuração.",
          "Na prática, isso pode atingir empresas de comércio que vendem mercadorias, emitem nota fiscal, são optantes pelo Simples Nacional e ainda estão dentro desse limite de movimento.",
        ],
      },
      {
        heading: "Não é isenção de todos os impostos",
        body:
          "É uma possível dispensa da parcela do ICMS que estaria dentro do DAS. Impostos federais, ISS, ICMS-ST, antecipação, diferencial de alíquota e outras cobranças podem continuar existindo conforme o caso.",
      },
      {
        heading: "Por que aparece a ideia de economizar até 34%?",
        body:
          "Em empresas comerciais no Simples Nacional, o DAS é dividido entre tributos. Uma parte pode ser destinada ao ICMS. Em determinadas faixas e atividades de comércio, essa fatia estadual pode representar parcela relevante do DAS.",
      },
      {
        heading: "Quem precisa olhar isso com atenção?",
        bullets: [
          "Comércios pequenos que vendem mercadorias no Pará e estão no Simples Nacional.",
          "Negócios com volume próximo ou abaixo de R$ 120 mil nos últimos 12 meses.",
          "Empresas que pagam DAS todo mês, mas nunca revisaram a composição do imposto.",
          "Empresas que emitem nota corretamente e conseguem comprovar receitas e entradas.",
        ],
      },
      {
        heading: "Quando a regra pode não servir?",
        bullets: [
          "Operações com ICMS-ST, antecipação, diferencial de alíquota ou importação.",
          "Empresas que usam regime de caixa, quando a própria norma excluir essa hipótese.",
          "Empresas com entradas maiores que as receitas, pois a regra manda observar também o volume de entradas em certas situações.",
          "Atividades que não tenham ICMS como tributo principal, como serviços sujeitos apenas ao ISS.",
          "Empresas com situação fiscal, cadastral ou documental inconsistente.",
        ],
      },
      {
        heading: "Resumo técnico",
        body:
          "A regra está no RICMS/PA, Anexo I, art. 230-E, inserido pelo Decreto Estadual nº 1.773/2017. A aplicação depende de documentos, atividade, regime, volume de negócios e tipo de operação.",
      },
    ],
    checklist: [
      "DAS e extratos do PGDAS-D dos últimos 12 meses",
      "Notas fiscais de saída e faturamento mensal",
      "Notas fiscais de entrada",
      "CNAEs, atividades e regime da empresa",
      "ICMS-ST, antecipação, DIFAL ou cobrança fora do DAS",
      "Situação cadastral e fiscal na SEFA/PA",
    ],
    sources: [
      {
        title: "Decreto PA nº 1.773/2017 - SEFA/PA",
        href: "https://antigo.sefa.pa.gov.br/legislacao/interna/decreto/dc2017_01773.pdf",
      },
      {
        title: "Lei Complementar nº 123/2006 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
      },
      {
        title: "PGFN - Do Simples Nacional",
        href: "https://www.gov.br/pgfn/pt-br/servicos/orgaos-publicos-e-parceiros/convenio-simples-nacional/do-simples-nacional",
      },
    ],
  },
  {
    slug: "fator-r-simples-nacional",
    category: "Simples Nacional",
    readTime: "6 min",
    title: "Empresas de serviço podem pagar mais DAS por não olhar o Fator R",
    excerpt:
      "Uma regra do Simples pode mudar a empresa do Anexo V para o Anexo III, quando a folha e a atividade permitem.",
    intro:
      "Muita empresa de serviço paga o DAS como se estivesse presa ao Anexo V. Só que, dependendo da folha de pagamento, ela pode ser tributada pelo Anexo III.",
    sections: [
      {
        heading: "O que é o Fator R?",
        paragraphs: [
          "O Fator R é uma comparação entre a folha de salários e a receita bruta da empresa nos últimos 12 meses. Ele serve para definir se determinadas atividades de serviço serão tributadas pelo Anexo III ou pelo Anexo V do Simples Nacional.",
          "Regra prática: se o Fator R for igual ou superior a 28%, a empresa pode ser tributada pelo Anexo III. Se for inferior a 28%, tende a ficar no Anexo V.",
        ],
      },
      {
        heading: "Por que isso dá economia?",
        body:
          "A primeira faixa do Anexo III começa em 6%, enquanto a primeira faixa do Anexo V começa em 15,5%. O cálculo efetivo depende da receita acumulada e da parcela a deduzir, mas a diferença entre os anexos pode ser grande.",
      },
      {
        heading: "Exemplo simples",
        body:
          "Uma empresa de serviço com receita acumulada de R$ 180.000,00 nos últimos 12 meses e folha de R$ 54.000,00 teria Fator R de 30%. Se a atividade estiver sujeita ao Fator R, ela pode sair do Anexo V e ser tributada pelo Anexo III.",
      },
      {
        heading: "Quem costuma precisar dessa análise?",
        bullets: [
          "Clínicas, saúde, medicina, odontologia, psicologia, fisioterapia e terapias.",
          "Consultorias, administração, gestão, organização e controle.",
          "Tecnologia, desenvolvimento, banco de dados e suporte.",
          "Engenharia, arquitetura, perícia, avaliação e serviços especializados.",
        ],
      },
      {
        heading: "O que entra na conta?",
        body:
          "A análise usa os últimos 12 meses. Em regra, entram valores como folha de salários, pró-labore, contribuição patronal previdenciária e FGTS, conforme a regra aplicável ao Simples Nacional.",
      },
      {
        heading: "Quando não adianta?",
        bullets: [
          "Quando a atividade não é sujeita ao Fator R e já tem anexo definido por outra regra.",
          "Quando a folha dos últimos 12 meses não chega a 28% da receita bruta.",
          "Quando a empresa informa pró-labore, folha ou receita de forma inconsistente.",
          "Quando há mistura de atividades e as receitas não são separadas corretamente no PGDAS-D.",
          "Quando o planejamento tenta criar folha artificial, sem lastro real, apenas para reduzir imposto.",
        ],
      },
    ],
    checklist: [
      "Extratos do PGDAS-D dos últimos 12 meses",
      "Folha de pagamento e pró-labore",
      "Guias de INSS e FGTS",
      "CNAE e objeto social",
      "Notas fiscais de serviço",
      "Separação de receitas por atividade",
    ],
    sources: [
      {
        title: "Lei Complementar nº 123/2006 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
      },
      {
        title: "Lei Complementar nº 155/2016 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp155.htm",
      },
      {
        title: "Portal do Simples Nacional - regra dos 28%",
        href: "https://www8.receita.fazenda.gov.br/simplesnacional/noticias/NoticiaCompleta.aspx?id=415ad600-7d43-4e55-971b-55df99e95ef3",
      },
      {
        title: "Manual do PGDAS-D e DEFIS",
        href: "https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/manual_pgdas-d_2018_v4.pdf",
      },
    ],
  },
  {
    slug: "clinica-estetica-economia-tributaria",
    category: "Clínicas",
    readTime: "7 min",
    title: "Clínica de estética pode pagar imposto a mais por estar no enquadramento errado",
    excerpt:
      "A economia pode aparecer no anexo correto, na separação entre serviço e produto e na revisão de mercadorias monofásicas.",
    intro:
      "Tem oportunidade tributária para clínica de estética, sim. Mas o segredo é separar bem o que a empresa faz: estética e beleza pura, procedimento de saúde, venda de cosméticos ou uma mistura de tudo isso.",
    sections: [
      {
        heading: "Estética e beleza pura pode ser Anexo III",
        paragraphs: [
          "A Receita Federal já se manifestou no sentido de que empresa optante pelo Simples Nacional cuja única atividade seja prestação de serviços de estética e cuidados com a beleza deve tributar essas receitas pelo Anexo III da LC nº 123/2006.",
          "Isso é importante porque o Anexo III começa em 6%. Então, se a clínica está pagando como se fosse Anexo V sem necessidade, pode haver imposto maior do que o devido.",
        ],
      },
      {
        heading: "Procedimento de saúde pode mudar a conversa",
        body:
          "Nem toda clínica que se chama estética é tributada igual. Se ela faz procedimentos de saúde, atua com profissional habilitado ou exerce atividades técnicas, pode entrar em discussão de Anexo V com aplicação do Fator R.",
      },
      {
        heading: "Venda de cosméticos precisa ser separada do serviço",
        body:
          "Muitas clínicas vendem produtos depois do procedimento. Quando existe venda de mercadoria, a receita precisa ser segregada no Simples Nacional. Alguns produtos de perfumaria, toucador, higiene pessoal e cosméticos podem estar sujeitos à tributação monofásica de PIS/COFINS.",
      },
      {
        heading: "ISS é municipal, mas também precisa estar certo",
        body:
          "Serviços de estética e cuidados pessoais estão no campo do ISS, conforme a lista de serviços da LC nº 116/2003. No Simples Nacional, normalmente o ISS entra dentro do DAS, mas a regra municipal ainda importa para cadastro, nota fiscal, retenção e local de incidência.",
      },
      {
        heading: "Onde pode estar a economia?",
        bullets: [
          "Anexo III direto para estética e beleza pura, quando a atividade real permite.",
          "Fator R para atividades técnicas ou de saúde, quando a folha alcança o percentual necessário.",
          "Segregação de receitas de venda de produtos.",
          "Revisão de produtos monofásicos de PIS/COFINS.",
          "Correção de ISS retido ou informado de forma errada.",
        ],
      },
    ],
    checklist: [
      "Extratos do PGDAS-D dos últimos 12 meses",
      "Notas fiscais de serviço e de venda de produtos",
      "CNAEs, contrato social e alvará ou licença sanitária",
      "Folha, pró-labore, INSS e FGTS dos últimos 12 meses",
      "Relatório de produtos vendidos com NCM",
      "Comprovantes de ISS retido, quando existir",
    ],
    sources: [
      {
        title: "Receita Federal - consulta de normas",
        href: "https://normas.receita.fazenda.gov.br/sijut2consulta/consulta.action?termoBusca=LC+123%2F2006&tipoData=2",
      },
      {
        title: "Lei Complementar nº 123/2006 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
      },
      {
        title: "Lei Complementar nº 116/2003 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm",
      },
      {
        title: "Lei nº 10.147/2000 - Planalto",
        href: "https://www.planalto.gov.br/ccivil_03/leis/l10147.htm",
      },
      {
        title: "Solução de Consulta Cosit nº 225/2017 - Receita Federal",
        href: "https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=43866",
      },
    ],
  },
  {
    slug: "cnpj-regular",
    category: "Regularidade",
    readTime: "3 min",
    title: "CNPJ regular: o que acompanhar antes de virar problema",
    excerpt:
      "Situação cadastral, certidões, débitos e declarações precisam ser vistos como rotina, não só quando a empresa precisa resolver algo urgente.",
    intro:
      "Ter CNPJ aberto não significa que a empresa está regular. A regularidade depende de cadastro, obrigações, impostos, declarações e documentos andando juntos.",
    sections: [
      {
        heading: "O que olhar primeiro",
        body: "A consulta começa pela situação cadastral do CNPJ, mas não para ali. Também é importante verificar certidões, pendências fiscais, declarações em atraso e débitos que possam impedir a empresa de emitir documentos, contratar ou comprovar regularidade.",
      },
      {
        heading: "Por que isso importa",
        body: "Quando a empresa só olha essa parte no susto, normalmente descobre o problema tarde: certidão travada, declaração pendente, guia esquecida ou cadastro desatualizado. A rotina contábil serve justamente para reduzir esse improviso.",
      },
    ],
    checklist: [
      "Consultar situação cadastral do CNPJ",
      "Verificar certidões e pendências",
      "Conferir declarações em atraso",
      "Separar documentos básicos da empresa",
    ],
  },
  {
    slug: "trocar-de-contador",
    category: "Rotina contábil",
    readTime: "3 min",
    title: "Quando faz sentido trocar de contador",
    excerpt:
      "Trocar de contador não é só trocar quem gera guia. A empresa precisa entender documentos, acessos, pendências e rotina antes da migração.",
    intro:
      "A troca de contador faz sentido quando a empresa sente que perdeu clareza sobre impostos, obrigações, documentos ou atendimento. Antes de mudar, é preciso organizar a transição.",
    sections: [
      {
        heading: "O que precisa ser conferido",
        body: "A migração deve levantar acessos, documentos enviados, declarações entregues, impostos apurados, pendências abertas e situação do CNPJ. Sem isso, a empresa troca de escritório carregando a bagunça junto.",
      },
      {
        heading: "O objetivo da troca",
        body: "A troca precisa melhorar a rotina: resposta mais clara, documentos mais organizados, obrigações acompanhadas e informação suficiente para o empresário decidir sem ficar no escuro.",
      },
    ],
    checklist: [
      "Listar acessos e procurações",
      "Conferir impostos e declarações",
      "Verificar pendências do CNPJ",
      "Organizar documentos antes da migração",
    ],
  },
  {
    slug: "abrir-empresa",
    category: "Abertura",
    readTime: "3 min",
    title: "Antes de abrir empresa, ajuste estas decisões",
    excerpt:
      "Abertura de CNPJ envolve atividade, regime, endereço, sócios e forma de operação. Começar errado pode gerar ajuste depois.",
    intro:
      "Abrir empresa parece simples, mas algumas decisões tomadas no início influenciam impostos, notas fiscais, obrigações e rotina operacional.",
    sections: [
      {
        heading: "Decisões que vêm antes do CNPJ",
        body: "É preciso entender o que a empresa vai vender, como vai receber, onde vai operar, se terá sócios, se terá funcionários e qual será a rotina de notas. Essas respostas ajudam a definir caminho cadastral e tributário.",
      },
      {
        heading: "O que evitar",
        body: "O erro comum é abrir o CNPJ olhando apenas para rapidez. Depois aparecem atividade mal escolhida, endereço inadequado, regime que não conversa com a operação ou falta de preparo para emitir nota.",
      },
    ],
    checklist: [
      "Definir atividade principal",
      "Entender faturamento esperado",
      "Verificar necessidade de nota fiscal",
      "Organizar documentos dos sócios",
    ],
  },
  {
    slug: "financeiro-organizado",
    category: "Financeiro",
    readTime: "4 min",
    title: "Financeiro organizado começa separando empresa e pessoa física",
    excerpt:
      "Misturar conta da empresa com conta pessoal dificulta caixa, lucro, retirada e comprovação de renda.",
    intro:
      "Uma empresa pode vender bem e ainda assim não saber se está dando lucro. Isso acontece muito quando dinheiro da pessoa física e da empresa se mistura sem controle.",
    sections: [
      {
        heading: "O problema da mistura",
        body: "Quando tudo passa pela mesma conta, fica difícil saber o que é venda, despesa, retirada, investimento, empréstimo ou pagamento pessoal. A contabilidade perde qualidade e o empresário perde leitura do resultado.",
      },
      {
        heading: "O básico que resolve muita coisa",
        body: "Separar contas, registrar entradas e saídas, definir retirada dos sócios e acompanhar caixa já muda a conversa. A empresa passa a ter número para decidir, não só saldo no banco.",
      },
    ],
    checklist: [
      "Separar conta pessoal e conta da empresa",
      "Registrar entradas e saídas",
      "Definir retirada dos sócios",
      "Acompanhar caixa com frequência",
    ],
  },
  {
    slug: "nota-fiscal-imposto",
    category: "Fiscal",
    readTime: "3 min",
    title: "Emitir nota fiscal não é só apertar um botão",
    excerpt:
      "Antes de emitir nota, a empresa precisa entender atividade, tributação, município, estado e dados do serviço ou produto.",
    intro:
      "A nota fiscal faz parte da rotina, mas ela não anda sozinha. Cada emissão conversa com cadastro, impostos e obrigações da empresa.",
    sections: [
      {
        heading: "O que precisa estar alinhado",
        body: "A empresa precisa conferir atividade, enquadramento, dados do cliente, descrição, município ou estado envolvido e tipo de operação. Uma nota emitida de qualquer jeito pode criar inconsistência depois.",
      },
      {
        heading: "Onde a contabilidade entra",
        body: "A contabilidade ajuda a manter a emissão coerente com a operação e com a apuração dos impostos. Não é para complicar, é para evitar que a rotina fiscal fique solta.",
      },
    ],
    checklist: [
      "Conferir cadastro da empresa",
      "Entender serviço ou produto vendido",
      "Guardar notas e comprovantes",
      "Acompanhar impostos gerados pela rotina",
    ],
  },
  {
    slug: "mei-simples-nacional",
    category: "MEI e Simples",
    readTime: "3 min",
    title: "MEI e Simples Nacional: cuidado com o básico",
    excerpt:
      "Mesmo regimes mais simples exigem rotina. DAS, declaração, faturamento e atividade precisam ser acompanhados.",
    intro:
      "MEI e Simples Nacional facilitam a vida de muitas empresas, mas facilidade não significa ausência de obrigação. O básico precisa estar em dia.",
    sections: [
      {
        heading: "O que acompanhar",
        body: "É importante olhar pagamentos, declaração anual, faturamento, atividade exercida, emissão de notas e eventuais pendências. Se a empresa cresce ou muda de operação, o enquadramento também precisa ser revisto.",
      },
      {
        heading: "Quando pedir ajuda",
        body: "Quando o empresário não sabe se está pagando certo, se pode emitir nota, se passou do limite ou se tem declaração pendente, é melhor conferir antes de deixar acumular.",
      },
    ],
    checklist: [
      "Acompanhar pagamento mensal",
      "Conferir faturamento",
      "Entregar declarações necessárias",
      "Revisar atividade e enquadramento",
    ],
  },
];

const heroHighlights = [
  "CNPJ em dia",
  "Impostos apurados",
  "Suporte contábil e fiscal",
];

const solutionCards = [
  {
    title: "Abrir ou regularizar CNPJ",
    text: "Para quem precisa abrir empresa, alterar dados cadastrais, resolver pendências ou colocar um CNPJ antigo em funcionamento.",
    services:
      "Abertura de empresa, alterações contratuais, regularização e enquadramento tributário.",
    tags: ["Regularização", "CNPJ"],
  },
  {
    title: "Manter a contabilidade em dia",
    text: "Para empresas que precisam emitir notas, calcular impostos, cumprir obrigações mensais e manter a documentação organizada.",
    services:
      "Contabilidade mensal, apuração de impostos, obrigações fiscais e suporte contábil.",
    tags: ["Rotina", "Fiscal"],
  },
  {
    title: "Entender melhor os impostos",
    text: "Para empresas que querem revisar tributação, reduzir riscos e identificar se estão pagando impostos corretamente.",
    services:
      "Planejamento tributário, revisão fiscal, recuperação tributária e análise de regime.",
    tags: ["Tributário", "Análise"],
  },
  {
    title: "Organizar retirada dos sócios e comprovação de renda",
    text: "Para empresários que precisam estruturar pró-labore, distribuição de lucros e documentos que ajudem a comprovar renda de forma correta.",
    services:
      "Pró-labore, distribuição de lucros, escrituração contábil e relatórios.",
    tags: ["Renda", "Sócios"],
  },
  {
    title: "Revisar produtos e operação fiscal",
    text: "Para comércios e empresas que vendem produtos e precisam avaliar NCM, CST, CSOSN, monofásicos, substituição tributária e benefícios fiscais.",
    services: "Classificação fiscal, análise de produtos e revisão tributária.",
    tags: ["Produtos", "Fiscal"],
  },
  {
    title: "Melhorar organização financeira",
    text: "Para empresas que já vendem, mas precisam entender melhor caixa, despesas, lucro e resultado.",
    services:
      "DRE gerencial, classificação financeira, leitura de resultados e apoio na formação de preços.",
    tags: ["Financeiro", "Gestão"],
  },
];

const serviceBlocks = [
  {
    title: "Rotina contábil",
    text: "Para manter a operação fiscal e contábil funcionando sem deixar prazos e documentos soltos.",
    items: [
      "Contabilidade mensal",
      "Apuração de impostos",
      "Obrigações fiscais",
      "Emissão e orientação sobre notas",
      "Pró-labore e distribuição de lucros",
      "Relatórios contábeis",
    ],
  },
  {
    title: "CNPJ e regularização",
    text: "Para abrir, ajustar, migrar ou recuperar a situação cadastral e fiscal da empresa.",
    items: [
      "Abertura de empresa",
      "Alteração contratual",
      "Troca de contador",
      "Regularização de CNPJ",
      "Declarações em atraso",
      "Parcelamentos e pendências",
    ],
  },
  {
    title: "Análises especializadas",
    text: "Para empresas que precisam olhar tributação, produtos, números e rotina financeira com mais profundidade.",
    items: [
      "Planejamento tributário",
      "Recuperação tributária",
      "Classificação fiscal de produtos",
      "Revisão de NCM, CST e CSOSN",
      "Produtos monofásicos e substituição tributária",
      "DRE gerencial e apoio financeiro",
    ],
  },
];

const trackingLevels = [
  {
    level: "Nível 1",
    title: "Essencial",
    text: "Para manter o CNPJ em dia, calcular impostos, cumprir obrigações e emitir notas com segurança.",
  },
  {
    level: "Nível 2",
    title: "Organização",
    text: "Para empresas que precisam, além da contabilidade, organizar documentos, retirada dos sócios, relatórios e rotina financeira.",
  },
  {
    level: "Nível 3",
    title: "Análise",
    text: "Para empresas que precisam revisar tributação, produtos, margens, formação de preço, DRE e oportunidades fiscais.",
  },
];

const steps = [
  {
    title: "Entendemos sua necessidade",
    text: "Você explica se precisa abrir, regularizar, trocar de contador ou organizar a empresa.",
  },
  {
    title: "Analisamos a situação",
    text: "Verificamos regime tributário, faturamento, obrigações, pendências e rotina atual.",
  },
  {
    title: "Definimos o melhor formato",
    text: "A proposta considera o tamanho da empresa, volume de movimentação e nível de acompanhamento necessário.",
  },
  {
    title: "Começamos a organização",
    text: "Alinhamos acessos, documentos, prazos, obrigações e canais de atendimento.",
  },
];

const audienceItems = [
  "Empresas que precisam manter a contabilidade em dia",
  "Comércios e prestadores de serviços",
  "Profissionais com CNPJ que precisam organizar renda e documentos",
  "Empresas que cresceram e não querem continuar operando no improviso",
  "CNPJs com pendências, declarações atrasadas ou risco de irregularidade",
  "Negócios que vendem produtos e precisam revisar a tributação",
  "Empresários que querem entender melhor imposto, caixa, lucro e retirada dos sócios",
];

function ParaFlag() {
  return (
    <svg
      className="para-flag"
      role="img"
      aria-label="Bandeira do Pará"
      viewBox="0 0 48 32"
    >
      <title>Bandeira do Pará</title>
      <rect width="48" height="32" fill="#c8102e" />
      <polygon points="-8 0 4 0 56 32 44 32" fill="#ffffff" />
      <polygon
        className="para-flag__star"
        points="24 11.5 25.3 14.2 28.2 14.6 26.1 16.7 26.6 19.6 24 18.2 21.4 19.6 21.9 16.7 19.8 14.6 22.7 14.2"
      />
    </svg>
  );
}

function BrazilFlag() {
  return (
    <svg
      className="brazil-flag"
      role="img"
      aria-label="Bandeira do Brasil"
      viewBox="0 0 48 32"
    >
      <title>Bandeira do Brasil</title>
      <rect width="48" height="32" fill="#009b3a" />
      <polygon points="24 4 43 16 24 28 5 16" fill="#ffdf00" />
      <circle cx="24" cy="16" r="6.6" fill="#002776" />
      <path
        d="M17.8 14.4c4.2-1 8.4-.7 12.5 1"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LinkIcon({ kind }: { kind: LinkKind }) {
  if (kind === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
        <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.8" cy="7.2" r="0.8" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  }

  if (kind === "site") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path d="M4.5 12h15" />
        <path d="M12 4c2.1 2.2 3.2 4.8 3.2 8S14.1 17.8 12 20" />
        <path d="M12 4c-2.1 2.2-3.2 4.8-3.2 8S9.9 17.8 12 20" />
      </svg>
    );
  }

  if (kind === "switch") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 7h9" />
        <path d="m13 4 3 3-3 3" />
        <path d="M17 17H8" />
        <path d="m11 14-3 3 3 3" />
      </svg>
    );
  }

  if (kind === "company") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 20V5.8A1.8 1.8 0 0 1 7.8 4h8.4A1.8 1.8 0 0 1 18 5.8V20" />
        <path d="M4 20h16" />
        <path d="M9 8h1.5" />
        <path d="M13.5 8H15" />
        <path d="M9 12h1.5" />
        <path d="M13.5 12H15" />
        <path d="M10 20v-4h4v4" />
      </svg>
    );
  }

  if (kind === "accounting") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="6" y="3.5" width="12" height="17" rx="2" />
        <path d="M9 7.5h6" />
        <path d="M9 11h.1" />
        <path d="M12 11h.1" />
        <path d="M15 11h.1" />
        <path d="M9 14.5h.1" />
        <path d="M12 14.5h.1" />
        <path d="M15 14.5h.1" />
        <path d="M9 18h6" />
      </svg>
    );
  }

  if (kind === "tax") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 19h14" />
        <path d="M7 16.5v-4" />
        <path d="M12 16.5v-8" />
        <path d="M17 16.5v-6" />
        <path d="M6.5 8.5 10 5l3 3 4.5-4" />
        <path d="M16 4h1.5v1.5" />
      </svg>
    );
  }

  if (kind === "advisor") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M4 19a4.5 4.5 0 0 1 9 0" />
        <path d="M15 7.5h4" />
        <path d="M15 11.5h4" />
        <path d="M15 15.5h3" />
      </svg>
    );
  }

  if (kind === "address") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }

  if (kind === "correspondent") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 15.5 9.5 19l8-8" />
        <path d="M4 11.5 7.5 15" />
        <path d="M12 15.5 20 7.5" />
        <path d="M15 7.5h5v5" />
      </svg>
    );
  }

  if (kind === "tools") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 5.5h14" />
        <path d="M5 10.5h14" />
        <path d="M5 15.5h8" />
        <path d="M17 14.5v5" />
        <path d="M14.5 17h5" />
        <path d="M8 19h4" />
      </svg>
    );
  }

  if (kind === "blog") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 4.5h9.5L18 7v12.5H6Z" />
        <path d="M15 4.5V8h3" />
        <path d="M9 10h6" />
        <path d="M9 13.5h6" />
        <path d="M9 17h4" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 5h6v6H5Z" />
      <path d="M13 5h6v6h-6Z" />
      <path d="M5 13h6v6H5Z" />
      <path d="M13 13h6v6h-6Z" />
    </svg>
  );
}

function BlogPage({ slug }: { slug?: string }) {
  const post = slug
    ? blogPosts.find((item) => item.slug === slug)
    : undefined;
  const relatedPosts = post
    ? blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
    : blogPosts;

  useEffect(() => {
    document.title = post
      ? `${post.title} | Blog Nacional Contabilidade`
      : "Blog | Nacional Contabilidade";
  }, [post]);

  if (slug && !post) {
    return (
      <main className="blog-page">
        <section className="blog-shell" aria-labelledby="blog-not-found-title">
          <a className="lead-logo" href="/links" aria-label="Voltar para os links da Nacional">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>
          <div className="blog-hero">
            <p className="lead-kicker">Blog</p>
            <h1 id="blog-not-found-title">Conteúdo não encontrado.</h1>
            <p>
              Esse artigo não está disponível. Volte para o blog e escolha outro
              conteúdo.
            </p>
          </div>
          <a className="button button--inline" href="/blog">
            Ver blog
          </a>
        </section>
      </main>
    );
  }

  if (post) {
    return (
      <main className="blog-page">
        <article className="blog-shell blog-article" aria-labelledby="blog-post-title">
          <a className="lead-logo" href="/blog" aria-label="Voltar para o blog da Nacional">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <header className="blog-hero">
            <p className="lead-kicker">{post.category}</p>
            <h1 id="blog-post-title">{post.title}</h1>
            <p>{post.intro}</p>
            <div className="blog-meta">
              <span>{post.readTime} de leitura</span>
              <span>Conteúdo da Nacional Contabilidade</span>
            </div>
          </header>

          <div className="blog-content">
            {post.sections.map((section) => (
              <section className="blog-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body ? <p>{section.body}</p> : null}
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={`${section.heading}-paragraph-${index}`}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="blog-bullets">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="blog-checklist" aria-labelledby="blog-checklist-title">
              <h2 id="blog-checklist-title">Checklist rápido</h2>
              <CheckList items={post.checklist} />
            </section>

            {post.sources ? (
              <section className="blog-sources" aria-labelledby="blog-sources-title">
                <h2 id="blog-sources-title">Fontes oficiais</h2>
                <ul>
                  {post.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <p>
                  Conteúdo informativo. A aplicação depende da análise
                  individual da empresa, documentos fiscais e enquadramento.
                </p>
              </section>
            ) : null}

            <div className="blog-cta">
              <h2>Quer olhar isso na sua empresa?</h2>
              <p>
                Explique a situação no WhatsApp. A Nacional entende o contexto
                e indica o melhor caminho para organizar essa parte.
              </p>
              <a
                className="button"
                href={buildWhatsappUrl(
                  `Olá, vim pelo blog da Nacional e quero falar sobre: ${post.title}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Falar com a Nacional
              </a>
            </div>
          </div>

          <aside className="blog-related" aria-labelledby="blog-related-title">
            <h2 id="blog-related-title">Outros conteúdos</h2>
            <div className="blog-grid blog-grid--compact">
              {relatedPosts.map((item) => (
                <a className="blog-card" href={`/blog/${item.slug}`} key={item.slug}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <small>{item.excerpt}</small>
                </a>
              ))}
            </div>
          </aside>
        </article>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <section className="blog-shell" aria-labelledby="blog-title">
        <a className="lead-logo" href="/links" aria-label="Voltar para os links da Nacional">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
        </a>

        <div className="blog-hero">
          <p className="lead-kicker">Blog</p>
          <h1 id="blog-title">Conteúdos para cuidar melhor da empresa.</h1>
          <p>
            Textos diretos sobre CNPJ, impostos, notas, financeiro e rotina
            contábil. Sem enrolar e sem prometer milagre.
          </p>
        </div>

        <div className="blog-featured">
          <div>
            <span>Leitura principal</span>
            <h2>{blogPosts[0].title}</h2>
            <p>{blogPosts[0].excerpt}</p>
          </div>
          <a className="button button--inline" href={`/blog/${blogPosts[0].slug}`}>
            Ler conteúdo
          </a>
        </div>

        <div className="blog-grid" aria-label="Lista de conteúdos do blog">
          {blogPosts.map((item) => (
            <a className="blog-card" href={`/blog/${item.slug}`} key={item.slug}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <small>{item.excerpt}</small>
              <em>{item.readTime} de leitura</em>
            </a>
          ))}
        </div>

        <div className="blog-cta blog-cta--index">
          <h2>Tem uma dúvida que daria um bom conteúdo?</h2>
          <p>
            Manda no WhatsApp. Se for algo comum na rotina das empresas, pode
            virar pauta do blog e também atendimento para o seu caso.
          </p>
          <a
            className="button"
            href={buildWhatsappUrl(
              "Olá, vim pelo blog da Nacional e quero tirar uma dúvida sobre minha empresa.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Enviar dúvida
          </a>
        </div>
      </section>
    </main>
  );
}

function ToolsPage() {
  useEffect(() => {
    document.title = "Central do empresário | Nacional Contabilidade";
  }, []);

  return (
    <main className="tools-page">
      <section className="tools-shell" aria-labelledby="tools-title">
        <a className="lead-logo" href="/links" aria-label="Voltar para os links da Nacional">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
        </a>

        <div className="tools-hero">
          <p className="lead-kicker">Central do empresário</p>
          <h1 id="tools-title">Atalhos para resolver a rotina da empresa.</h1>
          <p>
            Consultas, certidões, notas, Simples Nacional, MEI e caminhos para
            falar com a Nacional quando precisar organizar essa parte com apoio
            contábil.
          </p>
        </div>

        <div className="tools-note">
          <strong>Atenção simples:</strong>
          <span>
            esses atalhos ajudam na consulta. Se aparecer pendência, débito,
            bloqueio ou dúvida de enquadramento, vale conferir antes de enviar
            qualquer declaração ou pagamento.
          </span>
        </div>

        <div className="tools-groups">
          {toolGroups.map((group, index) => {
            const headingId = `tool-group-${index + 1}`;

            return (
              <section className="tool-group" key={group.title} aria-labelledby={headingId}>
                <div className="tool-group__heading">
                  <h2 id={headingId}>{group.title}</h2>
                  <p>{group.text}</p>
                </div>

                <div className="tool-links">
                  {group.links.map((link) => (
                    <a
                      className="tool-link"
                      href={link.href}
                      key={link.title}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <strong>{link.title}</strong>
                        <small>{link.text}</small>
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M7 17 17 7" />
                        <path d="M9 7h8v8" />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="tools-final">
          <h2>Quer que a gente olhe com você?</h2>
          <p>
            Se a consulta apontou pendência ou se você não sabe qual caminho
            seguir, chame a Nacional e explique a situação da empresa.
          </p>
          <a
            className="button"
            href={buildWhatsappUrl(
              "Olá, vim pela Central do Empresário e preciso de ajuda com a situação da minha empresa.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Falar com a Nacional
          </a>
        </div>
      </section>
    </main>
  );
}

function LinksPage() {
  const whatsappLink = linkTreeItems.find((item) => item.kind === "whatsapp")!;
  const switchLink = linkTreeItems.find((item) => item.kind === "switch")!;
  const featuredLinks = [
    {
      ...linkTreeItems.find((item) => item.kind === "company")!,
      title: "Abrir ou regularizar CNPJ",
    },
    linkTreeItems.find((item) => item.kind === "accounting")!,
    linkTreeItems.find((item) => item.kind === "tax")!,
    linkTreeItems.find((item) => item.kind === "address")!,
  ];
  const moreLinks = [
    linkTreeItems.find((item) => item.kind === "correspondent")!,
    linkTreeItems.find((item) => item.kind === "advisor")!,
    linkTreeItems.find((item) => item.kind === "solutions")!,
  ];
  const resourceLinks = [
    linkTreeItems.find((item) => item.kind === "tools")!,
    linkTreeItems.find((item) => item.kind === "blog")!,
  ];
  const footerLinks = [
    linkTreeItems.find((item) => item.kind === "site")!,
    linkTreeItems.find((item) => item.kind === "instagram")!,
    linkTreeItems.find((item) => item.kind === "email")!,
  ];

  useEffect(() => {
    document.title = "Rodrigo Coelho | Nacional Contabilidade";
  }, []);

  return (
    <main className="links-page">
      <section className="links-shell" aria-label="Links da Nacional Contabilidade">
        <div className="links-arcs" aria-hidden="true" />

        <header className="links-profile">
          <a className="links-logo" href="/" aria-label="Ir para o site da Nacional Contabilidade">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <div className="links-avatar-frame">
            <img
              className="links-avatar"
              src="/rodrigo-coelho.png"
              alt="Rodrigo Coelho"
            />
          </div>
          <p className="links-kicker">Contabilidade estratégica</p>
          <h1>Rodrigo Coelho</h1>
          <p className="links-profile__bio">
            Contabilidade para empresas que querem <strong>crescer com segurança.</strong>
          </p>
          <div className="links-location" aria-label="Atendimento no Pará e em todo o Brasil">
            <LinkIcon kind="address" />
            <span>Pará · Atendimento nacional</span>
          </div>
        </header>

        <nav className="links-primary" aria-label="Atalhos principais">
          {[whatsappLink, switchLink].map((item) => (
            <a
              className={`links-primary__item links-primary__item--${item.kind}`}
              href={item.href}
              key={item.title}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-label={item.ariaLabel}
            >
              <span className="links-primary__icon">
                <LinkIcon kind={item.kind} />
              </span>
              <span className="links-primary__text">
                <strong>{item.title}</strong>
                <small>
                  {item.kind === "whatsapp" ? "Resposta rápida e direta" : "Migração fácil e segura"}
                </small>
              </span>
            </a>
          ))}
        </nav>

        <section className="links-section" aria-labelledby="links-featured-title">
          <div className="links-section__heading">
            <span aria-hidden="true" />
            <h2 id="links-featured-title">Soluções mais procuradas</h2>
            <span aria-hidden="true" />
          </div>

          <div className="links-service-grid">
            {featuredLinks.map((item) => (
              <a
                className="links-service-card"
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span className="links-service-card__icon">
                  <LinkIcon kind={item.kind} />
                </span>
                <strong>{item.title}</strong>
                <span className="links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <section className="links-section" aria-labelledby="links-more-title">
          <div className="links-section__heading">
            <span aria-hidden="true" />
            <h2 id="links-more-title">Mais soluções</h2>
            <span aria-hidden="true" />
          </div>

          <div className="links-compact-list">
            {moreLinks.map((item) => (
              <a
                className="links-compact-card"
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span className="links-compact-card__icon">
                  <LinkIcon kind={item.kind} />
                </span>
                <span className="links-compact-card__text">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
                <span className="links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <section className="links-section" aria-labelledby="links-resources-title">
          <div className="links-section__heading">
            <span aria-hidden="true" />
            <h2 id="links-resources-title">Conteúdos e ferramentas</h2>
            <span aria-hidden="true" />
          </div>

          <div className="links-resource-grid">
            {resourceLinks.map((item) => (
              <a className="links-resource-card" href={item.href} key={item.kind}>
                <span className="links-service-card__icon">
                  <LinkIcon kind={item.kind} />
                </span>
                <strong>{item.kind === "blog" ? "Blog" : item.title}</strong>
                <span className="links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="links-footer">
          <nav className="links-footer__nav" aria-label="Outros canais da Nacional">
            {footerLinks.map((item) => (
              <a
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <LinkIcon kind={item.kind} />
                <span>{item.kind === "email" ? "E-mail" : item.title}</span>
              </a>
            ))}
          </nav>
          <p>{COMPANY_NAME}</p>
          <p>CNPJ: {CNPJ}</p>
        </footer>
      </section>
    </main>
  );
}

function SwitchAccountantPage() {
  const [form, setForm] = useState<SwitchAccountantFormData>(
    initialSwitchAccountantForm,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [stepError, setStepError] = useState("");

  useEffect(() => {
    document.title = "Trocar de contador | Nacional Contabilidade";
  }, []);

  const updateField = (
    field: keyof SwitchAccountantFormData,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStepError("");
  };

  const goToNextStep = () => {
    const firstStepIsValid =
      form.nome.trim() &&
      form.whatsapp.replace(/\D/g, "").length >= 10 &&
      form.cidade.trim();
    const secondStepIsValid =
      form.regime && form.segmento && form.faturamento && form.pendencias;

    if (currentStep === 1 && !firstStepIsValid) {
      setStepError("Preencha nome, WhatsApp e cidade para continuar.");
      return;
    }

    if (currentStep === 2 && !secondStepIsValid) {
      setStepError("Selecione todas as informações desta etapa.");
      return;
    }

    setStepError("");
    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goToPreviousStep = () => {
    setStepError("");
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 3) {
      goToNextStep();
      return;
    }

    setSubmitStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/troca-contador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          origem: "Formulario troca de contador",
          pagina: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar o formulário.");
      }

      setSubmitStatus("success");
      setForm(initialSwitchAccountantForm);
      setCurrentStep(3);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o formulário.",
      );
    }
  };

  return (
    <main className="lead-page lead-page--switch">
      <section className="switch-layout" aria-labelledby="troca-contador-title">
        <div className="switch-intro">
          <a className="switch-logo" href="/links" aria-label="Voltar para os links da Nacional">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <div className="switch-copy">
            <p className="switch-kicker">Troca de contador</p>
            <h1 id="troca-contador-title">
              Troque de contador sem parar a rotina da sua empresa.
            </h1>
            <p className="switch-summary">
              Conte o que está acontecendo. A Nacional analisa documentos,
              acessos e possíveis pendências para orientar uma transição organizada.
            </p>
          </div>

          <ul className="switch-assurances" aria-label="Diferenciais do atendimento">
            <li><span aria-hidden="true">✓</span> Atendimento humano</li>
            <li><span aria-hidden="true">✓</span> Pará e todo o Brasil</li>
            <li><span aria-hidden="true">✓</span> Análise inicial sem compromisso</li>
          </ul>

          <div className="switch-how">
            <p>Como funciona</p>
            <ol>
              <li><span>1</span> Você conta a situação</li>
              <li><span>2</span> Nossa equipe analisa</li>
              <li><span>3</span> Falamos com você no WhatsApp</li>
            </ol>
          </div>
        </div>

        <div className="switch-form-column">
          <form className="lead-form switch-form" onSubmit={handleSubmit}>
            <div className="switch-form-header">
              <div>
                <p>Etapa {currentStep} de 3</p>
                <h2>
                  {currentStep === 1 && "Vamos começar por você"}
                  {currentStep === 2 && "Agora, sobre a empresa"}
                  {currentStep === 3 && "O que motivou a troca?"}
                </h2>
              </div>
              <span className="switch-time">Leva 2 minutos</span>
            </div>

            <div className="switch-progress" aria-label={`Etapa ${currentStep} de 3`}>
              {[1, 2, 3].map((step) => (
                <span className={step <= currentStep ? "is-active" : ""} key={step} />
              ))}
            </div>

            {submitStatus === "success" ? (
              <div className="switch-success" role="status">
                <span aria-hidden="true">✓</span>
                <h3>Informações recebidas.</h3>
                <p>
                  A equipe da Nacional vai analisar sua situação e entrar em
                  contato pelo WhatsApp informado.
                </p>
                <a className="button button--secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Falar agora no WhatsApp
                </a>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <div className="form-grid switch-fields">
                    <label>
                      <span>Seu nome</span>
                      <input autoFocus autoComplete="name" type="text" value={form.nome} onChange={(event) => updateField("nome", event.target.value)} placeholder="Nome completo" />
                    </label>
                    <label>
                      <span>WhatsApp</span>
                      <input autoComplete="tel-national" inputMode="numeric" type="tel" value={form.whatsapp} onChange={(event) => updateField("whatsapp", formatBrazilPhone(event.target.value))} placeholder="(93) 99210-1980" />
                    </label>
                    <label>
                      <span>Cidade/UF</span>
                      <input autoComplete="address-level2" type="text" value={form.cidade} onChange={(event) => updateField("cidade", event.target.value)} placeholder="Ex: Santarém/PA" />
                    </label>
                    <label>
                      <span>Nome da empresa</span>
                      <input type="text" value={form.empresa} onChange={(event) => updateField("empresa", event.target.value)} placeholder="Opcional" />
                    </label>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-grid switch-fields">
                    <label>
                      <span>Regime tributário</span>
                      <select autoFocus value={form.regime} onChange={(event) => updateField("regime", event.target.value)}>
                        <option value="">Selecione</option>
                        {taxRegimeOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Segmento da empresa</span>
                      <select value={form.segmento} onChange={(event) => updateField("segmento", event.target.value)}>
                        <option value="">Selecione</option>
                        {segmentOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Faturamento aproximado</span>
                      <select value={form.faturamento} onChange={(event) => updateField("faturamento", event.target.value)}>
                        <option value="">Selecione</option>
                        {revenueOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Tem pendência fiscal?</span>
                      <select value={form.pendencias} onChange={(event) => updateField("pendencias", event.target.value)}>
                        <option value="">Selecione</option>
                        {pendingOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="switch-fields switch-fields--final">
                    <label>
                      <span>Principal motivo da troca</span>
                      <select autoFocus required value={form.motivo} onChange={(event) => updateField("motivo", event.target.value)}>
                        <option value="">Selecione</option>
                        {switchReasonOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Quer explicar algo?</span>
                      <textarea value={form.observacao} onChange={(event) => updateField("observacao", event.target.value)} placeholder="Conte rapidamente o que está acontecendo. Opcional." rows={4} />
                    </label>
                  </div>
                )}

                <label className="form-honeypot">
                  <span>Site</span>
                  <input tabIndex={-1} autoComplete="off" type="text" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
                </label>

                {stepError && <p className="form-alert form-alert--error" role="alert">{stepError}</p>}
                {submitStatus === "error" && (
                  <p className="form-alert form-alert--error" role="alert">
                    {errorMessage} Se preferir, fale direto pelo WhatsApp.
                  </p>
                )}

                <div className="switch-form-actions">
                  {currentStep > 1 && <button className="switch-back" type="button" onClick={goToPreviousStep}>Voltar</button>}
                  {currentStep < 3 ? (
                    <button className="button switch-next" type="button" onClick={goToNextStep}>Continuar <span aria-hidden="true">→</span></button>
                  ) : (
                    <button className="button switch-next" type="submit" disabled={submitStatus === "sending"}>
                      {submitStatus === "sending" ? "Enviando..." : "Enviar para análise"}
                    </button>
                  )}
                </div>
              </>
            )}

            <p className="switch-privacy">Seus dados serão usados apenas para esta análise e contato.</p>
          </form>

          <a className="switch-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">◉</span>
            Prefere conversar agora? <strong>Chame no WhatsApp</strong>
          </a>
        </div>
      </section>
    </main>
  );
}

function BusinessAccountingPage() {
  const [form, setForm] = useState<SwitchAccountantFormData>(
    initialSwitchAccountantForm,
  );
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Contabilidade para empresas | Nacional Contabilidade";
  }, []);

  const updateField = (
    field: keyof SwitchAccountantFormData,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/troca-contador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          tipo: "contabilidade_empresas",
          motivo: form.necessidade,
          origem: "Formulario contabilidade para empresas",
          pagina: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar o formulário.");
      }

      setSubmitStatus("success");
      setForm(initialSwitchAccountantForm);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o formulário.",
      );
    }
  };

  return (
    <main className="lead-page">
      <section className="lead-shell" aria-labelledby="contabilidade-empresas-title">
        <a className="lead-logo" href="/links" aria-label="Voltar para os links da Nacional">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
        </a>

        <div className="lead-heading">
          <p className="lead-kicker">Contabilidade para empresas</p>
          <h1 id="contabilidade-empresas-title">
            Vamos entender a rotina da sua empresa.
          </h1>
          <p>
            Responda o checklist abaixo. Com essas informações, nossa equipe
            consegue conversar com mais clareza sobre impostos, obrigações,
            notas e acompanhamento contábil.
          </p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Seu nome</span>
              <input
                required
                autoComplete="name"
                type="text"
                value={form.nome}
                onChange={(event) => updateField("nome", event.target.value)}
                placeholder="Nome completo"
              />
            </label>

            <label>
              <span>WhatsApp</span>
              <input
                required
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="[\d\s()+-]{14,15}"
                type="tel"
                value={form.whatsapp}
                onChange={(event) =>
                  updateField("whatsapp", formatBrazilPhone(event.target.value))
                }
                placeholder="(93) 99210-1980"
              />
            </label>

            <label>
              <span>Cidade/UF</span>
              <input
                required
                autoComplete="address-level2"
                type="text"
                value={form.cidade}
                onChange={(event) => updateField("cidade", event.target.value)}
                placeholder="Ex: Santarém/PA"
              />
            </label>

            <label>
              <span>Nome da empresa</span>
              <input
                type="text"
                value={form.empresa}
                onChange={(event) => updateField("empresa", event.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label>
              <span>Regime tributário</span>
              <select
                required
                value={form.regime}
                onChange={(event) => updateField("regime", event.target.value)}
              >
                <option value="">Selecione</option>
                {taxRegimeOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Segmento da empresa</span>
              <select
                required
                value={form.segmento}
                onChange={(event) =>
                  updateField("segmento", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {segmentOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Faturamento aproximado</span>
              <select
                required
                value={form.faturamento}
                onChange={(event) =>
                  updateField("faturamento", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {revenueOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Quantidade de sócios</span>
              <select
                value={form.socios}
                onChange={(event) => updateField("socios", event.target.value)}
              >
                <option value="">Selecione</option>
                {partnerOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Notas fiscais</span>
              <select
                value={form.notas}
                onChange={(event) => updateField("notas", event.target.value)}
              >
                <option value="">Selecione</option>
                {invoiceOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Funcionários</span>
              <select
                value={form.funcionarios}
                onChange={(event) =>
                  updateField("funcionarios", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {employeeOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Tem pendência fiscal?</span>
              <select
                required
                value={form.pendencias}
                onChange={(event) =>
                  updateField("pendencias", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {pendingOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>O que você precisa agora?</span>
              <select
                required
                value={form.necessidade}
                onChange={(event) =>
                  updateField("necessidade", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {accountingNeedOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>Quer explicar algo?</span>
            <textarea
              value={form.observacao}
              onChange={(event) =>
                updateField("observacao", event.target.value)
              }
              placeholder="Conte rapidamente o que está acontecendo. Opcional."
              rows={4}
            />
          </label>

          <label className="form-honeypot">
            <span>Site</span>
            <input
              tabIndex={-1}
              autoComplete="off"
              type="text"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </label>

          {submitStatus === "success" && (
            <p className="form-alert form-alert--success" role="status">
              Recebemos suas informações. A Nacional Contabilidade vai entrar em
              contato pelo WhatsApp informado. Se preferir, você também pode
              chamar a gente agora.
            </p>
          )}

          {submitStatus === "error" && (
            <p className="form-alert form-alert--error" role="alert">
              {errorMessage} Se preferir, fale direto pelo WhatsApp.
            </p>
          )}

          <div className="lead-actions">
            <button
              className="button"
              type="submit"
              disabled={submitStatus === "sending"}
            >
              {submitStatus === "sending" ? "Enviando..." : "Enviar checklist"}
            </button>
            <a
              className="button button--secondary"
              href={buildWhatsappUrl(
                "Olá, vim pelo checklist de contabilidade para empresas e quero falar com a Nacional Contabilidade.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </form>

        <p className="lead-note">
          Seus dados serão usados apenas para contato e avaliação inicial da
          contabilidade da empresa.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isLinksPage = normalizedPath === "/links";
  const isSwitchAccountantPage = normalizedPath === "/trocar-contador";
  const isBusinessAccountingPage = normalizedPath === "/contabilidade-empresas";
  const isToolsPage = normalizedPath === "/ferramentas";
  const isBlogPage = normalizedPath === "/blog" || normalizedPath.startsWith("/blog/");
  const blogSlug = normalizedPath.startsWith("/blog/")
    ? normalizedPath.replace("/blog/", "")
    : undefined;
  const [showFloatingWhatsapp, setShowFloatingWhatsapp] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      isLinksPage ||
      isSwitchAccountantPage ||
      isBusinessAccountingPage ||
      isToolsPage ||
      isBlogPage
    ) {
      return;
    }

    const updateFloatingButton = () => {
      const section = heroSectionRef.current;
      if (!section) return;

      setShowFloatingWhatsapp(section.getBoundingClientRect().bottom < 0);
    };

    updateFloatingButton();
    window.addEventListener("scroll", updateFloatingButton, { passive: true });
    window.addEventListener("resize", updateFloatingButton);

    return () => {
      window.removeEventListener("scroll", updateFloatingButton);
      window.removeEventListener("resize", updateFloatingButton);
    };
  }, [
    isLinksPage,
    isSwitchAccountantPage,
    isBusinessAccountingPage,
    isToolsPage,
    isBlogPage,
  ]);

  if (isLinksPage) {
    return <LinksPage />;
  }

  if (isSwitchAccountantPage) {
    return <SwitchAccountantPage />;
  }

  if (isBusinessAccountingPage) {
    return <BusinessAccountingPage />;
  }

  if (isToolsPage) {
    return <ToolsPage />;
  }

  if (isBlogPage) {
    return <BlogPage slug={blogSlug} />;
  }

  return (
    <main className="site">
      <header className="topbar">
        <div className="container topbar__inner">
          <a className="topbar__brand" href="#" aria-label="Nacional Contabilidade">
            <span className="topbar__logo">
              <img src="/nacional-contabilidade-logo-topbar.png" alt="" />
            </span>
          </a>
          <nav className="topbar__nav" aria-label="Navegação principal">
            <a href="#servicos">Serviços</a>
            <a href="/ferramentas">Ferramentas</a>
            <a href="/blog">Blog</a>
            <a href="#como-funciona">Como funciona</a>
            <a
              className="topbar__cta"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <section
        className="hero"
        aria-labelledby="hero-title"
        ref={heroSectionRef}
      >
        <div className="container hero__grid">
          <div className="hero__content">
            <p className="hero__redline">
              O problema não é só pagar imposto. É tocar a empresa sem saber se
              está tudo em ordem.
            </p>
            <h1 id="hero-title">
              Contabilidade para colocar rotina, imposto e números no lugar.
            </h1>
            <p className="hero__subtitle">
              A Nacional Contabilidade ajuda empresas a abrir, regularizar e
              manter a contabilidade em dia, com análise fiscal, tributária e
              financeira quando a operação pede mais atenção.
            </p>
            <p className="hero__support">
              Atendimento presencial em Santarém e online para empresas do Pará
              e de todo o Brasil.
            </p>
            <div className="hero__actions">
              <a
                className="button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a Nacional Contabilidade no WhatsApp"
              >
                Falar no WhatsApp
              </a>
              <a className="button button--secondary" href="#servicos">
                Ver serviços
              </a>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Destaques da Nacional">
            <div className="hero-panel__header">
              <span className="flag-pair" aria-hidden="true">
                <ParaFlag />
                <BrazilFlag />
              </span>
              <span>Atendimento contábil</span>
            </div>
            <div className="hero-panel__body">
              {heroHighlights.map((highlight) => (
                <div className="hero-highlight" key={highlight}>
                  <span aria-hidden="true" />
                  <strong>{highlight}</strong>
                </div>
              ))}
            </div>
            <p>
              Começamos pelo básico bem feito e aprofundamos onde existe risco,
              desorganização ou decisão importante pela frente.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="resolve-title">
        <div className="container">
          <div className="section-heading">
            <h2 id="resolve-title">
              Primeiro, tiramos da frente o que trava a empresa
            </h2>
            <p>
              A conversa começa pelo problema real: abrir, regularizar, emitir
              nota, pagar imposto certo, organizar documentos ou entender melhor
              os números.
            </p>
          </div>
          <div className="solution-grid">
            {solutionCards.map((card) => (
              <article className="solution-card" key={card.title}>
                <span className="solution-card__category">
                  {card.tags.join(" / ")}
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div className="related-services">
                  <span>Serviços relacionados</span>
                  <p>{card.services}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="inline-cta">
            <div>
              <strong>Não sabe exatamente qual serviço precisa?</strong>
              <p>
                Explique a situação da empresa e nossa equipe indica o melhor
                caminho.
              </p>
            </div>
            <a
              className="button button--inline"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Nacional Contabilidade no WhatsApp"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="servicos"
        aria-labelledby="servicos-title"
      >
        <div className="container">
          <div className="section-heading section-heading--center">
            <h2 id="servicos-title">
              Depois, organizamos a rotina contábil, fiscal e tributária
            </h2>
            <p>
              A entrega muda conforme a empresa. Algumas precisam resolver o
              básico. Outras precisam revisar operação, tributação, produtos,
              caixa e resultado.
            </p>
          </div>
          <div className="service-columns">
            {serviceBlocks.map((block) => (
              <article className="service-column" key={block.title}>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
                <CheckList items={block.items} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="nivel-title">
        <div className="container level-layout">
          <div className="section-heading">
            <h2 id="nivel-title">
              Nem toda empresa precisa do mesmo acompanhamento
            </h2>
            <p>
              O ponto é não tratar empresas diferentes como se fossem iguais. O
              acompanhamento precisa caber no tamanho da operação e no nível de
              decisão que ela exige.
            </p>
          </div>
          <div className="level-grid">
            {trackingLevels.map((item) => (
              <article className="level-card" key={item.title}>
                <span>{item.level}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="central-title">
        <div className="container split-section">
          <div className="section-heading">
            <h2 id="central-title">Central do empresário</h2>
            <p>
              Reunimos atalhos para CNPJ, Simples Nacional, MEI, certidões,
              notas fiscais, SEFA Pará, Prefeitura de Santarém, eSocial e FGTS
              Digital.
            </p>
            <a className="button button--inline" href="/ferramentas">
              Acessar ferramentas
            </a>
          </div>
          <div>
            <CheckList
              items={[
                "Consultas e portais oficiais em um só lugar",
                "Caminhos rápidos para checklists e atendimento",
                "Links úteis para empresários e contadores",
                "Apoio da Nacional quando aparecer pendência",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="blog-home-title">
        <div className="container">
          <div className="section-heading">
            <h2 id="blog-home-title">Conteúdos para empresários</h2>
            <p>
              Leituras rápidas sobre CNPJ, impostos, notas, financeiro e rotina
              contábil.
            </p>
          </div>
          <div className="blog-grid blog-grid--home">
            {blogPosts.slice(0, 3).map((item) => (
              <a className="blog-card" href={`/blog/${item.slug}`} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{item.excerpt}</small>
              </a>
            ))}
          </div>
          <div className="inline-cta">
            <div>
              <strong>Quer ver todos os conteúdos?</strong>
              <p>Acesse a área de blog da Nacional Contabilidade.</p>
            </div>
            <a className="button button--inline" href="/blog">
              Ver blog
            </a>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="como-funciona"
        aria-labelledby="funciona-title"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="funciona-title">
              Entendemos a situação antes de falar em solução
            </h2>
            <p>
              Antes de propor qualquer coisa, olhamos o que já existe: regime,
              pendências, documentos, faturamento, notas e rotina atual.
            </p>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <article className="step" key={step.title}>
                <span className="step__number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="publico-title">
        <div className="container split-section">
          <div className="section-heading">
            <h2 id="publico-title">
              Para empresas que não querem tocar essa parte no improviso
            </h2>
            <p>
              O atendimento faz sentido quando a empresa quer tratar contabilidade,
              fiscal e financeiro como parte da gestão, não como assunto para
              lembrar só quando aparece problema.
            </p>
          </div>
          <div>
            <CheckList items={audienceItems} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sobre-title">
        <div className="container about">
          <div className="about__image-wrap">
            <img
              className="about__image"
              src="/rodrigo-coelho.png"
              alt="Rodrigo Coelho, contador em Santarém-PA"
            />
          </div>
          <div className="about__content">
            <h2 id="sobre-title">Nacional Contabilidade</h2>
            <p className="credential">
              Liderada por Rodrigo Coelho, contador, estrategista tributário e
              especialista em consultoria financeira para PMEs, compliance e
              reestruturação de negócios.
            </p>
            <p>
              A Nacional Contabilidade é um escritório contábil com atuação em
              Santarém/PA e atendimento online para empresas do Pará e de todo
              o Brasil.
            </p>
            <p>
              Nosso trabalho começa pelo básico bem feito: CNPJ regular,
              impostos apurados, obrigações entregues e documentos organizados.
            </p>
            <p>
              Quando a empresa precisa de uma análise mais completa, também
              atuamos com revisão tributária, classificação fiscal, organização
              financeira, pró-labore, distribuição de lucros e leitura de
              resultados.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--honorarios" aria-labelledby="honorarios-title">
        <div className="container honorarios">
          <div className="section-heading">
            <h2 id="honorarios-title">
              O valor depende da realidade da empresa
            </h2>
          </div>
          <div className="honorarios__text">
            <p>
              O honorário contábil varia conforme regime tributário, faturamento,
              volume de notas, obrigações, situação fiscal, quantidade de sócios
              e nível de acompanhamento necessário.
            </p>
            <p>
              Por isso, antes de informar valores, entendemos a operação e
              montamos uma proposta proporcional ao que a empresa precisa.
            </p>
            <a
              className="button button--inline"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Solicitar avaliação pelo WhatsApp"
            >
              Solicitar avaliação
            </a>
          </div>
        </div>
      </section>

      <section className="section cta" aria-labelledby="cta-title">
        <div className="container cta__box">
          <h2 id="cta-title">
            Quer parar de empurrar imposto, documento e rotina para depois?
          </h2>
          <p>
            Fale com a Nacional Contabilidade e explique sua situação. Nossa
            equipe vai avaliar o melhor caminho para abrir, regularizar ou
            acompanhar seu CNPJ.
          </p>
          <a
            className="button button--inline"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Chamar a Nacional Contabilidade no WhatsApp"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__info">
            <p>{COMPANY_NAME}</p>
            <p>
              Email:{" "}
              <a className="footer__link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
            <p>CNPJ: {CNPJ}</p>
            <p>Endereço: {ADDRESS}</p>
          </div>
          <nav className="footer__social" aria-label="Canais de contato">
            <a
              className="icon-link icon-link--whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Nacional Contabilidade no WhatsApp"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
                <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
              </svg>
            </a>
            <a
              className="icon-link icon-link--instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Instagram de Rodrigo Coelho"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="16.8" cy="7.2" r="0.8" />
              </svg>
            </a>
          </nav>
        </div>
      </footer>

      {showFloatingWhatsapp && (
        <a
          className="floating-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Nacional Contabilidade no WhatsApp"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
            <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
          </svg>
        </a>
      )}
    </main>
  );
}
