import { useRef, useEffect, useState } from "react";
import "./HowItWorks.css";

function FlowerSVG({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', ...style }} fill={color}>
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(45 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(90 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(135 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(180 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(225 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(270 100 100)" />
      <path d="M100 0C100 0 120 40 100 70C80 40 100 0 100 0Z" transform="rotate(315 100 100)" />
    </svg>
  );
}

function BlobSVG({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', ...style }} fill={color}>
      <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.3,29,72.6,41.3C63.9,53.6,52.1,63.7,38.8,71.3C25.5,78.9,10.7,84,-3.2,89.5C-17.2,95,-34.3,100.8,-47.6,93.3C-60.9,85.7,-70.4,64.8,-77.5,45.5C-84.6,26.2,-89.4,8.5,-86.8,-7.5C-84.2,-23.5,-74.3,-37.8,-62.3,-49.6C-50.3,-61.4,-36.3,-70.6,-21.7,-77.4C-7.2,-84.3,7.8,-88.9,22.1,-86.2C36.3,-83.5,49.8,-73.6,44.7,-76.4Z" transform="translate(100 100)" />
    </svg>
  );
}

export default function HowItWorks() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const card = carousel.querySelector(".step-card") as HTMLElement;
      if (!card) return;
      const cw = card.offsetWidth + 16;
      const active = Math.round(carousel.scrollLeft / cw);
      setActiveIndex(active);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - carousel.offsetLeft;
      scrollLeftRef.current = carousel.scrollLeft;
    };
    const handleMouseLeave = () => { isDragging.current = false; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeftRef.current - (x - startX.current) * 1.5;
    };

    carousel.addEventListener("scroll", handleScroll);
    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove);
    return () => {
      carousel.removeEventListener("scroll", handleScroll);
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector(".step-card") as HTMLElement;
    if (!card) return;
    const cw = card.offsetWidth + 16;
    carousel.scrollTo({ left: index * cw, behavior: "smooth" });
  };

  return (
    <section className="como-funciona">
      <h2 className="como-funciona__titulo">como funciona</h2>

      <div className="carousel" ref={carouselRef}>
        <div className="step-card step-card--1">
          <FlowerSVG color="rgba(232,213,181,0.7)" style={{ width: '180px', top: '-40px', left: '-40px', transform: 'rotate(-15deg)' }} />
          <div className="step-card__content">
            <p className="step-card__num">1.</p>
            <h3 className="step-card__title">Você preenche seu perfil de look</h3>
            <p className="step-card__desc">Pra sabermos como você é, também o que quer, gosta e precisa</p>
          </div>
        </div>

        <div className="step-card step-card--2">
          <BlobSVG color="rgba(255,255,255,0.25)" style={{ width: '220px', top: '-60px', left: '-30px' }} />
          <div className="step-card__content">
            <p className="step-card__num">2.</p>
            <h3 className="step-card__title">Encontramos seu look perfeito</h3>
            <p className="step-card__desc">Nossa IA cruza suas respostas com os produtos da nossa curadoria</p>
          </div>
        </div>

        <div className="step-card step-card--3">
          <FlowerSVG color="rgba(255,90,95,0.85)" style={{ width: '200px', top: '-50px', left: '-50px', transform: 'rotate(10deg)' }} />
          <div className="step-card__content">
            <p className="step-card__num">3.</p>
            <h3 className="step-card__title">Sua box fit dos sonhos chega por aí</h3>
            <p className="step-card__desc">Todo mês você recebe 4 novas peças para completar sua rotina de treino</p>
          </div>
        </div>
      </div>

      <div className="carousel-dots">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={"carousel-dot" + (activeIndex === i ? " active" : "")}
            onClick={() => scrollToSlide(i)}
            aria-label={"Passo " + (i + 1)}
          />
        ))}
      </div>
    </section>
  );
}