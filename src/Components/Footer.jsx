import React from "react";
import Section from "./Section";
import { socials } from "../constants";
import { wvulkan } from "../assets";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-3">
      <div className="container flex sm:justify-between justify-center items-center gap-5 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. All rights reserved. <br />
          Developed by Luigi Gerber.
        </p>
        {/* Substituindo "Webvulkan" por uma imagem com link */}
        <a
          href="https://webvulkan.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block relative"
        >
          <img
            src={wvulkan}
            alt="Webvulkan"
            className="w-24 h-auto" // Ajuste o tamanho da imagem conforme necessário
          />
        </a>

        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;
