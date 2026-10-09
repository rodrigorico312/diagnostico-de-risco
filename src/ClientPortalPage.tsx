import { useEffect, useState, type FormEvent } from "react";
import { portalApi, PortalApiError, type Company, type CompanySummary, type PortalDocument, type PortalRequest } from "./portal-api";
import "./client-portal.css";

type Snapshot = { company: Company; documents: PortalDocument[]; requests: PortalRequest[] };
const statusNames: Record<string, string> = { open: "Recebida", in_progress: "Em andamento", closed: "Concluída" };
const date = (value: string) => new Intl.DateTimeFormat("pt-BR").format(new Date(value));

export default function ClientPortalPage() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    document.title = "Meu cadastro | Nacional Contabilidade";
    const controller = new AbortController();
    portalApi<{ email: string; companies: CompanySummary[] }>("me", undefined, controller.signal)
      .then((data) => { setEmail(data.email); setCompanies(data.companies); setSelected(data.companies[0]?.id || ""); })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        if (failure instanceof PortalApiError && failure.status === 401) window.location.replace("/area-do-cliente");
        else setError(failure.message);
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    const checkBack = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener("pageshow", checkBack);
    return () => { controller.abort(); window.removeEventListener("pageshow", checkBack); };
  }, []);

  useEffect(() => {
    if (!selected || leaving) return;
    const controller = new AbortController();
    setSnapshot(null);
    setError("");
    setNotice("");
    portalApi<Snapshot>("company", { companyId: selected }, controller.signal)
      .then(setSnapshot).catch((failure) => {
        if (controller.signal.aborted) return;
        setSnapshot(null);
        if (failure instanceof PortalApiError && failure.status === 401) window.location.replace("/area-do-cliente");
        else setError(failure.message);
      });
    return () => controller.abort();
  }, [selected, revision, leaving]);

  useEffect(() => {
    const recheck = () => { if (!document.hidden && !busy) setRevision((value) => value + 1); };
    window.addEventListener("focus", recheck);
    const timer = window.setInterval(recheck, 60000);
    return () => { window.removeEventListener("focus", recheck); window.clearInterval(timer); };
  }, [busy]);

  async function logout() {
    setLeaving(true);
    setSnapshot(null);
    setCompanies([]);
    try { await portalApi("logout"); window.location.replace("/area-do-cliente"); }
    catch (failure) { setError((failure as Error).message); }
  }
  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setNotice("");
    try {
      await portalApi("request", { companyId: selected, subject: fields.get("subject"), message: fields.get("message") });
      form.reset();
      setRevision((value) => value + 1);
    } catch (failure) { setNotice((failure as Error).message); }
    finally { setBusy(false); }
  }
  async function download(documentId: string) {
    setBusy(true);
    setNotice("");
    try {
      const data = await portalApi<{ url: string }>("download", { companyId: selected, documentId });
      // The server obtains this URL from private storage with a 60-second TTL.
      const link = document.createElement("a");
      link.href = data.url; link.rel = "noreferrer"; link.referrerPolicy = "no-referrer"; link.click();
    } catch (failure) { setNotice((failure as Error).message); }
    finally { setBusy(false); }
  }
  const visible = !leaving && snapshot?.company.id === selected ? snapshot : null;
  return <main className="client-portal">
    <header className="client-portal__header">
      <a href="/" aria-label="Nacional Contabilidade — início"><img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" /></a>
      <div><span>{leaving ? "" : email}</span><button onClick={logout} disabled={leaving && !error}>Sair</button></div>
    </header>
    <div className="client-portal__body">
      <p className="client-portal__eyebrow">ÁREA DO CLIENTE</p>
      <h1>Sua empresa, em um só lugar.</h1>
      {error && <div className="client-portal__notice" role="alert">{error} <button onClick={() => window.location.reload()}>Tentar novamente</button></div>}
      {notice && <p className="client-portal__notice" role="status">{notice}</p>}
      {loading && <p role="status">Verificando seu acesso…</p>}
      {!loading && !error && !leaving && companies.length === 0 && <section className="client-portal__card">
        <h2>Seu acesso ainda não tem empresa vinculada</h2>
        <p>A equipe da Nacional precisa conferir o cadastro e liberar sua empresa.</p>
        <a href="/solicitar-acesso?perfil=cliente">Solicitar vinculação</a>
      </section>}
      {companies.length > 0 && !leaving && <label className="client-portal__company-picker">Empresa
        <select value={selected} disabled={busy} onChange={(event) => { setSnapshot(null); setSelected(event.target.value); }}>
          {companies.map((company) => <option key={company.id} value={company.id}>{company.trade_name || company.legal_name} — {company.cnpj}</option>)}
        </select>
      </label>}
      {selected && !visible && !error && !leaving && <p role="status">Consultando informações da empresa…</p>}
      {visible && <div className="client-portal__grid">
        <section className="client-portal__card">
          <h2>Cadastro da empresa</h2>
          <dl>{[
            ["Razão social", visible.company.legal_name], ["Nome fantasia", visible.company.trade_name],
            ["CNPJ", visible.company.cnpj], ["Regime tributário", visible.company.tax_regime],
            ["E-mail", visible.company.contact_email], ["Telefone", visible.company.contact_phone],
            ["Endereço", visible.company.address],
          ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Não informado"}</dd></div>)}</dl>
          <p>Para corrigir o cadastro, envie uma solicitação à equipe.</p>
        </section>
        <section className="client-portal__card">
          <h2>Documentos</h2>
          {visible.documents.length === 0 ? <p>Nenhum documento disponível para esta empresa.</p> :
            <ul>{visible.documents.map((item) => <li key={item.id}><div><strong>{item.title}</strong><span>{item.period || date(item.created_at)}</span></div>
              <button disabled={busy} onClick={() => download(item.id)} aria-label={`Baixar ${item.title}`}>Baixar PDF</button></li>)}</ul>}
          <p>Exibindo até 100 documentos mais recentes.</p>
        </section>
        <section className="client-portal__card">
          <h2>Fale com a equipe</h2>
          <form onSubmit={sendRequest} aria-busy={busy}>
            <label>Assunto<input name="subject" required maxLength={160} disabled={busy} /></label>
            <label>Mensagem<textarea name="message" required maxLength={4000} rows={5} disabled={busy} /></label>
            <button disabled={busy} type="submit">{busy ? "Aguarde…" : "Enviar solicitação"}</button>
          </form>
        </section>
        <section className="client-portal__card">
          <h2>Solicitações da empresa</h2>
          {visible.requests.length === 0 ? <p>Nenhuma solicitação registrada.</p> :
            <ul>{visible.requests.map((item) => <li key={item.id}><div><strong>{item.subject}</strong>
              <span>{statusNames[item.status] || item.status} · {date(item.created_at)}</span><p>{item.message}</p></div></li>)}</ul>}
          <p>Exibindo até 100 solicitações mais recentes.</p>
        </section>
      </div>}
    </div>
  </main>;
}
