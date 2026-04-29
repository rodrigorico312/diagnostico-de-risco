import { useEffect, useRef } from 'react'

type Props = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalTermos({ aberto, onConfirmar, onCancelar }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aberto && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div style={overlayStyle} onClick={onCancelar}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: 'var(--azul-cobalto, #1E3A8A)' }}>Termos de Uso</h2>
          <button onClick={onCancelar} style={closeBtnStyle} aria-label="Fechar">x</button>
        </div>

        <div ref={scrollRef} style={contentStyle}>
          <p style={{ fontSize: '.85rem', color: '#64748B', margin: '0 0 1.5rem' }}><em>Ultima atualizacao: abril de 2026</em></p>

          <p style={paragraphStyle}>Ao finalizar sua assinatura VIVE FIT BOX, voce concorda com os termos abaixo.</p>

          <h3 style={h3}>1. Sobre o Clube de Assinatura</h3>
          <p style={paragraphStyle}>A VIVE FIT BOX e um clube de assinatura mensal que envia <strong>4 pecas fitness femininas</strong> por mes, selecionadas com base no perfil de estilo preenchido por voce no cadastro.</p>

          <h3 style={h3}>2. Como Funciona a Curadoria</h3>
          <p style={paragraphStyle}>As pecas enviadas sao escolhidas pela equipe VIVE FIT com base no seu quiz de perfil. A curadoria e parte central da experiencia - nao e possivel escolher pecas especificas, o valor do produto esta na surpresa.</p>
          <p style={paragraphStyle}>Atualizacoes no perfil passam a valer para a <strong>proxima</strong> box, nao para a box ja em processamento.</p>

          <h3 style={h3}>3. Datas de Envio</h3>
          <ul style={ulStyle}>
            <li>Boxes enviadas <strong>uma vez por mes</strong>, em datas organizadas por regiao</li>
            <li>Codigo de rastreio enviado quando a box for despachada</li>
            <li>Nao e um servico de entrega imediata - o prazo depende da sua regiao</li>
          </ul>

          <h3 style={h3}>4. Trocas e Devolucoes</h3>
          <p style={paragraphStyle}><strong>4.1. Direito de Arrependimento (7 dias):</strong> voce pode desistir em ate 7 dias do recebimento da box. Pecas devem estar sem uso, com etiquetas e embalagem originais. <strong>Frete de retorno por nossa conta</strong> - enviamos codigo de postagem gratuito. Reembolso integral do valor da assinatura em ate 10 dias uteis apos conferencia.</p>
          <p style={paragraphStyle}><strong>4.2. Defeito de fabricacao (30 dias):</strong> costura solta, ziper quebrado, tecido rasgado ou mancha de tinta dao direito a troca. Enviar foto pelo e-mail contato@vivefit.site.</p>
          <p style={paragraphStyle}><strong>4.3. Nao e considerado defeito:</strong> nao gostar da cor/modelagem, peca nao servir por mudanca de medidas, preferir pecas diferentes, danos por uso indevido ou lavagem incorreta.</p>

          <h3 style={h3}>5. Planos</h3>
          <ul style={ulStyle}>
            <li><strong>Mensal:</strong> R$ 199,90/mes - sem fidelidade</li>
            <li><strong>Semestral:</strong> R$ 189,90/mes - cobranca mensal por 6 meses no cartao de credito</li>
            <li><strong>Anual:</strong> R$ 2.158,80 - pagamento unico, PIX/Boleto a vista ou cartao de 1x a 12x</li>
          </ul>

          <h3 style={h3}>5.1. Cupons de Desconto</h3>
          <p style={paragraphStyle}>Cupons de desconto, quando aplicados, sao validos apenas para a <strong>primeira cobranca</strong> da assinatura, salvo se especificado de outra forma na divulgacao da promocao. As cobrancas seguintes serao processadas pelo valor cheio do plano contratado.</p>

          <h3 style={h3}>6. Cancelamento</h3>
          <p style={paragraphStyle}><strong>6.1. Arrependimento (CDC art. 49):</strong> ate 7 dias corridos do <strong>recebimento</strong> da primeira box. Reembolso integral do valor da assinatura. Frete de devolucao por nossa conta. Cancelamento imediato, sem multa. E-mail contato@vivefit.site ou WhatsApp (93) 99112-9194.</p>
          <p style={paragraphStyle}><strong>6.2. Plano Mensal (apos 7 dias):</strong> sem fidelidade, cancele a qualquer momento. Vale para o proximo ciclo, a box ja paga e enviada. Sem multa.</p>
          <p style={paragraphStyle}><strong>6.3. Plano Semestral:</strong> o plano semestral tem duracao de 6 meses e exige aviso previo minimo de <strong>30 dias</strong> para cancelamento, sem multa. Durante esse periodo, as cobrancas permanecem ativas e as boxes continuam sendo enviadas normalmente. Voce pode desistir do cancelamento a qualquer momento durante o aviso previo.</p>
          <p style={paragraphStyle}><strong>6.4. Plano Anual:</strong> o plano anual tem duracao de 12 meses. Caso opte por cancelar antes do termino do periodo contratado, sera aplicada multa rescisoria de 10% (dez por cento) sobre o saldo remanescente.</p>
          <p style={paragraphStyle}>Exemplo pratico:</p>
          <ul style={ulStyle}>
            <li><strong>Plano Anual:</strong> R$ 2.158,80 (12x de R$ 179,90)</li>
            <li>Cliente cancela apos 4 meses ja pagos</li>
            <li>Saldo restante: 8 meses x R$ 179,90 = R$ 1.439,20</li>
            <li>Multa: 10% x R$ 1.439,20 = <strong>R$ 143,92</strong></li>
            <li>Reembolso devido: R$ 1.295,28</li>
          </ul>
          <p style={paragraphStyle}>A multa e descontada do valor a ser estornado.</p>
          <p style={paragraphStyle}><strong>6.5. Falha da VIVE FIT:</strong> sem multa, estorno proporcional integral.</p>
          <p style={paragraphStyle}><strong>6.6. Processamento:</strong> a solicitacao de cancelamento e confirmada automaticamente apos o prazo de 30 dias do aviso previo (ou imediatamente, em caso de cancelamento imediato com multa). Voce pode desistir do cancelamento a qualquer momento durante o aviso previo.</p>

          <h3 style={h3}>7. Endereco de Entrega</h3>
          <p style={paragraphStyle}>E sua responsabilidade manter o endereco atualizado. Boxes devolvidas por endereco desatualizado so serao reenviadas com cobranca de frete adicional.</p>

          <h3 style={h3}>8. Dados Pessoais (LGPD)</h3>
          <p style={paragraphStyle}>Suas informacoes sao tratadas conforme a Lei Geral de Protecao de Dados.</p>

          <h3 style={h3}>9. Contato</h3>
          <p style={paragraphStyle}>E-mail: <strong>contato@vivefit.site</strong> - WhatsApp: <strong>(93) 99112-9194</strong></p>

          <p style={{ ...paragraphStyle, marginTop: '2rem', fontSize: '.85rem', color: '#64748B', textAlign: 'center' }}>
            <em>Versao completa disponivel em <a href="#/termos" target="_blank" rel="noopener" style={{ color: 'var(--turquesa, #06B6D4)' }}>vivefit.site/termos</a></em>
          </p>
        </div>

        <div style={footerStyle}>
          <button onClick={onCancelar} style={btnCancelarStyle}>Cancelar</button>
          <button onClick={onConfirmar} style={btnConfirmarStyle}>Li e confirmo</button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: '1rem',
}
const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '600px',
  maxHeight: '85vh', display: 'flex', flexDirection: 'column',
  overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.3)',
}
const headerStyle: React.CSSProperties = {
  padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
const closeBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', fontSize: '1.8rem',
  color: '#64748B', cursor: 'pointer', lineHeight: 1,
  width: '32px', height: '32px', borderRadius: '50%',
}
const contentStyle: React.CSSProperties = {
  padding: '1.5rem', overflowY: 'auto', flex: 1, fontSize: '.9rem', lineHeight: 1.6, color: '#334155', textAlign: 'justify',
}
const footerStyle: React.CSSProperties = {
  padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0',
  display: 'flex', gap: '.75rem', justifyContent: 'flex-end',
}
const btnCancelarStyle: React.CSSProperties = {
  padding: '.7rem 1.3rem', borderRadius: '8px', border: '1px solid #cbd5e1',
  background: '#fff', color: '#64748B', cursor: 'pointer', fontSize: '.9rem', fontWeight: 500,
}
const btnConfirmarStyle: React.CSSProperties = {
  padding: '.7rem 1.3rem', borderRadius: '8px', border: 'none',
  background: 'var(--coral, #FF5A5F)', color: '#fff', fontSize: '.9rem', fontWeight: 600,
}
const paragraphStyle: React.CSSProperties = { margin: '0 0 .9rem' }
const h3: React.CSSProperties = { fontSize: '1rem', color: 'var(--azul-cobalto, #1E3A8A)', margin: '1.2rem 0 .5rem', fontWeight: 600 }
const ulStyle: React.CSSProperties = { paddingLeft: '1.2rem', margin: '.5rem 0 .9rem' }
