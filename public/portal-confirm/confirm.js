// Keep email secrets out of URLs, analytics, history and HTTP access logs.
const params = new URLSearchParams(window.location.hash.slice(1));
const token_hash = params.get("token_hash");
const type = params.get("type");
window.history.replaceState(null, "", "/area-do-cliente/confirmar");
const button = document.getElementById("confirm");
const message = document.getElementById("message");
if (!token_hash || !["invite", "recovery"].includes(type)) {
  message.textContent = "Link inválido. Abra o link completo recebido por e-mail ou solicite um novo.";
} else {
  button.disabled = false;
  button.addEventListener("click", async () => {
    button.disabled = true;
    message.textContent = "Verificando o acesso…";
    try {
      const response = await fetch("/api/client-portal", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", token_hash, type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Link inválido ou vencido.");
      window.location.replace("/area-do-cliente/senha");
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : "Não foi possível confirmar o acesso.";
      button.disabled = false;
    }
  });
}
