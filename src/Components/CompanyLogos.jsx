import React from "react";
import { companyLogos, companyLogos2 } from "../constants";

const CompanyLogos = () => {
  return (
    <section className="w-full py-10 overflow-hidden" id="parceiros">
      <div className="container">
        <h4 className="tagline mb-8 text-center text-n-8">
          Nossos Parceiros Confirmados
        </h4>
      </div>

      {/* Primeiro carrossel */}
      <div className="relative flex overflow-hidden">
        {/* Primeira cópia */}
        <div className="flex shrink-0 animate-slide">
          {companyLogos.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Segunda cópia */}
        <div className="flex shrink-0 animate-slide">
          {companyLogos.map((item, index) => (
            <div
              key={`clone-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Segundo carrossel (direção reversa) */}
      <div className="relative flex overflow-hidden mt-8">
        {/* Primeira cópia */}
        <div className="flex shrink-0 animate-slide-reverse">
          {companyLogos2.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Segunda cópia */}
        <div className="flex shrink-0 animate-slide-reverse">
          {companyLogos2.map((item, index) => (
            <div
              key={`clone-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-[160px] sm:w-[180px] md:w-[200px] xl:w-[240px] h-[6rem] sm:h-[7rem] md:h-[8.5rem] xl:h-[10rem] mx-2 sm:mx-3 md:mx-4"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.logo}
                  width={134}
                  height={48}
                  alt={`Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
