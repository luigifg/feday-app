import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Section from "../../Components/Section.jsx";
import linkedin from "../../assets/socials/linkedin.png";
import SpeakerModal from "../../Components/design/SpeakerModal.jsx";
import { events } from "../../data/speakerData.jsx";

// Função para processar parágrafos em JSX
const formatDescriptionToJsx = (descriptionBanner, lineClampClass = "") => {
  if (!descriptionBanner) return null;

  // Divide o texto nas quebras de linha duplas
  const paragraphs = descriptionBanner.split("\n\n");

  // Mapeia cada parágrafo para um elemento <p>
  return paragraphs.map((paragraph, index) => (
    <p
      key={index}
      className={`text-sm sm:text-sm md:text-base text-gray-600 leading-relaxed ${
        index < paragraphs.length - 1 ? "mb-4" : ""
      } ${lineClampClass}`}
    >
      {paragraph}
    </p>
  ));
};

const truncateText = (text, screenSize) => {
  if (!text) return { truncatedText: "", isTruncated: false };

  // Remover quebras de linha para considerar apenas o texto
  const cleanText = text.replace(/\n\n/g, " ");
  const words = cleanText.split(" ");

  // Definir limites específicos para cada tipo de dispositivo
  let limit = 26; // Desktop (padrão)

  if (screenSize === "mobile") {
    limit = 20; // Menos palavras para celulares
  } else if (screenSize === "tablet") {
    limit = 17; // Limite específico para tablets
  }

  if (words.length <= limit)
    return {
      truncatedText: text,
      isTruncated: false,
    };

  // Retornamos o texto truncado sem quebras de linha
  return {
    truncatedText: words.slice(0, limit).join(" ") + "...",
    isTruncated: true,
  };
};

