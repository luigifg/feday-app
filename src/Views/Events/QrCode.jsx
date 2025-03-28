import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Section from "../../Components/Section";
import api from "../../constants/Axios";
import qrBg from "../../assets/logos/qrBg.svg";

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
      "END:VCARD",
    ].join("\n");

    return vCard;
  };

  if (!userData) return null;

  return (
    <Section
      showVerticalLines={false}
      className="px-[4rem] md:px-[8rem] bg-n-14"
      customPaddings
      id="qrcode"
    >
      <div className="flex py-8 flex-col md:flex-row justify-between">
        <div className="text-white mb-15 md:mb-0 flex flex-col justify-between">
          <div className="flex items-start mb-8">
            <img src={qrBg} alt="QR Background" className="h-16" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">
              Bem-vindo, {userData?.name || "Participante"}!
            </h1>
            <p className="text-lg opacity-90">
              Prepare-se para o Future Day. Explore a programação e escolha seus
              eventos.
            </p>
            <p className="text-lg opacity-90  underline">
              Aqui está seu QRcode para trocar conexões na feira e
              fazer seu check-in nas salas
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center self-end">
          <QRCode
            value={generateVCardData(userData)}
            size={200}
            level={"H"}
            className="mx-auto mb-4"
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default QRCodeSection;