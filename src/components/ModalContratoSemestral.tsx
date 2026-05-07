import { useState, useRef, useEffect } from 'react'

type Props = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalContratoSemestral({ aberto, onConfirmar, onCancelar }: Props) {
  const [leuTudo, setLeuTudo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aberto) {
      setLeuTudo(false)
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, 50)
    }
  }, [aberto])

  if (!aberto) return null

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setLeuTudo(true)
  }

  return (
    <div style={overlayStyle} onClick={onCancelar}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: 'var(--azul-cobalto, #1E3A8A)' }}>Contrato do Plano Semestral</h2>
          <button onClick={onCancelar} style={closeBtnStyle} aria-label="Fechar">&times;</button>
        </div>

        <div ref={scrollRef} onScroll={handleScroll} style={contentStyle}>
          <p style={{ fontSize: '.85rem', color: '#64748B', margin: '0 0 1.5rem' }}><em>Vers&atilde;o: semestral-2026-05</em></p>

          <p style={ps}>Ao finalizar sua assinatura do Plano Semestral da VIVE FIT BOX, voc&ecirc; concorda com todos os termos abaixo.</p>

          <h3 style={h3s}>1. Sobre o Clube de Assinatura</h3>
          <p style={ps}>A VIVE FIT BOX &eacute; um clube de assinatura que envia <strong>4 pe&ccedil;as fitness femininas</strong> por m&ecirc;s, selecionadas com base no perfil de estilo preenchido por voc&ecirc; no cadastro.</p>

          <h3 style={h3s}>2. Como Funciona a Curadoria</h3>
          <p style={ps}>As pe&ccedil;as enviadas s&atilde;o escolhidas pela equipe VIVE FIT com base no seu quiz de perfil. A curadoria &eacute; parte central da experi&ecirc;ncia: n&atilde;o &eacute; poss&iacute;vel escolher pe&ccedil;as espec&iacute;ficas. Atualiza&ccedil;&otilde;es no perfil passam a valer para a pr&oacute;xima box, n&atilde;o para a box j&aacute; em processamento.</p>

          <h3 style={h3s}>3. Datas de Envio</h3>
          <ul style={uls}>
            <li>Boxes enviadas <strong>uma vez por m&ecirc;s</strong>, em datas organizadas por regi&atilde;o</li>
            <li>C&oacute;digo de rastreio enviado quando a box for despachada</li>
            <li>N&atilde;o &eacute; um servi&ccedil;o de entrega imediata: o prazo depende da sua regi&atilde;o</li>
          </ul>

          <h3 style={h3s}>4. Trocas e Devolu&ccedil;&otilde;es</h3>
          <p style={ps}><strong>4.1. Arrependimento em 7 dias (CDC Art. 49):</strong> voc&ecirc; pode desistir em at&eacute; 7 dias do recebimento. Pe&ccedil;as devem estar sem uso, com etiquetas e embalagem originais. <strong>Frete de retorno por nossa conta.</strong> Reembolso integral em at&eacute; 10 dias &uacute;teis ap&oacute;s confer&ecirc;ncia.</p>
          <p style={ps}><strong>4.2. Defeito de fabrica&ccedil;&atilde;o (30 dias):</strong> costura solta, z&iacute;per quebrado, tecido rasgado ou mancha de tinta d&atilde;o direito a troca. Enviar foto pelo e-mail contato@vivefit.site.</p>
          <p style={ps}><strong>4.3. N&atilde;o &eacute; considerado defeito:</strong> n&atilde;o gostar da cor ou modelagem, pe&ccedil;a n&atilde;o servir por mudan&ccedil;a de medidas, preferir pe&ccedil;as diferentes, danos por uso indevido ou lavagem incorreta.</p>

          <h3 style={h3s}>5. Vig&ecirc;ncia e Cobran&ccedil;a do Plano Semestral</h3>
          <p style={ps}><strong>5.1.</strong> O Plano Semestral tem dura&ccedil;&atilde;o de <strong>6 (seis) meses</strong> a partir da data da primeira cobran&ccedil;a aprovada.</p>
          <p style={ps}><strong>5.2.</strong> O valor mensal contratado &eacute; de <strong>R$ 189,90</strong>, acrescido do valor do frete calculado para o seu CEP, cobrado mensalmente no cart&atilde;o de cr&eacute;dito cadastrado.</p>
          <p style={ps}><strong>5.3.</strong> As cobran&ccedil;as s&atilde;o processadas automaticamente, todo m&ecirc;s, na data correspondente &agrave; primeira cobran&ccedil;a. O limite do cart&atilde;o &eacute; bloqueado m&ecirc;s a m&ecirc;s, n&atilde;o h&aacute; bloqueio do valor total no ato da contrata&ccedil;&atilde;o.</p>
          <p style={ps}><strong>5.4.</strong> Em caso de recusa do cart&atilde;o, a VIVE FIT BOX tentar&aacute; novamente conforme as regras autom&aacute;ticas do processador de pagamentos.</p>
          <p style={ps}><strong>5.5.</strong> Cupons de desconto, quando aplicados, s&atilde;o v&aacute;lidos apenas para a <strong>primeira cobran&ccedil;a</strong>. As cobran&ccedil;as seguintes ser&atilde;o processadas pelo valor cheio do plano contratado.</p>

          <h3 style={h3s}>6. Cancelamento</h3>
          <p style={ps}><strong>6.1. Arrependimento (CDC art. 49):</strong> at&eacute; 7 dias corridos do recebimento da primeira box, estorno integral (incluindo frete) e devolu&ccedil;&atilde;o por nossa conta. Contato: contato@vivefit.site ou WhatsApp (93) 99112-9194.</p>
          <p style={ps}><strong>6.2. Cancelamento com aviso pr&eacute;vio (sem multa):</strong> voc&ecirc; pode solicitar o cancelamento a qualquer momento, comunicando com anteced&ecirc;ncia m&iacute;nima de <strong>30 (trinta) dias</strong>. Durante esse per&iacute;odo, as cobran&ccedil;as permanecem ativas e as boxes continuam sendo enviadas normalmente. Ao final dos 30 dias, sua assinatura &eacute; encerrada sem qualquer multa. Voc&ecirc; pode desistir do cancelamento a qualquer momento durante o aviso pr&eacute;vio.</p>
          <p style={ps}><strong>6.3. Cancelamento imediato (sem aviso pr&eacute;vio):</strong> caso opte por cancelar imediatamente, ser&aacute; aplicada multa de 10% sobre o valor da pr&oacute;xima fatura como compensa&ccedil;&atilde;o pelo n&atilde;o cumprimento do aviso pr&eacute;vio.</p>
          <p style={ps}><strong>6.4. Falha da VIVE FIT:</strong> em caso de descumprimento da nossa parte, o cancelamento &eacute; sem multa, com estorno proporcional integral.</p>

          <h3 style={h3s}>7. Endere&ccedil;o de Entrega</h3>
          <p style={ps}>&Eacute; sua responsabilidade manter o endere&ccedil;o atualizado. Boxes devolvidas por endere&ccedil;o desatualizado s&oacute; s&atilde;o reenviadas com cobran&ccedil;a de frete adicional.</p>

          <h3 style={h3s}>8. Dados Pessoais (LGPD)</h3>
          <p style={ps}>Suas informa&ccedil;&otilde;es s&atilde;o tratadas conforme a Lei Geral de Prote&ccedil;&atilde;o de Dados.</p>

          <h3 style={h3s}>9. Foro</h3>
          <p style={ps}>Fica eleito o Foro da Comarca de S&atilde;o Paulo, Estado de S&atilde;o Paulo, para dirimir quaisquer d&uacute;vidas oriundas deste contrato, salvo se voc&ecirc;, como consumidor, optar pelo foro do seu domic&iacute;lio, conforme assegurado pelo art. 101, I, do C&oacute;digo de Defesa do Consumidor.</p>

          <h3 style={h3s}>10. Contato</h3>
          <p style={ps}>E-mail: <strong>contato@vivefit.site</strong> &middot; WhatsApp: <strong>(93) 99112-9194</strong></p>
        </div>

        <div style={footerStyle}>
          <button onClick={onCancelar} style={btnCancelarStyle}>Cancelar</button>
          <button onClick={onConfirmar} disabled={!leuTudo} style={{ ...btnConfirmarStyle, opacity: leuTudo ? 1 : 0.5, cursor: leuTudo ? 'pointer' : 'not-allowed' }}>
            {leuTudo ? 'Li e confirmo' : 'Role at\u00e9 o fim'}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }
