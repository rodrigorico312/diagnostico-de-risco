import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/consultar-cnpj.js";
import { formatCnpj, isValidCnpj, normalizeCnpj, pickCompanyRegistry } from "../services/company-registry.mjs";

const cnpj = "11222333000181"; // Synthetic fixture, never sent to an external service.
const fixture = { cnpj, razao_social: "EMPRESA FICTÍCIA", nome_fantasia: "Exemplo", municipio: "CIDADE", uf: "PA", descricao_situacao_cadastral: "ATIVA", cnae_fiscal_descricao: "Serviço de exemplo", qsa: [{ cpf: "não encaminhar" }], email: "nao@example.test", ddd_telefone_1: "nao encaminhar" };
function response() { return { code: 0, body: null, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.code=code; return this; }, json(body) { this.body=body; return this; } }; }
async function isolated(fetcher, fn) { const previous=globalThis.fetch; try { globalThis.fetch=fetcher; await fn(); } finally { globalThis.fetch=previous; } }

test("CNPJ numérico e alfanumérico: máscara, normalização e dígitos", () => {
  assert.equal(formatCnpj(cnpj), "11.222.333/0001-81");
  assert.equal(normalizeCnpj("12.abc.345/01de-35"), "12ABC34501DE35");
  assert.equal(formatCnpj("12abc34501de35"), "12.ABC.345/01DE-35");
  assert.ok(isValidCnpj(cnpj)); assert.ok(isValidCnpj("12ABC34501DE35"));
  for (const invalid of ["", "00000000000000", "11222333000180", "1122233300018", "12ABC34501DE36"]) assert.equal(isValidCnpj(invalid), false);
});
test("retorno limitado aos dados da empresa e CNPJ divergente recusado", () => {
  assert.deepEqual(Object.keys(pickCompanyRegistry(fixture, cnpj)).sort(), ["cnpj", "razaoSocial", "nomeFantasia", "municipio", "uf", "situacao", "atividade"].sort());
  assert.equal(pickCompanyRegistry({ ...fixture, cnpj: "00000000000000" }, cnpj), null);
});
test("consulta: somente POST válido dispara BrasilAPI, sem armazenar em cache", async () => {
  const calls=[];
  await isolated(async (url, init) => { calls.push({url, init}); return {ok:true,json:async()=>fixture}; }, async () => {
    const r=response(); await handler({method:"POST",body:JSON.stringify({cnpj:formatCnpj(cnpj)})},r);
    assert.equal(r.code,200); assert.equal(r.headers["Cache-Control"],"no-store");
    assert.equal(r.body.empresa.razaoSocial, fixture.razao_social);
    assert.doesNotMatch(JSON.stringify(r.body), /qsa|cpf|telefone|email/);
  });
  assert.equal(calls.length,1); assert.equal(calls[0].url,`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  await isolated(() => { throw Error("Rede proibida"); }, async () => {
    for (const request of [{method:"GET"},{method:"POST",body:"{"},{method:"POST",body:{cnpj:"123"}}]) {
      const r=response(); await handler(request,r); assert.ok([400,405].includes(r.code));
    }
  });
});
test("falhas, timeout e divergência permitem preenchimento manual sem expor o provedor", async () => {
  for (const fetcher of [
    async()=>({ok:false,status:404}), async()=>({ok:false,status:429}),
    async()=>{throw Error("segredo do provedor");},
    async()=>({ok:true,json:async()=>({...fixture,cnpj:"00000000000000"})}),
    async()=>({ok:true,json:async()=>{throw Error("HTML inválido");}}),
  ]) await isolated(fetcher,async()=>{
    const r=response();await handler({method:"POST",body:{cnpj}},r);
    assert.ok([404,503].includes(r.code));assert.equal(r.body.ok,false);
    assert.match(r.body.error,/continuar sem consultar/);assert.doesNotMatch(JSON.stringify(r.body),/segredo|HTML/);
  });
});
