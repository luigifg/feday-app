import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Section from "../../Components/Section";
import bg3 from "../../assets/logos/bg4.svg";

const Previous = () => {
  const [activeYear, setActiveYear] = useState("2023");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const eventContent = {
    2023: {
      title: "O Sucesso em Curitiba – Evento 2023",
      description:
        "O evento de 2023, realizado em Curitiba, marcou o retorno dos eventos de eletrônica no Brasil após a pandemia. O Future Day estabeleceu um novo patamar para o setor, com grandes fabricantes e profissionais apresentando as últimas tendências e inovações. O Supplier Fair proporcionou importantes reencontros e networking entre clientes e fabricantes, tornando Curitiba o cenário perfeito para um evento histórico de excelência",
    },
    2024: {
      title: "Porto Alegre como Palco – Evento 2024",
      description:
        "Porto Alegre, que já sediou várias edições do Future Day, superou todas as expectativas na edição de 2024. Nossos clientes da região tiveram acesso a lançamentos exclusivos e às últimas tendências de mercado, com uma programação ainda mais enriquecedora e a participação de um número maior de fabricantes. A escolha da cidade ofereceu uma experiência única, com espaços modernos e uma atmosfera inspiradora, que impulsionaram a troca de ideias e fortaleceram as conexões entre os participantes.",
    },
  };

  const updateImagesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1280) {
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
    const importImages = async () => {
      let imageModules;
      if (activeYear === "2024") {
        imageModules = import.meta.glob("../../assets/fe2024/*", {
          eager: true,
        });
      } else {
        imageModules = import.meta.glob("../../assets/fe2023/*", {
          eager: true,
        });
      }
      const importedImages = Object.values(imageModules).map(
        (module) => module.default
      );
      setImages(importedImages);
    };

    importImages();
    setCurrentIndex(0);
  }, [activeYear]);

  useEffect(() => {
    updateImagesPerView();
    window.addEventListener("resize", updateImagesPerView);

    return () => {
      window.removeEventListener("resize", updateImagesPerView);
    };
  }, []);

  const nextSlide = () => {
    const maxIndex = Math.max(0, images.length - imagesPerView);
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + imagesPerView, maxIndex)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - imagesPerView));
  };

  const nextModalImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index) => {
    setSelectedImageIndex(currentIndex + index);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "unset";
  };

  const currentImages = images.slice(
    currentIndex,
    currentIndex + imagesPerView
  );
  const displayImages = [...currentImages];
  while (displayImages.length < imagesPerView) {
    displayImages.push(null);
  }

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + imagesPerView >= images.length;

  const totalPages = Math.ceil(images.length / imagesPerView);
  const currentPage = Math.floor(currentIndex / imagesPerView);

  return (
    <>
      <div className="relative">
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
          crossesOffset="translate-y"
          customPaddings
          className="py-16 md:py-16 lg:py-20 md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] relative scroll-mt-20"
          id="2024"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Year Tabs */}

            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white rounded-lg p-1 mb-10 shadow-md">
                {["2023", "2024"].map((year) => (
                  <button
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`relative px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        activeYear === year
                          ? "text-green-600"
                          : "text-gray-500 hover:text-green-500"
                      }`}
                  >
                    {year}
                    {activeYear === year && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-8 sm:mb-12 lg:mb-[3.875rem]">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-12">
                {eventContent[activeYear].title}
              </h2>

              <p className="text-base sm:text-lg lg:text-xl font- mx-auto text-gray-600 leading-relaxed">
                {eventContent[activeYear].description}
              </p>
              <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-medium text-gray-600 leading-relaxed mt-10">
                {"Confira as fotos das edições anteriores: "}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="relative w-full max-w-7xl mx-auto">
              {images.length > 0 ? (
                <div className="flex items-center justify-center w-full space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-10">
                  {!isMobile && (
                    <button
                      onClick={prevSlide}
                      disabled={isPrevDisabled}
                      className={`flex-shrink-0 bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-opacity duration-300 
                      ${
                        isPrevDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      aria-label="Previous slide"
                    >
                      <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                        <div className="bg-white rounded-full p-1">
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </div>
                      </div>
                    </button>
                  )}

                  <div className="flex-grow flex justify-center space-x-3 sm:space-x-4 lg:space-x-6 w-full">
                    {displayImages.map((src, index) => (
                      <div key={index} className="flex-1 max-w-xs">
                        <div className="p-1 sm:p-1.5 bg-gradient-to-r from-green-300 to-green-500 rounded-xl shadow-lg">
                          <div className="bg-white rounded-lg overflow-hidden h-full">
                            {src ? (
                              <img
                                src={src}
                                alt={`Event highlight ${
                                  currentIndex + index + 1
                                }`}
                                className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[430px] object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                                onClick={() => openModal(index)}
                              />
                            ) : (
                              <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[430px] bg-gray-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isMobile && (
                    <button
                      onClick={nextSlide}
                      disabled={isNextDisabled}
                      className={`flex-shrink-0 bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-opacity duration-300 
                      ${
                        isNextDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      aria-label="Next slide"
                    >
                      <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
                        <div className="bg-white rounded-full p-1">
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
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

              <div className="flex justify-center mt-6 sm:mt-8 space-x-1.5 sm:space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * imagesPerView)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${
                      currentPage === index
                        ? "bg-green-500"
                        : "bg-gray-300 hover:bg-green-300"
                    }`}
                  />
                ))}
              </div>
              
              {/* Removida a mensagem "Deslize para navegar" para dispositivos móveis */}
            </div>
          </div>
        </Section>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevModalImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={images[selectedImageIndex]}
              alt={`Event highlight ${selectedImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextModalImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Previous;