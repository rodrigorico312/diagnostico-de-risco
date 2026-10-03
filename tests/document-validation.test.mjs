import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import handler, { normalizeCode } from "../api/documento.js";
import { hashPdf, inspectRegistration } from "../public/document-validation/validation.js";

const code = "GL-" + "AB12".repeat(8);
const sample = { code, status: "active", title: "Teste", sha256: "a".repeat(64),
  issuer: { name: "Emissor", cnpj: "000", privateEmail: "private" },
  accountant: { name: "Contador", crc: "000", cpf: "private" },
  subject: { name: "Empresa", cnpj: "111", cpf: "private" },
  period: "19/09/2026 a 31/08/2027", nature: "Projeção estimada",
  issuedOn: "2026-10-03", registeredAt: "2026-10-03T18:00:00Z",
  filename: "sample.pdf", byteLength: 123,
  signatureStatus: "pending", revision: "01", privatePdf: "private" };
function invoke(url, method = "GET", records = { [code]: sample }) {
  process.env.DOCUMENT_VALIDATION_RECORDS_V1 = typeof records === "string" ? records : JSON.stringify(records);
  const result = { headers: {} };
  const res = { setHeader(k, v) { result.headers[k] = v; },
    status(value) { result.status = value; return this; }, json(value) { result.body = value; return this; } };
  handler({ url, method }, res);
  return result;
}
test("code normalization accepts groups, rejects malformed and prototype keys", () => {
  assert.equal(normalizeCode("gl-" + "ab12".repeat(8)), code);
  assert.equal(normalizeCode("GL-AB12AB12-AB12AB12-AB12AB12-AB12AB12"), code);
  for (const value of ["__proto__", "GL-ABC", "<script>", "", "x".repeat(1000)]) assert.equal(normalizeCode(value), "");
});
test("active record returns only permitted metadata with private headers", () => {
  const result = invoke("/api/documento?codigo=" + code);
  assert.equal(result.status, 200);
  assert.equal(result.body.sha256, sample.sha256);
  assert.equal(result.headers["Cache-Control"], "private, no-store, max-age=0");
  assert.match(result.headers["X-Robots-Tag"], /noindex/);
  assert.doesNotMatch(JSON.stringify(result.body), /private/);
});
test("missing, malformed, duplicated, and unknown codes are rejected", () => {
  assert.equal(invoke("/api/documento").status, 400);
  assert.equal(invoke("/api/documento?codigo=__proto__").status, 400);
  assert.equal(invoke(`/api/documento?codigo=${code}&codigo=${code}`).status, 400);
  assert.equal(invoke("/api/documento?codigo=GL-" + "C".repeat(32)).status, 404);
});
test("only GET is supported and records cannot be listed", () => {
  assert.equal(invoke("/api/documento?codigo=" + code, "POST").status, 405);
  assert.equal(invoke("/api/documento?codigo=" + code, "POST").headers.Allow, "GET");
});
test("unconfigured, corrupt and malformed records fail closed", () => {
  for (const records of ["null", "invalid-json", "[]", { [code]: { ...sample, sha256: "invalid" } },
    { [code]: { ...sample, issuer: null } }, { [code]: { ...sample, byteLength: 0 } }]) {
    assert.equal(invoke("/api/documento?codigo=" + code, "GET", records).status, 503);
  }
});
test("revoked record does not provide a digest for validation", () => {
  const result = invoke("/api/documento?codigo=" + code, "GET", { [code]: { ...sample, status: "revoked" } });
  assert.equal(result.status, 410);
  assert.equal(result.body.sha256, undefined);
});
test("browser hash matches SHA-256 of complete bytes and detects any change", async () => {
  const bytes = Buffer.from("%PDF-1.7\nTest\n%%EOF");
  const file = new File([bytes], "sample.pdf", { type: "application/pdf" });
  const actual = await hashPdf(file);
  assert.equal(actual, createHash("sha256").update(bytes).digest("hex"));
  assert.notEqual(await hashPdf(new File([bytes, "changed"], "other.pdf")), actual);
});
test("invalid, empty and oversized files are rejected before hashing", async () => {
  await assert.rejects(hashPdf(new File([], "empty.pdf")), /não vazio/);
  await assert.rejects(hashPdf(new File(["not-pdf"], "sample.pdf")), /não é um PDF/);
  await assert.rejects(hashPdf({ size: 30 * 1024 * 1024 }), /25 MB/);
});
let uiSession = 0;
async function withUi(fetch, exercise) {
  const original = { document: globalThis.document, location: globalThis.location, fetch: globalThis.fetch };
  const elements = new Map();
  const events = new Map();
  globalThis.document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, { value: "", hidden: true, dataset: {}, open: false,
      removeAttribute(name) { delete this[name]; }, showModal() { this.open = true; },
      close() { this.open = false; }, focus() { this.focused = true; },
      addEventListener(type, callback) { events.set(id + ":" + type, callback); } });
    return elements.get(id);
  } };
  globalThis.location = { search: "?codigo=" + code };
  globalThis.fetch = fetch;
  try {
    await import("../public/document-validation/validation.js?ui-test=" + ++uiSession);
    await exercise(elements, events);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
}
test("QR prefills without fetching, then opens truthful completed consultation", async () => {
  let requests = 0;
  await withUi(async () => { requests++; return { ok: true, json: async () => sample }; }, async (elements, events) => {
    assert.equal(elements.get("document-code").value, code);
    assert.equal(elements.get("record"), undefined);
    assert.equal(requests, 0);
    await events.get("lookup-form:submit")({ preventDefault() {} });
    assert.equal(requests, 1);
    assert.equal(elements.get("record").hidden, false);
    assert.equal(elements.get("subject").textContent, sample.subject.name);
    assert.equal(elements.get("consultation-dialog").open, true);
    assert.equal(elements.get("consultation-action").textContent, "Ver registro");
    assert.equal(elements.get("consultation-progress").value, 6);
    assert.equal(elements.get("lookup-step-5").dataset.state, "warning");
    assert.match(elements.get("lookup-step-status-5").textContent, /pendentes/);
    assert.match(elements.get("lookup-step-status-4").textContent, /ainda não conferido/);
    events.get("consultation-action:click")();
    assert.equal(elements.get("consultation-dialog").open, false);
    assert.equal(elements.get("record").focused, true);
  });
});
test("field checks reject inconsistent records and never verify certificates", () => {
  const checks = [];
  inspectRegistration({ ...sample, signatureStatus: "provided" }, code, (...check) => checks.push(check));
  assert.equal(checks.length, 6);
  assert.equal(checks[5][1], "warning");
  assert.match(checks[5][2], /certificados não verificados/);
  for (const [record, step] of [[{ ...sample, code: "wrong" }, 0], [{ ...sample, subject: {} }, 1],
    [{ ...sample, accountant: {} }, 2], [{ ...sample, issuedOn: "invalid-date" }, 3],
    [{ ...sample, sha256: "invalid" }, 4], [{ ...sample, signatureStatus: "verified" }, 5]]) {
    assert.throws(() => inspectRegistration(record, code), error => error.step === step);
  }
});
test("cancel ignores a late response and restores the consultation button", async () => {
  let resolve;
  await withUi(() => new Promise(done => { resolve = done; }), async (elements, events) => {
    const pending = events.get("lookup-form:submit")({ preventDefault() {} });
    assert.equal(elements.get("consultation-dialog").open, true);
    assert.equal(elements.get("lookup-step-0").dataset.state, "active");
    events.get("consultation-action:click")();
    assert.equal(elements.get("consultation-dialog").open, false);
    assert.equal(elements.get("lookup-button").disabled, false);
    resolve({ ok: true, json: async () => sample });
    await pending;
    assert.equal(elements.get("record").hidden, true);
    assert.equal(elements.get("subject"), undefined);
  });
});
test("failed lookup shows an error, not a successful validation", async () => {
  await withUi(async () => ({ ok: false, json: async () => ({ error: "Código não localizado." }) }), async (elements, events) => {
    await events.get("lookup-form:submit")({ preventDefault() {} });
    assert.equal(elements.get("record").hidden, true);
    assert.equal(elements.get("lookup-step-0").dataset.state, "error");
    assert.equal(elements.get("lookup-step-status-1").textContent, "Não conferido");
    assert.equal(elements.get("consultation-progress").value, 0);
    assert.equal(elements.get("consultation-action").textContent, "Fechar");
    events.get("consultation-action:click")();
    assert.equal(elements.get("consultation-dialog").open, false);
  });
});
test("a stalled lookup times out and can be retried", async () => {
  await withUi((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  }), async (elements, events) => {
    const timers = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout };
    let timeout;
    globalThis.setTimeout = callback => { timeout = callback; return 1; };
    globalThis.clearTimeout = () => {};
    try {
      const pending = events.get("lookup-form:submit")({ preventDefault() {} });
      timeout();
      await pending;
      assert.match(elements.get("consultation-status").textContent, /demorou demais/);
      assert.equal(elements.get("lookup-button").disabled, false);
      assert.equal(elements.get("record").hidden, true);
    } finally {
      Object.assign(globalThis, timers);
    }
  });
});
