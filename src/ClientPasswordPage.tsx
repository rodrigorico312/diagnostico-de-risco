import { useEffect, useState, type FormEvent } from "react";
import { portalApi } from "./portal-api";
import "./client-portal.css";

export default function ClientPasswordPage() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Verificando o link de acesso…");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    document.title = "Definir senha | Nacional Contabilidade";
    const controller = new AbortController();
    portalApi("me", undefined, controller.signal).then(() => { setReady(true); setMessage(""); })
      .catch((error) => { if (!controller.signal.aborted) setMessage(error.message); });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("password") !== values.get("confirmation")) { setMessage("As senhas precisam ser iguais."); return; }
    setBusy(true);
    setMessage("");
    try {
      await portalApi("password", { password: values.get("password") });
      form.reset();
      setReady(false);
      setMessage("Senha definida. Entre novamente com sua nova senha.");
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  return <main className="client-portal"><div className="client-portal__body client-portal__password">
    <a href="/"><img width="210" src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" /></a>
    <section className="client-portal__card"><h1>Definir sua senha</h1>
      <p>Use uma senha exclusiva com pelo menos 12 caracteres.</p>
      {message && <p role="status">{message}</p>}
      {ready && <form onSubmit={submit} aria-busy={busy}>
        <label>Nova senha<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} required disabled={busy} /></label>
        <label>Confirmar senha<input type="password" name="confirmation" autoComplete="new-password" minLength={12} maxLength={128} required disabled={busy} /></label>
        <button type="submit" disabled={busy}>{busy ? "Aguarde…" : "Salvar senha"}</button>
      </form>}
      <a href="/area-do-cliente">Voltar para entrar</a>
    </section></div></main>;
}
