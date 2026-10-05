import QRCode from "qrcode";
import { PNG } from "pngjs";
import { normalizeCode } from "./documento.js";

export const QR_SIZE = 336;

export async function renderDocumentQr(code = "", part = null) {
  const url = "https://nacionalcon.com/validar-documento" +
    (code ? "?codigo=" + code : "");
  const bytes = await QRCode.toBuffer(url, {
    type: "png", width: QR_SIZE, margin: 4, errorCorrectionLevel: "M",
  });
  if (part === null) return bytes;

  // Equal strips keep the QR in a dynamic Sheets footer without fixed merged rows.
  const original = PNG.sync.read(bytes);
  const height = QR_SIZE / 4;
  const strip = new PNG({ width: QR_SIZE, height });
  original.data.copy(strip.data, 0, (part - 1) * height * QR_SIZE * 4,
    part * height * QR_SIZE * 4);
  return PNG.sync.write(strip);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Metodo nao permitido." });
  }
  const query = new URL(req.url, "https://nacionalcon.com").searchParams;
  const input = query.get("codigo");
  const code = input === null ? "" : normalizeCode(input);
  const partInput = query.get("parte");
  if (query.getAll("codigo").length > 1 || (input !== null && !code) ||
      query.getAll("parte").length > 1 ||
      (partInput !== null && !/^[1-4]$/.test(partInput))) {
    return res.status(400).json({ error: "Parametros invalidos." });
  }
  try {
    const png = await renderDocumentQr(code, partInput === null ? null : Number(partInput));
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", png.length);
    return res.status(200).end(req.method === "HEAD" ? undefined : png);
  } catch {
    return res.status(503).json({ error: "QR temporariamente indisponivel." });
  }
}
