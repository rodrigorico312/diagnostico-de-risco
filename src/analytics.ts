type TrackingWindow = Window & {
  fbq?: (command: string, event: string, parameters?: Record<string, string>) => void;
  gtag?: (command: string, event: string, parameters?: Record<string, string>) => void;
};

export function installLeadTracking() {
  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    const href = link.href;
    const isWhatsapp = href.includes("wa.me/") || href.includes("api.whatsapp.com/");
    const isEmail = href.startsWith("mailto:");
    if (!isWhatsapp && !isEmail) return;

    const trackingWindow = window as TrackingWindow;
    const channel = isWhatsapp ? "whatsapp" : "email";
    trackingWindow.fbq?.("track", "Contact", { channel, page_path: window.location.pathname });
    trackingWindow.gtag?.("event", "generate_lead", { method: channel, page_path: window.location.pathname });
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
