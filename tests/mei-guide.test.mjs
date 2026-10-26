import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { decodeDraft, emptyDraft, recommendedSections, worksheetText } from "../src/mei-guide-state.ts";

test("uma pessoa pode combinar parcelamento com baixa sem perder consultas", () => {
  assert.deepEqual(recommendedSections(["agreement", "closed"]), ["consultas", "parcelamento", "baixado"]);
  assert.deepEqual(recommendedSections(["unknown"]), ["consultas"]);
});
test("rascunho malformado ou de versão desconhecida não impede abrir o guia", () => {
  for (const raw of [null, "{", "null", '42', '{"version":2}', 'x'.repeat(40001)]) assert.deepEqual(decodeDraft(raw), emptyDraft());
});
test("restaura apenas campos conhecidos e opções válidas", () => {
  const draft = decodeDraft(JSON.stringify({ version: 1, remember: true, profiles: ["agreement", "agreement", "approved"], notes: { situacao: "Meu exemplo", token: "não deve ser restaurado", divida: 99 }, checked: { "item-3-0": true, "eligible": true, "item-2-0": "sim" } }));
  assert.deepEqual(draft.profiles, ["agreement"]);
  assert.deepEqual(draft.checked, { "item-3-0": true });
  assert.deepEqual(draft.notes, { situacao: "Meu exemplo", divida: "", pendencia: "", proximo: "" });
});
test("limita tamanho das anotações restauradas", () => {
  assert.equal(decodeDraft(JSON.stringify({ version: 1, notes: { situacao: "x".repeat(6000) } })).notes.situacao.length, 4000);
});
test("ficha exportada contém o que foi escrito e não declara aprovação", () => {
  const draft = emptyDraft(); draft.notes.situacao = "Saí em agosto"; draft.notes.pendencia = "Falta o extrato";
  const text = worksheetText(draft, ["Conferi meu histórico"], "26/10/2026");
  assert.match(text, /Saí em agosto/); assert.match(text, /Falta o extrato/); assert.match(text, /Conferi meu histórico/);
  assert.match(text, /Não é aprovação de elegibilidade/);
});
test("conversão web remove referências para procurar link em outra página", () => {
  const data = JSON.parse(fs.readFileSync(new URL("../src/mei-guide-content.json", import.meta.url), "utf8"));
  for (const s of data.sections) {
    for (const b of s.blocks) {
      const text = b.content.map(p => p.text).join("");
      assert.doesNotMatch(text, /página\s*\d/i);
      for (const p of b.content) {
        if (/^(Consulta Optantes|Regularize|PGMEI|Meu INSS|Receita Atende|Fale Conosco|Portal do Simples Nacional)$/.test(p.text)) assert.ok(p.href, `Portal sem link: ${p.text}`);
        if (p.href) assert.match(p.href, /^(https:\/\/|#consultas$)/);
      }
    }
  }
});
test("guia conserva calendário como interpretação e explicações dos cenários", () => {
  const source = fs.readFileSync(new URL("../src/mei-guide-content.json", import.meta.url), "utf8");
  assert.match(source, /não é calendário operacional homologado/);
  assert.match(source, /R\$900/); assert.match(source, /R\$100/);
  const data = JSON.parse(source); assert.equal(data.quiz.length, 5);
  assert.ok(data.quiz.every(q => q.explanation && q.href));
});
