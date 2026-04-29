export default function Termos() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gelo, #F8FAFC)', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', background: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.04)' }}>
        <a href="#/" style={{ fontSize: '.85rem', color: 'var(--turquesa, #06B6D4)', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>← Voltar ao site</a>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: 'var(--azul-cobalto, #1E3A8A)', margin: '0 0 .5rem' }}>Termos de Uso - VIVE FIT BOX</h1>
        <p style={{ fontSize: '.8rem', color: '#64748B', margin: '0 0 2rem' }}><em>Última atualização: abril de 2026</em></p>

        <p style={{ fontSize: '.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 2rem', textAlign: 'justify' }}>
          Ao finalizar sua assinatura VIVE FIT BOX, você concorda com os termos abaixo. Recomendamos a leitura completa.
        </p>

        <Secao titulo="1. Sobre o Clube de Assinatura">
          <p>A VIVE FIT BOX é um clube de assinatura mensal que envia <strong>4 peças fitness femininas</strong> por mês, selecionadas com base no perfil de estilo preenchido por você no momento do cadastro.</p>
        </Secao>

        <Secao titulo="2. Como Funciona a Curadoria">
          <p>As peças enviadas são escolhidas pela equipe VIVE FIT com base nas informações que você forneceu no quiz de perfil (tipo de treino, preferências de cor, tamanho, modelagem, estilo e itens que não deseja receber).</p>
          <p><strong>A curadoria é parte central da experiência.</strong> Não é possível escolher peças específicas - o valor do produto está justamente na surpresa e descoberta de peças que você talvez não escolheria sozinha.</p>
          <p>Você pode atualizar seu perfil a qualquer momento na sua área da assinante. As atualizações passam a valer para a <strong>próxima</strong> box, não para a box já em processamento.</p>
        </Secao>

        <Secao titulo="3. Datas de Envio">
          <ul style={ulStyle}>
            <li>As boxes são enviadas <strong>uma vez por mês</strong>, em datas específicas organizadas por região</li>
            <li>Você receberá aviso com código de rastreio quando sua box for despachada</li>
            <li><strong>Não é um serviço de entrega imediata.</strong> O prazo de chegada depende da sua região e da transportadora</li>
            <li>Reforçamos: a VIVE FIT BOX não é um e-commerce tradicional; é uma experiência mensal</li>
          </ul>
        </Secao>

        <Secao titulo="4. Trocas e Devoluções">
          <h3 style={h3Style}>4.1. Direito de Arrependimento (7 dias)</h3>
          <p>Conforme o <strong>Art. 49 do Código de Defesa do Consumidor</strong>, você pode desistir da compra em até <strong>7 (sete) dias corridos</strong> a partir do recebimento da box.</p>
          <p>Para exercer esse direito:</p>
          <ul style={ulStyle}>
            <li>Entrar em contato pelo e-mail <strong>contato@vivefit.site</strong> em até 7 dias</li>
            <li>Devolver as <strong>4 peças sem uso</strong>, com etiquetas originais, na embalagem original</li>
            <li><strong>O frete de retorno é por nossa conta</strong> - enviamos código de postagem para uso gratuito nos Correios</li>
            <li>Após recebermos e conferirmos as peças, o reembolso é processado em até 10 dias úteis (incluindo o frete original que você pagou)</li>
          </ul>

          <h3 style={h3Style}>4.2. Defeito de Fabricação (30 dias)</h3>
          <p>Se alguma peça chegou com defeito de fabricação (costura solta, zíper quebrado, tecido rasgado, mancha de tinta), você tem <strong>até 90 dias</strong> para solicitar a troca.</p>
          <p>Requisitos:</p>
          <ul style={ulStyle}>
            <li>Enviar foto e descrição do defeito pelo e-mail <strong>contato@vivefit.site</strong></li>
            <li>Não haver sinais de uso indevido</li>
            <li>A troca será feita pela mesma peça ou similar, conforme disponibilidade</li>
          </ul>

          <h3 style={h3Style}>4.3. O que NÃO é considerado defeito</h3>
          <p>Para clareza, os itens abaixo <strong>não são motivo de troca ou devolução</strong> (fora do prazo de arrependimento dos 7 dias):</p>
          <ul style={ulStyle}>
            <li>Não gostar da cor ou modelagem</li>
            <li>A peça não servir por mudança de medidas</li>
            <li>Preferir peças diferentes das recebidas</li>
            <li>Danos causados por uso indevido ou lavagem incorreta</li>
          </ul>
        </Secao>

        <Secao titulo="5. Planos e Pagamento">
          <ul style={ulStyle}>
            <li><strong>Plano Mensal:</strong> R$ 199,90/mês - sem fidelidade ou multa</li>
            <li><strong>Plano Semestral:</strong> R$ 189,90/mês - Renovação mensal automática</li>
            <li><strong>Plano Anual:</strong> R$ 179,90/mês Consome o limite total do cartão, com parcelamento tradicional em 12x</li>
          </ul>
          <p>Os pagamentos são processados via Asaas, nossa provedora de pagamentos.</p>
        </Secao>

        <Secao titulo="6. Cancelamento">
          <h3 style={h3Style}>6.1. Arrependimento Legal (até 7 dias)</h3>
          <p>Conforme o <strong>Art. 49 do Código de Defesa do Consumidor</strong>, você pode desistir da assinatura em até <strong>7 (sete) dias corridos contados do recebimento da primeira box</strong>, sem precisar justificar.</p>
          <p>Nesse caso, garantimos:</p>
          <ul style={ulStyle}>
            <li>Estorno integral do valor pago, incluindo frete e quaisquer taxas</li>
            <li>Frete de devolução por nossa conta (enviamos código de postagem)</li>
            <li>Cancelamento imediato da assinatura, sem multa</li>
            <li>Reembolso processado em até 10 dias úteis após recebermos as peças</li>
          </ul>
          <p>Para exercer o direito de arrependimento, basta enviar e-mail para <strong>contato@vivefit.site</strong> ou WhatsApp <strong>(93) 99112-9194</strong> dentro do prazo de 7 dias.</p>

          <h3 style={h3Style}>6.2. Cancelamento Plano Mensal (após 7 dias)</h3>
          <p>Sem fidelidade. Cancele a qualquer momento na sua área da assinante. O cancelamento vale para o próximo ciclo - a box já paga será normalmente enviada. Sem multa.</p>

          <h3 style={h3Style}>6.3. Cancelamento Plano Semestral / Anual (após 7 dias)</h3>
          <p>Os planos semestral e anual são contratos com prazo determinado, com preço com desconto justamente porque você se compromete a manter a assinatura por 6 ou 12 meses.</p>
          <p>Caso opte por cancelar antes do término do período contratado, será aplicada uma <strong>multa rescisória de 10% (dez por cento) sobre o valor das mensalidades restantes</strong>.</p>
          <p>Exemplo prático:</p>
          <ul style={ulStyle}>
            <li>Plano Anual: R$ 179,90/mês (12x)</li>
            <li>Cliente cancela após 4 meses já pagos</li>
            <li>Saldo restante: 8 meses × R$ 179,90 = R$ 1.439,20</li>
            <li>Multa: 10% × R$ 1.439,20 = <strong>R$ 143,92</strong></li>
            <li>Reembolso devido: R$ 1.439,20 - R$ 143,92 = R$ 1.295,28</li>
          </ul>
          <p>A multa é descontada do valor a ser estornado.</p>

          <h3 style={h3Style}>6.4. Falha do Serviço</h3>
          <p>Se o cancelamento for motivado por falha grave da VIVE FIT BOX (atrasos recorrentes, peças com defeito reincidente, descumprimento contratual), <strong>não há multa</strong>, e o estorno é proporcional ao período não usufruído.</p>

          <h3 style={h3Style}>6.5. Processamento</h3>
          <p>Para cancelar, acesse sua área da assinante e clique em "Cancelar assinatura". Você poderá informar o motivo, e nossa equipe processará a solicitação em até 10 dias úteis. Durante esse prazo, podemos entrar em contato para entender sua experiência ou oferecer alternativas.</p>
        </Secao>

        <Secao titulo="7. Endereço de Entrega">
          <p>É sua responsabilidade manter o endereço de entrega atualizado na sua área da assinante. Boxes enviadas a endereço desatualizado e devolvidas à nossa base só serão reenviadas com cobrança de frete adicional.</p>
        </Secao>

        <Secao titulo="8. Uso dos Seus Dados">
          <p>Suas informações são tratadas conforme a Lei Geral de Proteção de Dados (LGPD). Consulte nossa Política de Privacidade para detalhes.</p>
        </Secao>

        <Secao titulo="9. Alterações nos Termos">
          <p>A VIVE FIT pode atualizar este termo. Mudanças relevantes serão comunicadas pelo e-mail cadastrado com 15 dias de antecedência.</p>
        </Secao>

        <Secao titulo="10. Contato">
          <ul style={ulStyle}>
            <li>E-mail: <strong>contato@vivefit.site</strong></li>
            <li>WhatsApp: <strong>(93) 99112-9194</strong></li>
          </ul>
        </Secao>
      </div>
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.8rem' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: 'var(--azul-cobalto, #1E3A8A)', margin: '0 0 .8rem', fontWeight: 600 }}>{titulo}</h2>
      <div style={{ fontSize: '.92rem', color: '#334155', lineHeight: 1.65, textAlign: 'justify' }}>{children}</div>
    </section>
  )
}

const h3Style: React.CSSProperties = { fontSize: '1rem', color: 'var(--azul-noite, #0F172A)', margin: '1.2rem 0 .5rem', fontWeight: 600 }
const ulStyle: React.CSSProperties = { paddingLeft: '1.2rem', margin: '.5rem 0' }
