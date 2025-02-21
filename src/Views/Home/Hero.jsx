import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
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

// Lazy load do CompanyLogos para melhorar performance inicial
const CompanyLogos = lazy(() => import("./CompanyLogos"));

// Constantes movidas para melhor manutenção
const SLIDE_INTERVAL = 7000;
const MOBILE_BREAKPOINT = 768;

// Conteúdo do slide movido para constante e otimizado com memoização
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

// Animações otimizadas para performance
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({
    backgrounds: false,
    slides: false,
  });

  const heroRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const imageCache = useRef(new Map());

  // Função de pré-carregamento otimizada com cache
  const preloadImage = async (src) => {
    if (imageCache.current.has(src)) {
      return imageCache.current.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };

      img.onerror = reject;
      img.src = src;
    });
  };

  // Pré-carregamento com priorização
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Carrega backgrounds primeiro (crítico para LCP)
        await Promise.all([preloadImage(bg1), preloadImage(bg2)]);
        setImagesLoaded((prev) => ({ ...prev, backgrounds: true }));

        // Carrega slides em segundo plano
        await Promise.all(
          slideContent.flatMap((slide) => [
            preloadImage(slide.logo),
            preloadImage(slide.mobileImage),
          ])
        );
        setImagesLoaded((prev) => ({ ...prev, slides: true }));
      } catch (error) {
        console.error("Erro ao carregar imagens:", error);
      }
    };

    loadImages();

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  // Detector de mobile otimizado com ResizeObserver
  useEffect(() => {
    const handleResize = (entries) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const width = entries[0]?.contentRect.width || window.innerWidth;
        setIsMobile(width <= MOBILE_BREAKPOINT);
      }, 150);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (heroRef.current) {
      resizeObserver.observe(heroRef.current);
    }

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  // Slider automático otimizado
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      ref={heroRef}
    >
      {/* Backgrounds com loading otimizado */}
      <div className="absolute inset-0 w-full h-full bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imagesLoaded.backgrounds ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <picture>
            <source
              srcSet={bg1}
              media="(min-width: 768px)"
              type="image/svg+xml"
            />
            <img
              src={bg1}
              className="absolute top-0 h-[51%] w-full object-cover object-bottom"
              loading="eager"
              fetchPriority="high"
              alt=""
              width="1920"
              height="1080"
            />
          </picture>
          <picture>
            <source
              srcSet={bg2}
              media="(min-width: 768px)"
              type="image/svg+xml"
            />
            <img
              src={bg2}
              className="absolute bottom-0 h-[51%] sm:h-[50%] w-full object-cover object-top"
              loading="eager"
              fetchPriority="high"
              alt=""
              width="1920"
              height="1080"
            />
          </picture>
        </motion.div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="container mx-auto flex-grow flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imagesLoaded.slides ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative z-10 w-full"
          >
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
                {/* Imagem do slide com otimização para diferentes dispositivos */}
                <motion.div
                  className="h-[430px] md:h-[350px] lg:h-[450px] flex items-center justify-center"
                  variants={animations.fadeInUp}
                >
                  <picture>
                    <source
                      srcSet={slideContent[currentSlide].logo}
                      media="(min-width: 768px)"
                      type="image/png"
                    />
                    <img
                      src={slideContent[currentSlide].mobileImage}
                      alt={slideContent[currentSlide].title}
                      className={`mt-[90px] h-full w-full sm:w-[650px] md:w-[700px] lg:w-[800px] xl:w-[1000px] object-contain transition-all duration-700 ease-out`}
                      width={isMobile ? 375 : 1000}
                      height={450}
                      loading="lazy"
                    />
                  </picture>
                </motion.div>

                {/* Conteúdo de texto */}
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
                          className="absolute top-full left-0 w-full"
                          width={624}
                          height={28}
                          alt=""
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

        {/* CompanyLogos com lazy loading */}
        <div className="container mt-15">
          <Suspense fallback={null}>
            {imagesLoaded.backgrounds && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="relative z-10 w-full"
              >
                <CompanyLogos showButton={false} className="hidden lg:block" />
              </motion.div>
            )}
          </Suspense>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
