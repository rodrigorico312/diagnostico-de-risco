/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Instagram, 
  ArrowRight,
  Dumbbell,
  Sparkles,
  Package,
  FileText,
  ShieldCheck,
  Heart
} from 'lucide-react';

// --- Types ---
type Period = 'mensal' | 'trimestral' | 'anual';

interface PlanData {
  name: string;
  pieces: string;
  prices: Record<Period, string>;
  description: string;
  includes: string;
  featured?: boolean;
  aspirational?: boolean;
  checkoutLinks: Record<Period, string>;
}

// --- Constants ---
// --- CONFIGURAÇÕES DE PREÇOS E LINKS DE CHECKOUT ---
const PLANS: PlanData[] = [
  {
    name: "Essential",
    pieces: "1 peça por mês",
    prices: {
      mensal: "R$ 129,90", // EDITAR PREÇO MENSAL
      trimestral: "R$ 119,90", // EDITAR PREÇO TRIMESTRAL
      anual: "R$ 109,90" // EDITAR PREÇO ANUAL
    },
    description: "Para quem quer peças de qualidade sem acumular. Uma peça-chave por mês, escolhida com base no seu perfil, com tecido de alta performance e estética alinhada ao seu estilo.",
    includes: "Peça selecionada + VIVE Guide + mimo de experiência + certificado de seleção",
    checkoutLinks: {
      mensal: "#checkout-essential-m", // EDITAR LINK CHECKOUT
      trimestral: "#checkout-essential-t",
      anual: "#checkout-essential-a"
    }
  },
  {
    name: "Select",
    pieces: "2 peças por mês",
    featured: true,
    prices: {
      mensal: "R$ 219,90",
      trimestral: "R$ 199,90",
      anual: "R$ 179,90"
    },
    description: "Looks mais completos e menos esforço. Duas peças coordenadas, pensadas para funcionar juntas e com o que você já tem. Mais praticidade, mais presença e mais identidade visual.",
    includes: "2 peças selecionadas + VIVE Guide + mimo de experiência + certificado de seleção",
    checkoutLinks: {
      mensal: "#checkout-select-m",
      trimestral: "#checkout-select-t",
      anual: "#checkout-select-a"
    }
  },
  {
    name: "Vive Premium",
    pieces: "3 peças por mês — experiência completa",
    aspirational: true,
    prices: {
      mensal: "R$ 299,90",
      trimestral: "R$ 279,90",
      anual: "R$ 249,90"
    },
    description: "A versão mais completa da VIVE FIT BOX. Três peças por mês, com mais versatilidade, mais combinações possíveis e a sensação de um guarda-roupa de treino que se renova de verdade.",
    includes: "3 peças selecionadas + VIVE Guide + mimo de experiência premium + certificado de seleção",
    checkoutLinks: {
      mensal: "#checkout-premium-m",
      trimestral: "#checkout-premium-t",
      anual: "#checkout-premium-a"
    }
  }
];

const PERIOD_NOTES: Record<Period, string> = {
  mensal: "Flexibilidade total. Cobrança mês a mês, sem compromisso longo.",
  trimestral: "Um compromisso leve, com desconto progressivo e mimos exclusivos.",
  anual: "O melhor valor da assinatura, com o maior desconto e acesso antecipado a coleções."
};

// --- POLÍTICAS E DÚVIDAS (FAQ) ---
const FAQ_ITEMS = [
  {
    q: "Como funciona o Quiz de Estilo?",
    a: "Você responde perguntas sobre preferências de cor, tipo de treino, peças favoritas, tamanho, compressão e o que prefere não receber. O quiz leva poucos minutos e é o que permite que a seleção da sua box seja feita para o seu perfil, não de forma genérica."
  },
  {
    q: "Posso alterar minhas preferências depois?",
    a: "Sim. Na Área da Assinante, você pode atualizar qualquer informação a qualquer momento — cores, peças, tamanho, blacklist, compressão."
  },
  {
    q: "E se vier uma peça que eu não goste?",
    a: "Oferecemos uma política de troca facilitada para assinantes. Se a peça não for o que você esperava, você pode solicitar a troca por crédito ou por outra peça selecionada na próxima box." // EDITAR POLÍTICA DE TROCA
  },
  {
    q: "E se o tamanho não servir?",
    a: "A primeira troca de tamanho de cada box é por nossa conta. Queremos garantir que você tenha o caimento perfeito para o seu treino." // EDITAR POLÍTICA DE TAMANHO
  },
  {
    q: "Posso pausar ou cancelar?",
    a: "Sim, a qualquer momento. No plano mensal não há fidelidade. Nos planos trimestral e anual, você pode pausar a assinatura por até 2 meses ou cancelar seguindo as regras de encerramento antecipado." // EDITAR REGRAS DE CANCELAMENTO
  },
  {
    q: "As peças podem repetir?",
    a: "Não. O sistema registra tudo o que já foi enviado para você. Nenhuma peça é repetida."
  }
];

