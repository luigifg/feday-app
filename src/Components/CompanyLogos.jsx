import React, { useRef, useEffect } from "react";
import { companyLogos, companyLogos2 } from "../constants";

const CompanyLogos = ({ className }) => {
  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);

  const setupCarousel = (carousel) => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = "grabbing";
    };

    const stopDragging = () => {
      isDragging = false;
      carousel.style.cursor = "grab";
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    carousel.addEventListener("mousedown", startDragging);
    carousel.addEventListener("mouseleave", stopDragging);
    carousel.addEventListener("mouseup", stopDragging);
    carousel.addEventListener("mousemove", drag);

    return () => {
      carousel.removeEventListener("mousedown", startDragging);
      carousel.removeEventListener("mouseleave", stopDragging);
      carousel.removeEventListener("mouseup", stopDragging);
      carousel.removeEventListener("mousemove", drag);
    };
  };

  useEffect(() => {
    if (carouselRef1.current) {
      const cleanup1 = setupCarousel(carouselRef1.current);
      return cleanup1;
    }
  }, []);

  useEffect(() => {
    if (carouselRef2.current) {
      const cleanup2 = setupCarousel(carouselRef2.current);
      return cleanup2;
    }
  }, []);

  return (
    <div className={className}>
      <h4 className="tagline mb-15 text-center text-n-8">
        Nossos Parceiros de confiança
      </h4>
      
      {/* Container do primeiro carrossel - movimento para direita */}
      <div className="relative w-full overflow-hidden mb-8">
        <div
          ref={carouselRef1}
          className="flex whitespace-nowrap cursor-grab select-none"
        >
          {/* Primeira cópia dos logos */}
          <div className="flex animate-slide">
            {companyLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
              >
                <img
                  src={logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          {/* Segunda cópia dos logos para movimento contínuo */}
          <div className="flex animate-slide">
            {companyLogos.map((logo, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
              >
                <img
                  src={logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container do segundo carrossel - movimento para esquerda */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={carouselRef2}
          className="flex whitespace-nowrap cursor-grab select-none"
        >
          {/* Primeira cópia dos logos */}
          <div className="flex animate-slide-reverse">
            {companyLogos2.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
              >
                <img
                  src={logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          {/* Segunda cópia dos logos para movimento contínuo */}
          <div className="flex animate-slide-reverse">
            {companyLogos2.map((logo, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
              >
                <img
                  src={logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;