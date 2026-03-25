import React, { useEffect, useRef, useState } from 'react';
import { Check, ArrowDown } from 'lucide-react';
 
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);
 
const FadeIn = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    const el = ref.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);
  return <div ref={ref} className={`fade-in-section ${className}`}>{children}</div>;
};
 
export default function App() {
  const [fab, setFab] = useState(false);
  const wa = "https://wa.me/5593992101980?text=Oi%20Rodrigo%2C%20quero%20saber%20mais%20sobre%20o%20Diagn%C3%B3stico%20de%20Risco%20Patrimonial";
 
  useEffect(() => {
    const fn = () => setFab(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
 
  // palette
  const bg1 = '#0C1F13';
  const bg2 = '#0F2918';
  const card = '#142E1C';
  const gold = '#C8A951';
  const txt = '#E8E4DB';
  const sub = '#A8A090';
  const dark = '#091A0F';
 
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: bg1, color: txt }}>
 
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-5 py-14 text-center" style={{ backgroundColor: bg1 }}>
        <FadeIn className="flex flex-col items-center max-w-[480px] mx-auto">
          <div className="mb-5 rounded-full p-[3px]" style={{ border: `1px solid ${gold}50` }}>
            <img src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg" alt="Rodrigo" className="h-[110px] w-[110px] rounded-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-[1.8rem] md:text-[2.3rem] font-bold tracking-tight mb-0.5">Rodrigo</h1>
          <p className="text-sm font-medium tracking-[0.14em] uppercase mb-1" style={{ color: gold }}>O Gestor do Lucro</p>
          <p className="text-sm mb-8" style={{ color: sub }}>Consultor Financeiro e Patrimonial · Santarém, PA</p>
          <div className="h-px w-10 mb-8 mx-auto" style={{ backgroundColor: `${gold}40` }} />
          <h2 className="text-[1.25rem] md:text-[1.65rem] leading-snug font-medium mb-4">
            Seu patrimônio conta uma história, e <span style={{ color: gold }}>seus documentos contam outra.</span>
          </h2>
          <p className="text-[0.9rem] leading-relaxed mb-9 max-w-[420px]" style={{ color: sub }}>
            Reorganização fiscal, contábil e patrimonial pra empresários que cresceram rápido e sabem que a estrutura não acompanhou.
          </p>
          <a href="#diagnostico" className="inline-flex items-center gap-2 font-bold py-3 px-7 rounded-lg text-sm transition-all hover:brightness-90" style={{ backgroundColor: gold, color: bg1 }}>
            COMO FUNCIONA <ArrowDown size={14} />
          </a>
        </FadeIn>
      </section>
 
      {/* ═══ O CENÁRIO ═══ */}
      <section className="px-5 py-12 md:py-16" style={{ backgroundColor: bg2 }}>
        <FadeIn className="max-w-[560px] mx-auto">
          <p className="text-[0.95rem] leading-[1.8]" style={{ color: `${txt}cc` }}>
            A empresa cresceu, o faturamento cresceu, o patrimônio cresceu, mas a estrutura ficou parada lá atrás. Movimentação que não bate com a declaração, bens sem lastro documental, finanças pessoais e da empresa misturadas. O empresário sabe que tem coisa fora do lugar, só não sabe o tamanho do problema.
          </p>
          <div className="mt-6 pl-4" style={{ borderLeft: `2px solid ${gold}` }}>
            <p className="text-[0.9rem] font-medium leading-[1.7]" style={{ color: gold }}>
              A Receita Federal recebe os dados do seu banco, do seu cartão e das suas notas fiscais automaticamente, todo semestre. Quando o que você movimenta não bate com o que você declara, o sistema gera um alerta.
            </p>
          </div>
        </FadeIn>
      </section>
 
      {/* ═══ O DIAGNÓSTICO ═══ */}
      <section id="diagnostico" className="px-5 py-12 md:py-16" style={{ backgroundColor: bg1, borderTop: `1px solid ${gold}25` }}>
        <FadeIn className="max-w-[560px] mx-auto">
          <p className="text-sm font-medium tracking-[0.1em] uppercase mb-2" style={{ color: gold }}>O que eu ofereço</p>
          <h2 className="text-[1.25rem] md:text-[1.5rem] font-semibold mb-3">Diagnóstico de Risco Patrimonial.</h2>
          <p className="text-[0.9rem] leading-[1.7] mb-8" style={{ color: sub }}>
            Uma análise completa que cruza a sua declaração, movimentação bancária, patrimônio e estrutura da empresa pra responder uma pergunta direta: se a Receita cruzar os seus dados hoje, o que ela encontra de inconsistente?
          </p>
 
          <h3 className="text-[0.9rem] font-semibold mb-3" style={{ color: `${txt}ee` }}>O que eu analiso:</h3>
          <ul className="space-y-2.5 mb-8">
            {[
              "Compatibilidade entre renda declarada, padrão de vida e gastos reais",
              "Movimentação bancária na PF versus o que consta no imposto de renda",
              "Evolução patrimonial dos últimos anos e se tem explicação documental",
              "Confusão entre finanças da empresa e pessoais, e o impacto disso",
              "Estrutura tributária da empresa pro faturamento atual",
              "Bens em nome de terceiros e a exposição que isso gera",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check style={{ color: gold }} className="shrink-0 mt-0.5" size={15} />
                <span className="text-[0.85rem] leading-relaxed" style={{ color: `${txt}bb` }}>{t}</span>
              </li>
            ))}
          </ul>
 
          <h3 className="text-[0.9rem] font-semibold mb-3" style={{ color: `${txt}ee` }}>O que você recebe:</h3>
          <ul className="space-y-2.5 mb-10">
            {[
              "Relatório com mapa de risco visual, cada área classificada como segura, atenção ou risco alto",
              "Detalhamento dos pontos críticos em linguagem clara, sem juridiquês",
              "Plano de ação separando o que corrigir agora e o que estruturar a médio prazo",
              "Reunião individual comigo onde eu apresento tudo e respondo suas dúvidas",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: gold }} />
                <span className="text-[0.85rem] leading-relaxed" style={{ color: `${txt}bb` }}>{t}</span>
              </li>
            ))}
          </ul>
 
          {/* CTA CARD */}
          <div className="rounded-lg p-6 text-center" style={{ backgroundColor: card, border: `1px solid ${gold}20` }}>
            <p className="text-sm mb-1" style={{ color: sub }}>Investimento</p>
            <p className="text-3xl font-bold mb-1" style={{ color: gold }}>R$ 1.500</p>
            <p className="text-sm mb-5" style={{ color: `${sub}99` }}>à vista ou em até 3x</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full font-bold py-3 px-6 rounded-lg text-sm transition-all hover:brightness-90" style={{ backgroundColor: gold, color: bg1 }}>
              <WhatsAppIcon className="w-5 h-5" /> QUERO O DIAGNÓSTICO
            </a>
            <p className="text-xs mt-3" style={{ color: `${sub}55` }}>Diagnóstico individual. Vagas limitadas por mês.</p>
          </div>
        </FadeIn>
      </section>
 
      {/* ═══ PRA QUEM É ═══ */}
      <section className="px-5 py-12 md:py-14" style={{ backgroundColor: bg2 }}>
        <FadeIn className="max-w-[520px] mx-auto">
          <h3 className="text-[1rem] font-semibold mb-5">Esse diagnóstico é pra você se:</h3>
          <div className="space-y-2.5 text-[0.85rem] leading-relaxed" style={{ color: `${txt}bb` }}>
            {[
              "Sua empresa cresceu, mas a estrutura contábil e fiscal ficou parada lá atrás",
              "O que você movimenta no banco não bate com o que declara, e isso te incomoda",
              "Tem patrimônio e padrão de vida que a sua renda oficial não explica no papel",
              "Quer saber se a sua situação está segura antes que a Receita aponte",
              "Está cansado de operar no improviso e quer uma estrutura que aguente qualquer fiscalização",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full shrink-0 mt-2.5" style={{ backgroundColor: gold }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
 
      {/* ═══ QUEM SOU EU ═══ */}
      <section className="px-5 py-12 md:py-16" style={{ backgroundColor: bg1 }}>
        <FadeIn className="max-w-[600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg" alt="Rodrigo" className="w-full md:w-[180px] h-auto object-cover rounded-sm" style={{ borderBottom: `2px solid ${gold}50` }} referrerPolicy="no-referrer" />
            <div>
              <p className="text-sm font-medium tracking-[0.1em] uppercase mb-3" style={{ color: gold }}>Quem sou eu</p>
              <div className="space-y-3 text-[0.9rem] leading-[1.75]" style={{ color: `${txt}dd` }}>
                <p>
                  Sou o Rodrigo, contador de formação e consultor financeiro e patrimonial na prática. Meu trabalho é pegar a situação fiscal do empresário, cruzar os mesmos dados que a Receita Federal cruza, e identificar inconsistências antes que virem problema.
                </p>
                <p>
                  Depois do diagnóstico, eu mostro como corrigir dentro da lei: distribuição de lucros isenta, planejamento tributário, reorganização patrimonial. Ferramentas legais que existem há décadas mas que a maioria dos empresários nunca teve acesso porque ninguém sentou pra explicar.
                </p>
              </div>
              <p className="italic text-[0.9rem] mt-5 pl-4" style={{ color: gold, borderLeft: `2px solid ${gold}` }}>
                "Eu faço a documentação alcançar a realidade."
              </p>
            </div>
          </div>
        </FadeIn>
      </section>
 
      {/* ═══ FECHAMENTO ═══ */}
      <section className="px-5 py-12" style={{ backgroundColor: bg2 }}>
        <FadeIn className="max-w-[460px] mx-auto text-center">
          <p className="text-sm leading-relaxed mb-3" style={{ color: sub }}>
            O dinheiro é seu, o lucro é legítimo, você trabalhou pra isso.
          </p>
          <p className="text-[1.05rem] font-medium leading-snug">
            O problema é que sem a documentação certa, <span style={{ color: gold }}>o que é legítimo parece irregular.</span>
          </p>
          <div className="h-px w-10 mx-auto my-5" style={{ backgroundColor: `${gold}40` }} />
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold py-3 px-7 rounded-lg text-sm transition-all hover:brightness-90" style={{ backgroundColor: gold, color: bg1 }}>
            <WhatsAppIcon className="w-4 h-4" /> FALE COMIGO
          </a>
        </FadeIn>
      </section>
 
      {/* ═══ FOOTER ═══ */}
      <footer className="px-5 py-7" style={{ backgroundColor: dark, borderTop: `1px solid ${gold}15` }}>
        <div className="max-w-[560px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="font-bold text-sm">O Gestor do Lucro</p>
            <p className="text-xs tracking-[0.14em] uppercase" style={{ color: gold }}>Lucro é construção.</p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-xs" style={{ color: `${sub}88` }}>
            <a href="https://instagram.com/rodrigospcoelho" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">@rodrigospcoelho</a>
            <span>Santarém, PA · 2026</span>
          </div>
        </div>
      </footer>
 
      {/* ═══ FAB WHATSAPP ═══ */}
      <a href={wa} target="_blank" rel="noopener noreferrer"
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 text-white py-3 px-4 rounded-full shadow-lg transition-all duration-300 ${fab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        style={{ backgroundColor: '#25D366' }} aria-label="WhatsApp">
        <WhatsAppIcon className="w-5 h-5" />
        <span className="font-medium hidden sm:inline text-sm">Fale comigo</span>
      </a>
    </div>
  );
}