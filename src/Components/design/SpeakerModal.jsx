import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import linkedin from "../../assets/socials/linkedin.png";
import { events } from "../../data/speakerData";

const SpeakerModal = ({
  isOpen,
  onClose,
  currentSlide,
  onPrevSlide,
  onNextSlide,
  slides,
  speakerId,
  // Novas props para flexibilidade
  titleField = "position", // Campo a ser usado como título secundário (position por padrão, pode ser "title")
  descriptionField = "descriptionBanner", // Campo a ser usado como descrição (descriptionBanner por padrão, pode ser "descriptionLecture")
  useSpeakerName = false // Flag para determinar se deve usar speakerName ou palestrante
}) => {
  if (!isOpen) return null;

  const speakerData = speakerId
    ? events.find((s) => s.id === speakerId)
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
        className={`text-sm md:text-base text-gray-600 leading-relaxed ${
          index < paragraphs.length - 1 ? "mb-4" : ""
        }`}
      >
        {paragraph}
      </p>
    ));
  };

  // Função para determinar o nome a ser exibido
  const getSpeakerName = (slide) => {
    // Quando vem do ScheduleSection (speakerId está definido), usar sempre palestrante
    // Caso contrário, usar speakerName se disponível, ou palestrante como fallback
    if (speakerId || !useSpeakerName) {
      return slide.palestrante;
    }
    return slide.speakerName || slide.palestrante;
  };

  // Função para lidar com a navegação dentro do modal
  const handlePrevSlide = (e) => {
    e.stopPropagation();
    onPrevSlide();
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    onNextSlide();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      {/* Botões de navegação para desktop - mostrados apenas em XL e acima */}
      {!speakerId && (
        <>
          <div className="hidden xl:block">
            <button
              onClick={handlePrevSlide}
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

            <button
              onClick={handleNextSlide}
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
          </div>
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

      <div className="flex flex-col items-center max-w-5xl 2xl:max-w-7xl w-full">
        {/* Modal com estrutura responsiva e altura fixa */}
        <div
          className="bg-white rounded-xl bg-gradient-to-r from-green-300 to-green-500 p-1 shadow-2xl w-full grid grid-cols-1 xl:grid-cols-3 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Coluna da imagem - com altura fixa para evitar "sambar" */}
          <div className="col-span-1 xl:col-span-2 h-[220px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[550px]">
            <img
              src={currentSlides[speakerId ? 0 : currentSlide]?.imageBanner}
              alt={getSpeakerName(currentSlides[speakerId ? 0 : currentSlide])}
              className="w-full h-full object-cover xl:rounded-l-xl rounded-t-xl xl:rounded-tr-none"
              loading="lazy"
            />

            {/* Indicador de quantidade de slides para XL - posicionado sobre a imagem */}
            {!speakerId && slides?.length > 1 && (
              <div className="hidden xl:flex absolute bottom-4 right-[34%] bg-black bg-opacity-60 px-4 py-2 rounded-full">
                <span className="text-base font-medium text-white">
                  {currentSlide + 1}/{slides.length}
                </span>
              </div>
            )}
          </div>

          {/* Coluna do conteúdo com altura fixa e scroll */}
          <div className="col-span-1 bg-white xl:rounded-r-xl rounded-b-xl xl:rounded-bl-none flex flex-col h-[350px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[550px]">
            {/* Container fixo para o cabeçalho */}
            <div className="p-4 md:p-5 xl:p-6 border-b">
              <div className="flex items-center gap-4 mb-4 xl:mb-6">
                <a
                  href={currentSlides[speakerId ? 0 : currentSlide]?.linkedinUrl}
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
                  {getSpeakerName(currentSlides[speakerId ? 0 : currentSlide])}
                </h2>
              </div>

              <h3 className="text-base md:text-lg 2xl:text-xl font-medium text-green-700">
                {currentSlides[speakerId ? 0 : currentSlide]?.[titleField]}
              </h3>
            </div>

            {/* Container com scroll para o conteúdo - altura fixa */}
            <div className="overflow-y-auto p-4 md:p-5 xl:p-6 custom-scrollbar flex-1">
              {formatDescriptionToJsx(currentSlides[speakerId ? 0 : currentSlide]?.[descriptionField])}
            </div>
          </div>
        </div>

        {/* Botões de navegação abaixo do modal para mobile e tablet - até XL */}
        {!speakerId && slides?.length > 1 && (
          <div className="xl:hidden flex items-center justify-center gap-6 mt-6">
            <button
              onClick={handlePrevSlide}
              className="bg-white w-12 h-12 rounded-full shadow-lg 
                hover:bg-gray-50 hover:scale-110 
                active:scale-95 active:bg-gray-100
                transition-all duration-200 ease-in-out 
                flex items-center justify-center"
              aria-label="Previous slide"
            >
              <div
                className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1 
                group-hover:from-green-400 group-hover:to-green-600
                group-active:from-green-500 group-active:to-green-700"
              >
                <div className="bg-white rounded-full p-1">
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </button>

            <div className="flex items-center">
              <span className="text-base font-medium text-white">
                {currentSlide + 1}/{slides.length}
              </span>
            </div>

            <button
              onClick={handleNextSlide}
              className="bg-white w-12 h-12 rounded-full shadow-lg 
                hover:bg-gray-50 hover:scale-110
                active:scale-95 active:bg-gray-100
                transition-all duration-200 ease-in-out 
                flex items-center justify-center"
              aria-label="Next slide"
            >
              <div
                className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1
                group-hover:from-green-400 group-hover:to-green-600
                group-active:from-green-500 group-active:to-green-700"
              >
                <div className="bg-white rounded-full p-1">
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerModal;