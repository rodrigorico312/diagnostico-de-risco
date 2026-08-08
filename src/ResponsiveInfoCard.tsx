import { useEffect, useState } from "react";

type ResponsiveInfoCardProps = {
  number?: string;
  title: string;
  text: string;
  tone?: "dark" | "light";
};

const MOBILE_QUERY = "(max-width: 700px)";

export default function ResponsiveInfoCard({
  number,
  title,
  text,
  tone = "light",
}: ResponsiveInfoCardProps) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [open, setOpen] = useState(() => !window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      setOpen(!event.matches);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <details
      className={`solution-info-card solution-info-card--${tone}`}
      open={open}
      onToggle={(event) => {
        if (isMobile) setOpen(event.currentTarget.open);
      }}
      onClick={(event) => {
        if (!isMobile) event.preventDefault();
      }}
    >
      <summary>
        {number && <span>{number}</span>}
        <strong>{title}</strong>
      </summary>
      <p>{text}</p>
    </details>
  );
}
