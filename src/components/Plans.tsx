import { useState, useEffect } from 'react';

// Paleta oficial Preset B (Cobalto + Coral)
const C = {
  cobalto: '#1E3A8A',
  cobaltoSoft: '#DBEAFE',
  cobaltoSofter: '#EFF4FE',
  coral: '#FF5A5F',
  coralDark: '#E53E47',
  gelo: '#F8FAFC',
  cinzaAzul: '#F1F5F9', // novo background da seção
  branco: '#FFFFFF',
  azulNoite: '#0F172A',
  cinzaChumbo: '#334155',
  cinzaMudo: '#94A3B8',
  border: '#E4E8EE',
  borderLight: '#F0F4F6',
};

// Outfit em TUDO — zero Arial
const FONT = "'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif";

// Tabular nums + lining nums forçados (Outfit pode ter old-style por padrão)
const NUM = {
  fontVariantNumeric: 'tabular-nums lining-nums',
  fontFeatureSettings: '"tnum" 1, "lnum" 1',
};

// Lógica preservada — handlePlanClick com redirect real
type PlanoId = 'mensal' | 'semestral' | 'anual';

const handlePlanClick = (planoId: PlanoId): void => {
  try {
    localStorage.setItem('vivefit_plano_intencao', planoId);
  } catch {
    /* noop — modo privado/quota */
  }
  window.location.hash = `#/cadastro?plano=${planoId}`;
};

type IconProps = { color: string };

const Check = ({ color }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 3 }}
  >
    <circle cx="10" cy="10" r="9" fill={color} fillOpacity="0.12" />
    <path
      d="M6 10.5L8.5 13L14 7.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Alert = ({ color }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 3 }}
  >
    <circle cx="10" cy="10" r="9" fill={color} fillOpacity="0.12" />
    <path d="M10 6V11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14" r="1" fill={color} />
  </svg>
);

// Ícone "i" minimalista — discreto pra rodapé info
const InfoMini = ({ color }: IconProps) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <path
      d="M12 11V16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="8" r="1" fill={color} />
  </svg>
);

// Botão CTA Primário — Coral pill, sombra dupla coral suave
const btnPrimary = {
  marginTop: 24,
  height: 48,
  background: C.coral,
  border: 'none',
  borderRadius: 60,
  color: C.branco,
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  boxShadow:
    '0 2px 12px rgba(255, 90, 95, 0.25), 0 1px 3px rgba(255, 90, 95, 0.15)',
  transition: 'all 0.2s ease',
};

// Botão CTA Secundário — pill vazado, borda 1.5 cobalto
const btnSecondary = {
  marginTop: 24,
  height: 48,
  background: 'transparent',
  border: `1.5px solid ${C.cobalto}`,
  borderRadius: 60,
  color: C.cobalto,
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

// ──────────────────────────────────────────────────────────────────────────────
// CARD MENSAL
// ─────────────────────────────────────────────────────────────────────────────
type CardProps = { desktop: boolean };

const CardMensal = ({ desktop }: CardProps) => (
  <article
    aria-labelledby="plano-mensal-title"
    className="transition-all duration-300 ease-out hover:-translate-y-1"
    style={{
      background: C.branco,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: desktop ? 24 : 22,
      width: desktop ? 296 : '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
    }}
  >
    {/* Título + subtítulo */}
    <h3
      id="plano-mensal-title"
      style={{
        fontFamily: FONT,
        fontSize: 17,
        fontWeight: 700,
        color: C.cobalto,
        margin: 0,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
      }}
    >
      Plano Mensal
    </h3>
    <p
      style={{
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 500,
        color: C.cinzaChumbo,
        margin: '4px 0 0 0',
        letterSpacing: '-0.01em',
      }}
    >
      Perfeito para experimentar
    </p>

    {/* Preço inline */}
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 700,
          color: C.cobalto,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        R$ 199,90
      </span>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          color: C.cinzaChumbo,
        }}
      >
        /mês
      </span>
    </div>

    <div style={{ height: 1, background: C.border, margin: '18px 0' }} />

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        flex: 1,
      }}
    >
      {[
        '4 peças fitness selecionadas',
        'Sem fidelidade ou multa',
        'Cancele quando quiser',
      ].map((b, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 400,
            color: C.azulNoite,
            lineHeight: 1.45,
            ...(i === 0 ? NUM : {}),
          }}
        >
          <Check color={C.cobalto} />
          <span>{b}</span>
        </li>
      ))}
    </ul>

    <button
      type="button"
      onClick={() => handlePlanClick('mensal')}
      style={btnSecondary}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.cobalto;
        e.currentTarget.style.color = C.branco;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = C.cobalto;
      }}
    >
      Quero assinar
    </button>
  </article>
);

