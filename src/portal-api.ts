export type CompanySummary = { id: string; legal_name: string; trade_name: string | null; cnpj: string };
export type Company = CompanySummary & {
  tax_regime: string | null; contact_email: string | null; contact_phone: string | null; address: string | null;
};
export type PortalDocument = { id: string; title: string; period: string | null; created_at: string };
export type PortalRequest = { id: string; subject: string; message: string; status: string; created_at: string };
export class PortalApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function portalApi<T>(action: string, data?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const params = new URLSearchParams({ action });
  if (data && action === "company") params.set("companyId", String(data.companyId));
  const read = action === "me" || action === "company";
  const response = await fetch(`/api/client-portal${read ? `?${params}` : ""}`, {
    method: read ? "GET" : "POST", credentials: "same-origin", cache: "no-store", signal,
    headers: read ? { Accept: "application/json" } : { "Content-Type": "application/json" },
    body: read ? undefined : JSON.stringify({ ...data, action }),
  });
  let payload: T & { message?: string };
  try { payload = await response.json(); }
  catch { throw new PortalApiError("Acesso temporariamente indisponível.", response.status); }
  if (!response.ok) throw new PortalApiError(payload.message || "Não foi possível concluir a operação.", response.status);
  return payload;
}
