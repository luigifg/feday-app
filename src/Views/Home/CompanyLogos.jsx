import React, { useState, useRef, useEffect } from "react";
import { companyLogos, companyLogos2 } from "../../constants";
import Button from "../../Components/design/Button";

const CompanyLogos = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };
  
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside, { passive: true });
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isPopupOpen]);

  const allLogos = [...companyLogos, ...companyLogos2];
  const sortedLogoTitles = allLogos
    .map((logo) => logo)
    .filter(
      (logo, index, self) =>
        self.findIndex((l) => l.title === logo.title) === index
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <section className="scroll-mt-20 mb-20 relative w-full" id="parceiros">
      <div className="container mx-auto">
        <div className="w-full mb-8 pt-2">
          <h4 className="tagline text-center text-n-8">
            Nossos Parceiros Confirmados
          </h4>
        </div>

        <div className="py-6">
          {/* Primeiro carrossel */}
          <div className="relative flex overflow-hidden w-full">
            {/* Primeira cópia */}
            <div className="flex shrink-0 animate-slide">
              {companyLogos.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-10"
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
                  className="flex-shrink-0 flex items-center justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-10"
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

          {/* Gap entre carrosséis */}
          <div className="h-10"></div>

          {/* Segundo carrossel */}
          <div className="relative flex overflow-hidden w-full">
            {/* Primeira cópia */}
            <div className="flex shrink-0 animate-slide-reverse">
              {companyLogos2.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-10"
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
                  className="flex-shrink-0 flex items-center justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-10"
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
        </div>

        {/* Botão para abrir lista completa */}
        <div className="text-center my-6">
          <Button onClick={togglePopup}>Ver lista completa</Button>
        </div>
      </div>

      {/* Pop-up com lista de títulos */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-white mt-20 p-8 w-[90%] sm:w-96 max-h-[80vh] overflow-y-auto shadow-2xl rounded-2xl font-sans custom-scrollbar mx-4"
            style={{
              borderRadius: "16px",
              border: "6px solid transparent",
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(45deg, #48bb78, #38b2ac)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-2xl font-bold text-gray-800"
                style={{
                  fontFamily: "'Rounded Mplus 1c', system-ui, sans-serif",
                }}
              >
                Lista de Parceiros
              </h3>
              <button
                onClick={togglePopup}
                className="text-gray-600 hover:text-green-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-1">
              {sortedLogoTitles.map((logo, index) => (
                <li
                  key={index}
                  className="py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-gray-800 flex items-center gap-3"
                  >
                    <img
                      src={logo.logo}
                      alt={`Logo ${logo.title}`}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{logo.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanyLogos;