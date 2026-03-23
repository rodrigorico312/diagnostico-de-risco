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

export default function App() {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const whatsappLink = "https://wa.me/5593992101980?text=Oi%20Rodrigo%2C%20quero%20saber%20mais%20sobre%20o%20Diagn%C3%B3stico%20de%20Risco%20Patrimonial";

  useEffect(() => {
    const handleScroll = () => setShowFloatingBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionMain = { backgroundColor: '#0C1F13' };
  const sectionAlt = { backgroundColor: '#0F2918' };
  const cardBg = { backgroundColor: '#142E1C' };
  const gold = '#C8A951';
  const textMain = '#E8E4DB';
  const textSoft = '#A8A090';
  const darkest = '#091A0F';

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", ...sectionMain, color: textMain }}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative flex min-h-[94vh] flex-col items-center justify-center px-5 py-16 text-center" style={sectionMain}>
        <FadeInSection className="flex flex-col items-center max-w-[520px] mx-auto">

          <div className="mb-5 overflow-hidden rounded-full p-[3px]" style={{ border: `1px solid ${gold}50` }}>
            <img
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg"
              alt="Rodrigo - O Gestor do Lucro"
              className="h-[115px] w-[115px] rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 className="text-[2rem] md:text-[2.5rem] font-bold tracking-tight mb-0.5" style={{ color: textMain }}>
            Rodrigo
          </h1>
          <p className="text-sm font-medium tracking-[0.14em] uppercase mb-1" style={{ color: gold }}>
            O Gestor do Lucro
          </p>
          <p className="text-sm mb-9" style={{ color: textSoft }}>
            Consultor Financeiro e Patrimonial · Santarém, PA
          </p>

          <div className="h-px w-10 mb-9 mx-auto" style={{ backgroundColor: `${gold}40` }} />

          <h2 className="text-[1.35rem] md:text-[1.8rem] leading-snug font-medium mb-5" style={{ color: textMain }}>
            Seu patrimônio conta uma história,{' '}
            <span style={{ color: gold }}>seus documentos contam outra.</span>
          </h2>

          <p className="text-[0.95rem] leading-relaxed mb-10 max-w-[460px]" style={{ color: textSoft }}>
            Eu reorganizo a base fiscal, contábil e patrimonial de empresários que cresceram rápido mas nunca tiveram estrutura pra sustentar o que construíram.
          </p>

          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-lg transition-all duration-200 text-sm hover:brightness-90"
            style={{ backgroundColor: gold, color: sectionMain.backgroundColor }}
          >
            ENTENDA O DIAGNÓSTICO
            <ArrowDown size={15} />
          </a>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          O CENÁRIO — prosa natural
      ══════════════════════════════════ */}
      <section className="px-5 py-14 md:py-20" style={sectionAlt}>
        <FadeInSection className="max-w-[600px] mx-auto">
          <h2 className="text-[1.35rem] md:text-[1.7rem] font-semibold mb-6" style={{ color: textMain }}>
            O problema que <span style={{ color: gold }}>ninguém fala.</span>
          </h2>

          <div className="space-y-4 text-[0.95rem] leading-[1.75]" style={{ color: `${textMain}cc` }}>
            <p>
              A maioria dos empresários que eu conheço construiu o negócio do zero. Começou vendendo, foi crescendo, formalizou em algum momento e continuou operando do mesmo jeito.
            </p>
            <p>
              A empresa paga as contas da casa, o PIX dos clientes cai direto na conta pessoal, os bens estão no nome de quem não deveria. O pró-labore é de um salário mínimo, mas o cartão de crédito fatura quinze mil por mês. E a contabilidade nunca passou de um DAS e uma DEFIS.
            </p>
            <p>
              A empresa cresceu, o faturamento cresceu, o patrimônio cresceu. Mas a estrutura ficou parada lá atrás. E quando a estrutura não acompanha o crescimento, o que o empresário tem de verdade é um patrimônio que ele não consegue explicar no papel.
            </p>
          </div>

          <div className="mt-8 pl-4" style={{ borderLeft: `2px solid ${gold}` }}>
            <p className="text-[0.95rem] font-medium leading-[1.75]" style={{ color: gold }}>
              A Receita Federal recebe os dados do seu banco, do seu cartão e das suas notas fiscais automaticamente, todo semestre. Quando o que você movimenta não bate com o que você declara, o sistema gera um alerta. E alertas viram fiscalização.
            </p>
          </div>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          O QUE A RECEITA SABE
      ══════════════════════════════════ */}
      <section className="px-5 py-14 md:py-20" style={sectionMain}>
        <FadeInSection className="max-w-[740px] mx-auto">
          <h2 className="text-[1.35rem] md:text-[1.7rem] font-semibold mb-8" style={{ color: textMain }}>
            O que a Receita <span style={{ color: gold }}>já sabe</span> sobre você.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Landmark style={{ color: gold }} size={22} strokeWidth={1.5} />, title: "Movimentação bancária", text: "Todo semestre, seu banco envia pra Receita cada centavo que você movimentou acima de cinco mil reais na pessoa física. Isso se chama e-Financeira e funciona desde 2015." },
              { icon: <Receipt style={{ color: gold }} size={22} strokeWidth={1.5} />, title: "Notas fiscais", text: "Cada nota emitida ou recebida pela sua empresa vai pro SPED em tempo real. Se o que passou na maquininha não bate com as notas emitidas, a diferença aparece." },
              { icon: <CreditCard style={{ color: gold }} size={22} strokeWidth={1.5} />, title: "Cartão de crédito", text: "As operadoras reportam as movimentações à Receita. Aquele cartão corporativo que paga despesa pessoal, aquele cartão pessoal com fatura alta e renda baixa — ela vê tudo." },
              { icon: <Globe style={{ color: gold }} size={22} strokeWidth={1.5} />, title: "Contas no exterior", text: "Mais de cem países trocam dados bancários automaticamente com o Brasil pelo CRS. Offshore sem declaração deixou de ser proteção, virou armadilha." },
            ].map((card, i) => (
              <div key={i} className="p-5 rounded-sm" style={{ ...cardBg, borderLeft: `2px solid ${gold}40` }}>
                <div className="mb-3">{card.icon}</div>
                <h3 className="text-[0.95rem] font-semibold mb-2" style={{ color: textMain }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textSoft }}>{card.text}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          QUEM SOU EU
      ══════════════════════════════════ */}
      <section className="px-5 py-14 md:py-20" style={sectionAlt}>
        <FadeInSection className="max-w-[740px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg"
              alt="Rodrigo"
              className="w-full md:w-[220px] h-auto object-cover rounded-sm"
              style={{ borderBottom: `2px solid ${gold}50` }}
              referrerPolicy="no-referrer"
            />

            <div>
              <p className="text-sm font-medium tracking-[0.1em] uppercase mb-4" style={{ color: gold }}>
                Quem sou eu
              </p>

              <div className="space-y-4 text-[0.95rem] leading-[1.75]" style={{ color: `${textMain}dd` }}>
                <p>
                  Sou contador de formação, mas eu não faço contabilidade mensal, não mando guia de imposto e não cuido de obrigação acessória. Isso é trabalho de escritório contábil. O meu trabalho é outro.
                </p>
                <p>
                  Eu pego a situação fiscal e patrimonial do empresário e trato como um exame de sangue. Cruzo renda declarada com movimentação bancária, comparo padrão de vida com o que aparece na declaração, faço o mesmo cruzamento que a Receita Federal faz — só que antes dela.
                </p>
                <p>
                  Se tiver inconsistência, eu identifico. E depois eu mostro como corrigir dentro da lei: distribuição de lucros isenta, planejamento tributário, reorganização da estrutura patrimonial. Ferramentas legais que existem há décadas, mas que a maioria dos empresários nunca ouviu falar porque nenhum contador sentou pra explicar.
                </p>
                <p>
                  A maioria dos meus clientes não tem um problema de dinheiro. Tem um problema de documentação. O dinheiro é legítimo, o lucro existiu, a empresa gerou resultado — só que ninguém formalizou. E sem formalização, o que é legítimo parece irregular.
                </p>
              </div>

              <p className="italic text-base mt-6 pl-4" style={{ color: gold, borderLeft: `2px solid ${gold}` }}>
                "Eu faço a documentação alcançar a realidade."
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          A OFERTA — clareza total
      ══════════════════════════════════ */}
      <section id="diagnostico" className="px-5 py-14 md:py-20" style={{ ...sectionMain, borderTop: `1px solid ${gold}30` }}>
        <FadeInSection className="max-w-[620px] mx-auto">

          <p className="text-sm font-medium tracking-[0.1em] uppercase mb-3" style={{ color: gold }}>
            Como funciona
          </p>

          <h2 className="text-[1.35rem] md:text-[1.7rem] font-semibold mb-3" style={{ color: textMain }}>
            Diagnóstico de Risco Patrimonial.
          </h2>

          <p className="text-[0.95rem] leading-[1.75] mb-10" style={{ color: textSoft }}>
            Uma análise completa da sua situação fiscal e patrimonial que responde uma pergunta direta: se a Receita Federal cruzar os seus dados hoje, o que ela encontra de inconsistente?
          </p>

          {/* O que eu analiso */}
          <h3 className="text-[0.95rem] font-semibold mb-4" style={{ color: `${textMain}ee` }}>
            O que eu analiso:
          </h3>
          <ul className="space-y-3 mb-10">
            {[
              "Se a sua renda declarada é compatível com o seu padrão de vida, seus gastos reais e o que aparece no cartão de crédito.",
              "Se a movimentação bancária na sua pessoa física bate com o que consta no seu imposto de renda.",
              "Se o crescimento do seu patrimônio ao longo dos anos tem explicação documental ou se está descoberto.",
              "Se existe confusão entre as finanças da empresa e as pessoais, e qual o impacto jurídico e tributário disso.",
              "Se a estrutura tributária da sua empresa é adequada pro faturamento atual ou se você está pagando mais do que deveria.",
              "Se bens registrados em nome de familiares ou terceiros criam exposição patrimonial.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check style={{ color: gold }} className="shrink-0 mt-0.5" size={16} />
                <span className="text-sm leading-relaxed" style={{ color: `${textMain}bb` }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* O que você recebe */}
          <h3 className="text-[0.95rem] font-semibold mb-4" style={{ color: `${textMain}ee` }}>
            O que você recebe:
          </h3>
          <ul className="space-y-3 mb-12">
            {[
              "Um relatório com mapa de risco visual, onde cada área da sua situação fica classificada como segura, atenção ou risco alto.",
              "O detalhamento dos pontos críticos com linguagem clara, sem juridiquês — você vai entender exatamente onde está o problema.",
              "Um plano de ação separando o que precisa ser corrigido agora e o que pode ser estruturado a médio prazo.",
              "Uma reunião individual comigo onde eu apresento o relatório, explico cada ponto e respondo as suas dúvidas pessoalmente.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: gold }} />
                <span className="text-sm leading-relaxed" style={{ color: `${textMain}bb` }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* PREÇO + CTA */}
          <div className="rounded-lg p-6 md:p-8 text-center" style={{ ...cardBg, border: `1px solid ${gold}20` }}>
            <p className="text-sm mb-1" style={{ color: textSoft }}>Investimento</p>
            <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: gold }}>
              R$ 497
            </p>
            <p className="text-sm mb-6" style={{ color: `${textSoft}99` }}>
              à vista ou 3x de R$166
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full font-bold py-3.5 px-8 rounded-lg transition-all duration-200 text-sm hover:brightness-90"
              style={{ backgroundColor: gold, color: sectionMain.backgroundColor }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              QUERO O DIAGNÓSTICO
            </a>

            <p className="text-xs mt-4" style={{ color: `${textSoft}66` }}>
              Cada diagnóstico é feito individualmente por mim. Vagas limitadas por mês.
            </p>
          </div>

        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          PRA QUEM É
      ══════════════════════════════════ */}
      <section className="px-5 py-14 md:py-16" style={sectionAlt}>
        <FadeInSection className="max-w-[600px] mx-auto">
          <h2 className="text-[1.15rem] md:text-[1.35rem] font-semibold mb-6" style={{ color: textMain }}>
            Esse diagnóstico é pra você se:
          </h2>

          <div className="space-y-3 text-[0.9rem] leading-relaxed" style={{ color: `${textMain}bb` }}>
            {[
              "Sua empresa cresceu, mas a estrutura contábil e fiscal ficou parada lá atrás.",
              "Você sabe que o que movimenta no banco não bate com o que declara, e isso te incomoda.",
              "Tem bens, patrimônio e padrão de vida que a sua renda oficial não explica no papel.",
              "Quer saber se a sua situação está segura ou se precisa corrigir alguma coisa antes que a Receita aponte.",
              "Está cansado de operar no improviso e quer uma estrutura que aguente qualquer fiscalização.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full shrink-0 mt-2.5" style={{ backgroundColor: gold }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          FRASE DE FECHAMENTO
      ══════════════════════════════════ */}
      <section className="px-5 py-14" style={sectionMain}>
        <FadeInSection className="max-w-[500px] mx-auto text-center">
          <p className="text-sm leading-relaxed mb-4" style={{ color: textSoft }}>
            O dinheiro é seu. O lucro é legítimo. Você trabalhou pra isso.
          </p>
          <p className="text-[1.1rem] md:text-[1.25rem] font-medium leading-snug" style={{ color: textMain }}>
            O problema é que sem a documentação certa,{' '}
            <span style={{ color: gold }}>o que é legítimo parece irregular.</span>
          </p>
          <div className="h-px w-10 mx-auto my-6" style={{ backgroundColor: `${gold}40` }} />
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-lg transition-all duration-200 text-sm hover:brightness-90"
            style={{ backgroundColor: gold, color: sectionMain.backgroundColor }}
          >
            <WhatsAppIcon className="w-4 h-4" />
            FALE COMIGO
          </a>
        </FadeInSection>
      </section>


      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="px-5 py-8" style={{ backgroundColor: darkest, borderTop: `1px solid ${gold}15` }}>
        <div className="max-w-[620px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-bold text-sm" style={{ color: textMain }}>O Gestor do Lucro</p>
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: gold }}>
              Lucro é construção.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-xs" style={{ color: `${textSoft}88` }}>
            <a
              href="https://instagram.com/rodrigospcoelho"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
            >
              @rodrigospcoelho
            </a>
            <span>Santarém, PA · 2026</span>
          </div>
        </div>
      </footer>


      {/* ══════════════════════════════════
          FLOATING WHATSAPP
      ══════════════════════════════════ */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 text-white py-3 px-4 rounded-full shadow-lg transition-all duration-300 ${
          showFloatingBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ backgroundColor: '#25D366' }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span className="font-medium hidden sm:inline text-sm">Fale comigo</span>
      </a>
    </div>
  );
}