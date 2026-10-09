import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { parseCookie, stringifySetCookie } from "cookie";
import { createHmac } from "node:crypto";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AUTH_ACTIONS = new Set(["login", "confirm"]);
export class PortalError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function readConfig(env) {
  if (env.PORTAL_ENABLED !== "true" || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY ||
      !env.SUPABASE_SECRET_KEY || !env.PORTAL_ORIGIN || !env.PORTAL_RATE_LIMIT_SECRET) {
    throw new PortalError(503, "O acesso está em preparação. Solicite ajuda à Nacional.");
  }
  const origin = new URL(env.PORTAL_ORIGIN);
  const local = ["localhost", "127.0.0.1"].includes(origin.hostname);
  if ((!local && origin.protocol !== "https:") || origin.origin !== env.PORTAL_ORIGIN ||
      (!local && env.PORTAL_RATE_LIMIT_SECRET.length < 32)) {
    throw new PortalError(503, "Configuração de acesso indisponível.");
  }
  return { ...env, origin: origin.origin, secure: !local };
}

export function assertMutation(request, config) {
  if (request.headers.origin !== config.origin ||
      (request.headers["sec-fetch-site"] && request.headers["sec-fetch-site"] !== "same-origin")) {
    throw new PortalError(403, "Origem não autorizada.");
  }
  if (!(request.headers["content-type"] || "").startsWith("application/json")) {
    throw new PortalError(415, "Envie dados em JSON.");
  }
}

export function userClient(request, response, config) {
  const jar = new Map(Object.entries(parseCookie(request.headers.cookie || "")));
  const outgoing = new Map();
  return createServerClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: { name: config.secure ? "__Host-nacional-client-auth" : "nacional-client-auth", path: "/", sameSite: "lax", httpOnly: true, secure: config.secure },
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) {
          jar.set(name, value);
          outgoing.set(name, stringifySetCookie({
            name, value,
            ...options, path: "/", domain: undefined, httpOnly: true,
            secure: config.secure, sameSite: "lax",
            maxAge: options.maxAge === 0 ? 0 : 8 * 60 * 60,
          }));
        }
        response.setHeader("Set-Cookie", [...outgoing.values()]);
      },
    },
  });
}

function adminClient(config) {
  // Used exclusively for the rate-limit RPC, never for customer data.
  return createClient(config.SUPABASE_URL, config.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function rateLimit(request, body, config, makeAdminClient) {
  const ip = config.VERCEL ? request.headers["x-vercel-forwarded-for"] : request.socket?.remoteAddress;
  if (!ip || typeof ip !== "string") throw new PortalError(503, "Não foi possível verificar esta solicitação.");
  const keys = [[`ip:${ip.split(",")[0].trim()}`, 30]];
  if (typeof body.email === "string") keys.push([`email:${body.email.trim().toLowerCase()}`, 10]);
  const limiter = makeAdminClient(config);
  for (const [value, limit] of keys) {
    const key = createHmac("sha256", config.PORTAL_RATE_LIMIT_SECRET).update(value).digest("hex");
    const { data, error } = await limiter.rpc("portal_consume_rate_limit", { p_key: key, p_limit: limit });
    if (error || !data) throw new PortalError(503, "Acesso temporariamente indisponível.");
    if (!data.allowed) throw new PortalError(429, "Muitas tentativas. Aguarde 15 minutos e tente novamente.");
  }
}

function checked(result) {
  if (result.error) throw new PortalError(503, "Não foi possível consultar as informações. Tente novamente.");
  return result.data;
}
function uuid(value) {
  if (typeof value !== "string" || !UUID.test(value)) throw new PortalError(400, "Identificador inválido.");
  return value;
}
function email(value) {
  if (typeof value !== "string" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new PortalError(400, "Informe um e-mail válido.");
  }
  return value.trim();
}
async function currentUser(client) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user || data.user.is_anonymous || !data.user.email_confirmed_at) {
    throw new PortalError(401, "Entre novamente para acessar suas informações.");
  }
  return data.user;
}
async function requireCompany(client, id) {
  const company = checked(await client.from("portal_companies")
    .select("id,legal_name,trade_name,cnpj,tax_regime,contact_email,contact_phone,address")
    .eq("id", uuid(id)).maybeSingle());
  if (!company) throw new PortalError(404, "Empresa não disponível para este acesso.");
  return company;
}

