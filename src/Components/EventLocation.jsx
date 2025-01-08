import React from "react";
import { MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import Button from "./Button";
import quoyaImage from "../assets/location/quoya.jpg";
import Section from "../Components/Section";

export default function EventLocation() {
  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5229655414233!2d-49.26571032520299!3d-25.436767133778824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3f5c6d0c56b%3A0x6d0a proporção0d0324b9!2sAv.%20Sete%20de%20Setembro%2C%204211%20-%20Batel%2C%20Curitiba%20-%20PR%2C%2080250-205!5e0!3m2!1spt-BR!2sbr!4v1703193177751!5m2!1spt-BR!2sbr";

  const handleOpenGoogleMaps = () => {
    window.open(
      "https://maps.google.com/maps?q=Av.+Sete+de+Setembro,+4211+-+Avenue,+Curitiba+-+PR,+80250-205",
      "_blank"
    );
  };

  return (
    <Section
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      className="pt-[10rem] pb-[5rem] md:pt-[10rem] px-4 md:px-[4rem] -mt-[5.25rem]"
      id="local"
    >
      <h2 className="font-bold text-2xl text-center sm:text-4xl md:text-5xl mb-8 md:mb-12">
        Local do Evento
      </h2>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-xl mb-4 md:mb-6 shadow-md">
              <img
                alt="Local do Evento"
                className="object-cover w-full h-full"
                src={quoyaImage}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4 md:space-y-6 order-1 md:order-2">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Qoya Hotel Curitiba
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Um espaço moderno e acolhedor, perfeitamente equipado para
                proporcionar uma experiência única aos participantes.
              </p>
            </div>
            <div className="space-y-5">
              {[
                {
                  Icon: MapPin,
                  title: "Endereço",
                  content: (
                    <>
                      Av. Sete de Setembro, 4211
                      <br />
                      Avenue - Curitiba, PR
                      <br />
                      CEP: 80250-205
                    </>
                  ),
                },
                {
                  Icon: Calendar,
                  title: "Data",
                  content: "15 de Dezembro de 2024",
                },
                {
                  Icon: Clock,
                  title: "Horário",
                  content: "Das 09:00 às 18:00",
                },
              ].map(({ Icon, title, content }, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Icon className="w-4 md:w-5 h-4 md:h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm md:text-base">{title}</p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Button
                className="w-full md:w-auto text-sm md:text-base gap-2"
                onClick={handleOpenGoogleMaps}
              >
                Ver no Google Maps
                <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 aspect-video md:aspect-[3/1] overflow-hidden rounded-xl shadow-md">
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do Evento"
            className="w-full h-full "
          />
        </div>
      </div>
    </Section>
  );
}
