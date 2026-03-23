import React, { useEffect, useRef, useState } from 'react';
import { Landmark, Receipt, CreditCard, Globe, Check, ArrowDown } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FadeInSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px' });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);
  return (
    <div ref={domRef} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
};

/* 
  PALETA:
  Verde escuro principal:  #0C1F13
  Verde escuro secundário: #0F2918  
  Verde card/destaque:     #142E1C
  Dourado accent:          #C8A951
  Dourado suave:           #C8A951/30
  Texto claro:             #E8E4DB (off-white quente, não branco puro)
  Texto secundário:        #A8A090
*/

export default function App() {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const whatsappLink = "https://wa.me/5593992101980?text=Oi%20Rodrigo%2C%20quero%20saber%20mais%20sobre%20o%20Diagn%C3%B3stico%20de%20Risco%20Patrimonial";

  useEffect(() => {
    const handleScroll = () => setShowFloatingBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0C1F13', color: '#E8E4DB' }}>

      {/* ══════════ HERO ══════════ */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-5 py-16 text-center" style={{ backgroundColor: '#0C1F13' }}>
        <FadeInSection className="flex flex-col items-center max-w-[520px] mx-auto">

          <div className="mb-5 overflow-hidden rounded-full p-[3px]" style={{ border: '1px solid rgba(200,169,81,0.5)' }}>
            <img
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg"
              alt="Rodrigo - O Gestor do Lucro"
              className="h-[110px] w-[110px] rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 className="text-[2rem] md:text-[2.4rem] font-bold tracking-tight mb-0.5" style={{ color: '#E8E4DB' }}>
            Rodrigo
          </h1>
          <p className="text-sm font-medium tracking-[0.15em] uppercase mb-1" style={{ color: '#C8A951' }}>
            O Gestor do Lucro
          </p>
          <p className="text-sm mb-8" style={{ color: '#A8A090' }}>
            Consultor Financeiro e Patrimonial · Santarém, PA
          </p>

          <div className="h-px w-10 mb-8 mx-auto" style={{ backgroundColor: 'rgba(200,169,81,0.35)' }} />

          <h2 className="text-[1.4rem] md:text-[1.8rem] leading-snug font-medium mb-4" style={{ color: '#E8E4DB' }}>
            Seu patrimônio conta uma história,{' '}
            <span style={{ color: '#C8A951' }}>seus documentos contam outra</span>
          </h2>

          <p className="text-[0.95rem] leading-relaxed mb-10 max-w-[450px]" style={{ color: '#A8A090' }}>
            Eu organizo a situação fiscal e patrimonial de empresários que faturam bem mas cresceram sem estrutura, antes que a Receita Federal faça isso por eles
          </p>

          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#C8A951', color: '#0C1F13' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b8993f')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C8A951')}
          >
            ENTENDA O DIAGNÓSTICO
            <ArrowDown size={16} />
          </a>
        </FadeInSection>
      </section>


      {/* ══════════ O CENÁRIO ══════════ */}
      <section className="px-5 py-14 md:py-20" style={{ backgroundColor: '#0F2918' }}>
        <FadeInSection className="max-w-[600px] mx-auto">
          <h2 className="text-[1.4rem] md:text-[1.75rem] font-semibold mb-6" style={{ color: '#E8E4DB' }}>
            O problema que{' '}<span style={{ color: '#C8A951' }}>ninguém fala</span>
          </h2>

          <div className="space-y-4 text-[0.95rem] leading-relaxed" style={{ color: 'rgba(232,228,219,0.8)' }}>
            <p>
              A maioria dos empresários que eu conheço construiu o negócio do zero, começou vendendo, foi crescendo, formalizou em algum momento e continuou operando do mesmo jeito
            </p>
            <p>
              A empresa paga as contas da casa, o PIX dos clientes cai na conta pessoal, os bens estão no nome de quem não deveria, o pró-labore é de um salário mínimo mas o cartão de crédito fatura quinze mil e a contabilidade nunca passou de um DAS e uma DEFIS
            </p>
            <p>
              Isso funcionava há dez anos, em 2026 não funciona mais
            </p>
          </div>

          <div className="mt-8 pl-4" style={{ borderLeft: '2px solid #C8A951' }}>
            <p className="text-[0.95rem] font-medium leading-relaxed" style={{ color: '#C8A951' }}>
              A Receita Federal recebe dados do seu banco, do seu cartão, das suas notas fiscais automaticamente, todo semestre, quando o que você movimenta não bate com o que você declara o sistema gera um alerta e alertas viram fiscalização
            </p>
          </div>
        </FadeInSection>
      </section>


      {/* ══════════ O QUE A RECEITA SABE ══════════ */}
      <section className="px-5 py-14 md:py-20" style={{ backgroundColor: '#0C1F13' }}>
        <FadeInSection className="max-w-[740px] mx-auto">
          <h2 className="text-[1.4rem] md:text-[1.75rem] font-semibold mb-8" style={{ color: '#E8E4DB' }}>
            O que a Receita{' '}<span style={{ color: '#C8A951' }}>já sabe</span>{' '}sobre você
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Landmark style={{ color: '#C8A951' }} size={22} strokeWidth={1.5} />, title: "Movimentação bancária", text: "Todo semestre seu banco envia pra Receita cada centavo que você movimentou acima de cinco mil reais na pessoa física, isso se chama e-Financeira" },
              { icon: <Receipt style={{ color: '#C8A951' }} size={22} strokeWidth={1.5} />, title: "Notas fiscais", text: "Cada nota emitida ou recebida pela sua empresa vai pro SPED em tempo real, sem delay nenhum" },
              { icon: <CreditCard style={{ color: '#C8A951' }} size={22} strokeWidth={1.5} />, title: "Cartão de crédito", text: "As operadoras reportam as movimentações à Receita, aquele cartão corporativo que paga despesa pessoal ela vê" },
              { icon: <Globe style={{ color: '#C8A951' }} size={22} strokeWidth={1.5} />, title: "Contas no exterior", text: "Mais de cem países trocam dados bancários automaticamente com o Brasil via CRS, offshore sem declaração virou armadilha" },
            ].map((card, i) => (
              <div key={i} className="p-5 rounded-sm" style={{ backgroundColor: '#142E1C', borderLeft: '2px solid rgba(200,169,81,0.35)' }}>
                <div className="mb-3">{card.icon}</div>
                <h3 className="text-base font-medium mb-2" style={{ color: '#E8E4DB' }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#A8A090' }}>{card.text}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>


      {/* ══════════ QUEM SOU EU ══════════ */}
      <section className="px-5 py-14 md:py-20" style={{ backgroundColor: '#0F2918' }}>
        <FadeInSection className="max-w-[740px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg"
              alt="Rodrigo"
              className="w-full md:w-[220px] h-auto object-cover rounded-sm"
              style={{ borderBottom: '2px solid rgba(200,169,81,0.4)' }}
              referrerPolicy="no-referrer"
            />

            <div>
              <p className="text-sm font-medium tracking-[0.1em] uppercase mb-4" style={{ color: '#C8A951' }}>
                Quem sou eu
              </p>

              <div className="space-y-4 text-[0.95rem] leading-relaxed" style={{ color: 'rgba(232,228,219,0.85)' }}>
                <p>
                  Sou contador de formação mas eu não faço contabilidade mensal, não mando guia de imposto e não cuido de obrigação acessória, isso é trabalho de escritório e o meu trabalho é outro
                </p>
                <p>
                  Eu pego a situação fiscal e patrimonial do empresário e trato como um exame de sangue, cruzo renda declarada com movimentação bancária, comparo padrão de vida com o que aparece na declaração, faço o mesmo cruzamento que a Receita Federal faz só que antes dela
                </p>
                <p>
                  Se tiver problema eu identifico e depois eu mostro como resolver dentro da lei, distribuição de lucros isenta, planejamento tributário, reorganização patrimonial, as ferramentas legais que existem há décadas mas que a maioria dos empresários nunca ouviu falar
                </p>
                <p>
                  A maioria dos meus clientes não tem um problema de dinheiro, tem um problema de documentação, o dinheiro é legítimo e o lucro existiu só que ninguém formalizou e sem formalização o que é legítimo parece irregular
                </p>
              </div>

              <p className="italic text-base mt-6 pl-4" style={{ color: '#C8A951', borderLeft: '2px solid #C8A951' }}>
                Eu faço a documentação alcançar a realidade
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>


      {/* ══════════ A OFERTA ══════════ */}
      <section id="diagnostico" className="px-5 py-14 md:py-20" style={{ backgroundColor: '#0C1F13', borderTop: '1px solid rgba(200,169,81,0.25)' }}>
        <FadeInSection className="max-w-[620px] mx-auto">

          <p className="text-sm font-medium tracking-[0.1em] uppercase mb-3" style={{ color: '#C8A951' }}>
            O que eu ofereço
          </p>

          <h2 className="text-[1.4rem] md:text-[1.75rem] font-semibold mb-3" style={{ color: '#E8E4DB' }}>
            Diagnóstico de Risco Patrimonial
          </h2>

          <p className="text-[0.95rem] leading-relaxed mb-8" style={{ color: '#A8A090' }}>
            Uma análise completa da sua situação fiscal e patrimonial que responde uma pergunta, se a Receita Federal cruzar os seus dados hoje o que ela encontra
          </p>

          <h3 className="text-base font-semibold mb-4" style={{ color: 'rgba(232,228,219,0.9)' }}>
            O que eu analiso
          </h3>
          <ul className="space-y-3 mb-8">
            {[
              "Se a sua renda declarada é compatível com o seu padrão de vida e os seus gastos reais",
              "Se o que você movimenta no banco bate com o que aparece no seu imposto de renda",
              "Se o crescimento do seu patrimônio tem explicação documental ou se está descoberto",
              "Se existe confusão entre as finanças da empresa e as pessoais e o impacto jurídico disso",
              "Se a estrutura tributária da empresa está adequada pro seu faturamento atual",
              "Se bens registrados em nome de terceiros representam risco patrimonial",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check style={{ color: '#C8A951' }} className="shrink-0 mt-0.5" size={16} />
                <span className="text-sm leading-relaxed" style={{ color: 'rgba(232,228,219,0.75)' }}>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-base font-semibold mb-4" style={{ color: 'rgba(232,228,219,0.9)' }}>
            O que você recebe
          </h3>
          <ul className="space-y-3 mb-10">
            {[
              "Relatório com mapa de risco visual onde cada área fica classificada como segura, atenção ou risco alto",
              "Detalhamento dos pontos críticos com linguagem clara sem juridiquês, você vai entender tudo",
              "Plano de ação mostrando o que corrigir agora e o que estruturar a médio prazo",
              "Reunião individual comigo onde eu apresento tudo e respondo as suas dúvidas pessoalmente",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: '#C8A951' }} />
                <span className="text-sm leading-relaxed" style={{ color: 'rgba(232,228,219,0.75)' }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* PREÇO + CTA */}
          <div className="rounded-lg p-6 md:p-8 text-center" style={{ backgroundColor: '#142E1C', border: '1px solid rgba(200,169,81,0.2)' }}>
            <p className="text-sm mb-1" style={{ color: '#A8A090' }}>Investimento</p>
            <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#C8A951' }}>
              R$ 497
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(168,160,144,0.7)' }}>
              à vista ou 3x de R$166
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full font-bold py-3.5 px-8 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#C8A951', color: '#0C1F13' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b8993f')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C8A951')}
            >
              <WhatsAppIcon className="w-5 h-5" />
              QUERO O DIAGNÓSTICO
            </a>

            <p className="text-xs mt-4" style={{ color: 'rgba(168,160,144,0.5)' }}>
              Cada diagnóstico é feito individualmente por mim, vagas limitadas
            </p>
          </div>

        </FadeInSection>
      </section>


      {/* ══════════ FRASE DE FECHAMENTO ══════════ */}
      <section className="px-5 py-12" style={{ backgroundColor: '#0F2918' }}>
        <FadeInSection className="max-w-[520px] mx-auto text-center">
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#A8A090' }}>
            O dinheiro é seu, o lucro é legítimo, você trabalhou pra isso
          </p>
          <p className="text-lg md:text-xl font-medium" style={{ color: '#E8E4DB' }}>
            O problema é que sem a documentação certa{' '}
            <span style={{ color: '#C8A951' }}>
              o que é legítimo parece irregular
            </span>
          </p>
          <p className="text-sm mt-4" style={{ color: '#A8A090' }}>
            Eu resolvo isso
          </p>
        </FadeInSection>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer className="px-5 py-8" style={{ backgroundColor: '#091A0F', borderTop: '1px solid rgba(200,169,81,0.1)' }}>
        <FadeInSection className="max-w-[620px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-bold text-sm" style={{ color: '#E8E4DB' }}>O Gestor do Lucro</p>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#C8A951' }}>
              Lucro é construção
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-xs" style={{ color: 'rgba(168,160,144,0.6)' }}>
            <a
              href="https://instagram.com/rodrigospcoelho"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              onMouseEnter={e => (e.currentTarget.style.color = '#C8A951')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,160,144,0.6)')}
            >
              @rodrigospcoelho
            </a>
            <span>Santarém, PA · 2026</span>
          </div>
        </FadeInSection>
      </footer>


      {/* ══════════ FLOATING WHATSAPP ══════════ */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 text-white py-3 px-4 rounded-full shadow-lg transition-all duration-300 ${
          showFloatingBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ backgroundColor: '#25D366' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1DA851')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span className="font-medium hidden sm:inline text-sm">Fale comigo</span>
      </a>
    </div>
  );
}
