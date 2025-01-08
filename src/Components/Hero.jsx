import { future, curve, heroBackground } from "../assets";
import bg1 from "../assets/logos/bg1.svg";
import bg2 from "../assets/logos/bg2.svg";
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
      className="pt-[12rem] -mt-[5.25rem] relative"
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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Second section background */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-0 h-[50%]"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
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
          <Button className="mt-5" href="/events">Ver Eventos</Button>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-3xl">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-14 rounded-t-[0.9rem]" />

              <div className="aspect-[33/17] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/225] lg:aspect-[1024/350]">
                <img
                  src={future}
                  className="w-full scale-[1.7] translate-y-[20%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[2%]"
                  width={1024}
                  height={490}
                  alt="AI"
                />

                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt={icon} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>
              </div>
            </div>
            <Gradient />
          </div>

        </div>

        <Section className="mt-2" id="parceiros" showVerticalLines={false}>
          <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
        </Section>
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;