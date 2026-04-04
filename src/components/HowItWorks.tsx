import { useRef, useEffect, useState } from "react";
import "./HowItWorks.css";

export default function HowItWorks() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
      scrollLeft.current = carousel.scrollLeft;
    };

    const handleMouseLeave = () => { isDragging.current = false; };
    const handleMouseUp = () => { isDragging.current = false; };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
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
          <div className="step-card__circle circle-a"></div>
          <div className="step-card__circle circle-b"></div>
          <div className="step-card__circle circle-c"></div>
          <p className="step-card__num">1.</p>
          <h3 className="step-card__title">Conta pra gente<br />quem você é</h3>
          <p className="step-card__desc">O quiz de estilo leva 2 minutos. A gente conhece seu corpo, seu gosto e seu treino.</p>
        </div>

        <div className="step-card step-card--2">
          <div className="step-card__circle circle-a"></div>
          <div className="step-card__circle circle-b"></div>
          <div className="step-card__circle circle-c"></div>
          <p className="step-card__num">2.</p>
          <h3 className="step-card__title">A gente monta<br />sua box com carinho</h3>
          <p className="step-card__desc">3 peças escolhidas pro seu estilo, tamanho e tipo de treino. Curadoria de verdade.</p>
        </div>

        <div className="step-card step-card--3">
          <div className="step-card__circle circle-a"></div>
          <div className="step-card__circle circle-b"></div>
          <div className="step-card__circle circle-c"></div>
          <p className="step-card__num">3.</p>
          <h3 className="step-card__title">Abre a porta<br />e se surpreende</h3>
          <p className="step-card__desc">Sua box chega todo mês, direto na sua casa. Vista, treine, repita.</p>
        </div>
      </div>

      <div className="carousel-dots">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={`carousel-dot${activeIndex === i ? " active" : ""}`}
            onClick={() => scrollToSlide(i)}
            aria-label={`Passo ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}