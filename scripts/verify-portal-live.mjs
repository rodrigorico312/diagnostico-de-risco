// Opt-in release check. Uses only synthetic fixtures in the designated portal project.
// Credentials stay inside the build process and are never printed or bundled.
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { handlePortal } from '../server/portal.mjs';

if (process.env.PORTAL_VERIFY_REAL !== 'true') process.exit(0);
assert.equal(process.env.SUPABASE_URL, 'https://cjqfurgqwlmfgyszcczk.supabase.co', 'Unexpected release-check database');
const env = { ...process.env, PORTAL_ENABLED: 'true', VERCEL: '', PORTAL_ORIGIN: 'https://www.nacionalcon.com' };
const target = process.env.PORTAL_VERIFY_TARGET;
if (target) assert.equal(target, env.PORTAL_ORIGIN, 'Unexpected live API target');
const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const users = [], companies = [], paths = [];
function ok(result) { assert.equal(result.error, null, 'Provider operation failed'); return result.data; }
function actor() { return { cookies: new Map(), ip: randomUUID() }; }
async function call(a, action, data = {}) {
  const read = action === 'me' || action === 'company';
  const query = new URLSearchParams({ action, ...(data.companyId ? { companyId: data.companyId } : {}) });
  const res = { headers: {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, setHeader(key, value) { this.headers[key] = value; } };
  const request = { method: read ? 'GET' : 'POST', url: `/api/client-portal?${query}`, body: { action, ...data }, socket: { remoteAddress: a.ip },
    headers: { origin: env.PORTAL_ORIGIN, 'content-type': 'application/json', cookie: [...a.cookies].map(([k,v]) => `${k}=${v}`).join('; ') } };
  if (target) {
    const response = await fetch(`${target}${request.url}`, { method: request.method, headers: request.headers,
      body: read ? undefined : JSON.stringify(request.body), redirect: 'error', signal: AbortSignal.timeout(20000) });
    res.code = response.status; res.body = await response.json();
    res.headers['Cache-Control'] = response.headers.get('cache-control');
    res.headers['Set-Cookie'] = response.headers.getSetCookie();
  } else await handlePortal(request, res, { env });
  for (const cookie of res.headers['Set-Cookie'] || []) {
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=Lax/);
    const [pair] = cookie.split(';'); const split = pair.indexOf('='); a.cookies.set(pair.slice(0, split), pair.slice(split + 1));
  }
  assert.match(res.headers['Cache-Control'], /no-store/);
  return res;
}
try {
  const a = actor(), b = actor(), nobody = actor();
  assert.equal((await call(nobody, 'me')).code, 401);
  assert.equal((await call(nobody, 'recover', { email: 'unknown@example.test' })).code, 400);
  for (let i = 0; i < 2; i++) {
    const password = randomBytes(30).toString('base64url');
    const email = `portal-check-${randomUUID()}@example.test`;
    const user = ok(await admin.auth.admin.createUser({ email, password, email_confirm: true })).user;
    users.push(user.id);
    const company = ok(await admin.from('portal_companies').insert({ legal_name: `TESTE AUTOMATIZADO ${i}`, cnpj: Array.from(randomBytes(14), x => String(x % 10)).join('') }).select('id').single());
    companies.push(company.id);
    ok(await admin.from('portal_memberships').insert({ company_id: company.id, user_id: user.id }));
    assert.equal((await call(i ? b : a, 'login', { email, password })).code, 200);
  }
  const own = await call(a, 'me'); assert.equal(own.code, 200); assert.equal(own.body.companies.length, 1); assert.equal(own.body.companies[0].id, companies[0]);
  assert.equal((await call(a, 'company', { companyId: companies[1] })).code, 404);
  assert.equal((await call(b, 'company', { companyId: companies[0] })).code, 404);
  assert.equal((await call(a, 'request', { companyId: companies[1], subject: 'Teste', message: 'Fixture sintética' })).code, 404);
  assert.equal((await call(a, 'request', { companyId: companies[0], subject: 'Teste', message: 'Fixture sintética' })).code, 201);
  const path = `${companies[1]}/${randomUUID()}.pdf`; paths.push(path);
  ok(await admin.storage.from('portal-documents').upload(path, Buffer.from('%PDF-1.4\n% Fixture sintética de teste\n%%EOF'), { contentType: 'application/pdf' }));
  const doc = ok(await admin.from('portal_documents').insert({ company_id: companies[1], title: 'Fixture de teste', storage_path: path, published: true }).select('id').single());
  assert.equal((await call(a, 'download', { companyId: companies[1], documentId: doc.id })).code, 404);
  assert.equal((await call(b, 'download', { companyId: companies[1], documentId: doc.id })).code, 200);
  ok(await admin.from('portal_memberships').update({ active: false }).eq('company_id', companies[0]).eq('user_id', users[0]));
  assert.equal((await call(a, 'company', { companyId: companies[0] })).code, 404);
  assert.equal((await call(a, 'me')).body.companies.length, 0);
  assert.equal((await call(b, 'logout')).code, 200);
  assert.equal((await call(b, 'me')).code, 401);
  const account = ok(await admin.auth.admin.getUserById(users[1])).user;
  const recovery = ok(await admin.auth.admin.generateLink({ type: 'recovery', email: account.email }));
  const c = actor();
  const token_hash = recovery.properties.hashed_token;
  assert.equal((await call(c, 'confirm', { type: 'recovery', token_hash })).code, 200);
  assert.equal((await call(actor(), 'confirm', { type: 'recovery', token_hash })).code, 400);
  const newPassword = randomBytes(30).toString('base64url');
  assert.equal((await call(c, 'password', { password: newPassword })).code, 200);
  assert.equal((await call(c, 'me')).code, 401);
  assert.equal((await call(c, 'login', { email: account.email, password: newPassword })).code, 200);
  assert.equal((await call(c, 'logout')).code, 200);
  console.log('PORTAL REAL: autenticação, cookies, isolamento Alfa/Beta, solicitações, storage, revogação, recuperação manual de uso único, nova senha e logout passaram. Nenhum e-mail enviado.');
  console.log(target ? 'PORTAL REAL: verificação pela API HTTPS publicada em www.nacionalcon.com.' : 'PORTAL REAL: verificação do servidor contra Supabase real.');
} finally {
  if (paths.length) ok(await admin.storage.from('portal-documents').remove(paths));
  if (companies.length) ok(await admin.from('portal_companies').delete().in('id', companies));
  for (const id of users) ok(await admin.auth.admin.deleteUser(id, true));
  console.log('PORTAL REAL: fixtures removidas; contas de teste desativadas.');
}