export async function handlePortal(request, response, dependencies = {}) {
  response.setHeader("Cache-Control", "private, no-store, max-age=0");
  response.setHeader("CDN-Cache-Control", "no-store");
  response.setHeader("Vercel-CDN-Cache-Control", "no-store");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  try {
    if (!["GET", "POST"].includes(request.method)) {
      response.setHeader("Allow", "GET, POST");
      throw new PortalError(405, "Método não permitido.");
    }
    const config = readConfig(dependencies.env || process.env);
    const url = new URL(request.url, config.origin);
    let body = {};
    if (request.method === "POST") {
      assertMutation(request, config);
      if (Number(request.headers["content-length"] || 0) > 16384) throw new PortalError(413, "Solicitação muito grande.");
      try { body = typeof request.body === "string" ? JSON.parse(request.body) : request.body; }
      catch { throw new PortalError(400, "Dados inválidos."); }
      if (!body || typeof body !== "object" || Array.isArray(body) || JSON.stringify(body).length > 16384) {
        throw new PortalError(400, "Dados inválidos.");
      }
    }
    const action = request.method === "GET" ? url.searchParams.get("action") : body.action;
    const permitted = request.method === "GET" ? ["me", "company"] :
      ["login", "confirm", "password", "logout", "request", "download"];
    if (!permitted.includes(action)) throw new PortalError(400, "Operação inválida.");
    if (AUTH_ACTIONS.has(action)) {
      if (action !== "confirm") body.email = email(body.email);
      await rateLimit(request, body, config, dependencies.makeAdminClient || adminClient);
    }
    const client = (dependencies.makeUserClient || userClient)(request, response, config);
    if (action === "login") {
      if (typeof body.password !== "string" || body.password.length < 1 || body.password.length > 1024) {
        throw new PortalError(400, "Informe sua senha.");
      }
      const { error } = await client.auth.signInWithPassword({ email: body.email, password: body.password });
      if (error) throw new PortalError(401, "Não foi possível entrar. Confira os dados ou recupere seu acesso.");
      await currentUser(client);
      return response.status(200).json({ ok: true });
    }
    if (action === "confirm") {
      if (!["invite", "recovery"].includes(body.type) ||
          typeof body.token_hash !== "string" || !/^[a-zA-Z0-9_-]{32,256}$/.test(body.token_hash)) {
        throw new PortalError(400, "Link inválido ou vencido. Solicite um novo acesso.");
      }
      const { error } = await client.auth.verifyOtp({ token_hash: body.token_hash, type: body.type });
      if (error) throw new PortalError(400, "Link inválido ou vencido. Solicite um novo acesso.");
      await currentUser(client);
      return response.status(200).json({ ok: true });
    }
    if (action === "logout") {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw new PortalError(503, "Não foi possível encerrar o acesso. Tente novamente.");
      return response.status(200).json({ ok: true });
    }
    const user = await currentUser(client);
    if (action === "password") {
      if (typeof body.password !== "string" || body.password.length < 12 || body.password.length > 128) {
        throw new PortalError(400, "Use uma senha de 12 a 128 caracteres.");
      }
      const { error } = await client.auth.updateUser({ password: body.password });
      if (error) throw new PortalError(400, "Não foi possível definir a senha. Solicite um novo link ou tente outra senha.");
      // End all refresh-token sessions after a password change. Access JWTs may remain valid until expiry.
      const { error: signOutError } = await client.auth.signOut({ scope: "global" });
      if (signOutError) throw new PortalError(503, "Senha atualizada. Encerre o acesso antes de entrar novamente.");
      return response.status(200).json({ ok: true });
    }
    if (action === "me") {
      const companies = checked(await client.from("portal_companies")
        .select("id,legal_name,trade_name,cnpj").order("legal_name").limit(100));
      return response.status(200).json({ ok: true, email: user.email, companies });
    }
    const companyId = request.method === "GET" ? url.searchParams.get("companyId") : body.companyId;
    const company = await requireCompany(client, companyId);
    if (action === "company") {
      const [documentsResult, requestsResult] = await Promise.all([
        client.from("portal_documents").select("id,title,period,created_at")
          .eq("company_id", company.id).order("created_at", { ascending: false }).limit(100),
        client.from("portal_requests").select("id,subject,message,status,created_at")
          .eq("company_id", company.id).order("created_at", { ascending: false }).limit(100),
      ]);
      return response.status(200).json({
        ok: true, company, documents: checked(documentsResult), requests: checked(requestsResult),
      });
    }
    if (action === "request") {
      const subject = typeof body.subject === "string" ? body.subject.trim() : "";
      const message = typeof body.message === "string" ? body.message.trim() : "";
      if (!subject || subject.length > 160 || !message || message.length > 4000) {
        throw new PortalError(400, "Informe assunto (até 160 caracteres) e mensagem (até 4.000 caracteres).");
      }
      await rateLimit(request, {}, config, dependencies.makeAdminClient || adminClient);
      const item = checked(await client.from("portal_requests").insert({
        company_id: company.id, created_by: user.id, subject, message, status: "open",
      }).select("id").single());
      return response.status(201).json({ ok: true, id: item.id });
    }
    if (action === "download") {
      const document = checked(await client.from("portal_documents").select("storage_path")
        .eq("company_id", company.id).eq("id", uuid(body.documentId)).maybeSingle());
      if (!document) throw new PortalError(404, "Documento não disponível para este acesso.");
      const result = checked(await client.storage.from("portal-documents").createSignedUrl(document.storage_path, 60, { download: true }));
      return response.status(200).json({ ok: true, url: result.signedUrl });
    }
  } catch (error) {
    const known = error instanceof PortalError;
    return response.status(known ? error.status : 503).json({
      ok: false, message: known ? error.message : "Acesso temporariamente indisponível. Tente novamente.",
    });
  }
}
