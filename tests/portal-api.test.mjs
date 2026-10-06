import { test } from "node:test";
import assert from "node:assert/strict";
import { handlePortal, userClient } from "../server/portal.mjs";

const env = {
  PORTAL_ENABLED: "true", PORTAL_ORIGIN: "https://www.nacionalcon.com",
  SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  SUPABASE_SECRET_KEY: "secret-test-key", PORTAL_RATE_LIMIT_SECRET: "test-secret".repeat(4),
};
const companyId = "20000000-0000-4000-8000-000000000001";
const user = { id: "10000000-0000-4000-8000-000000000001", email: "cliente@example.test", email_confirmed_at: "2026-01-01" };
function response() {
  return { headers: {}, statusCode: 0, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}
async function run({ method = "POST", body = {}, headers = {}, url = "/api/client-portal", client, config = env, limiter } = {}) {
  const res = response();
  let calls = 0;
  await handlePortal({
    method, url, body, socket: { remoteAddress: "127.0.0.1" },
    headers: { origin: env.PORTAL_ORIGIN, "content-type": "application/json", ...headers },
  }, res, {
    env: config,
    makeUserClient: () => { calls++; return client || { auth: { getUser: async () => ({ error: null, data: { user } }) } }; },
    makeAdminClient: () => limiter || { rpc: async () => ({ error: null, data: { allowed: true } }) },
  });
  return { res, calls };
}
test("feature desativada e configuração incompleta negam acesso sem vazar segredos", async () => {
  const { res, calls } = await run({ config: { ...env, PORTAL_ENABLED: "false" }, body: { action: "login" } });
  assert.equal(res.statusCode, 503); assert.equal(calls, 0);
  assert.equal(JSON.stringify(res.body).includes(env.SUPABASE_SECRET_KEY), false);
});
test("origem externa, Origin ausente e content-type de formulário bloqueiam mutações", async () => {
  for (const headers of [
    { origin: "https://evil.example" }, { origin: undefined },
    { "sec-fetch-site": "cross-site" }, { "content-type": "application/x-www-form-urlencoded" },
  ]) {
    const { res, calls } = await run({ headers, body: { action: "logout" } });
    assert.ok([403,415].includes(res.statusCode)); assert.equal(calls, 0);
  }
});
test("login por GET e operação desconhecida nunca executam autenticação", async () => {
  const { res, calls } = await run({ method: "GET", url: "/api/client-portal?action=login" });
  assert.equal(res.statusCode, 400); assert.equal(calls, 0);
});
test("limite excedido ou indisponível falha fechado antes de autenticar", async () => {
  for (const limiter of [
    { rpc: async () => ({ data: { allowed: false }, error: null }) },
    { rpc: async () => ({ data: null, error: { message: "secret database details" } }) },
  ]) {
    const { res, calls } = await run({ body: { action: "login", email: user.email, password: "secret-password" }, limiter });
    assert.ok([429,503].includes(res.statusCode)); assert.equal(calls, 0);
    assert.equal(JSON.stringify(res.body).includes("database details"), false);
  }
});
test("cookie forjado não dispensa getUser; resultado não validado é negado", async () => {
  let verified = false;
  const { res } = await run({
    method: "GET", url: "/api/client-portal?action=me", headers: { cookie: "nacional-client-auth=fake" },
    client: { auth: { getUser: async () => { verified = true; return { error: { message: "Invalid JWT" }, data: { user: null } }; } } },
  });
  assert.equal(verified, true); assert.equal(res.statusCode, 401);
});
test("empresa sem linha visível não chega a documentos ou solicitações", async () => {
  const queried = [];
  const client = {
    auth: { getUser: async () => ({ error: null, data: { user } }) },
    from: (table) => { queried.push(table); return {
      select() { return this; }, eq() { return this; }, maybeSingle: async () => ({ data: null, error: null }),
    }; },
  };
  const { res } = await run({ method: "GET", url: `/api/client-portal?action=company&companyId=${companyId}`, client });
  assert.equal(res.statusCode, 404); assert.deepEqual(queried, ["portal_companies"]);
});
test("recuperação tem a mesma resposta quando o provedor não revela ou recusa a conta", async () => {
  const bodies = [];
  for (const error of [null, { message: "User not found" }]) {
    const { res } = await run({ body: { action: "recover", email: user.email }, client: {
      auth: { resetPasswordForEmail: async () => ({ error }) },
    } });
    assert.equal(res.statusCode, 200); bodies.push(res.body);
  }
  assert.deepEqual(bodies[0], bodies[1]);
});
test("callback aceita apenas invite/recovery e não permite redirects arbitrários", async () => {
  const { res, calls } = await run({ body: { action: "confirm", type: "signup", token_hash: "a".repeat(64), next: "https://evil.example" } });
  assert.equal(res.statusCode, 400);
});
test("nenhuma resposta da API permite cache compartilhado", async () => {
  const { res } = await run({ method: "GET", url: "/api/client-portal?action=me", config: {} });
  assert.match(res.headers["Cache-Control"], /no-store/);
  assert.equal(res.headers["Vercel-CDN-Cache-Control"], "no-store");
});
test("SDK escreve cookies HttpOnly, Secure, SameSite e host-only sem expor tokens na resposta", async () => {
  const originalFetch = globalThis.fetch;
  const res = response();
  const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now()/1000) + 3600 })).toString("base64url");
  const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`;
  globalThis.fetch = async () => new Response(JSON.stringify({
    access_token: token, refresh_token: "refresh-test-token", expires_in: 3600, token_type: "bearer", user,
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const client = userClient({ headers: {} }, res, { ...env, secure: true });
    const result = await client.auth.verifyOtp({ token_hash: "a".repeat(64), type: "invite" });
    assert.equal(result.error, null);
    const cookies = res.headers["Set-Cookie"];
    assert.ok(cookies.length);
    for (const cookie of cookies) {
      assert.match(cookie, /^__Host-nacional-client-auth/);
      assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=Lax/);
      assert.match(cookie, /Path=\//); assert.equal(/Domain=/.test(cookie), false);
    }
  } finally { globalThis.fetch = originalFetch; }
});
