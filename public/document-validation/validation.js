const MAX_FILE_BYTES = 25 * 1024 * 1024;

export async function hashPdf(file) {
  if (!file || file.size === 0) throw new Error("Selecione um PDF não vazio.");
  if (file.size > MAX_FILE_BYTES) throw new Error("O PDF deve ter até 25 MB.");
  if (!globalThis.crypto?.subtle) throw new Error("Abra a consulta em HTTPS para conferir o arquivo.");
  const bytes = await file.arrayBuffer();
  if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") throw new Error("O arquivo selecionado não é um PDF.");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

if (typeof document !== "undefined") {
  const get = id => document.getElementById(id);
  let record = null;
  let lookupSequence = 0;
  let fileSequence = 0;
  let request = null;
  function notice(id, message, kind = "") {
    const element = get(id);
    element.textContent = message;
    element.className = "notice" + (kind ? " " + kind : "");
    element.hidden = !message;
  }
  function displayDate(value) {
    const date = new Date(value.length === 10 ? value + "T12:00:00Z" : value);
    return Number.isNaN(date.getTime()) ? "Não informado" : new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Fortaleza" }).format(date);
  }
  async function lookup(event) {
    event?.preventDefault();
    const code = get("document-code").value.trim();
    if (!code) return;
    const sequence = ++lookupSequence;
    ++fileSequence;
    record = null;
    get("record").hidden = true;
    get("pdf-file").value = "";
    notice("file-result", "");
    request?.abort();
    request = new AbortController();
    get("lookup-button").disabled = true;
    notice("lookup-status", "Consultando o registro do escritório...");
    try {
      const response = await fetch("/api/documento?codigo=" + encodeURIComponent(code), {
        cache: "no-store", referrerPolicy: "no-referrer", signal: request.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível consultar o documento.");
      if (sequence !== lookupSequence) return;
      record = result;
      get("record-title").textContent = result.title;
      get("revision").textContent = "Revisão " + result.revision;
      for (const [id, value] of Object.entries({
        subject: result.subject.name, "subject-cnpj": result.subject.cnpj,
        issuer: result.issuer.name, "issuer-cnpj": result.issuer.cnpj,
        period: result.period, nature: result.nature,
        "issued-on": displayDate(result.issuedOn), "registered-at": displayDate(result.registeredAt),
        accountant: result.accountant.name + " · CRC/PA " + result.accountant.crc,
        "registered-hash": result.sha256,
      })) get(id).textContent = value;
      get("signature-status").textContent = result.signatureStatus === "pending"
        ? "Assinaturas pendentes. O arquivo registrado ainda não é uma versão assinada."
        : "Assinaturas informadas pelo emissor. Esta consulta não verifica os certificados das assinaturas.";
      get("record").hidden = false;
      notice("lookup-status", "Registro localizado. Selecione o PDF recebido para conferir a integridade.");
    } catch (error) {
      if (sequence === lookupSequence && error.name !== "AbortError") notice("lookup-status", error.message || "Falha na consulta. Tente novamente.", "error");
    } finally {
      if (sequence === lookupSequence) get("lookup-button").disabled = false;
    }
  }
  get("lookup-form").addEventListener("submit", lookup);
  get("pdf-file").addEventListener("change", async event => {
    const selectedRecord = record;
    const sequence = ++fileSequence;
    const file = event.target.files[0];
    if (!file || !selectedRecord) return notice("file-result", "");
    notice("file-result", "Conferindo o arquivo neste dispositivo...");
    try {
      const hash = await hashPdf(file);
      if (sequence !== fileSequence || record !== selectedRecord) return;
      if (hash === selectedRecord.sha256) {
        notice("file-result", "Integridade confirmada. Este PDF corresponde exatamente à versão registrada pelo emissor.", "success");
      } else {
        notice("file-result", "O arquivo não corresponde à versão registrada. Ele pode ter sido alterado, assinado posteriormente ou ser outra versão. Solicite ao emissor o registro correto.", "error");
      }
    } catch (error) {
      if (sequence === fileSequence && record === selectedRecord) notice("file-result", error.message, "error");
    }
  });
  const queryCode = new URLSearchParams(location.search).get("codigo");
  if (queryCode) {
    get("document-code").value = queryCode.slice(0, 50);
    lookup();
  }
}
