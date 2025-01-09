import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Section from "./Section";
import bg3 from "../assets/logos/bg3.svg";

const Previous = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // Function to update images per view based on screen width
  const updateImagesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setImagesPerView(3);
      setIsMobile(false);
    } else if (width >= 768) {
      setImagesPerView(2);
      setIsMobile(false);
    } else {
      setImagesPerView(1);
      setIsMobile(true);
    }
  };

  useEffect(() => {
    // Import images
    const importImages = async () => {
      const imageModules = import.meta.glob("../assets/fe2024/*", {
        eager: true,
      });
      const importedImages = Object.values(imageModules).map(
        (module) => module.default
      );
      setImages(importedImages);
    };

    importImages();

    // Set initial images per view
    updateImagesPerView();

    // Add window resize listener
    window.addEventListener("resize", updateImagesPerView);

    // Remove listener on unmount
    return () => {
      window.removeEventListener("resize", updateImagesPerView);
    };
  }, []);

  // Reset current index when images per view changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [imagesPerView]);

  // Navigate to next slide
  const nextSlide = () => {
    // Calculate the maximum starting index to ensure we don't go out of bounds
    const maxIndex = Math.max(0, images.length - imagesPerView);
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + imagesPerView, maxIndex)
    );
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - imagesPerView));
  };

  // Get the current group of images to display
  const currentImages = images.slice(
    currentIndex,
    currentIndex + imagesPerView
  );

  // Pad the current images group if it's not full
  const displayImages = [...currentImages];
  while (displayImages.length < imagesPerView) {
    displayImages.push(null);
  }

  // Check if navigation buttons should be disabled
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + imagesPerView >= images.length;

  // Handle image click for mobile navigation
  const handleImageClick = () => {
    if (isMobile) {
      nextSlide();
    }
  };

  return (
    <div className="relative">
      {/* Background wrapper */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${bg3})`,
          backgroundSize: "145% 120%",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Section
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        className="pt-[10rem] -mt-[5.25rem] pb-[5rem] relative"
        id="2024"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
            <h2 className="h1 mb-6">
              Veja o Sucesso {` `}
              <span className="inline-block relative mb-10">
                Do Evento Passado{" "}
              </span>
            </h2>
            <p className="body-1 max-w-3xl mx-auto mb-6 text-n-8 lg:mb-8">
              Nosso último evento foi um grande sucesso e se consolidou como um
              importante espaço de troca de informações e conexões. Realizado no
              mesmo local que receberá a próxima edição, reunimos os principais
              fabricantes do setor, apresentando lançamentos, tendências de
              mercado e palestras enriquecedoras que fortaleceram o conhecimento
              de todos os participantes. Confira abaixo os destaques e as fotos
              que marcaram o evento:
            </p>
          </div>

          <div className="relative w-full max-w-7xl mx-auto">
            {images.length > 0 ? (
              <div className="flex items-center justify-center w-full space-x-4 px-10">
                {/* Previous Button - Hidden on mobile */}
                {!isMobile && (
                  <button
                    onClick={prevSlide}
                    disabled={isPrevDisabled}
                    className={`flex-shrink-0 bg-white p-2 rounded-full shadow-md transition-opacity duration-300 
                    ${
                      isPrevDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    aria-label="Previous slide"
                  >
                    <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </button>
                )}

                {/* Image Carousel */}
                <div className="flex-grow flex justify-center space-x-6 w-full">
                  {displayImages.map((src, index) => (
                    <div
                      key={index}
                      className="flex-1 max-w-xs"
                      onClick={handleImageClick}
                    >
                      <div className="p-1.5 bg-gradient-to-r from-green-300 to-green-500 rounded-xl shadow-lg">
                        <div className="bg-white rounded-lg overflow-hidden h-full cursor-pointer">
                          {src ? (
                            <img
                              src={src}
                              alt={`Event highlight ${
                                currentIndex + index + 1
                              }`}
                              className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] bg-gray-200"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Button - Hidden on mobile */}
                {!isMobile && (
                  <button
                    onClick={nextSlide}
                    disabled={isNextDisabled}
                    className={`flex-shrink-0 bg-white p-2 rounded-full shadow-md transition-opacity duration-300 
                    ${
                      isNextDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    aria-label="Next slide"
                  >
                    <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1">
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Carregando imagens...
              </div>
            )}

            {/* Navigation Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({
                length: Math.ceil(images.length / imagesPerView),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * imagesPerView)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index * imagesPerView === currentIndex
                      ? "bg-green-500"
                      : "bg-gray-300 hover:bg-green-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Previous;