const modalStyle: React.CSSProperties = { background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '600px', maxHeight: 'calc(100dvh - 2rem)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }
const headerStyle: React.CSSProperties = { padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const closeBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#64748B', cursor: 'pointer', lineHeight: 1, width: '32px', height: '32px', borderRadius: '50%' }
const contentStyle: React.CSSProperties = { padding: '1.5rem', overflowY: 'auto', flex: 1, fontSize: '.9rem', lineHeight: 1.6, color: '#334155', textAlign: 'justify' }
const footerStyle: React.CSSProperties = { padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }
const btnCancelarStyle: React.CSSProperties = { padding: '.7rem 1.3rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748B', cursor: 'pointer', fontSize: '.9rem', fontWeight: 500 }
const btnConfirmarStyle: React.CSSProperties = { padding: '.7rem 1.3rem', borderRadius: '8px', border: 'none', background: 'var(--cobalto, #1E3A8A)', color: '#fff', fontSize: '.9rem', fontWeight: 600 }
const ps: React.CSSProperties = { margin: '0 0 .9rem' }
const h3s: React.CSSProperties = { fontSize: '1rem', color: 'var(--azul-cobalto, #1E3A8A)', margin: '1.2rem 0 .5rem', fontWeight: 600 }
const uls: React.CSSProperties = { paddingLeft: '1.2rem', margin: '.5rem 0 .9rem' }
