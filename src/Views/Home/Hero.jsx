import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { curve } from "../../assets";
import bg1 from "../../assets/logos/bg1.svg";
import bg2 from "../../assets/logos/bg2.svg";
import fe2025 from "../../assets/logos/fedayDateR2.png";
import fe2025M from "../../assets/logos/feday2025M.png";
import keynote1 from "../../assets/speakers/barrera4.png";
import keynote1M from "../../assets/speakers/barreraM.png";
import Button from "../../Components/design/Button";
import Section from "../../Components/Section";
import CompanyLogos from "./CompanyLogos";

// Pré-definição dos conteúdos do slide usando useMemo
const slideContent = [
  {
    id: 1,
    logo: fe2025,
    mobileImage: fe2025M,
    welcome: "Bem-vindo ao evento",
    title: "Future Day 2025",
    description:
      "Acompanhe todas as novidades do nosso evento e fique por dentro das palestras, horários e inovações do mundo eletrônico que o Future Day 2025 tem para apresentar",
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
  },
];

// Animações memoizadas
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  buttonVariants: {
    enter: (direction) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      rotateX: direction > 0 ? 90 : -90,
    }),
    center: {
      y: 0,
      opacity: 1,
      rotateX: 0,
    },
    exit: (direction) => ({
      y: direction < 0 ? 50 : -50,
      opacity: 0,
      rotateX: direction < 0 ? 90 : -90,
    }),
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
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundsLoaded, setBackgroundsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const heroRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Pré-carregamento de imagens otimizado
  const preloadImages = useMemo(() => {
    return async () => {
      try {
        const imageUrls = [bg1, bg2, ...slideContent.flatMap(slide => [slide.logo, slide.mobileImage])];
        const loadImage = (src) => new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });

        // Carrega backgrounds primeiro
        await Promise.all([bg1, bg2].map(loadImage));
        setBackgroundsLoaded(true);

        // Carrega as imagens dos slides em segundo plano
        await Promise.all(imageUrls.map(loadImage));
      } catch (error) {
        console.error("Erro ao carregar imagens:", error);
      }
    };
  }, []);

  useEffect(() => {
    preloadImages();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [preloadImages]);

  // Detector de mobile com debounce otimizado
  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Slider automático otimizado
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, 7000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Componente de loading memoizado
  const LoadingSpinner = useMemo(() => (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>
  ), []);

  return (
    <Section 
      id="hero" 
      className="relative min-h-screen overflow-hidden"
      ref={heroRef}
    >
      {/* Loading State */}
      {!backgroundsLoaded && LoadingSpinner}

      {/* Backgrounds com lazy loading */}
      <div className="absolute inset-0 w-full h-full bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: backgroundsLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <img
            src={bg1}
            className="absolute top-0 h-[51%] w-full object-cover object-bottom"
            loading="lazy"
            alt="Background superior"
          />
          <img
            src={bg2}
            className="absolute bottom-0 h-[51%] w-full object-cover object-top"
            loading="lazy"
            alt="Background inferior"
          />
        </motion.div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="container mx-auto flex-grow flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: backgroundsLoaded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative z-10 w-full"
          >
            {/* Slider */}
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
                {/* Logo com lazy loading */}
                <motion.div
                  className="h-[430px] md:h-[350px] lg:h-[450px] flex items-center justify-center"
                  variants={animations.fadeInUp}
                >
                  <img
                    src={slideContent[currentSlide].logo}
                    alt={`${slideContent[currentSlide].title} - Logo`}
                    width={1000}
                    height={450}
                    className={`hidden sm:block mt-[90px] h-full w-[370px] sm:w-[650px] md:w-[700px] lg:w-[800px] xl:w-[1000px] object-cover transition-all duration-700 ease-out ${
                      currentSlide === 0
                        ? ""
                        : "h-[179px] sm:h-[100px] md:h-[300px] lg:h-[440px]"
                    }`}
                    loading="lazy"
                  />

                  <img
                    src={slideContent[currentSlide].mobileImage}
                    alt={`${slideContent[currentSlide].title} - Mobile`}
                    width={375}
                    height={450}
                    className="block sm:hidden mt-[90px] h-full w-full object-cover transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                </motion.div>

                {/* Conteúdo de texto otimizado */}
                <div className="flex flex-col items-center mt-[2.5rem] w-full space-y-15">
                  <motion.div variants={animations.fadeInUp}>
                    <div className="mt-5 md:mt-10 text-center">
                      <span className="h2 md:h1 font-bold block">
                        {slideContent[currentSlide].welcome}
                      </span>
                      <span className="h2 md:h1 font-bold inline-block relative">
                        {slideContent[currentSlide].title}
                        <img
                          src={curve}
                          className="absolute top-full left-0 w-full animate-pulse"
                          width={624}
                          height={28}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                        />
                      </span>
                    </div>
                  </motion.div>

                  <motion.div variants={animations.fadeInUp}>
                    <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-center text-n-8">
                      {slideContent[currentSlide].description}
                    </p>
                  </motion.div>

                  <motion.div variants={animations.fadeInUp}>
                    <Button 
                      className="transition-all duration-300 hover:scale-105 hover:text-green-800"
                      aria-label={slideContent[currentSlide].buttonText}
                    >
                      {slideContent[currentSlide].buttonText}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Logos das empresas com lazy loading */}
        <div className="container mt-15">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: backgroundsLoaded ? 1 : 0,
              y: backgroundsLoaded ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative z-10 w-full"
          >
            <CompanyLogos showButton={false} className="hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;