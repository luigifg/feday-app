import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { curve } from "../../assets";
import bg1 from "../../assets/logos/bg1.svg";
import bg2 from "../../assets/logos/bg2.jpg";
import fe2025 from "../../assets/logos/fedayDateR2.png";
import fe2025M from "../../assets/logos/feday2025M.png";
import keynote1 from "../../assets/speakersBanner/barrera4.png";
import keynote1M from "../../assets/speakersBanner/barreraM.png";
import Button from "../../Components/design/Button";
import Section from "../../Components/Section";
import CompanyLogos from "./CompanyLogos";
import SpeakerModal from "../../Components/design/SpeakerModal";  // Importando o componente SpeakerModal

const slideContent = [
  {
    id: 1,
    logo: fe2025,
    mobileImage: fe2025M,
    welcome: "Bem-vindo ao evento",
    title: "Future Day 2025",
    description:
      "Acompanhe todas as novidades do nosso evento e fique por dentro das palestras, horários, convidados e inovações do mundo eletrônico que o Future Day 2025 tem para apresentar",
    buttonText: "Ver Eventos - EM BREVE",
  },
  {
    id: 2,
    logo: keynote1,
    mobileImage: keynote1M,
    welcome: "Conheça nosso",
    title: "Palestrante Especial",
    description:
      "Fernando Barrera é um líder de vendas com vasta experiência na indústria de Semicondutores e atualmente atua como Diretor Técnico Regional na Future Electronics, baseado no Vale do Silício",
    buttonText: "Conheça Fernando Barrera",
    speakerId: 26, // Adicionando o ID do palestrante para o segundo slide
  },
];

const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  slideVariants: {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  },
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  
  // Estado para controlar a exibição do modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para verificar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Verificar na montagem do componente
    checkMobile();

    // Adicionar listener para redimensionamento da janela
    window.addEventListener("resize", checkMobile);

    // Remover listener na desmontagem
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Estado para controlar se o slider automático está pausado
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // Iniciar o intervalo para troca automática de slides
  useEffect(() => {
    // Se não estiver pausado, inicia o intervalo
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        // Função de auto-navegação - não dispara handleManualNavigation
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slideContent.length);
      }, 15000); // Alterado para 15 segundos
    }

    return () => {
      // Limpa o intervalo na desmontagem ou quando o estado muda
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // Funções para navegação manual dos slides
  const handleManualNavigation = () => {
    // Pausar o slider automático
    setIsPaused(true);

    // Limpar qualquer timeout existente
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    // Retomar o slider automático após 30 segundos
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 30000);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slideContent.length);

    // Se a navegação for manual (não chamada pelo temporizador)
    if (intervalRef.current) {
      handleManualNavigation();
    }
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + slideContent.length) % slideContent.length
    );

    // Se a navegação for manual (não chamada pelo temporizador)
    if (intervalRef.current) {
      handleManualNavigation();
    }
  };

  // Função para abrir o modal quando o botão do slide com o palestrante for clicado
  const handleOpenModal = () => {
    // Verifica se o slide atual tem um speakerId
    if (slideContent[currentSlide].speakerId) {
      setIsModalOpen(true);
      setIsPaused(true); // Pausa o slider quando o modal está aberto
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    
    // Limpar qualquer timeout existente
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Retomar o slider automático após 5 segundos
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // Verificar se os botões devem estar desabilitados
  // Para este caso, como é um carrossel circular, nenhum botão precisa ser desabilitado
  const isPrevDisabled = false;
  const isNextDisabled = false;

  return (
    <Section id="hero" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-white">
        <div className="relative w-full h-full">
          <img
            src={bg1}
            width="1920"
            height="1080"
            className="absolute top-0 h-[50%] w-full object-cover object-bottom"
            loading="eager"
            fetchpriority="high"
            alt="Background superior"
          />
          <img
            src={bg2}
            width="1920"
            height="1080"
            className="absolute bottom-0 h-[51%] sm:h-[50%] w-full object-cover object-top"
            loading="eager"
            fetchpriority="high"
            alt="Background inferior"
          />
        </div>
      </div>

      <div className="relative w-full min-h-screen flex flex-col">
        <div className="container mx-auto flex-grow flex items-center">
          {/* Wrapper que contém o conteúdo em movimento e os botões fixos */}
          <div className="w-full relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={animations.slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="w-full flex flex-col items-center"
              >
                <div className="h-[430px] md:h-[350px] lg:h-[450px] flex items-center justify-center">
                  <img
                    src={slideContent[currentSlide].logo}
                    alt={`${slideContent[currentSlide].title} - Logo`}
                    width="1000"
                    height="450"
                    className={`hidden sm:block mt-[90px] h-full w-[370px] sm:w-[650px] md:w-[700px] lg:w-[800px] xl:w-[1000px] object-cover transition-all duration-700 ease-out ${
                      currentSlide === 0
                        ? ""
                        : "h-[179px] sm:h-[100px] md:h-[300px] lg:h-[440px]"
                    }`}
                    loading="eager"
                    fetchpriority="high"
                  />
                  <img
                    src={slideContent[currentSlide].mobileImage}
                    alt={`${slideContent[currentSlide].title} - Mobile`}
                    width="375"
                    height="450"
                    className="block sm:hidden mt-[90px] h-full w-full object-cover transition-all duration-700 ease-out"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

                <div className="flex flex-col items-center mt-[2.5rem] w-full space-y-15">
                  <div className="mt-5 md:mt-10 text-center">
                    <span className="h2 md:h1 font-bold block"
                    >
                      {slideContent[currentSlide].welcome}
                    </span>
                    <span className="h2 md:h1 font-bold inline-block relative">
                      {slideContent[currentSlide].title}
                      <img
                        src={curve}
                        width="624"
                        height="28"
                        className="absolute top-full left-0 w-full"
                        alt=""
                        loading="lazy"
                      />
                    </span>
                  </div>

                  <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-center text-n-8">
                    {slideContent[currentSlide].description}
                  </p>

                  <Button
                    className="transition-all duration-300 hover:scale-105 hover:text-green-800"
                    aria-label={slideContent[currentSlide].buttonText}
                    onClick={slideContent[currentSlide].speakerId ? handleOpenModal : undefined}
                  >
                    {slideContent[currentSlide].buttonText}
                  </Button>

                  {/* Botões de navegação fixos do slider */}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 gap-5 mt-15 w-full">
          <button
            onClick={prevSlide}
            disabled={isPrevDisabled}
            className={`flex-shrink-0  
                    ${
                      isPrevDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
            aria-label="Slide anterior"
          >
            <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
              <div className="bg-white rounded-full p-1">
                <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
              </div>
            </div>
          </button>

          {/* Indicadores de slide */}
          <div className="flex items-center space-x-2">
            {slideContent.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                  handleManualNavigation();
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index
                    ? "bg-green-500"
                    : "bg-gray-500 hover:bg-green-300"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={isNextDisabled}
            className={`flex-shrink-0  rounded-full transition-opacity duration-300 
                    ${
                      isNextDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
            aria-label="Próximo slide"
          >
            <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-full p-1">
              <div className="bg-white rounded-full p-1">
                <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
              </div>
            </div>
          </button>
        </div>

        <div className="container mt-15">
          <div className="relative z-10 w-full">
            <CompanyLogos showButton={false} className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Modal do Palestrante */}
      <SpeakerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        speakerId={26} // Definindo fixo como 25, independente do slide
        currentSlide={0} // Não utilizado quando speakerId é fornecido
        onPrevSlide={() => {}} // Não utilizado quando speakerId é fornecido
        onNextSlide={() => {}} // Não utilizado quando speakerId é fornecido
        slides={[]} // Não utilizado quando speakerId é fornecido
      />
    </Section>
  );
};

export default Hero;