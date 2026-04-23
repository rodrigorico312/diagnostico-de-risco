import { useState, useRef, useEffect } from 'react'

type Props = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalTermos({ aberto, onConfirmar, onCancelar }: Props) {
  const [leuTudo, setLeuTudo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aberto) {
      setLeuTudo(false)
      // pequeno delay pra garantir que o ref esta pronto
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0
      }, 50)
    }
  }, [aberto])

  if (!aberto) return null

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    // considerar "leu tudo" quando chegar a 90% do fim
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setLeuTudo(true)
    }
  }

  return (
    <div style={overlayStyle} onClick={onCancelar}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: 'var(--azul-cobalto, #1E3A8A)' }}>Termos de Uso</h2>
          <button onClick={onCancelar} style={closeBtnStyle} aria-label="Fechar">×</button>
        </div>

        <div ref={scrollRef} onScroll={handleScroll} style={contentStyle}>
          <p style={{ fontSize: '.85rem', color: '#64748B', margin: '0 0 1.5rem' }}><em>Última atualização: abril de 2026</em></p>

          <p style={paragraphStyle}>Ao finalizar sua assinatura VIVE FIT BOX, você concorda com os termos abaixo.</p>

          <h3 style={h3}>1. Sobre o Clube de Assinatura</h3>
          <p style={paragraphStyle}>A VIVE FIT BOX é um clube de assinatura mensal que envia <strong>4 peças fitness femininas</strong> por mês, selecionadas com base no perfil de estilo preenchido por você no cadastro.</p>

          <h3 style={h3}>2. Como Funciona a Curadoria</h3>
          <p style={paragraphStyle}>As peças enviadas são escolhidas pela equipe VIVE FIT com base no seu quiz de perfil. A curadoria é parte central da experiência - não é possível escolher peças específicas, o valor do produto está na surpresa.</p>
          <p style={paragraphStyle}>Atualizações no perfil passam a valer para a <strong>próxima</strong> box, não para a box já em processamento.</p>

          <h3 style={h3}>3. Datas de Envio</h3>
          <ul style={ulStyle}>
            <li>Boxes enviadas <strong>uma vez por mês</strong>, em datas organizadas por região</li>
            <li>Código de rastreio enviado quando a box for despachada</li>
            <li>Não é um serviço de entrega imediata - o prazo depende da sua região</li>
          </ul>

          <h3 style={h3}>4. Trocas e Devoluções</h3>
          <p style={paragraphStyle}><strong>4.1. Arrependimento em 7 dias (CDC Art. 49):</strong> você pode desistir em até 7 dias do recebimento. Peças devem estar sem uso, com etiquetas e embalagem originais. Frete de retorno é por conta da assinante. Reembolso em até 10 dias úteis após conferência.</p>
          <p style={paragraphStyle}><strong>4.2. Defeito de fabricação (30 dias):</strong> costura solta, zíper quebrado, tecido rasgado ou mancha de tinta dão direito a troca. Enviar foto pelo e-mail contato@vivefit.site.</p>
          <p style={paragraphStyle}><strong>4.3. Não é considerado defeito:</strong> não gostar da cor/modelagem, peça não servir por mudança de medidas, preferir peças diferentes, danos por uso indevido ou lavagem incorreta.</p>

          <h3 style={h3}>5. Planos</h3>
          <ul style={ulStyle}>
            <li><strong>Mensal:</strong> R$ 199,90/mês - sem fidelidade</li>
            <li><strong>Semestral:</strong> R$ 189,90/mês - pagamento antecipado</li>
            <li><strong>Anual:</strong> R$ 179,90/mês - pagamento antecipado</li>
          </ul>

          <h3 style={h3}>6. Cancelamento</h3>
          <p style={paragraphStyle}>Para cancelar, acesse sua área da assinante e clique em "Cancelar assinatura". Informe o motivo e nossa equipe processará em até 10 dias úteis - podemos entrar em contato para entender sua experiência.</p>
          <p style={paragraphStyle}><strong>Mensal:</strong> cancelamento vale para o próximo ciclo, a box já paga será enviada. <strong>Semestral/Anual:</strong> sem reembolso proporcional após os 7 dias de arrependimento, salvo hipóteses legais.</p>

          <h3 style={h3}>7. Endereço de Entrega</h3>
          <p style={paragraphStyle}>É sua responsabilidade manter o endereço atualizado. Boxes devolvidas por endereço desatualizado só são reenviadas com cobrança de frete adicional.</p>

          <h3 style={h3}>8. Dados Pessoais (LGPD)</h3>
          <p style={paragraphStyle}>Suas informações são tratadas conforme a Lei Geral de Proteção de Dados.</p>

          <h3 style={h3}>9. Contato</h3>
          <p style={paragraphStyle}>E-mail: <strong>contato@vivefit.site</strong> · WhatsApp: <strong>(93) 99120-1036</strong></p>

          <p style={{ ...paragraphStyle, marginTop: '2rem', fontSize: '.85rem', color: '#64748B', textAlign: 'center' }}>
            <em>Versão completa disponível em <a href="#/termos" target="_blank" rel="noopener" style={{ color: 'var(--turquesa, #06B6D4)' }}>vivefit.site/termos</a></em>
          </p>
        </div>

        <div style={footerStyle}>
          <button onClick={onCancelar} style={btnCancelarStyle}>Cancelar</button>
          <button
            onClick={onConfirmar}
            disabled={!leuTudo}
            style={{ ...btnConfirmarStyle, opacity: leuTudo ? 1 : 0.5, cursor: leuTudo ? 'pointer' : 'not-allowed' }}
          >
            {leuTudo ? 'Li e confirmo' : 'Role até o fim'}
          </button>
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
