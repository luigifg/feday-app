import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { curve } from "../../assets";
import bg1 from "../../assets/logos/bg1.svg";
import bg2 from "../../assets/logos/bg2.svg";
import fe2025 from "../../assets/logos/fedayDateR2.png";
import fe2025M from "../../assets/logos/feday2025M.png";
import keynote1 from "../../assets/speakersBanner/barrera4.png";
import keynote1M from "../../assets/speakersBanner/barreraM.png";
import Button from "../../Components/design/Button";
import Section from "../../Components/Section";
import CompanyLogos from "./CompanyLogos";

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
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, 7000);

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  return (
    <Section 
      id="hero" 
      className="relative min-h-screen overflow-hidden"
    >
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
                  <span className="h2 md:h1 font-bold block">
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
                >
                  {slideContent[currentSlide].buttonText}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mt-15">
          <div className="relative z-10 w-full">
            <CompanyLogos showButton={false} className="hidden lg:block" />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;