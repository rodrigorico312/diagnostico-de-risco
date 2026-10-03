import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import handler, { normalizeCode } from "../api/documento.js";
import { hashPdf } from "../public/document-validation/validation.js";

const code = "GL-" + "AB12".repeat(8);
const sample = { status: "active", title: "Teste", sha256: "a".repeat(64),
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
test("QR prefills the code without fetching until the form is submitted", async () => {
  const original = { document: globalThis.document, location: globalThis.location, fetch: globalThis.fetch };
  const elements = new Map();
  const events = new Map();
  let requests = 0;
  globalThis.document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, { value: "", hidden: true,
      addEventListener(type, callback) { events.set(id + ":" + type, callback); } });
    return elements.get(id);
  } };
  globalThis.location = { search: "?codigo=" + code };
  globalThis.fetch = async () => {
    requests++;
    return { ok: true, json: async () => sample };
  };
  try {
    await import("../public/document-validation/validation.js?manual-submit-test");
    assert.equal(elements.get("document-code").value, code);
    assert.equal(elements.get("record"), undefined);
    assert.equal(requests, 0);
    await events.get("lookup-form:submit")({ preventDefault() {} });
    assert.equal(requests, 1);
    assert.equal(elements.get("record").hidden, false);
    assert.equal(elements.get("subject").textContent, sample.subject.name);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
});
