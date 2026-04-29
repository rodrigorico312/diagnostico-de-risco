export default function Termos() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gelo, #F8FAFC)', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', background: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.04)' }}>
        <a href="#/" style={{ fontSize: ".85rem", color: "var(--turquesa, #06B6D4)", textDecoration: "none", marginBottom: "1.5rem", display: "inline-block" }}>Voltar ao site</a>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: 'var(--azul-cobalto, #1E3A8A)', margin: '0 0 .5rem' }}>Termos de Uso - VIVE FIT BOX</h1>
        <p style={{ fontSize: '.8rem', color: '#64748B', margin: '0 0 2rem' }}><em>Ultima atualizacao: abril de 2026</em></p>

        <p style={{ fontSize: '.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 2rem', textAlign: 'justify' }}>
          Ao finalizar sua assinatura VIVE FIT BOX, voce concorda com os termos abaixo. Recomendamos a leitura completa.
        </p>

        <Secao titulo="1. Sobre o Clube de Assinatura">
          <p>A VIVE FIT BOX e um clube de assinatura mensal que envia <strong>4 pecas fitness femininas</strong> por mes, selecionadas com base no perfil de estilo preenchido por voce no momento do cadastro.</p>
        </Secao>

        <Secao titulo="2. Como Funciona a Curadoria">
          <p>As pecas enviadas sao escolhidas pela equipe VIVE FIT com base nas informacoes que voce forneceu no quiz de perfil (tipo de treino, preferencias de cor, tamanho, modelagem, estilo e itens que nao deseja receber).</p>
          <p><strong>A curadoria e parte central da experiencia.</strong> Nao e possivel escolher pecas especificas - o valor do produto esta justamente na surpresa e descoberta de pecas que voce talvez nao escolheria sozinha.</p>
          <p>Voce pode atualizar seu perfil a qualquer momento na sua area da assinante. As atualizacoes passam a valer para a <strong>proxima</strong> box, nao para a box ja em processamento.</p>
        </Secao>

        <Secao titulo="3. Datas de Envio">
          <ul style={ulStyle}>
            <li>As boxes sao enviadas <strong>uma vez por mes</strong>, em datas especificas organizadas por regiao</li>
            <li>Voce recebera aviso com codigo de rastreio quando sua box for despachada</li>
            <li><strong>Nao e um servico de entrega imediata.</strong> O prazo de chegada depende da sua regiao e da transportadora</li>
            <li>Reforcamos: a VIVE FIT BOX nao e um e-commerce tradicional; e uma experiencia mensal</li>
          </ul>
        </Secao>

        <Secao titulo="4. Trocas e Devolucoes">
          <h3 style={h3Style}>4.1. Direito de Arrependimento (7 dias)</h3>
          <p>Conforme o <strong>Art. 49 do Codigo de Defesa do Consumidor</strong>, voce pode desistir da compra em ate <strong>7 (sete) dias corridos</strong> a partir do recebimento da box.</p>
          <p>Para exercer esse direito:</p>
          <ul style={ulStyle}>
            <li>Entrar em contato pelo e-mail <strong>contato@vivefit.site</strong> em ate 7 dias</li>
            <li>Devolver as <strong>4 pecas sem uso</strong>, com etiquetas originais, na embalagem original</li>
            <li><strong>O frete de retorno e por nossa conta</strong> - enviamos codigo de postagem para uso gratuito nos Correios</li>
            <li>Depois da conferencia, o reembolso e processado em ate 10 dias uteis</li>
          </ul>

          <h3 style={h3Style}>4.2. Defeito de Fabricacao (30 dias)</h3>
          <p>Se alguma peca chegou com defeito de fabricacao (costura solta, ziper quebrado, tecido rasgado, mancha de tinta), voce tem <strong>ate 90 dias</strong> para solicitar a troca.</p>
          <p>Requisitos:</p>
          <ul style={ulStyle}>
            <li>Enviar foto e descricao do defeito pelo e-mail <strong>contato@vivefit.site</strong></li>
            <li>Nao haver sinais de uso indevido</li>
            <li>A troca sera feita pela mesma peca ou similar, conforme disponibilidade</li>
          </ul>

          <h3 style={h3Style}>4.3. O que NAO e considerado defeito</h3>
          <p>Para clareza, os itens abaixo <strong>nao sao motivo de troca ou devolucao</strong> (fora do prazo de arrependimento dos 7 dias):</p>
          <ul style={ulStyle}>
            <li>Nao gostar da cor ou modelagem</li>
            <li>A peca nao servir por mudanca de medidas</li>
            <li>Preferir pecas diferentes das recebidas</li>
            <li>Danos causados por uso indevido ou lavagem incorreta</li>
          </ul>
        </Secao>

        <Secao titulo="5. Planos e Pagamento">
          <ul style={ulStyle}>
            <li><strong>Plano Mensal:</strong> R$ 199,90/mes - sem fidelidade</li>
            <li><strong>Plano Semestral:</strong> R$ 189,90/mes - cobranca mensal por 6 meses no cartao de credito</li>
            <li><strong>Plano Anual:</strong> R$ 2.158,80 (pagamento unico, PIX/Boleto a vista ou cartao de 1x a 12x)</li>
          </ul>
          <p>Os pagamentos sao processados via Asaas, nossa provedora de pagamentos.</p>
        </Secao>

        <Secao titulo="5.1. Cupons de Desconto">
          <p>Cupons de desconto, quando aplicados, sao validos apenas para a <strong>primeira cobranca</strong> da assinatura, salvo se especificado de outra forma na divulgacao da promocao. As cobrancas seguintes serao processadas pelo valor cheio do plano contratado.</p>
        </Secao>

        <Secao titulo="6. Cancelamento">
          <h3 style={h3Style}>6.1. Arrependimento Legal (ate 7 dias)</h3>
          <p>Conforme o <strong>Art. 49 do Codigo de Defesa do Consumidor</strong>, voce pode desistir da assinatura em ate <strong>7 (sete) dias corridos contados do recebimento da primeira box</strong>, sem precisar justificar.</p>
          <p>Nesse caso, garantimos:</p>
          <ul style={ulStyle}>
            <li>Estorno integral do valor pago pela assinatura</li>
            <li>Frete de devolucao por nossa conta (enviamos codigo de postagem)</li>
            <li>Cancelamento imediato da assinatura, sem multa</li>
            <li>Reembolso processado em ate 10 dias uteis apos recebermos as pecas</li>
          </ul>
          <p>Para exercer o direito de arrependimento, basta enviar e-mail para <strong>contato@vivefit.site</strong> ou WhatsApp <strong>(93) 99112-9194</strong> dentro do prazo de 7 dias.</p>

          <h3 style={h3Style}>6.2. Cancelamento Plano Mensal (apos 7 dias)</h3>
          <p>Sem fidelidade. Cancele a qualquer momento na sua area da assinante. O cancelamento vale para o proximo ciclo - a box ja paga sera normalmente enviada. Sem multa.</p>

          <h3 style={h3Style}>6.3. Cancelamento Plano Semestral</h3>
          <p>O plano semestral tem duracao de 6 meses e exige aviso previo minimo de <strong>30 dias</strong> para cancelamento, sem multa. Durante esse periodo, as cobrancas permanecem ativas e as boxes continuam sendo enviadas normalmente. Voce pode desistir do cancelamento a qualquer momento durante o aviso previo.</p>

          <h3 style={h3Style}>6.4. Cancelamento Plano Anual</h3>
          <p>O plano anual tem duracao de 12 meses. Caso opte por cancelar antes do termino do periodo contratado, sera aplicada uma multa rescisoria de 10% (dez por cento) sobre o saldo remanescente.</p>
          <p>Exemplo pratico:</p>
          <ul style={ulStyle}>
            <li><strong>Plano Anual:</strong> R$ 2.158,80 (12x de R$ 179,90)</li>
            <li>Cliente cancela apos 4 meses ja pagos</li>
            <li>Saldo restante: 8 meses x R$ 179,90 = R$ 1.439,20</li>
            <li>Multa: 10% x R$ 1.439,20 = <strong>R$ 143,92</strong></li>
            <li>Reembolso devido: R$ 1.295,28</li>
          </ul>
          <p>A multa e descontada do valor a ser estornado.</p>

          <h3 style={h3Style}>6.5. Falha da VIVE FIT</h3>
          <p>Se o cancelamento for motivado por falha grave da VIVE FIT BOX (atrasos recorrentes, pecas com defeito reincidente, descumprimento contratual), <strong>nao ha multa</strong>, e o estorno e proporcional ao periodo nao usufruido.</p>

          <h3 style={h3Style}>6.6. Processamento</h3>
          <p>Para cancelar, acesse sua area da assinante e clique em "Cancelar assinatura". Voce podera informar o motivo, e nossa equipe processara a solicitacao em ate 10 dias uteis. Durante esse prazo, podemos entrar em contato para entender sua experiencia ou oferecer alternativas.</p>
        </Secao>

        <Secao titulo="7. Endereco de Entrega">
          <p>E sua responsabilidade manter o endereco de entrega atualizado na sua area da assinante. Boxes enviadas a endereco desatualizado e devolvidas a nossa base so serao reenviadas com cobranca de frete adicional.</p>
        </Secao>

        <Secao titulo="8. Uso dos Seus Dados">
          <p>Suas informacoes sao tratadas conforme a Lei Geral de Protecao de Dados (LGPD). Consulte nossa Politica de Privacidade para detalhes.</p>
        </Secao>

        <Secao titulo="9. Alteracoes nos Termos">
          <p>A VIVE FIT pode atualizar este termo. Mudancas relevantes serao comunicadas pelo e-mail cadastrado com 15 dias de antecedencia.</p>
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
