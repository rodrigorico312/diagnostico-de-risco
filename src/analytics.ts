type TrackingWindow = Window & {
  fbq?: (command: string, event: string, parameters?: Record<string, string>) => void;
  gtag?: (command: string, event: string, parameters?: Record<string, string>) => void;
};

type TrackingParameters = Record<string, string>;

export function trackLeadEvent(eventName: string, parameters: TrackingParameters = {}) {
  const trackingWindow = window as TrackingWindow;
  const payload = { ...parameters, page_path: window.location.pathname };

  trackingWindow.fbq?.("trackCustom", eventName, payload);
  trackingWindow.gtag?.("event", eventName, payload);
}

export function installLeadTracking() {
  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    const href = link.href;
    const isWhatsapp = href.includes("wa.me/") || href.includes("api.whatsapp.com/");
    const isEmail = href.startsWith("mailto:");
    const isServiceRequest = (() => {
      try {
        return new URL(href).pathname === "/solicitar-atendimento";
      } catch {
        return false;
      }
    })();

    const explicitEvent = link.dataset.trackEvent;
    if (explicitEvent) {
      trackLeadEvent(explicitEvent, { link_text: link.textContent?.trim() || "" });
    } else if (isServiceRequest) {
      trackLeadEvent("request_service_click", {
        link_text: link.textContent?.trim() || "",
      });
    }

    if (!isWhatsapp && !isEmail) return;

    const trackingWindow = window as TrackingWindow;
    const channel = isWhatsapp ? "whatsapp" : "email";
    if (isWhatsapp) {
      const whatsappKind = link.dataset.whatsappKind || "direct";
      trackLeadEvent(`${whatsappKind}_whatsapp_click`, {
        link_text: link.textContent?.trim() || "",
      });
    }
    trackingWindow.fbq?.("track", "Contact", { channel, page_path: window.location.pathname });
    trackingWindow.gtag?.("event", "generate_lead", { method: channel, page_path: window.location.pathname });
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
