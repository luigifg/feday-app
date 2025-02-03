import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import infineon from "../assets/banner/infineon.png";
import ams from "../assets/banner/ams.png";
import Section from "../Components/Section";

const PresentationCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [fullScreenSlide, setFullScreenSlide] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const presentations = [
    {
      id: 1,
      title: "The Art of Photography",
      description:
        "With over 15 years of experience in digital and film photography, John specializes in capturing the essence of natural landscapes and urban architecture. His work has been featured in numerous international exhibitions, showcasing his unique perspective and technical mastery in visual storytelling.",
      image: infineon,
      tags: ["Photography", "Art", "Digital"],
    },
    {
      id: 2,
      title: "Historia do Resistor",
      description:
        "Sarah brings 20 years of architectural expertise, focusing on sustainable urban development and innovative design solutions. Her projects have won multiple awards for environmental consciousness and cutting-edge urban planning strategies.",
      image: ams,
      tags: ["Architecture", "Design", "Urban"],
    },
  ];

  const [expandedDescriptions, setExpandedDescriptions] = useState(
    presentations.map(() => false)
  );

  const truncateDescription = (text) => {
    const words = text.split(' ');
    if (words.length <= 25) return text;
    return words.slice(0, 25).join(' ') + '...';
  };

  const renderDescription = (description, index) => {
    const isExpanded = expandedDescriptions[index];
    if (window.innerWidth < 768) {
      return isExpanded ? description : truncateDescription(description);
    }
    return truncateDescription(description);
  };

  const toggleDescription = (index, e) => {
    e?.stopPropagation();
    if (window.innerWidth >= 768) return;

    setExpandedDescriptions((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      if (window.innerWidth < 768) {
        setIsAutoPlayPaused(!prev[index]);
      }
      return newExpanded;
    });
  };

  useEffect(() => {
    if (!isAutoPlayPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === presentations.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [presentations.length, isAutoPlayPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === presentations.length - 1 ? 0 : prev + 1
    );
  }, [presentations.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? presentations.length - 1 : prev - 1
    );
  }, [presentations.length]);

  const openFullScreen = (index) => {
    setFullScreenSlide(index);
    setIsAutoPlayPaused(true);
  };

  const closeFullScreen = () => {
    setFullScreenSlide(null);
    setIsAutoPlayPaused(false);
  };

  if (fullScreenSlide !== null) {
    const slide = presentations[fullScreenSlide];
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl h-[90vh] flex bg-white shadow-2xl rounded-lg overflow-hidden">
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 z-60 text-gray-600 hover:text-black transition-colors"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="flex w-full">
            <div className="w-2/3 relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/3 bg-white p-8 flex flex-col justify-center overflow-y-auto">
              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-gray-600 text-base mb-6">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {slide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Section
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      className="pt-[6rem] pb-[6rem] lg:pb-0 md:pt-[5.3rem] md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] -mt-[5.25rem] relative"
        id="local"
      >
        <div className="w-full">
          <div className="max-w-9xl mx-auto relative">
            <div className="relative">
              {presentations.map((item, index) => (
                <div
                  key={item.id}
                  className={`w-full transition-all duration-500 ease-in-out ${
                    index === currentSlide ? "block" : "hidden"
                  }`}
                  onClick={() => window.innerWidth >= 640 && openFullScreen(index)}
                >
                  <div className={`flex flex-col md:flex-col lg:flex-row group relative ${
                    window.innerWidth < 768 && expandedDescriptions[index] 
                      ? 'h-auto' 
                      : 'h-[400px] sm:h-[350px] md:h-[400px] 2xl:h-[500px]'
                  }`}>
                    <div className="w-full lg:w-1/3 bg-white p-4 md:p-6 lg:p-8 flex flex-col justify-between order-2 lg:order-1">
                      <div>
                        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">
                          {item.title}
                        </h2>
                        <div className="transition-all duration-300 ease-in-out">
                          <p className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-base mb-2 sm:mb-3 lg:mb-6">
                            {renderDescription(item.description, index)}
                          </p>
                          {window.innerWidth < 768 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(index, e);
                              }}
                              className="text-green-500 text-sm font-semibold hover:underline mb-4"
                            >
                              {expandedDescriptions[index]
                                ? "Ver Menos"
                                : "Ver Mais"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 sm:px-2 md:px-2 lg:px-3 py-0.5 sm:py-1 bg-gray-200 rounded-full text-[10px] sm:text-xs md:text-xs lg:text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full lg:w-2/3 h-[200px] sm:h-[250px] md:h-[250px] lg:h-full order-1 lg:order-2 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-black/10 
                        ${isHovered ? "opacity-20" : "opacity-10"} 
                        transition-opacity duration-300`}
                      />
                      {isHovered && window.innerWidth >= 640 && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer">
                          <div className="bg-white/80 px-4 py-2 rounded-full text-gray-800">
                            Clique para expandir
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative md:relative lg:absolute bottom-0 left-0 right-0 py-4 md:py-4 lg:py-0 lg:bottom-4 flex justify-center items-center gap-4 px-4 z-10 bg-white lg:bg-transparent">
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

              <div className="flex gap-1">
                {presentations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1 h-1 md:w-1 md:h-1 lg:w-1.5 lg:h-1.5 rounded-full transition-colors ${
                      index === currentSlide ? "bg-green-500" : "bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
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
      </Section>
    </div>
  );
};

export default PresentationCarousel;