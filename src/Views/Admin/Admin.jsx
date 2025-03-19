import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Check, QrCode, Wifi, X } from "lucide-react";

import api from "../../constants/Axios";

import Section from "../../Components/Section";
import { horariosEvento, events } from "../../data/speakerData";

const AdminList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scanMethod, setScanMethod] = useState("qrcode"); // 'qrcode' ou 'nfc'
  const [showScanner, setShowScanner] = useState(false);
  const [isReading, setIsReading] = useState(true);
  const [lastScannedQR, setLastScannedQR] = useState(null);
  const [isNfcReading, setIsNfcReading] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [favorites, setFavorites] = useState({
    hour: "",
    event: "",
  });
  const qrScannerRef = useRef(null);
  const nfcAbortController = useRef(null);
  const navigate = useNavigate();

  // Verificar suporte a NFC no navegador
  useEffect(() => {
    setNfcSupported(
      typeof window !== "undefined" && 
      "NDEFReader" in window
    );
  }, []);

  // Reset messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const getFavoritesKey = (userId) => `eventFavorites_${userId}`;

  useEffect(() => {
    if (userData?.id) {
      const savedFavorites = localStorage.getItem(getFavoritesKey(userData.id));
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
        setSelectedHour(parsedFavorites.hour);
        setSelectedEvent(parsedFavorites.event);
      }
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/me");
        if (response.status === 200) {
          setUserData(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/signin");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    let html5QrcodeScanner;

    if (showScanner && selectedHour && selectedEvent && scanMethod === "qrcode") {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      qrScannerRef.current = html5QrcodeScanner;

      const handleQrCodeSuccess = async (decodedText) => {
        try {
          await processScannedData(decodedText);
        } catch (error) {
          setError("Erro ao processar QR Code: " + error.message);
          setLastScannedQR(null);
        }
      };

      html5QrcodeScanner.render(handleQrCodeSuccess, (errorMessage) => {
        console.error("Erro na leitura do QR code:", errorMessage);
      });
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Erro ao limpar scanner:", error);
        });
      }
    };
  }, [showScanner, selectedHour, selectedEvent, scanMethod, userData]);

  // Iniciar ou parar leitura de NFC conforme estado do isNfcReading
  useEffect(() => {
    if (isNfcReading && nfcSupported) {
      startNfcReading();
    } else {
      stopNfcReading();
    }

    return () => {
      stopNfcReading();
    };
  }, [isNfcReading, nfcSupported]);

  useEffect(() => {
    setLastScannedQR(null);
  }, [selectedEvent, selectedHour]);

  // Função para processar dados escaneados (de QR ou NFC)
  const processScannedData = async (decodedText) => {
    try {
      let qrData;
      try {
        // Tenta parsear como JSON
        qrData = JSON.parse(decodedText);
      } catch (e) {
        // Se não for JSON, verifica se é uma string com ID e nome
        if (typeof decodedText === 'string' && decodedText.includes('|')) {
          const [id, name] = decodedText.split('|');
          qrData = { id, name };
        } else {
          throw new Error("Formato de dados inválido");
        }
      }

      if (qrData.id) {
        // Se for o mesmo código que acabou de ser processado, mantém a mensagem atual
        if (lastScannedQR === `${qrData.id}-${selectedEvent}-${selectedHour}`) {
          return;
        }

        try {
          // Buscar informações do usuário
          const userResponse = await api.get(`/user`, {
            params: {
              userName: qrData.name,
            },
          });

          const userDataQr = {
            id: qrData.id,
            name: userResponse.data.name || qrData.name
          };

          // Verificar se já existe check-in
          const checkExistingResponse = await api.get("/checkIn", {
            params: {
              user_id: qrData.id,
              event_id: selectedEvent,
              hour: selectedHour
            }
          });

          if (checkExistingResponse.data.exists) {
            // Se já existe no banco, apenas atualiza o usuário e mostra mensagem de sucesso
            setScannedUser(userDataQr);
            setSuccessMessage("Check-in já existente registrado com sucesso!");
            setLastScannedQR(`${qrData.id}-${selectedEvent}-${selectedHour}`);
            return;
          }

          // Realizar o check-in
          const checkInData = {
            userId: qrData.id,
            userName: qrData.name,
            hour: selectedHour,
            eventId: selectedEvent,
            adminId: userData.id,
          };

          const response = await api.post("/checkIn", checkInData, {
            withCredentials: true,
          });

          if (response.status === 200) {
            setScannedUser(userDataQr);
            setSuccessMessage("Check-in realizado com sucesso!");
            setLastScannedQR(`${qrData.id}-${selectedEvent}-${selectedHour}`);
          }
        } catch (error) {
          console.error("Erro na API:", error);
          setError("Erro ao salvar o check-in: " + (error.message || "Erro desconhecido"));
          setLastScannedQR(null);
        }
      } else {
        setError("Dados inválidos: ID não encontrado");
        setLastScannedQR(null);
      }
    } catch (error) {
      setError("Formato inválido de dados: " + error.message);
      setLastScannedQR(null);
    }
  };

  // Função para iniciar leitura de NFC
  const startNfcReading = async () => {
    if (!nfcSupported) {
      setError("NFC não é suportado neste dispositivo ou navegador");
      return;
    }

    try {
      const abortController = new AbortController();
      nfcAbortController.current = abortController;

      const ndef = new NDEFReader();
      await ndef.scan({ signal: abortController.signal });
      
      setSuccessMessage("Leitura NFC iniciada. Aproxime o cartão.");
      setError("");

      ndef.addEventListener("reading", async ({ message, serialNumber }) => {
        try {
          // Extrair dados do cartão NFC
          let userIdFromNFC = "";
          let userNameFromNFC = "";

          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(record.data);
              
              // Assumindo que o formato é "ID|Nome" ou um JSON
              if (text.includes('|')) {
                [userIdFromNFC, userNameFromNFC] = text.split('|');
              } else if (text.startsWith('{')) {
                try {
                  const jsonData = JSON.parse(text);
                  userIdFromNFC = jsonData.id;
                  userNameFromNFC = jsonData.name;
                } catch (e) {
                  // Se não conseguir parsear como JSON, usa o serialNumber
                  userIdFromNFC = serialNumber;
                  userNameFromNFC = text;
                }
              } else {
                // Se não tiver formato específico, usa o serialNumber como ID
                userIdFromNFC = serialNumber;
                userNameFromNFC = text;
              }
            }
          }

          // Se não encontrou dados nos records, usa o serialNumber
          if (!userIdFromNFC) {
            userIdFromNFC = serialNumber;
            userNameFromNFC = "Usuário " + serialNumber;
          }

          // Processa os dados obtidos
          const nfcData = JSON.stringify({
            id: userIdFromNFC,
            name: userNameFromNFC
          });

          await processScannedData(nfcData);
        } catch (error) {
          console.error("Erro ao processar tag NFC:", error);
          setError("Erro ao processar tag NFC: " + error.message);
        }
      });

      ndef.addEventListener("error", (error) => {
        console.error("Erro na leitura NFC:", error);
        setError("Erro na leitura NFC: " + error.message);
      });

    } catch (error) {
      console.error("Falha ao iniciar leitura NFC:", error);
      setError("Falha ao iniciar leitura NFC: " + error.message);
      setIsNfcReading(false);
    }
  };

  // Função para parar leitura de NFC
  const stopNfcReading = () => {
    if (nfcAbortController.current) {
      nfcAbortController.current.abort();
      nfcAbortController.current = null;
    }
  };

  const resetCheckInForm = () => {
    setScannedUser(null);
    setError("");
    setSuccessMessage("");
  };

  const saveFavorites = (newFavorites) => {
    if (userData?.id) {
      localStorage.setItem(
        getFavoritesKey(userData.id),
        JSON.stringify(newFavorites)
      );
      setFavorites(newFavorites);
    }
  };

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    setSelectedHour(newHour);
    setSelectedEvent("");
    resetCheckInForm();

    const newFavorites = {
      ...favorites,
      hour: newHour,
      event: "",
    };
    saveFavorites(newFavorites);
  };

  const handleEventChange = (e) => {
    const newEvent = e.target.value;
    setSelectedEvent(newEvent);
    resetCheckInForm();

    const newFavorites = {
      ...favorites,
      event: newEvent,
    };
    saveFavorites(newFavorites);
  };

  const handleStartScanning = () => {
    setShowScanner(true);
    if (scanMethod === "nfc") {
      setIsNfcReading(true);
    }
  };

  const handleStopScanning = () => {
    setShowScanner(false);
    setIsNfcReading(false);
    setScannedUser(null);
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(error => {
        console.error("Erro ao limpar scanner QR:", error);
      });
    }
    stopNfcReading();
  };

  const filteredEvents = events.filter((event) => event.hour === selectedHour);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">

      <Section
        className="flex-grow px-4 md:px-8 lg:px-16 pt-20 pb-16"
        crosses
        customPaddings
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mt-10 mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Área do Administrador
            </h1>
            <p className="text-lg">
              Realize check-in de participantes via QR Code ou NFC
            </p>

            <p className="text-lg mt-8 border-l-4 border-emerald-400 pl-4">
              Selecione o horário e o evento para realizar o check-in
            </p>
          </div>

          <div className="flex gap-4 md:gap-6 flex-col items-center mt-12 max-w-md mx-auto">
            {successMessage && (
              <div className="w-full p-4 bg-emerald-500 text-white rounded-lg flex items-center gap-2">
                <Check size={24} />
                {successMessage}
              </div>
            )}

            <div className="relative w-full">
              <select
                value={selectedHour}
                onChange={handleHourChange}
                className="w-full p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                         hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 
                         transition-all duration-300 outline-none appearance-none 
                         cursor-pointer shadow-lg backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">
                  Selecione um horário
                </option>
                {horariosEvento.map((horario) => (
                  <option
                    key={horario.id}
                    value={horario.id}
                    className="bg-gray-800"
                  >
                    {horario.label}
                  </option>
                ))}
              </select>
              {favorites.hour && selectedHour === favorites.hour && (
                <Check
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={24}
                />
              )}
            </div>

            <div className="relative w-full">
              <select
                value={selectedEvent}
                onChange={handleEventChange}
                className={`w-full p-4 rounded-lg bg-gray-800 text-white border-2 
                         hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 
                         transition-all duration-300 outline-none appearance-none 
                         cursor-pointer shadow-lg backdrop-blur-sm
                         ${
                           !selectedHour
                             ? "border-gray-700 opacity-50"
                             : "border-gray-700"
                         }`}
                disabled={!selectedHour}
              >
                <option value="" className="bg-gray-800">
                  {!selectedHour
                    ? "Primeiro selecione um horário"
                    : "Selecione um evento"}
                </option>
                {filteredEvents.map((event) => (
                  <option key={event.id} value={event.id} className="bg-gray-800">
                    {event.title} - Sala: {event.room}
                  </option>
                ))}
              </select>
              {favorites.event && selectedEvent === favorites.event && (
                <Check
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={24}
                />
              )}
            </div>

            {/* Seleção do método de escaneamento */}
            {!showScanner && selectedHour && selectedEvent && (
              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  onClick={() => setScanMethod("qrcode")}
                  className={`p-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                          transition-colors duration-300 ${
                            scanMethod === "qrcode"
                              ? "bg-emerald-600 hover:bg-emerald-500"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                >
                  <QrCode size={20} />
                  QR Code
                </button>
                <button
                  onClick={() => setScanMethod("nfc")}
                  className={`p-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                          transition-colors duration-300 ${
                            scanMethod === "nfc"
                              ? "bg-emerald-600 hover:bg-emerald-500"
                              : "bg-gray-600 hover:bg-gray-500"
                          } ${!nfcSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!nfcSupported}
                >
                  <Wifi size={20} />
                  NFC
                  {nfcSupported === false && <X size={16} className="text-red-400 absolute top-1 right-1" />}
                </button>
              </div>
            )}

            {!showScanner ? (
              <button
                onClick={handleStartScanning}
                className="w-full p-4 rounded-lg bg-emerald-600 text-white font-semibold
                         hover:bg-emerald-500 transition-colors duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedHour || !selectedEvent || (scanMethod === "nfc" && !nfcSupported)}
              >
                {scanMethod === "qrcode" ? "Escanear QR Code" : "Iniciar Leitura NFC"}
              </button>
            ) : (
              <div className="w-full relative">
                {scanMethod === "qrcode" ? (
                  <div
                    id="qr-reader"
                    className="w-full bg-gray-800 text-white [&_button]:bg-emerald-500 [&_button]:hover:bg-emerald-600 [&_button]:transition-colors [&_button]:duration-300 [&_button]:px-2 [&_button]:py-2 [&_button]:rounded-lg [&_button]:cursor-pointer [&_img]:invert-[1] rounded-lg overflow-hidden"
                  />
                ) : (
                  <div className="w-full p-8 bg-gray-800 text-white rounded-lg text-center">
                    <div className="animate-pulse mb-4">
                      <Wifi size={64} className="mx-auto text-emerald-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Leitura NFC ativa</p>
                    <p className="text-sm text-gray-300">Aproxime o cartão NFC do dispositivo para fazer o check-in</p>
                  </div>
                )}
                <button
                  onClick={handleStopScanning}
                  className="absolute top-2 right-8 bg-red-500 text-white px-3 py-1 rounded-full
                           hover:bg-red-600 transition-colors duration-300"
                >
                  ✕
                </button>
              </div>
            )}

            {scannedUser && (
              <div className="w-full p-4 bg-green-800 rounded-lg text-white">
                <p>Check-In do usuário: <span className="font-bold text-yellow-400">{scannedUser.name}</span>, realizado!</p>
              </div>
            )}

            {error && (
              <div className="w-full p-4 bg-red-500 text-white rounded-lg">
                {error}
              </div>
            )}
            
            {nfcSupported === false && !showScanner && (
              <div className="w-full p-4 bg-yellow-600 text-white rounded-lg text-sm">
                <p className="font-medium">NFC não suportado neste dispositivo ou navegador</p>
                <p className="mt-1">NFC funciona apenas em Chrome/Edge em dispositivos Android com NFC. Não funciona em iOS.</p>
              </div>
            )}
          </div>
        </div>
      </Section>

    </div>
  );
};

export default AdminList;