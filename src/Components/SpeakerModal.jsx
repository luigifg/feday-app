import React from 'react';
import { ChevronLeft, ChevronRight, Linkedin, X } from "lucide-react";

const SpeakerModal = ({ 
  isOpen, 
  onClose, 
  currentSlide,
  onPrevSlide,
  onNextSlide,
  slides 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      {/* Botão de navegação esquerdo */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevSlide();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center mx-4"
        aria-label="Previous slide"
      >
        <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
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
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center mx-4"
        aria-label="Next slide"
      >
        <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
          <div className="bg-white rounded-full p-1">
            <ChevronRight className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </button>

      {/* Modal com scroll */}
      <div
        className="bg-white rounded-xl bg-gradient-to-r from-green-300 to-green-500 p-1 shadow-2xl w-4/5 max-h-[80vh] grid grid-cols-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coluna da imagem */}
        <div className="col-span-2 h-[450px]">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover rounded-l-xl"
            loading="lazy"
          />
        </div>

        {/* Coluna do conteúdo com scroll */}
        <div className="col-span-1 bg-white rounded-r-xl h-[450px] flex flex-col">
          {/* Container fixo para o cabeçalho */}
          <div className="p-6 border-b">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Close full text"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {slides[currentSlide].speakerName}
            </h3>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {slides[currentSlide].title}
            </h2>

            <a
              href={slides[currentSlide].linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#084d93] transition-colors duration-300"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Connect on LinkedIn
            </a>
          </div>

          {/* Container com scroll para o conteúdo */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-base text-gray-600">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerModal;