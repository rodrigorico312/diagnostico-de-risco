import test from "node:test";
import assert from "node:assert/strict";
import { calculateMei, parseMoney, formatMoneyInput } from "../src/mei-calculator.ts";
const base={year:2026,openingYear:2025,openingMonth:1,activity:"servicos",revenue:0,expected:0};
test("máscara BRL mantém os centavos e rejeita valores colados inválidos sem os transformar",()=>{
  assert.equal(parseMoney(formatMoneyInput("8100001")),8_100_001);
  assert.equal(parseMoney(formatMoneyInput("R$ 12.500,56")),1_250_056);
  assert.equal(parseMoney(formatMoneyInput("0")),0);
  assert.equal(formatMoneyInput(""),"");
  for (const raw of ["-125,00","999999999999999999999","1e9"]) assert.throws(()=>parseMoney(formatMoneyInput(raw)));
});
test("limite anual distingue exatamente teto, 20% e um centavo além",()=>{
  assert.equal(calculateMei({...base,revenue:8_100_000}).actual,"within");
  assert.equal(calculateMei({...base,revenue:8_100_001}).actual,"excess20");
  assert.equal(calculateMei({...base,revenue:9_720_000}).actual,"excess20");
  assert.equal(calculateMei({...base,revenue:9_720_001}).actual,"excessAbove20");
});
test("abertura em julho inclui seis meses e efeitos dependem do ano inicial",()=>{
  const r=calculateMei({...base,openingYear:2026,openingMonth:7,revenue:4_860_001});
  assert.equal(r.limit,4_050_000);assert.equal(r.months,6);assert.equal(r.actual,"excessAbove20");assert.equal(r.firstYear,true);
});
test("abertura em dezembro inclui um mês completo e janeiro inclui o ano",()=>{
  assert.equal(calculateMei({...base,openingYear:2026,openingMonth:12}).limit,675_000);
  assert.equal(calculateMei({...base,openingYear:2026,openingMonth:1}).limit,8_100_000);
});
test("mês de abertura em ano anterior não reduz o teto do ano corrente",()=>assert.equal(calculateMei({...base,openingMonth:12}).limit,8_100_000));
test("previsão é separada da receita realizada",()=>{
  const r=calculateMei({...base,revenue:6_000_000,expected:4_000_000});assert.equal(r.actual,"within");assert.equal(r.projected,"excessAbove20");assert.equal(r.excess,0);assert.equal(r.remaining,2_100_000);
});
test("Caminhoneiro exclusivo usa teto próprio e valor mensal expresso na lei",()=>{
  assert.equal(calculateMei({...base,activity:"caminhoneiro"}).limit,25_160_000);
  assert.equal(calculateMei({...base,activity:"caminhoneiro",openingYear:2026,openingMonth:7}).limit,12_580_002);
});
test("mudanças futuras não são aplicadas silenciosamente a anos não revisados",()=>{
  for(const year of [2023,2027,2028])assert.throws(()=>calculateMei({...base,year}));
});
test("entradas incoerentes ou não finitas não recebem resultado tributário",()=>{
  for(const extra of [{revenue:-1},{expected:NaN},{revenue:Infinity},{revenue:12.1},{openingYear:2027},{openingYear:2008},{openingMonth:0},{openingMonth:13},{activity:"arbitraria"}])assert.throws(()=>calculateMei({...base,...extra}));
});
test("atividade desconhecida exige conferência além do limite",()=>assert.equal(calculateMei({...base,activity:"revisar"}).activityReview,true));
test("moeda brasileira não aceita negativos, separadores ambíguos ou infinito",()=>{
  assert.equal(parseMoney("81.000,01"),8_100_001);assert.equal(parseMoney("0"),0);assert.equal(parseMoney("12500,5"),1_250_050);
  for(const raw of ["","-1","100.50","1,2,3","Infinity","R$","1e9"])assert.throws(()=>parseMoney(raw));
});
