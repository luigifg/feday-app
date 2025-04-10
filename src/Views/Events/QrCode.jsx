import React from "react";
import QRCode from "react-qr-code";
import Section from "../../Components/Section";
import qrBg from "../../assets/logos/qrBg.svg";
import { useAuth } from "../../context/AuthContext"; // Importando o novo hook

const QRCodeSection = () => {
  const { user } = useAuth(); // Usando o contexto de autenticação


  const generateVCardData = (user) => {
    if (!user) return "";

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:;${user.name};;;`,
      `FN:${user.name}`,
      `TEL;TYPE=CELL:${user.phone || ""}`,
      `EMAIL;TYPE=INTERNET:${user.email}`,
      `ORG:${user.company || ""}`,
      "END:VCARD",
    ].join("\n");

    return vCard;
  };

  if (!user) return null;

  return (
    <Section
      showVerticalLines={false}
      className="px-[2rem] sm:px-[4rem] md:px-[2rem] xl:px-[3rem] bg-n-14"
      customPaddings
      id="qrcode"
    >
      <div className="flex py-8 flex-col md:flex-row justify-between md:items-center ">
        <div className="text-white mb-8 md:mb-0 flex flex-col justify-between">
          <div className="flex items-start lg:mb-20">
            <img src={qrBg} alt="QR Background" className="h-16" />
          </div>
          
          <div className="flex flex-col gap-2 md:max-w-[450px] lg:max-w-[600px] xl:max-w-[800px]">
            <h1 className="text-3xl font-bold mt-10">
              Bem-vindo, {user?.name || "Participante"}!
            </h1>
            <p className="text-lg opacity-90">
              Prepare-se para o Future Day. Explore a programação e escolha seus
              eventos.
            </p>
            <p className="text-lg opacity-90 underline">
              Aqui está seu QRcode para trocar conexões na feira e
              fazer seu check-in nas salas
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center self-center md:self-end">
          <QRCode
            value={generateVCardData(user)}
            size={200}
            level={"H"}
            className="mx-auto mb-4"
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default QRCodeSection;