const slides = events;

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [fullTextExpanded, setFullTextExpanded] = useState({});
  const [fullTextModalOpen, setFullTextModalOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop");
  const [is2XL, setIs2XL] = useState(false);

  // Check screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIs2XL(width >= 1536);

      if (width <= 768) setScreenSize("mobile");
      else if (width <= 1023) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    let slideInterval;
    // Adiciona fullTextModalOpen na condição para pausar
    if (isPlaying && !isHovered && !fullTextModalOpen) {
      slideInterval = setInterval(nextSlide, 2500);
    }
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isPlaying, nextSlide, isHovered, fullTextModalOpen]); // Adiciona fullTextModalOpen nas dependências

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleTextExpansion = (slideId) => {
    if (screenSize === "mobile" || screenSize === "tablet") {
      setFullTextExpanded((prev) => ({
        ...prev,
        [slideId]: !prev[slideId],
      }));
    } else {
      setFullTextModalOpen(true);
    }
  };

  const closeFullTextModal = () => {
    setFullTextModalOpen(false);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative">
      <Section
        crosses
        crossesOffset="translate-y"
        customPaddings
        className="scroll-mt-20 md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] relative"
        id="speaker"
      >
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="relative lg:col-span-2 h-[230px] md:h-[400px] lg:h-[450px] 2xl:h-[600px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    currentSlide === index ? "opacity-100" : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={slide.imageBanner}
                    alt={slide.palestrante}
                    className="w-full h-full object-cover "
                    loading="lazy"
                  />
                  <div className="absolute inset-0" />
                </div>
              ))}
            </div>
            <div className="relative p-0.5 bg-gradient-to-r from-green-300 to-green-500">
              <div className="px-6 py-5 lg:pt-6 xl:pt-15 2xl:pt-6 flex flex-col bg-white h-full">
                {slides.map((slide, index) => {
                  const { truncatedText, isTruncated } = truncateText(
                    slide.descriptionBanner,
                    screenSize
                  );
                  const isExpanded = fullTextExpanded[slide.id];

                  return (
                    <div
                      key={slide.id}
                      className={`transition-opacity duration-500 ${
                        currentSlide === index
                          ? "opacity-100 relative z-10"
                          : "opacity-0 absolute inset-0 z-0"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <a
                          href={slide.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center transition-transform hover:scale-110"
                        >
                          <img
                            src={linkedin}
                            alt="LinkedIn"
                            className="w-6 h-6 brightness-100"
                          />
                        </a>
                        <h2 className="text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-800">
                          {slide.palestrante}
                        </h2>
                      </div>

                      <h3
                        className={`
                          text-lg sm:text-lg md:text-base lg:text-xl xl:text-lg 
                          font-medium text-green-700 my-3
                          tracking-wide
                          ${
                            screenSize !== "desktop" && isExpanded
                              ? "line-clamp-none"
                              : screenSize === "mobile"
                              ? "line-clamp-1"
                              : "line-clamp-none"
                          }
                        `}
                      >
                        {slide.position}
                      </h3>

                      <div className="relative">
                        {/* Renderiza diferente baseado na tela e estado */}
                        {is2XL || (screenSize !== "desktop" && isExpanded) ? (
                          // Para 2XL ou conteúdo expandido - mostra com parágrafos
                          <div className="text-sm sm:text-sm md:text-base text-gray-600 leading-relaxed">
                            {formatDescriptionToJsx(
                              screenSize !== "desktop" && isExpanded
                                ? slide.descriptionBanner
                                : is2XL
                                ? slide.descriptionBanner
                                : truncatedText
                            )}
                          </div>
                        ) : (
                          // Para telas menores com texto truncado - sem quebra de linha
                          <p
                            className={`
                            text-sm sm:text-sm md:text-base text-gray-600 leading-relaxed 
                            ${
                              screenSize === "mobile"
                                ? "line-clamp-2"
                                : screenSize === "tablet"
                                ? "line-clamp-3"
                                : "line-clamp-4"
                            } mb-4
                          `}
                          >
                            {truncatedText}
                          </p>
                        )}

                        {isTruncated && !is2XL && (
                          <div className="flex justify-start mt-6 mb-6 xl:mt-4 xl:mb-4">
                            <button
                              onClick={() => toggleTextExpansion(slide.id)}
                              className="text-green-600 hover:text-green-800 font-medium p-2 -m-2 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                            >
                              {screenSize !== "desktop" && isExpanded
                                ? "Mostrar menos"
                                : "Ver mais"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-6 pt-2 pb-6 lg:pb-0 justify-center lg:absolute lg:bottom-15 2xl:bottom-6 lg:left-1/2 lg:-translate-x-1/2  ">
                  <button
                    onClick={prevSlide}
                    className="bg-white w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full shadow-md 
                    hover:bg-gray-50 hover:scale-110
                    active:scale-95 active:bg-gray-100
                    transition-all duration-200 ease-in-out 
                    flex items-center justify-center cursor-pointer z-20"
                    aria-label="Previous slide"
                  >
                    <div
                      className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1
                    group-hover:from-green-400 group-hover:to-green-600
                    group-active:from-green-500 group-active:to-green-700"
                    >
                      <div className="bg-white rounded-full p-1">
                        <ChevronLeft className="w-6 h-6" />
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center">
                    <span className="text-sm md:text-base font-medium text-gray-600">
                      {currentSlide + 1}/{slides.length}
                    </span>
                  </div>

                  <button
                    onClick={nextSlide}
                    className="bg-white w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full shadow-md 
                    hover:bg-gray-50 hover:scale-110
                    active:scale-95 active:bg-gray-100
                    transition-all duration-200 ease-in-out 
                    flex items-center justify-center cursor-pointer z-20"
                    aria-label="Next slide"
                  >
                    <div
                      className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1
                      group-hover:from-green-400 group-hover:to-green-600
                      group-active:from-green-500 group-active:to-green-700"
                    >
                      <div className="bg-white rounded-full p-1">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <SpeakerModal
        isOpen={fullTextModalOpen && screenSize === "desktop"}
        onClose={closeFullTextModal}
        currentSlide={currentSlide}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        slides={slides}
      />
    </div>
  );
};

export default ImageSlider;
