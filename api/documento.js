const CODE_PATTERN = /^GL-[A-F0-9]{32}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

export function normalizeCode(value) {
  const input = String(value ?? "").trim().toUpperCase();
  if (!/^GL-[A-F0-9-]+$/.test(input)) return "";
  const code = "GL-" + input.slice(3).replaceAll("-", "");
  return CODE_PATTERN.test(code) ? code : "";
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }
  const query = new URL(req.url, "https://nacionalcon.com").searchParams;
  const code = normalizeCode(query.get("codigo"));
  if (!code || query.getAll("codigo").length !== 1) {
    return res.status(400).json({ error: "Informe o código completo do documento." });
  }
  let records;
  try {
    records = JSON.parse(process.env.DOCUMENT_VALIDATION_RECORDS_V1 || "null");
    if (!records || typeof records !== "object" || Array.isArray(records)) throw new Error();
  } catch {
    return res.status(503).json({ error: "Consulta temporariamente indisponível." });
  }
  const record = Object.hasOwn(records, code) ? records[code] : null;
  if (!record) return res.status(404).json({ error: "Código não localizado no registro do escritório." });
  if (record.status === "revoked") {
    return res.status(410).json({ error: "Este registro foi cancelado pelo emissor." });
  }
  if (record.status !== "active" || !HASH_PATTERN.test(record.sha256) ||
      !["pending", "provided"].includes(record.signatureStatus) ||
      ![record.title, record.period, record.nature, record.issuedOn, record.registeredAt,
        record.revision, record.filename, record.issuer?.name, record.issuer?.cnpj,
        record.accountant?.name, record.accountant?.crc, record.subject?.name, record.subject?.cnpj]
        .every(value => typeof value === "string" && value.length > 0) ||
      !Number.isSafeInteger(record.byteLength) || record.byteLength <= 0) {
    return res.status(503).json({ error: "Consulta temporariamente indisponível." });
  }
  // Return only the registration fields; never expose private record attachments or contact data.
  return res.status(200).json({
    code,
    status: record.status,
    title: record.title,
    issuer: { name: record.issuer.name, cnpj: record.issuer.cnpj },
    accountant: { name: record.accountant.name, crc: record.accountant.crc },
    subject: { name: record.subject.name, cnpj: record.subject.cnpj },
    period: record.period,
    nature: record.nature,
    issuedOn: record.issuedOn,
    registeredAt: record.registeredAt,
    revision: record.revision,
    signatureStatus: record.signatureStatus,
    filename: record.filename,
    byteLength: record.byteLength,
    sha256: record.sha256,
  });
}
