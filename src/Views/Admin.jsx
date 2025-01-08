import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Check } from "lucide-react";
import { navigationAdmin } from "../constants/index";
import axios from "../Axios";
import HeaderEvents from "../Components/HeaderEvents";
import Section from "../Components/Section";
import Footer from "../Components/Footer";
import { horariosEvento, events } from "../data/EventsData";

const AdminList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isReading, setIsReading] = useState(true);
  const [lastScannedQR, setLastScannedQR] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [favorites, setFavorites] = useState({
    hour: "",
    event: "",
  });
  const navigate = useNavigate();

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
        const response = await axios.get("/me", { withCredentials: true });
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

    if (showScanner && selectedHour && selectedEvent) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const handleQrCodeSuccess = async (decodedText) => {
        try {
          const qrData = JSON.parse(decodedText);
          if (qrData.id) {
            // Se for o mesmo QR code que acabou de ser processado, mantém a mensagem atual
            if (lastScannedQR === `${qrData.id}-${selectedEvent}-${selectedHour}`) {
              return;
            }

            try {
              // Buscar informações do usuário
              const userResponse = await axios.get(`/user`, {
                params: {
                  userName: qrData.name,
                },
              });

              const userData = {
                id: qrData.id,
                name: userResponse.data.name || qrData.name
              };

              // Verificar se já existe check-in
              const checkExistingResponse = await axios.get("/checkIn", { 
                params: {
                  user_id: qrData.id,
                  event_id: selectedEvent,
                  hour: selectedHour
                }
              });
              
              if (checkExistingResponse.data.exists) {
                // Se já existe no banco, apenas atualiza o usuário e mostra mensagem de sucesso
                setScannedUser(userData);
                setSuccessMessage("Check-in realizado com sucesso!");
                setLastScannedQR(`${qrData.id}-${selectedEvent}-${selectedHour}`);
                return;
              }

              // Realizar o check-in
              const checkInData = {
                userId: qrData.id,
                hour: selectedHour,
                eventId: selectedEvent,
                adminId: userData.id,
              };

              const response = await axios.post("/checkIn", checkInData, {
                withCredentials: true,
              });

              if (response.status === 200) {
                setScannedUser(userData);
                setSuccessMessage("Check-in realizado com sucesso!");
                setLastScannedQR(`${qrData.id}-${selectedEvent}-${selectedHour}`);
              }
            } catch (error) {
              setError("Erro ao salvar o check-in: " + error.message);
              setLastScannedQR(null);
            }
          } else {
            setError("QR Code inválido: ID não encontrado");
            setLastScannedQR(null);
          }
        } catch (error) {
          setError("QR Code inválido: formato incorreto");
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
  }, [showScanner, selectedHour, selectedEvent, userData]);

  useEffect(() => {
    setLastScannedQR(null);
  }, [selectedEvent, selectedHour]);

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

  const filteredEvents = events.filter((event) => event.hour === selectedHour);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderEvents navigation={navigationAdmin} />
      <Section
        className="flex-grow px-4 md:px-8 lg:px-16 pt-20 pb-16 py-12 lg:py-20"
        crosses
        customPaddings
      >
        <div className="max-w-4xl mx-auto ">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mt-10 mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Área do Administrador
            </h1>
            <p className="text-lg">
              Se você está aqui, o estagiário definitivamente clicou em 'Permitir
              Acesso' sem pensar duas vezes.
            </p>

            <p className="text-lg mt-8 border-l-4 border-emerald-400 pl-4">
              Selecione o horário e o evento para realizar o check-in
            </p>
          </div>

          <div className="flex gap-4 md:gap-6 flex-col items-center  mt-12 max-w-md mx-auto">
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

            {!showScanner ? (
              <button
                onClick={() => setShowScanner(true)}
                className="w-full p-4 rounded-lg bg-emerald-600 text-white font-semibold
                         hover:bg-emerald-500 transition-colors duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedHour || !selectedEvent}
              >
                Escanear QR Code
              </button>
            ) : (
              <div className="w-full relative ">
                <div
                  id="qr-reader"
                  className="w-full bg-gray-800 text-white [&_button]:bg-emerald-500 [&_button]:hover:bg-emerald-600 [&_button]:transition-colors [&_button]:duration-300 [&_button]:px-2 [&_button]:py-2 [&_button]:rounded-lg [&_button]:cursor-pointer [&_img]:invert-[1] rounded-lg overflow-hidden"
                />
                <button
                  onClick={() => {
                    setShowScanner(false);
                    setScannedUser(null);
                  }}
                  className="absolute top-2 right-8 bg-red-500 text-white px-3 rounded-full
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
          </div>
        </div>
      </Section>

      <Footer className="mt-auto" />
    </div>
  );
};

export default AdminList;