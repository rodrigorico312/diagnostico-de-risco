import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function browserMeasurement() {
  const source = readFileSync(new URL("../src/measurement.ts", import.meta.url), "utf8")
    .replaceAll("import.meta.env", '({ VITE_GA_MEASUREMENT_ID: "G-TESTONLY", VITE_PREVIEW_MODE: "false" })');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const storage = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value) }; };
  const scripts = [];
  const window = { location: { hostname: "www.example.test", origin: "https://www.example.test", pathname: "/mei-em-crescimento", search: "?email=private%40example.test" } };
  const document = { title: "Página de teste", referrer: "", createElement: () => ({}), head: { appendChild: script => scripts.push(script) } };
  const exports = {};
  vm.runInNewContext(code, { exports, window, document, localStorage: storage(), sessionStorage: storage(), URL, URLSearchParams });
  return { api: exports, window, scripts, commands: () => JSON.parse(JSON.stringify((window.dataLayer || []).map(command => Array.from(command)))) };
}

test("nenhuma biblioteca é carregada sem consentimento ou após recusa", () => {
  const browser = browserMeasurement();
  browser.api.initializeMeasurement();
  browser.api.setMeasurementConsent(false);
  browser.api.initializeMeasurement();
  assert.equal(browser.scripts.length, 0);
  assert.equal(browser.window.gtag, undefined);
});

test("desativa visualização automática globalmente antes de inicializar e envia uma visualização explícita", () => {
  const browser = browserMeasurement();
  browser.api.setMeasurementConsent(true);
  browser.api.setMeasurementConsent(true);
  const commands = browser.commands();
  const globalSettings = commands.findIndex(command => command[0] === "set");
  assert.ok(globalSettings >= 0 && globalSettings < commands.findIndex(command => command[0] === "js"));
  assert.equal(commands[globalSettings][1].send_page_view, false);
  assert.equal(commands[globalSettings][1].page_location, "https://www.example.test/mei-em-crescimento");
  assert.equal(commands[globalSettings][1].page_referrer, "");
  assert.equal(commands[globalSettings][1].allow_google_signals, false);
  assert.equal(commands.filter(command => command[0] === "event" && command[1] === "page_view").length, 1);
  assert.equal(browser.scripts.filter(script => script.src.includes("googletagmanager.com")).length, 1);
});

test("eventos não levam respostas pessoais e param após revogar a medição", () => {
  const browser = browserMeasurement();
  browser.api.setMeasurementConsent(true);
  browser.api.trackLeadEvent("generate_lead", { form_id: "teste", email: "private@example.test", cnpj: "somente-teste", faturamento: "10000" });
  const sent = browser.commands().find(command => command[0] === "event" && command[1] === "generate_lead");
  assert.equal(sent[2].form_id, "teste");
  assert.equal(sent[2].email, undefined);
  assert.equal(sent[2].cnpj, undefined);
  assert.equal(sent[2].faturamento, undefined);
  assert.doesNotMatch(JSON.stringify(browser.commands()), /private|\?email=/);
  browser.api.setMeasurementConsent(false);
  browser.api.trackLeadEvent("generate_lead");
  assert.equal(browser.commands().filter(command => command[0] === "event" && command[1] === "generate_lead").length, 1);
});
