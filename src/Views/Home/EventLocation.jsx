import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../Components/design/Button";
import Section from "../../Components/Section";
import bg4 from "../../assets/logos/bg4.svg";

export default function EventLocation() {
  const [locationImages, setLocationImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      const images = import.meta.glob("../../assets/location/*", { eager: true });
      setLocationImages(Object.values(images).map((img) => img.default));
    };
    loadImages();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const images = import.meta.glob("../../assets/location/*", { eager: true });
      setLocationImages(Object.values(images).map((img) => img.default));
    };
    loadImages();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % locationImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + locationImages.length) % locationImages.length
    );
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const nextModalImage = (e) => {
    e.stopPropagation();
    setModalImage((prev) => (prev + 1) % locationImages.length);
  };

  const prevModalImage = (e) => {
    e.stopPropagation();
    setModalImage(
      (prev) => (prev - 1 + locationImages.length) % locationImages.length
    );
  };
  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5229655414233!2d-49.26571032520299!3d-25.436767133778824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3f5c6d0c56b%3A0x6d0a0d0324b9!2sAv.%20Sete%20de%20Setembro%2C%204211%20-%20Batel%2C%20Curitiba%20-%20PR%2C%2080250-205!5e0!3m2!1spt-BR!2sbr!4v1703193177751!5m2!1spt-BR!2sbr";

  const handleOpenGoogleMaps = () => {
    window.open(
      "https://maps.google.com/maps?q=Av.+Sete+de+Setembro,+4211+-+Avenue,+Curitiba+-+PR,+80250-205",
      "_blank"
    );
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${bg4})`,
          backgroundSize: "100% 125%",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <Section
        crosses
        crossesOffset="translate-y"
        customPaddings
        className="py-12 md:py-16 lg:py-20 md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] relative scroll-mt-20"
        id="local"
      >
        <div className="relative">
          <h2 className="font-bold text-2xl text-center sm:text-4xl md:text-4xl mb-8 md:mb-12">
            Local do Evento - 2025
          </h2>
          <div className=" mx-auto  ">
            <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Qoya Hotel Curitiba
                </h3>
                <p className="text-sm md:text-lg text-gray-600 mb-6 mx-[2rem]">
                  Um espaço moderno e acolhedor, perfeitamente equipado para
                  proporcionar uma experiência única aos participantes.
                </p>
              </div>

              <div className="grid md:grid-cols-3 md:gap-15 gap-10 mb-4 mx-[2rem]">
                <div className="flex flex-col items-center text-center gap-3 group">
                  <MapPin className="w-6 h-6 text-primary text-green-600" />
                  <div>
                    <p className="font-bold text-xl text-green-600">Endereço</p>
                    <p className="text-lg">
                      Av. Sete de Setembro, 4211
                      <br />
                      Curitiba, PR
                      <br />
                      CEP: 80250-205
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-3 group">
                  <Calendar className="w-6 h-6 text-primary text-green-600" />
                  <div>
                    <p className="font-bold text-xl text-green-600">Data</p>
                    <p className="text-lg">08 de Maio de 2025
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-3 group">
                  <Clock className="w-6 h-6 text-primary text-green-600" />
                  <div>
                    <p className="font-bold text-xl text-green-600">Horário</p>
                    <p className="text-lg"> 08:00 às 18:00</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-5">
                <div className="flex items-end justify-center">
                  <Button
                    className="flex flex-row text-sm md:text-base gap-1 w-auto"
                    onClick={handleOpenGoogleMaps}
                  >
                    Ver no Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 relative">
                {/* Mobile: Single image */}
                <div className="md:hidden relative aspect-video overflow-hidden rounded-xl shadow-md">
                  <img
                    src={locationImages[currentIndex]}
                    alt="Local do Evento"
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => handleImageClick(currentIndex)}
                  />
                </div>

                {/* Desktop: Two images */}
                <div
                  className="hidden md:block relative aspect-video overflow-hidden rounded-xl shadow-md cursor-pointer"
                  onClick={() => handleImageClick(currentIndex)}
                >
                  <img
                    src={locationImages[currentIndex]}
                    alt="Local do Evento"
                    className="object-cover w-full h-full"
                  />
                </div>

                <div
                  className="hidden md:block relative aspect-video overflow-hidden rounded-xl shadow-md cursor-pointer"
                  onClick={() =>
                    handleImageClick((currentIndex + 1) % locationImages.length)
                  }
                >
                  <img
                    src={
                      locationImages[(currentIndex + 1) % locationImages.length]
                    }
                    alt="Local do Evento"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Navigation controls - centered between images */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-10">
                  <button
                    onClick={prevSlide}
                    className="bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full z-10">
                  {currentIndex + 1} / {locationImages.length}
                </div>
              </div>

              {/* Modal for mobile image view */}
              {isModalOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={locationImages[modalImage]}
                      alt="Local do Evento"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(false);
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={prevModalImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextModalImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-3 py-1 rounded-full text-white">
                      {modalImage + 1} / {locationImages.length}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 md:mt-8 aspect-video md:aspect-[3/1] overflow-hidden rounded-xl shadow-md">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do Evento"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
