import React, { useEffect, useRef, useState } from 'react';
import { X, Landmark, Receipt, CreditCard, Globe, Check, ArrowDown } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
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
    if (current) {
      observer.observe(current);
    }
    
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);
  
  return (
    <div ref={domRef} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
};

export default function App() {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const whatsappLink = "https://wa.me/5593992101980?text=Oi%20Rodrigo%2C%20vi%20seu%20conte%C3%BAdo%20e%20quero%20saber%20mais%20sobre%20o%20Diagn%C3%B3stico%20de%20Risco";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingBtn(true);
      } else {
        setShowFloatingBtn(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-green-main font-sans text-text-light">
      
      {/* SEÇÃO 1 — HERO (CENTRALIZADO) */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-16 text-center bg-green-main border-b border-gold/20">
        <FadeInSection className="flex flex-col items-center max-w-[600px] mx-auto">
          <div className="mb-6 overflow-hidden rounded-full border border-gold p-1 shadow-lg">
            <img 
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg" 
              alt="Rodrigo - O Gestor do Lucro" 
              className="h-[120px] w-[120px] rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl tracking-tight mb-1 text-text-light font-bold">
            Rodrigo
          </h1>
          <h2 className="text-gold text-base md:text-lg font-medium tracking-wide uppercase mb-2">
            O Gestor do Lucro
          </h2>
          <p className="text-text-light/80 text-sm mb-6">
            Consultor Financeiro e Patrimonial
          </p>
          
          <div className="h-px w-10 bg-gold mb-6 mx-auto"></div>
          
          <h3 className="text-2xl md:text-3xl leading-tight font-medium mb-4 text-text-light">
            Eu faço a documentação <span className="text-gold">alcançar a realidade</span>.
          </h3>
          
          <p className="text-text-light/80 text-sm md:text-base leading-relaxed mb-8">
            Proteção patrimonial, elisão fiscal e estruturação financeira para empresários que faturam bem mas operam sem estrutura.
          </p>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-gold hover:bg-gold/90 text-green-dark font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md text-sm md:text-base"
          >
            QUERO O DIAGNÓSTICO
          </a>
        </FadeInSection>
        <ArrowDown className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold animate-bounce" size={20} />
      </section>

      {/* SEÇÃO 2 — O PROBLEMA (ALINHADO À ESQUERDA) */}
      <section className="px-5 py-12 md:py-20 bg-green-dark text-left">
        <FadeInSection className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl mb-8 text-text-light font-semibold">
            Você <span className="text-gold">opera assim</span>?
          </h2>
          
          <ul className="space-y-4 mb-8">
            {[
              "Recebe PIX na conta pessoal sem emitir nota",
              "Mistura as finanças da empresa com as pessoais",
              "Tem bens no nome de familiares ou terceiros",
              "Pró-labore baixo e padrão de vida alto",
              "Nunca fez um balanço patrimonial da empresa",
              "A declaração de IR não reflete a realidade"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <X className="text-[#FF4444] shrink-0 mt-1" size={18} />
                <span className="text-base text-text-light">{item}</span>
              </li>
            ))}
          </ul>
          
          <p className="text-gold font-medium text-base md:text-lg leading-relaxed border-l-2 border-gold pl-4">
            Se você se reconheceu em uma dessas opções, a sua situação fiscal não aguenta um cruzamento da Receita.
          </p>
        </FadeInSection>
      </section>

      {/* SEÇÃO 3 — O QUE A RECEITA SABE (ALINHADO À ESQUERDA, CAIXAS MENORES NO MOBILE) */}
      <section className="px-5 py-12 md:py-20 bg-green-main text-left">
        <FadeInSection className="max-w-[800px] mx-auto">
          <h2 className="text-2xl md:text-3xl mb-8 text-text-light font-semibold">
            O que a Receita Federal <span className="text-gold">já sabe</span> sobre você
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-green-light p-4 md:p-6 border-l-2 border-gold rounded-sm">
              <Landmark className="text-gold mb-3" size={24} strokeWidth={1.5} />
              <h3 className="text-lg mb-2 text-text-light font-medium">Movimentação bancária</h3>
              <p className="text-text-light/80 text-sm leading-relaxed">
                Todo semestre, seu banco envia pra Receita tudo acima de R$2.000.
              </p>
            </div>
            
            <div className="bg-green-light p-4 md:p-6 border-l-2 border-gold rounded-sm">
              <Receipt className="text-gold mb-3" size={24} strokeWidth={1.5} />
              <h3 className="text-lg mb-2 text-text-light font-medium">Notas fiscais</h3>
              <p className="text-text-light/80 text-sm leading-relaxed">
                Cada NF-e emitida ou recebida vai pro SPED em tempo real.
              </p>
            </div>
            
            <div className="bg-green-light p-4 md:p-6 border-l-2 border-gold rounded-sm">
              <CreditCard className="text-gold mb-3" size={24} strokeWidth={1.5} />
              <h3 className="text-lg mb-2 text-text-light font-medium">Cartão de crédito</h3>
              <p className="text-text-light/80 text-sm leading-relaxed">
                As operadoras reportam seus gastos à Receita.
              </p>
            </div>
            
            <div className="bg-green-light p-4 md:p-6 border-l-2 border-gold rounded-sm">
              <Globe className="text-gold mb-3" size={24} strokeWidth={1.5} />
              <h3 className="text-lg mb-2 text-text-light font-medium">Contas no exterior</h3>
              <p className="text-text-light/80 text-sm leading-relaxed">
                100+ países trocam dados bancários automaticamente com o Brasil.
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SEÇÃO 4 — QUEM SOU EU (COM FOTO E TEXTO ORIGINAL, À ESQUERDA) */}
      <section className="px-5 py-12 md:py-20 bg-green-dark text-left">
        <FadeInSection className="max-w-[800px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img 
              src="https://i.postimg.cc/C5tw7Bm7/O_gestor_do_Lucro.jpg" 
              alt="Rodrigo - O Gestor do Lucro" 
              className="w-full md:w-[250px] h-auto object-cover rounded-sm border-b-2 border-gold"
              referrerPolicy="no-referrer"
            />
            
            <div>
              <h2 className="text-2xl md:text-3xl mb-6 text-text-light font-semibold">
                Quem é <span className="text-gold">O Gestor do Lucro</span>
              </h2>
              
              <div className="space-y-4 text-text-light/90 text-sm md:text-base leading-relaxed mb-6">
                <p>
                  Eu sou o Rodrigo. Contador de formação, consultor financeiro e patrimonial na prática.
                </p>
                <p>
                  Eu não preencho declaração de imposto. <span className="text-gold font-medium">Eu faço diagnóstico de risco.</span> Eu pego a situação fiscal do empresário e trato como um exame de sangue do patrimônio dele. Cruzo os mesmos dados que a Receita cruza. Se tiver problema, eu encontro antes dela.
                </p>
                <p>
                  Depois do diagnóstico, eu mostro como resolver dentro da lei — com distribuição de lucros isenta, planejamento tributário e blindagem patrimonial. As ferramentas legais que a elite usa há décadas.
                </p>
              </div>
              
              <p className="text-gold italic text-lg border-l-2 border-gold pl-4">
                "Eu não vendo conformidade fiscal. Eu vendo tranquilidade."
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SEÇÃO 5 — A OFERTA (ALINHADA À ESQUERDA, BOTÃO DOURADO SEM PREÇO) */}
      <section className="px-5 py-12 md:py-20 bg-green-main border-t border-gold text-left">
        <FadeInSection className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl mb-3 text-text-light font-semibold">
            Diagnóstico de <span className="text-gold">Risco Patrimonial</span>
          </h2>
          <p className="text-text-light/80 text-base mb-8">
            Descubra se o seu patrimônio está na mira antes que a Receita descubra por você.
          </p>
          
          <ul className="space-y-3 mb-10">
            {[
              "Análise de compatibilidade renda x padrão de vida",
              "Cruzamento de movimentação bancária x declaração",
              "Verificação de exposição à malha fina e bloqueio de bens",
              "Relatório completo com mapa de risco",
              "Reunião individual de entrega com plano de ação"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="text-gold shrink-0 mt-1" size={18} />
                <span className="text-sm md:text-base text-text-light">{item}</span>
              </li>
            ))}
          </ul>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-gold hover:bg-gold/90 text-green-dark font-bold py-3 px-8 rounded-lg transition-colors duration-300 mb-4 text-sm md:text-base"
          >
            QUERO O DIAGNÓSTICO
          </a>
          
          <p className="text-text-light/60 text-xs md:text-sm mt-2">
            Vagas limitadas. Cada diagnóstico é feito individualmente.
          </p>
        </FadeInSection>
      </section>

      {/* SEÇÃO 6 — FOOTER (ESQUERDA) */}
      <footer className="px-5 py-10 bg-green-dark text-left border-t border-gold/20">
        <FadeInSection className="max-w-[700px] mx-auto">
          <div className="text-lg mb-1 text-text-light font-bold">O Gestor do Lucro</div>
          <div className="text-gold text-xs tracking-widest uppercase mb-4">Lucro é construção.</div>
          
          <div className="flex flex-col gap-2 text-text-light/60 text-xs md:text-sm">
            <a 
              href="https://instagram.com/rodrigospcoelho" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors inline-block"
            >
              @rodrigospcoelho
            </a>
            <div>&copy; 2026</div>
          </div>
        </FadeInSection>
      </footer>

      {/* FLOATING WHATSAPP BUTTON (MANTIDO VERDE PRO PADRÃO DO APP, SE QUISER DOURADO EU MUDO) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-3 px-4 rounded-full shadow-lg transition-all duration-300 ${
          showFloatingBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Fale comigo no WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6" />
        <span className="font-medium hidden sm:inline-block text-sm">Fale comigo</span>
      </a>
    </div>
  );
}