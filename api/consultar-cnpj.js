import { isValidCnpj, normalizeCnpj, pickCompanyRegistry } from "../services/company-registry.mjs";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false });
  }
  let body;
  try { body = typeof request.body === "string" ? JSON.parse(request.body) : request.body; }
  catch { return response.status(400).json({ ok: false }); }
  const cnpj = normalizeCnpj(body?.cnpj);
  if (!isValidCnpj(cnpj)) return response.status(400).json({ ok: false, error: "Confira o CNPJ informado." });
  try {
    const result = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: { Accept: "application/json", "User-Agent": "NacionalContabilidade/1.0 (+https://www.nacionalcon.com)" },
      signal: AbortSignal.timeout(6500),
    });
    if (!result.ok) return response.status(result.status === 404 ? 404 : 503).json({ ok: false, error: "Consulta indisponível. Você pode continuar sem consultar." });
    const empresa = pickCompanyRegistry(await result.json(), cnpj);
    if (!empresa) return response.status(503).json({ ok: false, error: "Não foi possível conferir a empresa. Você pode continuar sem consultar." });
    return response.status(200).json({ ok: true, empresa });
  } catch {
    return response.status(503).json({ ok: false, error: "Consulta indisponível. Você pode continuar sem consultar." });
  }
}
