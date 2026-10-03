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

export function inspectRegistration(result, requestedCode, report = () => {}) {
  const present = value => typeof value === "string" && value.trim().length > 0;
  const expectedCode = "GL-" + requestedCode.trim().toUpperCase().slice(3).replaceAll("-", "");
  function check(index, valid, detail, state = "done") {
    if (!valid) {
      const error = new Error("O registro retornado está incompleto ou inconsistente. Tente novamente.");
      error.step = index;
      throw error;
    }
    report(index, state, detail);
  }
  check(0, result?.status === "active" && result.code === expectedCode, "Protocolo localizado no escritório");
  check(1, present(result.subject?.name) && present(result.subject?.cnpj), "Nome e CNPJ presentes no registro");
  check(2, [result.issuer?.name, result.issuer?.cnpj, result.accountant?.name, result.accountant?.crc].every(present), "Emissor e CRC informados no registro");
  check(3, [result.period, result.revision, result.issuedOn, result.registeredAt].every(present) &&
    !Number.isNaN(Date.parse(result.issuedOn)) && !Number.isNaN(Date.parse(result.registeredAt)),
    "Período e revisão " + result.revision + " carregados");
  check(4, /^[a-f0-9]{64}$/.test(result.sha256) && present(result.filename) &&
    Number.isSafeInteger(result.byteLength) && result.byteLength > 0, "Referência SHA-256 disponível; PDF ainda não conferido");
  check(5, ["pending", "provided"].includes(result.signatureStatus),
    result.signatureStatus === "pending" ? "Assinaturas pendentes" : "Assinaturas informadas; certificados não verificados", "warning");
}

if (typeof document !== "undefined") {
  const get = id => document.getElementById(id);
  let record = null;
  let lookupSequence = 0;
  let fileSequence = 0;
  let request = null;
  let modalPhase = "idle";
  const dialog = get("consultation-dialog");
  function step(index, state, detail) {
    get("lookup-step-" + index).dataset.state = state;
    get("lookup-step-status-" + index).textContent = detail;
    get("lookup-step-marker-" + index).textContent = state === "done" ? "✓" : state === "warning" || state === "error" ? "!" : String(index + 1);
    if (state === "done" || state === "warning") get("consultation-progress").value = index + 1;
  }
  function openConsultation() {
    modalPhase = "loading";
    for (let index = 0; index < 6; index++) step(index, "waiting", "Aguardando consulta");
    step(0, "active", "Consultando o registro do escritório...");
    get("consultation-progress").removeAttribute("value");
    get("consultation-title").textContent = "Consultando documento";
    get("consultation-status").textContent = "Buscando o protocolo no registro do escritório.";
    get("consultation-action").textContent = "Cancelar";
    if (!dialog.open) dialog.showModal();
  }
  function dismissConsultation() {
    if (modalPhase === "loading") {
      ++lookupSequence;
      request?.abort();
      get("lookup-button").disabled = false;
      notice("lookup-status", "Consulta cancelada.");
    }
    const showRecord = modalPhase === "ready";
    modalPhase = "idle";
    dialog.close();
    if (showRecord) get("record").focus({ preventScroll: true });
  }
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
    const controller = request;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
    get("lookup-button").disabled = true;
    notice("lookup-status", "Consultando o registro do escritório...");
    openConsultation();
    try {
      const response = await fetch("/api/documento?codigo=" + encodeURIComponent(code), {
        cache: "no-store", referrerPolicy: "no-referrer", signal: request.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível consultar o documento.");
      if (sequence !== lookupSequence) return;
      inspectRegistration(result, code, step);
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
      modalPhase = "ready";
      get("consultation-title").textContent = "Registro localizado";
      get("consultation-status").textContent = result.signatureStatus === "pending"
        ? "Cadastro localizado. Assinaturas pendentes. O PDF ainda não foi conferido."
        : "Cadastro localizado. Certificados de assinatura não verificados. O PDF ainda não foi conferido.";
      get("consultation-action").textContent = "Ver registro";
    } catch (error) {
      if (sequence === lookupSequence) {
        const message = timedOut ? "A consulta demorou demais. Tente novamente." : error.message || "Falha na consulta. Tente novamente.";
        notice("lookup-status", message, "error");
        step(error.step ?? 0, "error", "Consulta não concluída");
        for (let index = (error.step ?? 0) + 1; index < 6; index++) step(index, "waiting", "Não conferido");
        get("consultation-progress").value = error.step ?? 0;
        modalPhase = "error";
        get("consultation-title").textContent = "Não foi possível concluir";
        get("consultation-status").textContent = message;
        get("consultation-action").textContent = "Fechar";
      }
    } finally {
      clearTimeout(timeout);
      if (sequence === lookupSequence) get("lookup-button").disabled = false;
    }
  }
  get("consultation-action").addEventListener("click", dismissConsultation);
  dialog.addEventListener("cancel", event => { event.preventDefault(); dismissConsultation(); });
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
  }
}
