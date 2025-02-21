import React, { useState, useEffect, useRef, lazy } from "react";
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

const CompanyLogos = lazy(() => import("./CompanyLogos"));

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

const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
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
  const intervalRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, 7000);

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  return (
    <Section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bg1}
          className="absolute top-0 h-[51%] w-full object-cover object-bottom"
          width="1920"
          height="1080"
          alt=""
          fetchPriority="high"
        />
        <img
          src={bg2}
          className="absolute bottom-0 h-[51%] sm:h-[50%] w-full object-cover object-top"
          width="1920"
          height="1080"
          alt=""
          fetchPriority="high"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="container mx-auto flex-grow flex items-center">
          <div className="relative z-10 w-full">
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
                {/* Imagem do slide */}
                <div className="h-[430px] md:h-[350px] lg:h-[500px] flex items-center justify-center">
                  <picture>
                    <source
                      srcSet={slideContent[currentSlide].logo}
                      media="(min-width: 768px)"
                      width="1000"
                      height="450"
                    />
                    <img
                      src={slideContent[currentSlide].mobileImage}
                      alt={slideContent[currentSlide].title}
                      className="mt-[90px] h-full w-full object-contain"
                      width={isMobile ? 375 : 1000}
                      height="450"
                      fetchPriority="high"
                    />
                  </picture>
                </div>

                {/* Conteúdo de texto */}
                <div className="flex flex-col items-center mt-[2.5rem] w-full space-y-15">
                  <motion.div {...animations.fadeInUp}>
                    <div className="mt-5 md:mt-10 text-center">
                      <span className="h2 md:h1 font-bold block">
                        {slideContent[currentSlide].welcome}
                      </span>
                      <span className="h2 md:h1 font-bold inline-block relative">
                        {slideContent[currentSlide].title}
                        <img
                          src={curve}
                          className="absolute top-full left-0 w-full"
                          width="624"
                          height="28"
                          alt=""
                        />
                      </span>
                    </div>
                  </motion.div>

                  <motion.div {...animations.fadeInUp}>
                    <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-center text-n-8">
                      {slideContent[currentSlide].description}
                    </p>
                  </motion.div>

                  <motion.div {...animations.fadeInUp}>
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
          </div>
        </div>

        {/* CompanyLogos */}
        <div className="container mt-15">
          <CompanyLogos showButton={false} className="hidden lg:block" />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
