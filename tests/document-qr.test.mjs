import test from "node:test";
import assert from "node:assert/strict";
import { PNG } from "pngjs";
import handler, { QR_SIZE, renderDocumentQr } from "../api/qr-documento.js";

const code = "GL-" + "0123456789ABCDEF".repeat(2);
async function request(url, method = "GET") {
  const result = { headers: {}, statusCode: 0 };
  const res = {
    setHeader(name, value) { result.headers[name] = value; },
    status(value) { result.statusCode = value; return this; },
    json(value) { result.body = value; return this; },
    end(value) { result.body = value; return this; },
  };
  await handler({ url, method }, res);
  return result;
}

test("four footer strips reconstruct the complete QR exactly", async () => {
  const full = PNG.sync.read(await renderDocumentQr(code));
  const combined = new PNG({ width: QR_SIZE, height: QR_SIZE });
  for (let part = 1; part <= 4; part++) {
    const strip = PNG.sync.read(await renderDocumentQr(code, part));
    assert.equal(strip.width, QR_SIZE);
    assert.equal(strip.height, QR_SIZE / 4);
    strip.data.copy(combined.data, (part - 1) * strip.data.length);
  }
  assert.deepEqual(combined.data, full.data);
});

test("generic portal and bounded document QR return private PNGs", async () => {
  for (const url of ["/api/qr-documento", "/api/qr-documento?codigo=" + code + "&parte=2"]) {
    const result = await request(url);
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers["Content-Type"], "image/png");
    assert.match(result.headers["Cache-Control"], /no-store/);
    assert.ok(PNG.sync.read(result.body).width === QR_SIZE);
  }
});

test("invalid codes, arbitrary URLs and malformed parts are rejected", async () => {
  for (const query of ["codigo=BAD", "codigo=https://example.com", "codigo=", "parte=0",
    "parte=5", "parte=1&parte=2", "codigo=" + code + "&codigo=" + code]) {
    assert.equal((await request("/api/qr-documento?" + query)).statusCode, 400);
  }
});

test("HEAD returns headers only and writes are rejected", async () => {
  const head = await request("/api/qr-documento?codigo=" + code, "HEAD");
  assert.equal(head.statusCode, 200);
  assert.equal(head.body, undefined);
  assert.ok(head.headers["Content-Length"] > 0);
  assert.equal((await request("/api/qr-documento", "POST")).statusCode, 405);
});
