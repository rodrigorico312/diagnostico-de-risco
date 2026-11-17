/** Exact decimal arithmetic: round each installment first, then the entry. */
type Decimal = { units: bigint; scale: bigint };

function parseDecimal(raw: string, money: boolean): Decimal {
  let value = raw.trim();
  if (money) value = value.replace(/^R\$\s*/, "");
  else value = value.replace(/\s*%$/, "");
  if (!value || value.length > 60) throw new Error("Informe um número positivo ou zero.");

  // A comma is decimal; dots before it must be valid Brazilian thousands groups.
  if (value.includes(",")) {
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+),\d+$/.test(value)) {
      throw new Error("Valor inválido. Use vírgula para os decimais.");
    }
    if (!money && value.includes(".")) throw new Error("Informe o percentual sem separador de milhar.");
    value = value.replace(/\./g, "").replace(",", ".");
  } else if (money && /^\d{1,3}(?:\.\d{3})+$/.test(value)) {
    value = value.replace(/\./g, "");
  }
  if (!/^\d+(?:\.\d+)?$/.test(value)) throw new Error("Informe um número positivo ou zero.");
  const [whole, fraction = ""] = value.split(".");
  if (money && fraction.length > 2) throw new Error("Use até duas casas decimais no faturamento.");
  return { units: BigInt(whole + fraction), scale: 10n ** BigInt(fraction.length) };
}

function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  return (2n * numerator + denominator) / (2n * denominator);
}

export function formatPricingMoney(cents: bigint): string {
  return `R$ ${(cents / 100n).toLocaleString("pt-BR")},${(cents % 100n).toString().padStart(2, "0")}`;
}

export function formatPricingRevenue(raw: string): string {
  const amount = parseDecimal(raw, true);
  return formatPricingMoney(amount.units * 100n / amount.scale).slice(3);
}

export function validatePricingInput(raw: string, money = false): string {
  try { parseDecimal(raw, money); return ""; }
  catch (error) { return (error as Error).message; }
}

export function calculateConsultation(revenue: string, installmentPercent = "10", entryPercent = "30") {
  const amount = parseDecimal(revenue, true);
  const installmentRate = parseDecimal(installmentPercent, false);
  const entryRate = parseDecimal(entryPercent, false);
  // reais × rate / 100 × 100 cents: the two factors of 100 cancel.
  const installment = roundHalfUp(amount.units * installmentRate.units, amount.scale * installmentRate.scale);
  const installmentsTotal = installment * 5n;
  const entry = roundHalfUp(installmentsTotal * entryRate.units, entryRate.scale * 100n);
  return { installment, installmentsTotal, entry, total: installmentsTotal + entry };
}
