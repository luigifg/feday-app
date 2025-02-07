import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Linkedin, X } from "lucide-react";
import Section from "../Components/Section";
import SpeakerModal from "../Components/SpeakerModal";
import { speakers } from "../Components/speakerData.jsx";

const truncateText = (text, limit = 30) => {
  const words = text.split(" ");
  if (words.length <= limit) return { truncatedText: text, isTruncated: false };
  return {
    truncatedText: words.slice(0, limit).join(" ") + "...",
    isTruncated: true,
  };
};

const slides = speakers;

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [fullTextExpanded, setFullTextExpanded] = useState({});
  const [fullTextModalOpen, setFullTextModalOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop");

  // Check screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
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
      slideInterval = setInterval(nextSlide, 5000);
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
        className="md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] -mt-[5.25rem] relative"
      >
        <div
          className="relative w-full   overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="relative lg:col-span-2 h-[230px] md:h-[400px] lg:h-[400px] 2xl:h-[600px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    currentSlide === index
                      ? "opacity-100"
                      : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover "
                    loading="lazy"
                  />
                  <div className="absolute inset-0" />
                </div>
              ))}
            </div>

            <div className="relative p-0.5 bg-gradient-to-r from-green-300 to-green-500">
              <div className="px-6 py-5 lg:pt-0 flex flex-col justify-center bg-white h-full">
                {slides.map((slide, index) => {
                  const { truncatedText, isTruncated } = truncateText(
                    slide.description
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
                      <h3 className="text-xl sm:text-xl md:text-xl font-medium text-gray-600 mb-2 mt-4">
                        {slide.position}
                      </h3>

                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-xl xl:text-2xl font-bold text-gray-800">
                        {slide.name}
                      </h2>

                      <a
                        href={slide.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center lg:text-sm px-4 py-2 my-5 bg-[#0A66C2] text-white rounded-md hover:bg-[#084d93] transition-colors duration-300"
                      >
                        <Linkedin className="w-5 h-5 mr-2" />
                        Connect with me
                      </a>

                      <div className="relative">
                        <p
                          className={`
                            text-sm sm:text-sm md:text-base text-gray-600 mb-4
                            ${
                              screenSize !== "desktop" && isExpanded
                                ? "line-clamp-none"
                                : "line-clamp-3"
                            }
                          `}
                        >
                          {screenSize !== "desktop" && isExpanded
                            ? slide.description
                            : truncatedText}
                        </p>

                        {isTruncated && (
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

                <div className="flex items-center gap-5 justify-center">
                  <button
                    onClick={prevSlide}
                    className="bg-white w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer z-20"
                    aria-label="Previous slide"
                  >
                    <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1">
                        <ChevronLeft className="w-4 h-4 md:w-4 md:h-4 lg:w-6 lg:h-6 text-gray-600" />
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-colors duration-300 ${
                          currentSlide === index
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="bg-white w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer z-20"
                    aria-label="Next slide"
                  >
                    <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1">
                        <ChevronRight className="w-4 h-4 md:w-4 md:h-4 lg:w-6 lg:h-6 text-gray-600" />
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
