import { useEffect, useState } from "react";
import { hasMeasurementChoice, setMeasurementConsent } from "./analytics";
export default function MeasurementConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(!hasMeasurementChoice()); const reopen = () => setVisible(true); window.addEventListener("nc:privacy-settings", reopen); return () => window.removeEventListener("nc:privacy-settings", reopen); }, []);
  if (!visible) return null;
  const choose = (accepted: boolean) => { setMeasurementConsent(accepted); setVisible(false); };
  return <aside className="nc-cookie-banner" aria-label="Preferências de privacidade"><strong>Sua privacidade, sua escolha.</strong><p>Podemos usar medição opcional para entender visitas e melhorar o site. Você pode recusar e continuar navegando. <a href="/politica-de-privacidade">Saiba como tratamos seus dados.</a></p><div><button onClick={() => choose(false)} type="button">Somente necessários</button><button onClick={() => choose(true)} type="button">Aceitar medição</button></div></aside>;
}
