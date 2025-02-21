import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Section from "../../Components/Section";
import api from "../../constants/Axios";

const QRCodeSection = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/me");
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

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
      "END:VCARD"
    ].join("\n");
  
    return vCard;
  };

  if (!userData) return null;

  return (
    <Section
      showVerticalLines={false}
      className="px-[4rem] md:px-[8rem] pt-[3rem] bg-gradient-to-r from-green-400 to-blue-500"
      customPaddings
      id="qrcode"
    >
      <div className="flex py-8 flex-col md:flex-row items-center justify-between">
        <div className="text-white mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {userData?.name || "Participante"}!
          </h1>
          <p className="text-lg opacity-90">
            Prepare-se para o Future Day. Explore a programação e escolha seus
            eventos.
          </p>
          <p className="text-lg opacity-90 mt-10 underline">
            Ao lado você encontra o seu QRcode para trocar conexões na feira e
            fazer seu check-in nas salas
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <QRCode
            value={generateVCardData(userData)}
            size={200}
            level={"H"}
            className="mx-auto mb-4"
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.position}</p>
            <p className="text-gray-600">{userData.company}</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default QRCodeSection;