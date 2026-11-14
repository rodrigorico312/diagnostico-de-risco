export type TrackingParameters = Record<string, string>;
type TrackingWindow = Window & { fbq?: (...args: unknown[]) => void; gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]; _fbq?: (...args: unknown[]) => void };
export type LeadAttribution = { utm_source: string; utm_medium: string; utm_campaign: string; landing_page: string; referrer_host: string; source_group: string };
const CONSENT_KEY = "nacional_measurement_v1", ATTRIBUTION_KEY = "nacional_lead_source_v1";
const safe = (value: string | null) => (value || "").replace(/[^a-zA-Z0-9_ .-]/g, "").slice(0, 80);
const isPreview = () => import.meta.env.VITE_PREVIEW_MODE === "true" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
export function measurementAllowed() { try { return localStorage.getItem(CONSENT_KEY) === "accepted"; } catch { return false; } }
export function getLeadAttribution(): LeadAttribution {
  try { const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "null"); if (stored?.landing_page && stored?.source_group) return stored; } catch { /* Storage is optional. */ }
  const query = new URLSearchParams(window.location.search);
  let host = ""; try { host = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* Invalid referrer. */ }
  const source = safe(query.get("utm_source")), reference = `${source} ${host}`.toLowerCase();
  const sourceGroup = /google/.test(reference) ? "google" : /bing/.test(reference) ? "bing" : /instagram/.test(reference) ? "instagram" : /facebook|fb\./.test(reference) ? "facebook" : source ? "campaign" : host && host !== window.location.hostname ? "referral" : "direct";
  const result = { utm_source: source, utm_medium: safe(query.get("utm_medium")), utm_campaign: safe(query.get("utm_campaign")), landing_page: window.location.pathname.slice(0,180), referrer_host: host.slice(0,180), source_group: sourceGroup };
  try { sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(result)); } catch { /* Continue without persistence. */ }
  return result;
}
export function initializeMeasurement() {
  if (!measurementAllowed() || isPreview()) return;
  const w = window as TrackingWindow;
  if (!w.fbq) {
    const pixel = function (...args: unknown[]) { const p = pixel as typeof pixel & { callMethod?: (...a: unknown[]) => void; queue: unknown[] }; if (p.callMethod) p.callMethod(...args); else p.queue.push(args); };
    Object.assign(pixel, { push: pixel, loaded: true, version: "2.0", queue: [] });
    w.fbq = pixel; w._fbq = pixel;
    const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
    w.fbq("init", "1662572128063141"); w.fbq("track", "PageView");
  } else w.fbq("consent", "grant");
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (id && /^G-[A-Z0-9]+$/.test(id) && !w.gtag) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer!.push(arguments); };
    w.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    // Apply before tag initialization: the Google-managed container may initialize
    // its destination before processing the stream-specific config command.
    w.gtag("set", { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: "" });
    w.gtag("js", new Date()); w.gtag("config", id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement("script"); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(script);
    w.gtag("event", "page_view", { page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: "", page_title: document.title });
  }
}
export function setMeasurementConsent(accepted: boolean) {
  try { localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined"); } catch { /* A visitor can still use the site. */ }
  if (accepted) { initializeMeasurement(); const w = window as TrackingWindow; w.gtag?.("consent", "update", { analytics_storage: "granted" }); if (window.location.pathname === "/mei-em-crescimento") trackLeadEvent("mei_page_view"); }
  else { const w = window as TrackingWindow; w.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }); w.fbq?.("consent", "revoke"); }
}
export function hasMeasurementChoice() { try { return ["accepted", "declined"].includes(localStorage.getItem(CONSENT_KEY) || ""); } catch { return false; } }
export function trackLeadEvent(eventName: string, parameters: TrackingParameters = {}) {
  if (!measurementAllowed() || isPreview()) return;
  const allowed = ["form_id", "interesse", "momento", "calculator", "status", "projection_status", "method"];
  const payload = { ...Object.fromEntries(Object.entries(parameters).filter(([k]) => allowed.includes(k)).map(([k,v]) => [k, safe(v)])), page_path: window.location.pathname, source_group: getLeadAttribution().source_group };
  const w = window as TrackingWindow;
  w.fbq?.("trackCustom", eventName, payload);
  w.gtag?.("event", eventName, { ...payload, page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: "" });
}
export function installLeadTracking() {
  getLeadAttribution(); initializeMeasurement();
  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]"); if (!link) return;
    const url = new URL(link.href, window.location.origin);
    if (["wa.me", "api.whatsapp.com"].includes(url.hostname)) { trackLeadEvent("whatsapp_click"); trackLeadEvent(`${link.dataset.whatsappKind || "direct"}_whatsapp_click`); }
    if (url.pathname === "/solicitar-atendimento") trackLeadEvent("request_service_click");
    if (link.dataset.trackEvent) trackLeadEvent(link.dataset.trackEvent);
  };
  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
