import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

try { process.loadEnvFile(".env.local"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const [command, inputPath] = process.argv.slice(2);
if (!["company", "invite", "link", "revoke", "document"].includes(command) || !inputPath) {
  console.error("Uso: node scripts/manage-portal.mjs company|invite|link|revoke|document arquivo.json");
  process.exit(1);
}
const uuid = (value) => {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("UUID inválido.");
  }
  return value;
};
const result = (response) => {
  if (response.error) throw new Error("Operação recusada pelo serviço. Confira cadastro, permissões e configuração.");
  return response.data;
};
try {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY || !process.env.PORTAL_ORIGIN) {
    throw new Error("Configure SUPABASE_URL, SUPABASE_SECRET_KEY e PORTAL_ORIGIN no ambiente seguro.");
  }
  const configOrigin = new URL(process.env.PORTAL_ORIGIN);
  if (configOrigin.origin !== process.env.PORTAL_ORIGIN ||
      (configOrigin.protocol !== "https:" && configOrigin.hostname !== "localhost")) throw new Error("Origem inválida.");
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  if (command === "company") {
    if (typeof input.legal_name !== "string" || !input.legal_name.trim() || !/^[0-9]{14}$/.test(input.cnpj)) {
      throw new Error("Informe razão social e CNPJ com 14 dígitos.");
    }
    const data = result(await client.from("portal_companies").insert({
      legal_name: input.legal_name.trim(), cnpj: input.cnpj, trade_name: input.trade_name || null,
      tax_regime: input.tax_regime || null, contact_email: input.contact_email || null,
      contact_phone: input.contact_phone || null, address: input.address || null,
    }).select("id").single());
    console.log("Empresa criada:", data.id);
  } else {
    const companyId = uuid(input.companyId);
    const company = result(await client.from("portal_companies").select("id").eq("id", companyId).maybeSingle());
    if (!company) throw new Error("Empresa inexistente.");
    if (command === "invite") {
      if (typeof input.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error("E-mail inválido.");
      // This command sends an email. Run only for an explicitly requested, verified customer.
      const invitation = result(await client.auth.admin.inviteUserByEmail(input.email, {
        redirectTo: `${process.env.PORTAL_ORIGIN}/area-do-cliente/confirmar`,
      }));
      const membership = await client.from("portal_memberships").insert({ company_id: companyId, user_id: invitation.user.id });
      if (membership.error) {
        console.error("Convite enviado, mas o vínculo falhou. A conta permanece sem acesso a esta empresa. Vincule o usuário:", invitation.user.id);
        process.exitCode = 1;
      } else console.log("Convite enviado e vínculo criado. Usuário:", invitation.user.id);
    } else if (command === "link" || command === "revoke") {
      const userId = uuid(input.userId);
      result(await client.auth.admin.getUserById(userId));
      if (command === "link") {
        result(await client.from("portal_memberships").upsert({ company_id: companyId, user_id: userId, active: true }));
        console.log("Vínculo concedido.");
      } else {
        const rows = result(await client.from("portal_memberships").update({ active: false })
          .eq("company_id", companyId).eq("user_id", userId).select("user_id"));
        if (!rows.length) throw new Error("Vínculo inexistente.");
        console.log("Vínculo revogado. Novas consultas e novos links de download estão bloqueados.");
      }
    } else if (command === "document") {
      if (typeof input.title !== "string" || !input.title.trim() || !input.file) throw new Error("Informe título e caminho do PDF.");
      const file = await readFile(input.file);
      if (file.length > 20971520 || file.subarray(0, 5).toString() !== "%PDF-") throw new Error("Use um PDF de até 20 MB.");
      const storagePath = `${companyId}/${randomUUID()}.pdf`;
      result(await client.storage.from("portal-documents").upload(storagePath, file, { contentType: "application/pdf", upsert: false }));
      const document = await client.from("portal_documents").insert({
        company_id: companyId, title: input.title.trim(), period: input.period || null,
        storage_path: storagePath, published: true,
      }).select("id").single();
      if (document.error) {
        const cleanup = await client.storage.from("portal-documents").remove([storagePath]);
        if (cleanup.error) console.error("Upload privado órfão; remover pelo storage:", storagePath);
        throw new Error("Falha ao cadastrar o documento. Nenhum acesso foi concedido pelo portal.");
      }
      console.log("Documento publicado para a empresa:", document.data.id);
    }
  }
} catch (error) {
  // No service errors, tokens or request payloads are written to logs.
  console.error(error instanceof Error ? error.message : "Falha na administração.");
  process.exitCode = 1;
}