// ─────────────────────────────────────────────────────────────────────────────
// CARD SEMESTRAL — A ESTRELA
// ─────────────────────────────────────────────────────────────────────────────
const CardSemestral = ({ desktop }: CardProps) => (
  <article
    aria-labelledby="plano-semestral-title"
    className="transition-all duration-300 ease-out"
    style={{
      background: C.cobalto,
      borderRadius: 16,
      padding: desktop ? 26 : 24,
      paddingTop: desktop ? 34 : 32,
      width: desktop ? 332 : '100%',
      transform: desktop ? 'scale(1.03)' : 'none',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: desktop
        ? `0 12px 32px -8px ${C.cobalto}40, 0 2px 8px rgba(15, 23, 42, 0.08)`
        : `0 8px 20px -6px ${C.cobalto}40`,
      zIndex: 2,
    }}
    onMouseEnter={(e) => {
      if (desktop) {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 16px 40px -8px ${C.cobalto}55`;
      }
    }}
    onMouseLeave={(e) => {
      if (desktop) {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = `0 12px 32px -8px ${C.cobalto}40, 0 2px 8px rgba(15, 23, 42, 0.08)`;
      }
    }}
  >
    {/* Tag MELHOR OPÇÃO */}
    <div
      style={{
        position: 'absolute',
        top: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        background: C.coral,
        color: C.branco,
        padding: '6px 16px',
        borderRadius: 60,
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        boxShadow:
          '0 2px 12px rgba(255, 90, 95, 0.35), 0 1px 3px rgba(255, 90, 95, 0.2)',
        whiteSpace: 'nowrap',
      }}
    >
      Melhor Opção
    </div>

    <h3
      id="plano-semestral-title"
      style={{
        fontFamily: FONT,
        fontSize: 19,
        fontWeight: 700,
        color: C.branco,
        margin: 0,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
      }}
    >
      Plano Semestral
    </h3>
    <p
      style={{
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.7)',
        margin: '4px 0 0 0',
        letterSpacing: '-0.01em',
      }}
    >
      A escolha favorita das assinantes
    </p>

    <s
      style={{
        ...NUM,
        fontFamily: FONT,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.55)',
        marginTop: 12,
        textDecoration: 'line-through',
        fontWeight: 400,
      }}
      aria-label="De R$ 199,90 por R$ 189,90"
    >
      R$ 199,90
    </s>

    {/* Preço gigante inline com /mês */}
    <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 800,
          color: C.branco,
          letterSpacing: '-0.035em',
          lineHeight: 1,
        }}
      >
        R$ 189,90
      </span>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.75)',
        }}
      >
        /mês
      </span>
    </div>

    <div
      style={{
        height: 1,
        background: 'rgba(255, 255, 255, 0.15)',
        margin: '18px 0',
      }}
    />

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        flex: 1,
      }}
    >
      {[
        { text: 'Assinatura Inteligente', emphasis: false },
        { text: 'NÃO bloqueia o limite do cartão', emphasis: true },
        { text: 'Renovação mensal automática', emphasis: false },
      ].map((b, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            fontFamily: FONT,
            fontSize: 14,
            color: C.branco,
            lineHeight: 1.45,
            fontWeight: b.emphasis ? 600 : 400,
          }}
        >
          <Check color={C.coral} />
          <span>{b.text}</span>
        </li>
      ))}
    </ul>

    <button
      type="button"
      onClick={() => handlePlanClick('semestral')}
      style={btnPrimary}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.coralDark;
        e.currentTarget.style.boxShadow =
          '0 4px 16px rgba(255, 90, 95, 0.4), 0 2px 6px rgba(255, 90, 95, 0.25)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.coral;
        e.currentTarget.style.boxShadow =
          '0 2px 12px rgba(255, 90, 95, 0.25), 0 1px 3px rgba(255, 90, 95, 0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      Quero assinar
    </button>
  </article>
);

// ─────────────────────────────────────────────────────────────────────────────
// CARD ANUAL
// ─────────────────────────────────────────────────────────────────────────────
const CardAnual = ({ desktop }: CardProps) => (
  <article
    aria-labelledby="plano-anual-title"
    className="transition-all duration-300 ease-out hover:-translate-y-1"
    style={{
      background: C.branco,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: desktop ? 24 : 22,
      width: desktop ? 296 : '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
    }}
  >
    <h3
      id="plano-anual-title"
      style={{
        fontFamily: FONT,
        fontSize: 17,
        fontWeight: 700,
        color: C.cobalto,
        margin: 0,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
      }}
    >
      Plano Anual
    </h3>
    <p
      style={{
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 500,
        color: C.cinzaChumbo,
        margin: '4px 0 0 0',
        letterSpacing: '-0.01em',
      }}
    >
      A maior economia do Clube
    </p>

    <s
      style={{
        ...NUM,
        fontFamily: FONT,
        fontSize: 13,
        color: C.cinzaMudo,
        marginTop: 12,
        textDecoration: 'line-through',
      }}
      aria-label="De R$ 199,90 por R$ 179,90"
    >
      R$ 199,90
    </s>

    <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 700,
          color: C.cobalto,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        R$ 179,90
      </span>
      <span
        style={{
          ...NUM,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          color: C.cinzaChumbo,
        }}
      >
        /mês
      </span>
    </div>

    <div style={{ height: 1, background: C.border, margin: '18px 0' }} />

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        flex: 1,
      }}
    >
      <li
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontFamily: FONT,
          fontSize: 14,
          color: C.azulNoite,
          lineHeight: 1.45,
        }}
      >
        <Check color={C.cobalto} />
        <span>Preço exclusivo de assinante</span>
      </li>
      <li
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontFamily: FONT,
          fontSize: 14,
          color: C.azulNoite,
          lineHeight: 1.45,
          ...NUM,
        }}
      >
        <Check color={C.cobalto} />
        <span>Parcelamento tradicional em 12x</span>
      </li>
      <li
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontFamily: FONT,
          fontSize: 14,
          color: C.cinzaChumbo,
          lineHeight: 1.45,
        }}
      >
        <Alert color={C.coral} />
        <span>Consome o limite total do cartão</span>
      </li>
    </ul>

    <button
      type="button"
      onClick={() => handlePlanClick('anual')}
      style={btnSecondary}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.cobalto;
        e.currentTarget.style.color = C.branco;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = C.cobalto;
      }}
    >
      Quero assinar
    </button>
  </article>
);

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — detecta viewport via matchMedia
// ─────────────────────────────────────────────────────────────────────────────
type Viewport = 'desktop' | 'mobile';

const DESKTOP_QUERY = '(min-width: 768px)';

function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(DESKTOP_QUERY);
    const handler = (e: MediaQueryListEvent) => setViewport(e.matches ? 'desktop' : 'mobile');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return viewport;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function Plans() {
  const viewport = useViewport();

  return (
    <>
      {/* Import Outfit do Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Section Plans */}
      <section
        id="planos"
        style={{
          background: C.gelo,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 24,
          paddingRight: 24,
          fontFamily: FONT,
        }}
      >
        {/* Header — Variação A: minimalista, sem eyebrow */}
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto 56px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: FONT,
              fontSize: viewport === 'mobile' ? 32 : 42,
              fontWeight: 700,
              color: C.azulNoite,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Escolha o plano certo
            <br />
            <span style={{ color: C.cobalto }}>pra você</span>
          </h2>
        </div>

        {/* Cards */}
        {viewport === 'desktop' ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 20,
              maxWidth: 1200,
              margin: '0 auto',
              paddingTop: 16,
            }}
          >
            <CardMensal desktop />
            <CardSemestral desktop />
            <CardAnual desktop />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              maxWidth: 440,
              margin: '0 auto',
              paddingTop: 16,
            }}
          >
            <CardMensal desktop={false} />
            <CardSemestral desktop={false} />
            <CardAnual desktop={false} />
          </div>
        )}

        {/* Card de info — anti-armadilha 12.1: borda discreta cobalto-soft, sem border-left coral */}
        <div
          style={{
            maxWidth: 680,
            margin: '48px auto 0',
            padding: '18px 22px',
            background: C.cobaltoSofter,
            border: `1px solid ${C.cobaltoSoft}`,
            borderRadius: 12,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ marginTop: 1 }}>
            <InfoMini color={C.cobalto} />
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 400,
              color: C.azulNoite,
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: C.cobalto,
                letterSpacing: '-0.02em',
                marginRight: 4,
              }}
            >
              Dúvida sobre o limite?
            </span>
            O Plano Semestral é o único com{' '}
            <strong style={{ color: C.cobalto, fontWeight: 700 }}>
              Assinatura Inteligente
            </strong>{' '}
            que debita apenas o valor do mês, protegendo o limite do seu cartão.
          </p>
        </div>
      </section>
    </>
  );
}
