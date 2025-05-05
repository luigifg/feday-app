import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Wifi, Layers, FileText } from "lucide-react";

import api from "../../constants/Axios";
import CheckInExport from "./CheckInExport";
import Section from "../../Components/Section";
import { horariosEvento, events } from "../../data/speakerData";
import NFCWriterAdmin from "./NfcWriter";
import CheckInSelector from "./CheckInSelector";
import CheckInScanner from "./CheckInScanner";
import CheckInStatus from "./CheckInStatus";

const AdminList = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState("checkin");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);

  // Estados para seleção de evento
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [favorites, setFavorites] = useState({ hour: "", event: "" });

  // Estados para scanner
  const [scanMethod, setScanMethod] = useState("qrcode");
  const [showScanner, setShowScanner] = useState(false);
  const [isNfcReading, setIsNfcReading] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(null);

  // Estados de processamento e feedback
  const [lastProcessedQRContent, setLastProcessedQRContent] = useState(null);
  const [lastProcessTime, setLastProcessTime] = useState(0);
  const [lastScannedQR, setLastScannedQR] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Refs
  const nfcAbortController = useRef(null);
  const navigate = useNavigate();

  // Key para armazenar e recuperar favoritos
  const getFavoritesKey = (userId) => `eventFavorites_${userId}`;

  // Verificar suporte a NFC no navegador
  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
  }, []);

  // Reset messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Carregar favoritos quando o usuário estiver disponível
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

  // Verificar autenticação do usuário
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

  // Resetar informações ao trocar evento ou horário
  useEffect(() => {
    setLastScannedQR(null);
    setLastProcessedQRContent(null);
    setScannedUser(null);
    setError("");
    setSuccessMessage("");

    // Forçar o fechamento do scanner e parar a leitura NFC
    if (showScanner) {
      setShowScanner(false);
    }

    if (isNfcReading) {
      setIsNfcReading(false);
      stopNfcReading();
    }

    // Reset completo - usuário deve selecionar método de leitura novamente
  }, [selectedEvent, selectedHour]);

  // Iniciar ou parar leitura de NFC
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

  /**
   * Função para processar dados escaneados (QR/NFC)
   */
  const processScannedData = async (decodedText) => {
    try {
      let qrData;

      // Limita processamentos rápidos do mesmo QR code para evitar duplicação
      const now = Date.now();
      if (
        decodedText === lastProcessedQRContent &&
        now - lastProcessTime < 800
      ) {
        console.log("QR code lido recentemente, ignorando");
        return;
      }

      // Atualizar o timestamp para controle de leituras repetidas
      setLastProcessedQRContent(decodedText);
      setLastProcessTime(now);

      // Limpar mensagens anteriores quando um novo QR code é lido
      setError("");
      setSuccessMessage("");

      // PROCESSAMENTO DO CONTEÚDO DO QR CODE
      // Processar vCard, JSON ou formato separado por pipe
      if (
        typeof decodedText === "string" &&
        decodedText.includes("BEGIN:VCARD")
      ) {
        // Processamento de vCard (extrair ID e nome)
        const noteRegex = /NOTE:(\d+)\|(.+?)(?:\r?\n|$)/;
        const noteMatch = decodedText.match(noteRegex);

        if (noteMatch && noteMatch[1] && noteMatch[2]) {
          qrData = { id: noteMatch[1], name: noteMatch[2] };
        } else {
          // Tentar extrair email e nome e buscar usuário
          const emailRegex = /EMAIL[^:]*:(.+?)(?:\r?\n|$)/i;
          const nameRegex = /FN:(.+?)(?:\r?\n|$)/i;

          const emailMatch = decodedText.match(emailRegex);
          const nameMatch = decodedText.match(nameRegex);

          if (emailMatch && emailMatch[1] && nameMatch && nameMatch[1]) {
            try {
              const userResponse = await api.get(`/user`, {
                params: { userEmail: emailMatch[1].trim() },
              });

              if (userResponse.data && userResponse.data.id) {
                qrData = {
                  id: userResponse.data.id,
                  name: nameMatch[1].trim(),
                };
              } else {
                throw new Error("Usuário não encontrado pelo email");
              }
            } catch (emailError) {
              throw new Error(
                "Não foi possível identificar o usuário pelo vCard"
              );
            }
          } else {
            throw new Error("vCard não contém dados necessários para check-in");
          }
        }
      } else {
        // Tentar processar como JSON ou formato separado por pipe
        try {
          qrData = JSON.parse(decodedText);
        } catch (e) {
          if (typeof decodedText === "string" && decodedText.includes("|")) {
            const [id, name] = decodedText.split("|");
            qrData = { id, name };
          } else {
            throw new Error("Formato de dados inválido");
          }
        }
      }

      // VERIFICAÇÃO DO USUÁRIO E CHECK-IN
      if (!qrData || !qrData.id) {
        throw new Error("Dados inválidos: ID não encontrado");
      }

      // Definir informações do usuário imediatamente para feedback rápido
      setScannedUser({
        id: qrData.id,
        name: qrData.name || "Usuário #" + qrData.id,
      });

      // Chave única para este check-in para evitar duplicatas
      const checkInKey = `${qrData.id}-${selectedEvent}-${selectedHour}`;

      // Se for o mesmo check-in recente, não processa novamente
      if (lastScannedQR === checkInKey) {
        console.log("Check-in já processado recentemente");
        return;
      }

      // Verificar se já existe check-in para este usuário no evento e horário
      try {
        const checkExistingResponse = await api.get("/checkIn", {
          params: {
            user_id: qrData.id,
            event_id: selectedEvent,
            hour: selectedHour,
          },
        });

        if (checkExistingResponse.data.exists) {
          // Check-in já existente - mostrar mensagem em LARANJA
          const eventDetails = events.find((e) => e.id == selectedEvent) || {};
          setSuccessMessage(
            `${qrData.name} já registrado na sala ${eventDetails.room}.`
          );
          setLastScannedQR(checkInKey);
          return;
        }

        // Fazer o check-in no banco de dados
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

        // Check-in realizado com sucesso
        const eventDetails = events.find((e) => e.id == selectedEvent) || {};
        setSuccessMessage(
          `Check-in realizado! ${qrData.name} registrado para "${
            eventDetails.title || "Evento selecionado"
          }" na sala ${eventDetails.room || "designada"}.`
        );
        setLastScannedQR(checkInKey);
      } catch (apiError) {
        // Tratar erro da API
        console.error("Erro na API:", apiError);

        if (apiError.response && apiError.response.status === 409) {
          if (apiError.response.data.isHourConflict) {
            // Get details of the conflicting event
            const conflictingEventDetails =
              events.find(
                (e) => e.id == apiError.response.data.conflictEventId
              ) || {};

            // Get details of the current event
            const currentEventDetails =
              events.find((e) => e.id == selectedEvent) || {};

            // Compare the hours to determine if this is a time conflict or a room conflict
            const conflictingHour = events.find(
              (e) => e.id == apiError.response.data.conflictEventId
            )?.hour;

            if (conflictingHour === selectedHour) {
              // This is a room conflict at the same time - always prevent it
              // and show clear warning that the user is already registered elsewhere
              setError(
                `CONFLITO: ${
                  qrData.name
                } já está registrado em outro evento no mesmo horário: "${
                  conflictingEventDetails.title ||
                  "Evento #" + apiError.response.data.conflictEventId
                }" (Sala ${
                  conflictingEventDetails.room || "N/A"
                }). Não é possível registrar em duas salas no mesmo horário.`
              );
              setLastScannedQR(checkInKey);
            } else if (conflictingHour !== selectedHour) {
              // Different time slots - allow check-in regardless of room
              // Create a new check-in record directly
              try {
                const checkInData = {
                  userId: qrData.id,
                  userName: qrData.name,
                  hour: selectedHour,
                  eventId: selectedEvent,
                  adminId: userData.id,
                  // Add a flag to indicate this is for different time slots
                  allowDifferentTimeSlots: true,
                };

                const response = await api.post("/checkIn", checkInData, {
                  withCredentials: true,
                });

                setSuccessMessage(
                  `Check-in realizado! ${qrData.name} registrado para "${
                    currentEventDetails.title || "Evento selecionado"
                  }" na sala ${currentEventDetails.room || "designada"}.`
                );
                setLastScannedQR(checkInKey);
              } catch (secondAttemptError) {
                setError(
                  "Erro ao processar check-in: " +
                    (secondAttemptError.response?.data?.message ||
                      secondAttemptError.message)
                );
              }
            } else {
              // Same room, same time - show as already registered (shouldn't happen normally)
              setSuccessMessage(
                `${qrData.name} já registrado para "${
                  currentEventDetails.title || "Evento selecionado"
                }" na sala ${currentEventDetails.room || "designada"}.`
              );
              setLastScannedQR(checkInKey);
            }
          } else if (apiError.response.data.isDuplicate) {
            // Check-in duplicado (mostrar como já existente, em laranja)
            const eventDetails =
              events.find((e) => e.id == selectedEvent) || {};
            setSuccessMessage(
              `${qrData.name} já registrado para "${
                eventDetails.title || "Evento selecionado"
              }" na sala ${eventDetails.room || "designada"}.`
            );
            setLastScannedQR(checkInKey);
          } else {
            // Outros erros de conflito
            setError(
              "Erro de conflito: " +
                (apiError.response?.data?.message || "Conflito desconhecido")
            );
          }
        } else {
          // Erros técnicos continuam aparecendo como erro
          setError(
            "Erro ao processar check-in: " +
              (apiError.response?.data?.message ||
                apiError.message ||
                "Erro desconhecido")
          );
        }
      }
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      setError("Erro: " + (error.message || "Falha no processamento"));
      setLastScannedQR(null);
    }
  };

  /**
   * Função para iniciar leitura de NFC
   */
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
          let foundIdData = false;

          console.log("NFC lido - Records:", message.records.length);

          // Buscar dados de identificação nos records
          for (const record of message.records) {
            // Verificar se é um vCard pelo tipo MIME
            if (
              record.recordType === "mime" &&
              record.mediaType === "text/vcard"
            ) {
              try {
                const textDecoder = new TextDecoder();
                const vCardText = textDecoder.decode(record.data);

                // Buscar especificamente pelo formato NOTE:ID|Nome
                const noteRegex = /NOTE:(\d+)\|(.+?)(?:\r?\n|$)/;
                const noteMatch = vCardText.match(noteRegex);

                if (noteMatch && noteMatch[1] && noteMatch[2]) {
                  userIdFromNFC = noteMatch[1];
                  userNameFromNFC = noteMatch[2];
                  foundIdData = true;
                  console.log(
                    "Dados encontrados no NOTE do vCard:",
                    userIdFromNFC,
                    userNameFromNFC
                  );
                  break;
                }
              } catch (vCardError) {
                console.error("Erro ao processar vCard:", vCardError);
              }
            }
            // Verificar se é um texto simples que pode conter ID|Nome
            else if (record.recordType === "text") {
              try {
                const textDecoder = new TextDecoder();
                const textData = textDecoder.decode(record.data);

                // Verificar se o formato é ID|Nome
                if (textData.includes("|")) {
                  const [id, name] = textData.split("|");
                  if (id && name) {
                    userIdFromNFC = id;
                    userNameFromNFC = name;
                    foundIdData = true;
                    console.log(
                      "Dados encontrados no formato texto ID|Nome:",
                      userIdFromNFC,
                      userNameFromNFC
                    );
                    break;
                  }
                }
              } catch (textError) {
                console.error("Erro ao processar texto:", textError);
              }
            }
            // Verificar outros formatos como JSON
            else if (
              record.recordType === "mime" &&
              record.mediaType === "application/json"
            ) {
              try {
                const textDecoder = new TextDecoder();
                const jsonText = textDecoder.decode(record.data);
                const jsonData = JSON.parse(jsonText);

                if (jsonData.id) {
                  userIdFromNFC = jsonData.id;
                  userNameFromNFC = jsonData.name || "";
                  foundIdData = true;
                  console.log(
                    "Dados encontrados no formato JSON:",
                    userIdFromNFC,
                    userNameFromNFC
                  );
                  break;
                }
              } catch (jsonError) {
                console.error("Erro ao processar JSON:", jsonError);
              }
            }
          }

          // Usar serial do cartão como último recurso
          if (!foundIdData && serialNumber) {
            userIdFromNFC = serialNumber;
            userNameFromNFC = "Cartão " + serialNumber.substring(0, 8);
            console.log(
              "Usando número serial como identificação:",
              userIdFromNFC,
              userNameFromNFC
            );
          }

          if (userIdFromNFC) {
            // Transformar nos dados para processamento
            const nfcData = JSON.stringify({
              id: userIdFromNFC,
              name: userNameFromNFC,
            });

            // Processar dados para check-in
            await processScannedData(nfcData);
          } else {
            setError("Nenhum dado de identificação encontrado no cartão NFC");
          }
        } catch (error) {
          console.error("Erro ao processar tag NFC:", error);
          setError("Erro ao processar tag NFC: " + error.message);
        }
      });
    } catch (error) {
      console.error("Falha ao iniciar leitura NFC:", error);
      setError("Falha ao iniciar leitura NFC: " + error.message);
      setIsNfcReading(false);
    }
  };

  /**
   * Função para parar leitura de NFC
   */
  const stopNfcReading = () => {
    if (nfcAbortController.current) {
      nfcAbortController.current.abort();
      nfcAbortController.current = null;
    }
  };

  /**
   * Função para forçar reativação do scanner
   * Reinicia o scanner mas mantém as seleções de sala e horário
   */
  const refreshScannerOnly = () => {
    // Limpa mensagens e resultados anteriores
    resetScanner();

    if (scanMethod === "nfc") {
      // Para NFC, precisamos reiniciar a leitura com as novas seleções
      if (isNfcReading) {
        stopNfcReading();
      }

      // Em modo NFC, reiniciamos a leitura imediatamente com novos parâmetros
      setTimeout(() => {
        if (selectedHour && selectedEvent) {
          setIsNfcReading(true);
        }
      }, 300);
    } else {
      // Para QR code, precisamos recriar o componente de scanner
      setShowScanner(false);

      // Dá um tempo maior para o DOM realmente se atualizar antes de reabrir o scanner
      setTimeout(() => {
        setShowScanner(true);
      }, 300);
    }
  };

  /**
   * Funções para gerenciar seleção de evento e horário
   * Reset completo do formulário e do scanner
   */
  const resetCheckInForm = () => {
    setScannedUser(null);
    setError("");
    setSuccessMessage("");
    setLastScannedQR(null);
    setLastProcessedQRContent(null);

    // Sempre pare o scanner quando resetar o formulário
    if (showScanner) {
      setShowScanner(false);
    }

    if (isNfcReading) {
      setIsNfcReading(false);
      stopNfcReading();
    }
  };

  /**
   * Reseta o scanner para um novo check-in sem fechar a câmera
   * Mantém as seleções de sala e horário
   */
  const resetScanner = () => {
    setScannedUser(null);
    setError("");
    setSuccessMessage("");
    setLastScannedQR(null);
    setLastProcessedQRContent(null);
    // Não resetamos selectedHour e selectedEvent para manter as seleções entre scans
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

    // Complete reset: close scanner and stop all readings
    handleStopScanning();
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

    // Complete reset: close scanner and stop all readings
    handleStopScanning();
  };

  /**
   * Funções para controle do scanner
   */
  const handleStartScanning = () => {
    resetScanner();
    // Garante que o scanner anterior foi fechado completamente antes de abrir um novo
    setShowScanner(false);
    setTimeout(() => {
      setShowScanner(true);
      if (scanMethod === "nfc") {
        setIsNfcReading(true);
      }
    }, 100);
  };

  const handleStopScanning = () => {
    setShowScanner(false);
    setIsNfcReading(false);
    resetScanner();
    stopNfcReading();
    // Ensure we always go back to the scan method selection screen
  };

  // Filtrar eventos com base no horário selecionado
  const filteredEvents = events.filter((event) => event.hour === selectedHour);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Section
        className="flex-grow px-2 sm:px-4 md:px-8 lg:px-16 pb-8 md:pb-16 overflow-x-hidden"
        crosses
        customPaddings
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-10 mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Área do Administrador
            </h1>
            <p className="text-lg">
              Realize operações de check-in e gerenciamento de cartões NFC
            </p>
          </div>

          {/* Tabs para alternar entre modos */}
          <div className="w-full overflow-x-auto mb-6 border-b border-gray-700">
            <div className="flex min-w-[500px]">
              <button
                onClick={() => setActiveTab("checkin")}
                className={`flex items-center gap-2 py-3 px-5 font-medium transition-colors ${
                  activeTab === "checkin"
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <QrCode size={18} />
                <span className="whitespace-nowrap">Check-in</span>
              </button>
              <button
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-2 py-3 px-5 font-medium transition-colors ${
                  activeTab === "write"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Layers size={18} />
                <span className="whitespace-nowrap">Gravação NFC</span>
              </button>
              {/* Nova tab para exportação */}
              <button
                onClick={() => setActiveTab("export")}
                className={`flex items-center gap-2 py-3 px-5 font-medium transition-colors ${
                  activeTab === "export"
                    ? "border-b-2 border-orange-500 text-orange-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FileText size={18} />
                <span className="whitespace-nowrap">Exportar</span>
              </button>
            </div>
          </div>

          {activeTab === "checkin" ? (
            <div className="flex gap-4 md:gap-6 flex-col items-center mt-6 max-w-md mx-auto">
              <p className="text-lg border-l-4 border-emerald-400 pl-4 self-start">
                Selecione o horário e o evento para realizar o check-in
              </p>

              {/* Componente de seleção de horário e evento */}
              <CheckInSelector
                selectedHour={selectedHour}
                selectedEvent={selectedEvent}
                handleHourChange={handleHourChange}
                handleEventChange={handleEventChange}
                horariosEvento={horariosEvento}
                filteredEvents={filteredEvents}
                favorites={favorites}
                resetCheckInForm={resetCheckInForm}
              />

              {/* Status do check-in em tempo real (quando evento selecionado) */}
              {selectedEvent && (
                <CheckInStatus
                  resetScanner={resetScanner}
                  successMessage={successMessage}
                  error={error}
                  scannedUser={scannedUser}
                  selectedEvent={selectedEvent}
                  events={events}
                />
              )}

              {/* Componente de scanner */}
              <CheckInScanner
                scanMethod={scanMethod}
                setScanMethod={setScanMethod}
                showScanner={showScanner}
                setShowScanner={setShowScanner}
                selectedHour={selectedHour}
                selectedEvent={selectedEvent}
                nfcSupported={nfcSupported}
                processScannedData={processScannedData}
                handleStartScanning={handleStartScanning}
                handleStopScanning={handleStopScanning}
                resetScanner={resetScanner}
                successMessage={successMessage}
                error={error}
                scannedUser={scannedUser}
                isNfcReading={isNfcReading}
              />
            </div>
          ) : activeTab === "write" ? (
            // Aba de gravação de cartões NFC
            <NFCWriterAdmin />
          ) : activeTab === "export" ? (
            // Nova aba de exportação
            <CheckInExport horariosEvento={horariosEvento} events={events} />
          ) : null}
        </div>
      </Section>
    </div>
  );
};

export default AdminList;