// --- Components ---

const SectionLabel = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <span className={`inline-block font-heading text-[0.7rem] font-bold tracking-[0.12em] uppercase text-olive mb-4 ${className}`}>
    {children}
  </span>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [period, setPeriod] = useState<Period>('mensal');
  const [quizStep, setQuizStep] = useState(1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setStickyVisible(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextStep = () => setQuizStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setQuizStep(prev => Math.max(prev - 1, 1));
  const finishQuiz = () => {
    setQuizFinished(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-border-light py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#" className="font-heading font-extrabold text-xl tracking-tighter text-olive-deep">
            VIVE <span className="text-terracotta">FIT</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Como funciona', 'Quiz', 'Planos', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="font-heading text-[0.8rem] font-semibold tracking-wider uppercase text-text-secondary hover:text-olive transition-colors"
              >
                {item}
              </a>
            ))}
            <a href="#quiz" className="bg-olive text-white px-6 py-2.5 rounded-full font-heading text-[0.85rem] font-semibold hover:bg-olive-deep transition-all shadow-sm">
              Começar meu Quiz
            </a>
          </nav>

          <button className="md:hidden text-text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 flex flex-col gap-6 md:hidden"
          >
            {['Como funciona', 'Quiz de Estilo', 'Planos', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().split(' ')[0]}`} 
                onClick={() => setIsMenuOpen(false)}
                className="font-heading text-xl font-bold text-text-primary py-4 border-b border-border-light"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32 bg-sand relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[120%] bg-radial-gradient from-sand-warm to-transparent pointer-events-none opacity-50" />
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Assinatura de moda fitness</SectionLabel>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
              Moda fitness escolhida para você. Todo mês.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              A VIVE FIT BOX é uma assinatura de peças selecionadas com base no seu estilo, no seu treino e no que faz sentido para a sua rotina. Você responde um quiz, conta o que gosta e o que não usa — e todo mês recebe uma box montada para o seu perfil.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="#quiz" className="bg-olive text-white px-8 py-4 rounded-full font-heading font-semibold hover:bg-olive-deep transition-all transform hover:-translate-y-1 shadow-lg shadow-olive/20">
                Começar meu Quiz
              </a>
              <a href="#planos" className="border-2 border-olive text-olive px-8 py-4 rounded-full font-heading font-semibold hover:bg-olive hover:text-white transition-all">
                Escolher meu plano
              </a>
            </div>
            <p className="mt-8 text-xs text-text-muted tracking-wide uppercase font-medium">
              Personalização real · Seleção inteligente · Entrega mensal
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-sand-warm to-cement-light rounded-[2rem] border border-dashed border-border flex items-center justify-center p-8 text-center overflow-hidden">
              <img 
                src="https://picsum.photos/seed/fitness-hero/800/1000" 
                alt="VIVE FIT Hero" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
              />
              <div className="relative z-10 text-text-muted font-medium">
                <p className="text-sm">[FOTO EDITORIAL VIVE FIT]</p>
              </div>
            </div>
            <div className="absolute bottom-8 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-olive rounded-full animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Seleção personalizada</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section id="problema" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionLabel>O problema</SectionLabel>
              <h2 className="text-3xl md:text-4xl mb-6">Você não precisa de mais opções. Precisa das certas.</h2>
              <p className="text-text-secondary leading-relaxed">
                Comprar moda fitness virou um processo. Você pesquisa, compara, monta carrinho, desmonta, troca de loja, volta ao início. São dezenas de marcas, centenas de peças e nenhuma garantia de que o tecido é bom, o caimento funciona ou a cor combina com o que você já tem.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <SectionLabel>A solução</SectionLabel>
              <h2 className="text-3xl md:text-4xl mb-6">A VIVE FIT BOX simplifica essa decisão.</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Você conta o que gosta, o que não quer e como treina. A partir disso, a gente seleciona peças que combinam com você — com tecido de verdade, caimento testado e uma estética que faz sentido no seu dia a dia, não só na foto.
              </p>
              <p className="text-text-secondary font-medium">Sem excesso. Sem fadiga. Sem surpresas ruins.</p>
              <div className="mt-8 flex items-center gap-3 text-olive font-heading font-bold text-xs uppercase tracking-widest">
                <div className="w-6 h-[1px] bg-olive" />
                VIVE FIT
                <div className="w-6 h-[1px] bg-olive" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-sand">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>Passo a passo</SectionLabel>
            <h2 className="text-4xl">Como funciona</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Responda o Quiz de Estilo",
                desc: "Conte suas preferências de cor, peças, tipo de treino, tamanho e o que prefere não receber. Leva poucos minutos e é o que garante que a seleção da sua box seja feita para você de verdade."
              },
              {
                num: "02",
                title: "A gente monta a sua box",
                desc: "Com base no seu perfil, escolhemos peças de marca própria e de marcas parceiras que seguem o mesmo padrão de qualidade, estética e funcionalidade."
              },
              {
                num: "03",
                title: "Receba e viva a experiência",
                desc: "Todo mês, sua box chega com peças selecionadas, um guia com informações sobre o tecido e uma dica de bem-estar, além de um mimo pensado para o seu momento."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2rem] hover:-translate-y-1 transition-transform shadow-sm"
              >
                <div className="font-heading font-extrabold text-5xl text-sand-dark mb-6 leading-none tracking-tighter">{step.num}</div>
                <h3 className="text-xl mb-4">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <SectionLabel>Personalização</SectionLabel>
            <h2 className="text-4xl mb-4">Seu estilo começa aqui.</h2>
            <p className="text-text-secondary">O Quiz de Estilo é rápido e serve para que a seleção da sua box seja realmente personalizada. Você informa o que gosta, o que não usa, como treina e o que espera receber.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-sand rounded-[2rem] p-8 md:p-12 relative">
            {!quizFinished ? (
              <>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${s <= quizStep ? 'bg-olive' : 'bg-sand-dark'}`} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={quizStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="min-h-[300px]"
                  >
                    <div className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest mb-2">Etapa {quizStep} de 6</div>
                    
                    {quizStep === 1 && (
                      <div>
                        <h3 className="text-2xl mb-2">Quais cores combinam com você?</h3>
                        <p className="text-sm text-text-muted mb-8">Selecione uma ou mais opções.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['Neutras', 'Naturais', 'Terrosas', 'Vibrantes', 'Escuras', 'Um pouco de tudo'].map(opt => (
                            <button key={opt} className="bg-white border-2 border-border p-4 rounded-xl text-sm font-medium hover:border-olive-light transition-all active:bg-olive active:text-white">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === 2 && (
                      <div>
                        <h3 className="text-2xl mb-2">Qual é o seu treino principal?</h3>
                        <p className="text-sm text-text-muted mb-8">Selecione uma ou mais opções.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['Yoga', 'Pilates', 'Musculação', 'Corrida', 'Funcional', 'Outro'].map(opt => (
                            <button key={opt} className="bg-white border-2 border-border p-4 rounded-xl text-sm font-medium hover:border-olive-light transition-all">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === 3 && (
                      <div>
                        <h3 className="text-2xl mb-2">Quais peças você mais usa?</h3>
                        <p className="text-sm text-text-muted mb-8">Selecione todas que se aplicam.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['Legging', 'Short', 'Top', 'Regata', 'Jaqueta', 'Body', 'Camiseta', 'Calça jogger'].map(opt => (
                            <button key={opt} className="bg-white border-2 border-border p-4 rounded-xl text-sm font-medium hover:border-olive-light transition-all">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === 4 && (
                      <div>
                        <h3 className="text-2xl mb-2">O que você prefere não receber?</h3>
                        <p className="text-sm text-text-muted mb-8">Marque tudo que não combina com você.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['Shorts curtos', 'Top com bojo', 'Cores claras', 'Cores neon', 'Peças muito justas', 'Estampas', 'Transparência', 'Nenhuma restrição'].map(opt => (
                            <button key={opt} className="bg-white border-2 border-border p-4 rounded-xl text-sm font-medium hover:border-olive-light transition-all">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === 5 && (
                      <div>
                        <h3 className="text-2xl mb-2">Tamanho e compressão</h3>
                        <p className="text-sm text-text-muted mb-8">Para que cada peça vista do jeito certo.</p>
                        <div className="mb-6">
                          <p className="text-xs font-bold uppercase mb-3">Tamanho</p>
                          <div className="flex flex-wrap gap-2">
                            {['PP', 'P', 'M', 'G', 'GG', 'XG'].map(s => (
                              <button key={s} className="w-12 h-12 bg-white border-2 border-border rounded-lg flex items-center justify-center font-bold text-sm hover:border-olive transition-all">
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase mb-3">Nível de compressão</p>
                          <div className="grid grid-cols-2 gap-3">
                            {['Leve', 'Média', 'Alta', 'Sem preferência'].map(opt => (
                              <button key={opt} className="bg-white border-2 border-border p-3 rounded-xl text-sm font-medium hover:border-olive transition-all">
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {quizStep === 6 && (
                      <div>
                        <h3 className="text-2xl mb-2">Alguma preferência extra?</h3>
                        <p className="text-sm text-text-muted mb-6">Escreva livremente qualquer detalhe que ajude a gente.</p>
                        <textarea 
                          className="w-full min-h-[150px] bg-white border-2 border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-olive transition-colors"
                          placeholder="Ex.: prefiro peças de cintura alta, não gosto de decote nas costas..."
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between">
                  {quizStep > 1 ? (
                    <button onClick={prevStep} className="text-sm font-medium text-text-muted hover:text-text-primary flex items-center gap-1">
                      <ChevronLeft size={18} /> Voltar
                    </button>
                  ) : <div />}
                  
                  {quizStep < 6 ? (
                    <button onClick={nextStep} className="bg-olive text-white px-10 py-3 rounded-full font-heading font-semibold hover:bg-olive-deep transition-all">
                      Próximo
                    </button>
                  ) : (
                    <button onClick={finishQuiz} className="bg-olive text-white px-10 py-3 rounded-full font-heading font-semibold hover:bg-olive-deep transition-all">
                      Finalizar Quiz
                    </button>
                  )}
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-olive text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl mb-4">Pronto. Seu perfil de estilo foi criado.</h3>
                <p className="text-text-secondary mb-8">Agora é só escolher o plano ideal para você e aguardar sua primeira box.</p>
                <a href="#planos" className="bg-olive text-white px-10 py-4 rounded-full font-heading font-semibold hover:bg-olive-deep transition-all inline-block">
                  Escolher meu plano
                </a>
              </motion.div>
            )}
          </div>
          <p className="text-center mt-8 text-xs text-text-muted">Você pode alterar suas preferências a qualquer momento na Área da Assinante.</p>
        </div>
      </section>

      {/* Box Contents */}
      <section id="box" className="py-24 bg-sand">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <SectionLabel>Cada entrega</SectionLabel>
            <h2 className="text-4xl mb-4">O que vem na sua box</h2>
            <p className="text-text-secondary">Toda VIVE FIT BOX vai além das peças. A experiência começa na embalagem e se estende a cada detalhe que você encontra dentro.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Sparkles className="text-olive" />, title: "Peças selecionadas para o seu perfil", desc: "Roupas fitness escolhidas com base no que você informou no quiz — tecido de alta performance, caimento testado e estética alinhada ao seu estilo." },
              { icon: <FileText className="text-olive" />, title: "VIVE Guide", desc: "Card impresso em papel texturizado com a ficha técnica do tecido da peça e uma dica de bem-estar, treino ou autocuidado do mês." },
              { icon: <Package className="text-olive" />, title: "Mimo de experiência", desc: "Um item que reforça o conceito da marca. Pode ser um sachê de chá premium, um elástico minimalista ou outro detalhe pensado para o seu momento." },
              { icon: <ShieldCheck className="text-olive" />, title: "Certificado de seleção", desc: "Selo que acompanha cada box, indicando que as peças passaram por controle de qualidade e foram escolhidas dentro dos critérios da VIVE FIT." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] border border-border-light">
                <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensory Experience */}
      <section className="py-24 bg-olive-deep text-sand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-gradient from-terracotta/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel className="text-terracotta-soft">Unboxing</SectionLabel>
            <h2 className="text-4xl text-sand mb-6">Abrir a box faz parte da experiência.</h2>
            <p className="text-sand/80 leading-relaxed mb-4">
              Cada entrega é montada com atenção ao que você vê, toca e sente. Papel de seda com fragrância sutil de bambu. Apresentação limpa, sem excesso de plástico. Tags em papel reciclado encorpado. Logo com acabamento em relevo.
            </p>
            <p className="text-sand/80 leading-relaxed mb-8">
              A ideia é que o momento de abrir a box seja uma pausa — não uma pressa. Um instante de cuidado, de atenção ao detalhe e de conexão com algo que foi pensado para você.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Papel de seda perfumado', 'Sem plástico', 'Acabamento em relevo', 'Papel reciclado'].map(tag => (
                <span key={tag} className="bg-white/10 border border-white/15 px-4 py-2 rounded-full text-[0.7rem] font-medium tracking-wider uppercase text-sand/70">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[3/4] bg-gradient-to-br from-olive to-olive-light rounded-[2rem] flex items-center justify-center border border-dashed border-white/20 p-8 text-center overflow-hidden"
          >
            <img 
              src="https://picsum.photos/seed/unboxing/600/800" 
              alt="VIVE FIT Unboxing" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            <div className="relative z-10 text-sand/40 text-sm font-medium">
              <p>[FOTO DE UNBOXING VIVE FIT]</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>Planos</SectionLabel>
            <h2 className="text-4xl mb-4">Escolha o que faz sentido para você.</h2>
            <p className="text-text-secondary">Primeiro, defina quantas peças quer receber por mês. Depois, escolha a periodicidade da sua assinatura.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-sand p-1 rounded-full flex">
              {(['mensal', 'trimestral', 'anual'] as Period[]).map((p) => (
                <button 
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-8 py-2.5 rounded-full font-heading text-sm font-bold transition-all ${period === p ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white border-2 p-10 rounded-[2rem] transition-all hover:shadow-xl ${plan.featured ? 'border-olive shadow-lg shadow-olive/10' : 'border-border hover:border-sand-dark'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-olive text-white px-4 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest">
                    Mais escolhido
                  </div>
                )}
                <h3 className={`text-2xl font-extrabold mb-1 ${plan.aspirational ? 'text-terracotta' : ''}`}>{plan.name}</h3>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">{plan.pieces}</div>
                
                <div className="mb-6">
                  <span className="text-3xl font-extrabold tracking-tighter">{plan.prices[period]}</span>
                  <span className="text-sm text-text-muted ml-1">/mês</span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6 min-h-[80px]">
                  {plan.description}
                </p>

                <div className="pt-6 border-t border-border-light mb-8">
                  <p className="text-xs text-text-muted leading-relaxed italic">
                    {plan.includes}
                  </p>
                </div>

                <a 
                  href={plan.checkoutLinks[period]} 
                  className={`w-full py-4 rounded-full font-heading font-bold text-center block transition-all ${plan.featured ? 'bg-olive-deep text-white hover:bg-black' : 'border-2 border-olive text-olive hover:bg-olive hover:text-white'}`}
                >
                  Assinar {plan.name}
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center max-w-lg mx-auto">
            <p className="text-sm text-text-muted">
              <strong>{period.charAt(0).toUpperCase() + period.slice(1)}:</strong> {PERIOD_NOTES[period]}
            </p>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section id="diferenciais" className="py-24 bg-sand">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <SectionLabel>Diferenciais</SectionLabel>
            <h2 className="text-4xl mb-4">Como a gente escolhe o que vai na sua box.</h2>
            <p className="text-text-secondary">A VIVE FIT trabalha com marca própria e com marcas parceiras que seguem o mesmo padrão de qualidade, estética e funcionalidade.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Tecido e tecnologia", desc: "A gente testa o material. Performance real, toque confortável, durabilidade. Sem enganação de etiqueta." },
              { title: "Caimento e modelagem", desc: "Não basta parecer boa na foto. A peça precisa vestir bem no corpo, no movimento e no treino." },
              { title: "Alinhamento estético", desc: "Tudo segue a mesma linguagem visual: clean, funcional, sofisticada. Se não combina com a identidade da marca, não entra." },
              { title: "Coerência com o seu perfil", desc: "O que você informou no quiz, as preferências que atualizou e o histórico do que já recebeu guiam a escolha." }
            ].map((diff, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-border-light">
                <h3 className="text-lg mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-olive rounded-full" />
                  {diff.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscriber Area */}
      <section id="area-assinante" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Sua conta</SectionLabel>
            <h2 className="text-4xl mb-6">Você muda. Suas preferências acompanham.</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Na Área da Assinante, você tem acesso a tudo o que define a seleção da sua box. Pode atualizar cores, peças favoritas, tamanho e nível de compressão sempre que quiser. Também pode trocar de plano, alterar a periodicidade e consultar o histórico do que já recebeu.
            </p>
            <ul className="space-y-3">
              {['Preferências de cor e estilo', 'Blacklist de peças', 'Tamanho e compressão', 'Plano e periodicidade', 'Histórico de boxes recebidas'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-olive rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video bg-sand rounded-[2rem] border border-dashed border-border flex items-center justify-center p-8 text-center"
          >
             <img 
              src="https://picsum.photos/seed/dashboard/800/600" 
              alt="Área da Assinante" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20"
            />
            <div className="relative z-10 text-text-muted text-sm font-medium">
              <p>[MOCKUP DA ÁREA DA ASSINANTE]</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="depoimentos" className="py-24 bg-sand">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>Quem usa, aprova</SectionLabel>
            <h2 className="text-4xl">Quem recebe, sente a diferença.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "A curadoria é impecável. As peças que recebi realmente combinam com o meu estilo e o tecido é de uma qualidade que eu não encontrava facilmente.", author: "Camila S.", meta: "São Paulo · Plano Select" },
              { text: "O unboxing é uma experiência à parte. Dá pra sentir o cuidado em cada detalhe, desde o perfume até a escolha das peças. Recomendo muito!", author: "Juliana R.", meta: "Curitiba · Plano Premium" },
              { text: "Finalmente uma assinatura que entende que eu não gosto de cores neon. Minha box veio exatamente com a paleta neutra que eu pedi.", author: "Beatriz M.", meta: "Belo Horizonte · Plano Essential" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] flex flex-col justify-between border border-border-light">
                <blockquote className="text-sm text-text-secondary italic leading-relaxed mb-8">
                  "{t.text}"
                </blockquote>
                <div>
                  <div className="font-heading font-bold text-sm">{t.author}</div>
                  <div className="text-xs text-text-muted mt-1">{t.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <SectionLabel>Dúvidas</SectionLabel>
            <h2 className="text-4xl">Perguntas frequentes</h2>
          </div>

          <div className="space-y-1">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-border-light">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-heading font-bold text-lg group-hover:text-olive transition-colors">{item.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-olive text-white rotate-45' : 'bg-sand text-text-secondary'}`}>
                    <Plus size={16} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 text-sm text-text-secondary leading-relaxed max-w-2xl">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-sand text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Comece agora</SectionLabel>
            <h2 className="text-4xl mb-6">Pronta para receber peças que combinam com você?</h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-10">
              Responda o quiz, escolha seu plano e receba todo mês uma box montada para o seu estilo, o seu treino e a sua rotina.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#quiz" className="bg-olive text-white px-10 py-4 rounded-full font-heading font-semibold hover:bg-olive-deep transition-all shadow-lg shadow-olive/20">
                Começar meu Quiz
              </a>
              <a href="#planos" className="border-2 border-olive text-olive px-10 py-4 rounded-full font-heading font-semibold hover:bg-olive hover:text-white transition-all">
                Escolher meu plano
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-olive-deep text-sand/60 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="font-heading font-extrabold text-2xl tracking-tighter text-sand">
              VIVE <span className="text-terracotta-soft">FIT</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {['Termos de Uso', 'Política de Privacidade', 'Contato'].map(link => (
                <a key={link} href="#" className="text-xs hover:text-sand transition-colors uppercase tracking-widest font-medium">{link}</a>
              ))}
              <a href="#" className="flex items-center gap-2 text-xs hover:text-sand transition-colors uppercase tracking-widest font-medium">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-[0.7rem] tracking-wider uppercase font-medium">
            &copy; 2026 VIVE FIT. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-light p-4 md:hidden"
          >
            <a href="#quiz" className="w-full bg-olive text-white py-4 rounded-full font-heading font-bold text-center block shadow-lg shadow-olive/20">
              Começar meu Quiz
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
