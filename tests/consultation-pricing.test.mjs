import test from "node:test";
import assert from "node:assert/strict";
import { CONSULTATION_PRESETS, calculateConsultation, formatPricingMoney, formatPricingRevenue, formatPricingRevenueInput, validatePricingInput } from "../src/consultation-pricing.ts";

test("baixa usa parcela de 6,63% do faturamento e entrada de 30% das cinco parcelas", () => {
  const preset = CONSULTATION_PRESETS.find(item => item.id === "baixa");
  assert.deepEqual(calculateConsultation("60.000,00", preset.installmentPercent, preset.entryPercent), { installment: 397800n, installmentsTotal: 1989000n, entry: 596700n, total: 2585700n });
});
test("média conserva a referência de 10% e entrada de 30%; alta requer escolha do percentual", () => {
  const medium = CONSULTATION_PRESETS.find(item => item.id === "media");
  const high = CONSULTATION_PRESETS.find(item => item.id === "alta");
  assert.equal(calculateConsultation("60000", medium.installmentPercent, medium.entryPercent).total, 3900000n);
  assert.throws(() => calculateConsultation("60000", high.installmentPercent, high.entryPercent));
});
test("máscara monetária mostra reais, milhar e centavos sem usar ponto flutuante", () => {
  for (const raw of ["6000000", "R$ 60.000,00", "06000000"])
    assert.equal(formatPricingRevenueInput(raw), "R$ 60.000,00");
  assert.equal(formatPricingRevenueInput("1"), "R$ 0,01");
  assert.equal(formatPricingRevenueInput("0"), "R$ 0,00");
  assert.equal(formatPricingRevenueInput(""), "");
  assert.equal(formatPricingRevenueInput("90071992547409991"), "R$ 900.719.925.474.099,91");
  for (const raw of ["-100", "abc", "1e6", "1".repeat(61)]) {
    assert.equal(formatPricingRevenueInput(raw), raw);
    assert.notEqual(validatePricingInput(formatPricingRevenueInput(raw), true), "");
  }
});

test("65 mil: entrada de 30% sobre cinco parcelas", () => {
  assert.deepEqual(calculateConsultation("65.000,00"), { installment: 650000n, installmentsTotal: 3250000n, entry: 975000n, total: 4225000n });
});
test("65 mil: atalho de entrada 36%", () => {
  assert.deepEqual(calculateConsultation("65000", "10", "36"), { installment: 650000n, installmentsTotal: 3250000n, entry: 1170000n, total: 4420000n });
});
test("25 mil: 4.500 de entrada e cinco parcelas de 2.500", () => {
  assert.deepEqual(calculateConsultation("25.000", "10", "36"), { installment: 250000n, installmentsTotal: 1250000n, entry: 450000n, total: 1700000n });
});
test("percentual fracionado com vírgula ou ponto mantém precisão", () => {
  for (const rate of ["13,508", "13.508", "13,508%"])
    assert.equal(calculateConsultation("R$ 25.000,00", rate).installment, 337700n);
});
test("meio centavo arredonda para cima nas duas etapas", () => {
  assert.deepEqual(calculateConsultation("0,05", "10", "30"), { installment: 1n, installmentsTotal: 5n, entry: 2n, total: 7n });
  assert.equal(calculateConsultation("0,04", "10").installment, 0n);
  assert.equal(calculateConsultation("0,06", "10").installment, 1n);
});
test("entrada usa soma das parcelas já arredondadas", () => {
  assert.deepEqual(calculateConsultation("1", "0,5", "100"), { installment: 1n, installmentsTotal: 5n, entry: 5n, total: 10n });
});
test("zeros e percentuais acima de 100 são parâmetros válidos", () => {
  assert.equal(calculateConsultation("0").total, 0n);
  assert.equal(calculateConsultation("10", "0", "36").total, 0n);
  assert.equal(calculateConsultation("10", "150", "0").total, 7500n);
});
test("formatos monetários aceitos mantêm centavos e agrupamento brasileiro", () => {
  for (const raw of ["65000", "65.000", "65.000,00", "65000.00", "R$ 65.000,00"])
    assert.equal(formatPricingRevenue(raw), "65.000,00");
  assert.equal(formatPricingMoney(4225000n), "R$ 42.250,00");
  assert.equal(formatPricingMoney(7n), "R$ 0,07");
});
test("não converte texto inválido em resultado e não aceita negativos", () => {
  for (const raw of ["", " ", "-1", "NaN", "Infinity", "1e6", "12.34,56", "65,000.00", "1,2,3", "R$", "0,001", "12 34", "1".repeat(61)])
    assert.throws(() => calculateConsultation(raw));
  for (const raw of ["", "-1", "Infinity", "1e2", "1.000,25", "abc", "30%%"])
    for (const position of [1, 2]) {
      const args = ["65000", "10", "30"]; args[position] = raw;
      assert.throws(() => calculateConsultation(...args));
    }
});
test("valores acima do limite de inteiros seguros não perdem centavos", () => {
  const result = calculateConsultation("900719925474099,91", "100", "30");
  assert.equal(result.installment, 90071992547409991n);
  assert.equal(result.total, 585467951558164942n);
  assert.equal(formatPricingMoney(result.installment), "R$ 900.719.925.474.099,91");
});
