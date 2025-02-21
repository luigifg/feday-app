import React, { useState, useEffect, useRef } from "react";
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

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundsLoaded, setBackgroundsLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Efeito para carregar os backgrounds
  useEffect(() => {
    Promise.all([
      new Promise((resolve) => {
        const img1 = new Image();
        img1.src = bg1;
        img1.onload = resolve;
      }),
      new Promise((resolve) => {
        const img2 = new Image();
        img2.src = bg2;
        img2.onload = resolve;
      }),
    ]).then(() => {
      setBackgroundsLoaded(true);
      // Adiciona delay antes de mostrar o conteúdo
      setTimeout(() => setContentVisible(true), 500);
    });
  }, []);

  // Efeito para verificar mobile e pré-carregar imagens do slideContent
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Pré-carrega as imagens do slideContent
    slideContent.forEach((slide) => {
      const img = new Image();
      img.src = slide.logo;
      if (slide.mobileImage) {
        const mobileImg = new Image();
        mobileImg.src = slide.mobileImage;
      }
    });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Efeito para controlar o slider
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

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

  const buttonVariants = {
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
  };

  const slideVariants = {
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
  };

  return (
    <Section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Loading Indicator */}
      {!backgroundsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
      )}

      {/* Backgrounds Container */}
      <div className="absolute inset-0 w-full h-full bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: backgroundsLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          <div
            className="absolute top-0 h-[50%] w-full bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: `url(${bg1})` }}
          />
          <div
            className="absolute bottom-0 h-[51%] sm:h-[50%] w-full bg-cover bg-top bg-no-repeat"
            style={{ backgroundImage: `url(${bg2})` }}
          />
        </motion.div>
      </div>

      {/* Main Content Section */}
      <div className="relative w-full min-h-screen flex flex-col">
        {/* Slider Container */}
        <div className="container mx-auto flex-grow flex items-center" ref={parallaxRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: contentVisible ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative z-10 w-full"
          >
            {/* Slides Content Block */}
            <div>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                  }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Logo Container */}
                  <motion.div
                    className="h-[430px] md:h-[350px] lg:h-[450px] flex items-center justify-center"
                    variants={fadeInUp}
                  >
                    <img
                      src={slideContent[currentSlide].logo}
                      alt="Event Logo"
                      className={`hidden sm:block mt-[90px] h-full w-[370px] sm:w-[650px] md:w-[700px] lg:w-[800px] xl:w-[1000px] object-cover transition-all duration-700 ease-out ${
                        currentSlide === 0
                          ? ""
                          : "h-[179px] sm:h-[100px] md:h-[300px] lg:h-[440px]"
                      }`}
                      loading="eager"
                    />

                    <img
                      src={slideContent[currentSlide].mobileImage}
                      alt="Event Logo Mobile"
                      className={`block sm:hidden mt-[90px] h-full w-full object-cover transition-all duration-700 ease-out`}
                      loading="eager"
                    />
                  </motion.div>

                  {/* Content Container */}
                  <div className="flex flex-col items-center mt-[2.5rem] w-full space-y-15">
                    <motion.div variants={fadeInUp}>
                      <div className="mt-5 md:mt-10 text-center">
                        <span className="h2 xl:h1 font-bold block">
                          {slideContent[currentSlide].welcome}
                        </span>
                        <span className="h2 xl:h1 font-bold inline-block relative">
                          {slideContent[currentSlide].title}
                          <img
                            src={curve}
                            className="absolute top-full left-0 w-full animate-pulse"
                            width={624}
                            height={28}
                            alt="Curve"
                            loading="eager"
                          />
                        </span>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <p className="body-1 max-w-3xl mx-auto text-center text-n-8">
                        {slideContent[currentSlide].description}
                      </p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                          key={currentSlide}
                          custom={direction}
                          variants={buttonVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            y: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                            rotateX: { duration: 0.3 },
                          }}
                        >
                          <Button className="transition-all duration-300 hover:scale-105 hover:text-green-800">
                            {slideContent[currentSlide].buttonText}
                          </Button>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Company Logos Container */}
        <div className="container mt-15">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: contentVisible ? 1 : 0,
              y: contentVisible ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative z-10 w-full"
          >
            <div>
              <CompanyLogos showButton={false} className="hidden lg:block" />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;