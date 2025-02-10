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
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <Section
      className="pb-[8rem] pt-[7rem] lg:pt-[2rem] -mt-[5.25rem] relative min-h-[100svh] overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 z-0 h-[50%] bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: `url(${bg1})`,
          willChange: "opacity",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-0 h-[50%] bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${bg2})`,
          willChange: "opacity",
        }}
      />

      <div className="container relative" ref={parallaxRef}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.3 } },
          }}
          className="relative z-1 max-w-[62rem] mx-auto text-center "
        >
          <motion.div variants={fadeInUp} className="flex justify-center px-4">
            <img
              src={fe2025}
              alt="Future Event Logo"
              className="w-[350px] md:w-[500px] lg:w-[600px] xl:w-[650px] h-auto object-contain transition-all duration-700 ease-out"
              loading="eager"
            />
          </motion.div>

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

          <motion.p
            variants={fadeInUp}
            className="body-1 max-w-3xl mx-auto text-n-8"
          >
            Acompanhe todas as novidades do nosso evento e fique por dentro das
            palestras, horários e inovações do mundo eletrônico que o Future Day
            2025 tem para apresentar
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Button className="my-[6rem] transition-all duration-300 hover:scale-105 hover:text-green-800">
              Ver Eventos - EM BREVE
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
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
  );
};

export default Hero;
