import React, { useRef, useEffect } from "react";
import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
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
      const walk = (x - startX) * 2; // Multiply by 2 to increase drag sensitivity
      carousel.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    carousel.addEventListener("mousedown", startDragging);
    carousel.addEventListener("mouseleave", stopDragging);
    carousel.addEventListener("mouseup", stopDragging);
    carousel.addEventListener("mousemove", drag);

    // Cleanup event listeners
    return () => {
      carousel.removeEventListener("mousedown", startDragging);
      carousel.removeEventListener("mouseleave", stopDragging);
      carousel.removeEventListener("mouseup", stopDragging);
      carousel.removeEventListener("mousemove", drag);
    };
  }, []);

  return (
    <div className={className}>
      <h4 className="tagline mb-15 text-center text-n-8">
        Nossos Parceiros de confiança
      </h4>
      <div
        ref={carouselRef}
        className="flex overflow-x-scroll scrollbar-hide whitespace-nowrap cursor-grab select-none"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex animate-slide">
          {companyLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center w-[200px] h-[8.5rem] mx-4"
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
          {/* Duplicate logos for infinite scroll effect */}
          {companyLogos.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-[200px] h-[8.5rem] mx-4"
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
      <div
        ref={carouselRef}
        className="flex overflow-x-scroll scrollbar-hide whitespace-nowrap cursor-grab select-none"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex animate-slide">
          {companyLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center w-[200px] h-[8.5rem] mx-4"
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
          {/* Duplicate logos for infinite scroll effect */}
          {companyLogos.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-[200px] h-[8.5rem] mx-4"
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
  );
};

export default CompanyLogos;
