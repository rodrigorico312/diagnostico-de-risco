/** Revenue-only screening. Legal review: 2026-11-11. All money is integer cents. */
export const MEI_REVIEW_DATE = "11/11/2026";
export const MEI_YEARS = [2024, 2025, 2026] as const;
export const MEI_SOURCES = [
  { label: "Receita Federal · Manual de desenquadramento do SIMEI", url: "https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_DESENQUADRAMENTO_SIMEI.pdf" },
  { label: "Receita Federal · Resolução CGSN 140/2018, arts. 100, 115 e 116", url: "https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=92278" },
  { label: "Senado Federal · LC 238/2026 e vigência dos novos limites", url: "https://legis.senado.gov.br/norma/44276013/publicacao/44280206" },
];
export type MeiInput = { year: number; openingYear: number; openingMonth: number; activity: string; revenue: number; expected: number };
export function parseMoney(raw: string): number {
  const value = raw.trim().replace(/R\$\s?/g, "");
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(value)) throw new Error("Informe valores como 12.500,00, sem sinal negativo.");
  const [whole, fraction = ""] = value.replace(/\./g, "").split(",");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents > 100_000_000_000) throw new Error("Revise o valor de faturamento informado.");
  return cents;
}
export const formatMoney = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export function calculateMei(input: MeiInput) {
  const { year, openingYear, openingMonth, activity, revenue, expected } = input;
  if (!MEI_YEARS.includes(year as typeof MEI_YEARS[number])) throw new Error("Esta versão calcula somente 2024, 2025 e 2026. Outros anos exigem revisão das regras.");
  if (!Number.isInteger(openingYear) || openingYear < 2009 || openingYear > year || !Number.isInteger(openingMonth) || openingMonth < 1 || openingMonth > 12) throw new Error("A abertura deve ser anterior ou pertencer ao ano analisado.");
  if (![revenue, expected].every(v => Number.isSafeInteger(v) && v >= 0 && v <= 100_000_000_000)) throw new Error("Informe receitas válidas, iguais ou maiores que zero.");
  if (!["comercio", "servicos", "industria", "mista", "caminhoneiro", "revisar"].includes(activity)) throw new Error("Selecione a atividade da empresa.");
  const firstYear = openingYear === year;
  const months = firstYear ? 13 - openingMonth : 12;
  const truck = activity === "caminhoneiro";
  const annual = truck ? 25_160_000 : 8_100_000;
  // Statutory monthly amount for transport is R$20,966.67, not annual / 12.
  const limit = firstYear && months < 12 ? (truck ? 2_096_667 : 675_000) * months : annual;
  const classify = (amount: number) => amount <= limit ? "within" : amount * 100 <= limit * 120 ? "excess20" : "excessAbove20";
  return { limit, threshold20: Math.floor(limit * 120 / 100), months, firstYear, truck, actual: classify(revenue), projected: classify(revenue + expected), projectedRevenue: revenue + expected, remaining: Math.max(0, limit - revenue), excess: Math.max(0, revenue - limit), activityReview: activity === "revisar" };
}
