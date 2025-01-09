import { future, curve, heroBackground } from "../assets";
import bg1 from "../assets/logos/bg1.svg";
import bg2 from "../assets/logos/bg2.svg";
import fe2025 from "../assets/logos/fedayDate.svg";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import CompanyLogos from "./CompanyLogos";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[5rem] lg:pt-[2rem] -mt-[5.25rem] relative"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* First section background */}
      <div
        className="absolute inset-0 z-0 h-[50%]"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Second section background */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 h-[50%]"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[4.25rem]">
          {/* Added Logo Container */}
          <div className="flex justify-center  px-4">
            <img
              src={fe2025}
              alt="Future Event Logo"
              className="w-[350px] sm:w-[250px] md:w-[450px] lg:w-[650px] h-auto object-contain"
            />
          </div>
          
          <h1 className="h1 mb-4">
            Bem-vindo ao evento {` `}
            <span className="inline-block relative mb-10">
              Future Day 2025{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-8 lg:mb-8">
            Acompanhe todas as novidades do nosso evento e fique por dentro das
            palestras, horários e inovações do mundo eletrônico que o Future Day
            2025 tem para apresentar
          </p>
          <Button className="mt-5" href="/events">
            Ver Eventos
          </Button>
        </div>
      </div>
      <div className="relative max-w-[23rem] mx-auto md:max-w-5xl">
        <div className="mb-15" id="parceiros" showVerticalLines={false}>
          <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
        </div>
      </div>
    </Section>
  );
};

export default Hero;