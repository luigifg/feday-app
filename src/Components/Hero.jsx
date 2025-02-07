import { curve } from "../assets";
import bg1 from "../assets/logos/bg1.svg";
import bg2 from "../assets/logos/bg2.svg";
import fe2025 from "../assets/logos/fedayDate.svg";
import Button from "./Button";
import Section from "./Section";
import { useRef, useEffect, useState } from "react";
import CompanyLogos from "./CompanyLogos";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const imageUrls = [bg1, bg2, fe2025];
    let loadedImages = 0;

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(imageUrls.map(loadImage));
        setTimeout(() => {
          setIsLoading(false);
          requestAnimationFrame(() => {
            setIsImagesLoaded(true);
          });
        }, 300);
      } catch (error) {
        console.error("Erro ao carregar imagens:", error);
        setIsLoading(false);
        setIsImagesLoaded(true);
      }
    };

    loadAllImages();

    return () => {
      setIsImagesLoaded(false);
      setIsLoading(true);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Carregando experiência...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alterado padding-top e min-height */}
      <Section
        className="pb-[8rem] pt-[7rem] lg:pt-[2rem] -mt-[5.25rem] relative min-h-[100svh] overflow-hidden" // Ajuste o pb-[8rem] para pb-[2rem]
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="hero"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isImagesLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-0 h-[50%] bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: `url(${bg1})`,
            willChange: "opacity",
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isImagesLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 z-0 h-[50%] bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: `url(${bg2})`,
            willChange: "opacity",
          }}
        />

        <div className="container relative" ref={parallaxRef}>
          {/* Reduzidas as margens do container principal */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="relative z-1 max-w-[62rem] mx-auto text-center "
          >
            <motion.div
              variants={fadeInUp}
              className="flex justify-center px-4"
            >
              <img
                src={fe2025}
                alt="Future Event Logo"
                className={`
                  w-[280px] sm:w-[250px] md:w-[450px] lg:w-[650px] h-auto object-contain
                  transition-all duration-700 ease-out
                  ${
                    isImagesLoaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }
                `}
                loading="eager"
              />
            </motion.div>

            {/* Reduzida margem do título */}
            <motion.h1 variants={fadeInUp} className="h1 mb-2">
              Bem-vindo ao evento{" "}
              <span className="inline-block relative mb-6">
                Future Day 2025{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full animate-pulse"
                  width={624}
                  height={28}
                  alt="Curve"
                  loading="eager"
                />
              </span>
            </motion.h1>

            {/* Ajustadas margens do parágrafo */}
            <motion.p
              variants={fadeInUp}
              className="body-1 max-w-3xl mx-auto text-n-8 "
            >
              Acompanhe todas as novidades do nosso evento e fique por dentro
              das palestras, horários e inovações do mundo eletrônico que o
              Future Day 2025 tem para apresentar
            </motion.p>

            {/* Ajustada margem top do botão */}
            <motion.div variants={fadeInUp}>
              <Button className="my-[6rem] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Ver Eventos - EM BREVE
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isImagesLoaded ? 1 : 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto md:max-w-5xl"
        >
          <div>
            <CompanyLogos
              showButton={false}
              className="hidden relative z-10 lg:block"
            />
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default Hero;
