import React from "react";
import { ChevronLeft, ChevronRight, Linkedin, X } from "lucide-react";
import linkedin from "../../assets/socials/linkedin.png";
import { speakers } from "../../data/speakerData";

const SpeakerModal = ({
  isOpen,
  onClose,
  currentSlide,
  onPrevSlide,
  onNextSlide,
  slides,
  speakerId,
}) => {
  if (!isOpen) return null;

  const speakerData = speakerId
    ? speakers.find((s) => s.id === speakerId)
    : null;
  const currentSlides = speakerId ? [speakerData] : slides;

  // Função para converter texto com quebras de linha em parágrafos JSX
  const formatDescriptionToJsx = (description) => {
    if (!description) return null;
    
    // Divide o texto nas quebras de linha duplas que formatamos anteriormente
    const paragraphs = description.split('\n\n');
    
    // Mapeia cada parágrafo para um elemento <p> com margem inferior
    return paragraphs.map((paragraph, index) => (
      <p 
        key={index} 
        className="text-sm md:text-base text-gray-600 leading-relaxed mb-4"
      >
        {paragraph}
      </p>
    ));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      {!speakerId && (
        <>
          {/* Botão de navegação esquerdo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevSlide();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg 
              hover:bg-gray-50 hover:scale-110 
              active:scale-95 active:bg-gray-100
              transition-all duration-200 ease-in-out 
              flex items-center justify-center mx-4"
            aria-label="Previous slide"
          >
            <div
              className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1 
              group-hover:from-green-400 group-hover:to-green-600
              group-active:from-green-500 group-active:to-green-700"
            >
              <div className="bg-white rounded-full p-1">
                <ChevronLeft className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </button>

          {/* Botão de navegação direito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNextSlide();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg 
              hover:bg-gray-50 hover:scale-110
              active:scale-95 active:bg-gray-100
              transition-all duration-200 ease-in-out 
              flex items-center justify-center mx-4"
            aria-label="Next slide"
          >
            <div
              className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1
              group-hover:from-green-400 group-hover:to-green-600
              group-active:from-green-500 group-active:to-green-700"
            >
              <div className="bg-white rounded-full p-1">
                <ChevronRight className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full 
          hover:bg-gray-200 hover:scale-110
          active:scale-95 active:bg-gray-300
          transition-all duration-200 ease-in-out"
        aria-label="Close full text"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      {/* Modal com estrutura responsiva */}
      <div
        className="bg-white rounded-xl bg-gradient-to-r from-green-300 to-green-500 p-1 shadow-2xl w-5/6 max-h-[85vh] 2xl:max-h-[90vh] grid grid-cols-1 xl:grid-cols-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coluna da imagem - responsiva */}
        <div className="col-span-1 xl:col-span-2 h-[220px] md:h-[290px] lg:h-[400px] xl:h-[450px] 2xl:h-[600px]">
          <img
            src={currentSlides[speakerId ? 0 : currentSlide].image}
            alt={currentSlides[speakerId ? 0 : currentSlide].title}
            className="w-full h-full object-cover xl:rounded-l-xl rounded-t-xl xl:rounded-tr-none"
            loading="lazy"
          />
        </div>

        {/* Coluna do conteúdo com scroll - responsiva */}
        <div className="col-span-1 bg-white xl:rounded-r-xl rounded-b-xl xl:rounded-bl-none flex flex-col max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh] xl:max-h-[450px] 2xl:max-h-[600px]">
          {/* Container fixo para o cabeçalho */}
          <div className="p-4 md:p-5 xl:p-6 border-b">
            <div className="flex items-center gap-4 mb-4 xl:mb-6">
              <a
                href={currentSlides[speakerId ? 0 : currentSlide].linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-transform hover:scale-110 flex-shrink-0"
              >
                <img
                  src={linkedin}
                  alt="LinkedIn"
                  className="w-5 h-5 md:w-6 md:h-6 brightness-100"
                />
              </a>
              <h2 className="text-xl md:text-2xl 2xl:text-3xl font-bold text-gray-800">
                {currentSlides[speakerId ? 0 : currentSlide].name}
              </h2>
            </div>

            <h3 className="text-base md:text-lg 2xl:text-xl font-medium text-green-700">
              {currentSlides[speakerId ? 0 : currentSlide].position}
            </h3>
          </div>

          {/* Container com scroll para o conteúdo - CORRIGIDO */}
          <div className="overflow-y-auto p-4 md:p-5 xl:p-6 custom-scrollbar flex-1 min-h-0">
            {formatDescriptionToJsx(currentSlides[speakerId ? 0 : currentSlide].description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerModal;