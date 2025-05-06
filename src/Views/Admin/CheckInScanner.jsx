import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  QrCode,
  Wifi,
  Check,
  AlertCircle,
  X,
  Camera,
  RefreshCw,
} from "lucide-react";

/**
 * Componente para escaneamento de QR Code e NFC para check-in
 * Versão com botões de controle sempre visíveis
 */
const CheckInScanner = ({
  scanMethod,
  setScanMethod,
  showScanner,
  setShowScanner,
  selectedHour,
  selectedEvent,
  nfcSupported,
  processScannedData,
  handleStartScanning,
  handleStopScanning,
  resetScanner,
  successMessage,
  error,
  scannedUser,
  isNfcReading,
}) => {
  const qrScannerRef = useRef(null);
  const scannerInitializedRef = useRef(false);

  // Inicializar o scanner QR quando showScanner muda
  useEffect(() => {
    let html5QrcodeScanner;

    // Função para limpar o scanner
    const cleanupScanner = async () => {
      if (qrScannerRef.current) {
        try {
          await qrScannerRef.current.clear();
          console.log("Scanner QR limpo com sucesso");
        } catch (e) {
          console.error("Erro ao limpar scanner:", e);
        } finally {
          qrScannerRef.current = null;
          scannerInitializedRef.current = false;
        }
      }
    };

    // Realizar limpeza ao montar/desmontar ou quando valores críticos mudam
    cleanupScanner().then(() => {
      // Só inicializa se estiver no modo QR code e o scanner estiver ativo
      if (
        showScanner &&
        selectedHour &&
        selectedEvent &&
        scanMethod === "qrcode"
      ) {
        try {
          console.log("Inicializando novo scanner QR...");

          // Configuração do scanner QR
          html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            {
              fps: 10,
              qrbox: 220,
              aspectRatio: 1.0,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
            },
            false
          );

          qrScannerRef.current = html5QrcodeScanner;
          scannerInitializedRef.current = true;

          // Função de callback quando o QR code é lido com sucesso
          const handleQrCodeSuccess = async (decodedText) => {
            try {
              console.log("QR Code lido:", decodedText);
              await processScannedData(decodedText);
            } catch (error) {
              console.error("Erro ao processar QR Code:", error);
            }
          };

          // Renderizar o scanner
          html5QrcodeScanner.render(handleQrCodeSuccess, (errorMessage) => {
            console.error("Erro na leitura do QR code:", errorMessage);
          });

          console.log("Scanner QR inicializado com sucesso");

          // Garantir que o botão de request fique visível
          setTimeout(() => {
            ajustarControles();
          }, 300);
        } catch (initError) {
          console.error("Erro ao inicializar scanner QR:", initError);
          scannerInitializedRef.current = false;
        }
      }
    });

    // Limpeza ao desmontar ou quando os parâmetros essenciais mudarem
    return () => {
      cleanupScanner();
    };
  }, [showScanner, selectedHour, selectedEvent, scanMethod]);

  // Função para ajustar os controles
  const ajustarControles = () => {
    try {
      // Remover a área de seleção de arquivo
      const fileElements = document.querySelectorAll(
        "#qr-reader__filescan_area"
      );
      fileElements.forEach((el) => {
        if (el) el.style.display = "none";
      });

      // Remover textos desnecessários
      const poweredByElements = document.querySelectorAll(
        '#qr-reader div a[rel="noopener noreferrer"]'
      );
      poweredByElements.forEach((el) => {
        if (el && el.parentNode) el.parentNode.style.display = "none";
      });

      // Mover o dashboard para o topo para garantir que fique visível
      const dashboard = document.querySelector("#qr-reader__dashboard");
      if (dashboard) {
        dashboard.style.position = "sticky";
        dashboard.style.top = "0";
        dashboard.style.zIndex = "100";
        dashboard.style.backgroundColor = "#2F855A";
      }

      // Garantir que o botão de request fique visível
      const requestButton = document.querySelector(
        "#qr-reader__dashboard button"
      );
      if (requestButton) {
        requestButton.style.position = "sticky";
        requestButton.style.zIndex = "101";
      }
    } catch (e) {
      console.error("Erro ao ajustar controles:", e);
    }
  };

  // Função para reiniciar o scanner sem fechar
  const reiniciarScannerSemFechar = () => {
    try {
      // Limpa resultados de scanner
      resetScanner();

      // Reajusta os controles
      ajustarControles();

      console.log("Scanner reiniciado com sucesso");
    } catch (e) {
      console.error("Erro ao reiniciar scanner:", e);
    }
  };

  // Função completa para reiniciar o scanner (troca de câmera)
  const reiniciarScanner = () => {
    resetScanner();

    // Forçar completa reinicialização do scanner
    scannerInitializedRef.current = false;
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current
          .clear()
          .then(() => {
            handleStartScanning();
          })
          .catch((error) => {
            console.error("Erro ao limpar scanner:", error);
            handleStartScanning();
          });
      } catch (e) {
        console.error("Erro ao reiniciar scanner:", e);
        handleStartScanning();
      }
    }
  };

  return (
    <div className="flex gap-2 flex-col items-center w-full">
      {/* Botões de seleção do método quando não está escaneando */}
      {!showScanner && selectedHour && selectedEvent && (
        <>
          <div className="w-full p-3 bg-gray-800 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-medium text-center mb-3 text-white">
              Selecione o método de leitura
            </h3>

            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setScanMethod("qrcode")}
                className={`p-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                  transition-colors ${
                    scanMethod === "qrcode"
                      ? "bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
              >
                <QrCode size={20} />
                QR Code
              </button>
              <button
                onClick={() => setScanMethod("nfc")}
                className={`p-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                  transition-colors ${
                    scanMethod === "nfc"
                      ? "bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400"
                      : "bg-gray-600 hover:bg-gray-500"
                  } ${!nfcSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!nfcSupported}
              >
                <Wifi size={20} />
                NFC
                {nfcSupported === false && (
                  <X
                    size={14}
                    className="text-red-400 absolute top-1 right-1"
                  />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                scannerInitializedRef.current = false;
                handleStartScanning();
              }}
              className="w-full p-4 rounded-lg bg-blue-600 text-white font-semibold
                hover:bg-blue-500 transition-colors shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 text-lg"
              disabled={
                !selectedHour ||
                !selectedEvent ||
                (scanMethod === "nfc" && !nfcSupported)
              }
            >
              {scanMethod === "qrcode" ? (
                <>
                  <QrCode size={22} />
                  Iniciar Leitura de QR Code
                </>
              ) : (
                <>
                  <Wifi size={22} />
                  Iniciar Leitura de Cartão NFC
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Interface do scanner com layout fixo */}
      {showScanner && (
        <div className="w-full relative">
          {/* Botões de controle e mensagem de status combinados */}
          <div className="flex flex-col mb-2">
            {/* Botões de controle - condicionais baseados no método de escaneamento */}
            <div
              className={`grid ${
                scanMethod === "qrcode" ? "grid-cols-3" : "grid-cols-2"
              } gap-2 mb-2`}
            >
              {/* Botão de Trocar Câmera apenas para QR code */}
              {scanMethod === "qrcode" && (
                <button
                  onClick={() => {
                    reiniciarScanner();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center px-3 py-2 gap-1 transition-all shadow-md"
                >
                  <Camera size={18} />
                  <span className="text-sm">Trocar Câmera</span>
                </button>
              )}

              <button
                onClick={() => {
                  reiniciarScannerSemFechar();
                }}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center px-3 py-2 gap-1 transition-all shadow-md"
              >
                <RefreshCw size={18} />
                <span className="text-sm">Reiniciar</span>
              </button>

              <button
                onClick={() => {
                  handleStopScanning();
                  scannerInitializedRef.current = false;
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center px-3 py-2 gap-1 transition-all shadow-md"
              >
                <X size={18} />
                <span className="text-sm">Pausar</span>
              </button>
            </div>

            {/* Área de status fixa - sempre presente */}
            <div className="w-full min-h-16 max-h-24 flex items-center justify-center p-2 rounded-lg border border-gray-700 bg-gray-800 overflow-y-auto">
              {/* Componente de status que sempre mostra algo */}
              {successMessage ? (
                <div
                  className={`flex items-start w-full ${
                    successMessage.includes("ATENÇÃO") ||
                    successMessage.includes("já registrado")
                      ? "text-orange-400"
                      : "text-green-400"
                  }`}
                >
                  {successMessage.includes("ATENÇÃO") ? (
                    <AlertCircle
                      size={20}
                      className="mr-2 flex-shrink-0 mt-1"
                    />
                  ) : (
                    <Check size={20} className="mr-2 flex-shrink-0 mt-1" />
                  )}
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
              ) : error ? (
                <div
                  className={`flex items-start w-full ${
                    error.includes("CONFLITO")
                      ? "text-yellow-500 font-bold"
                      : "text-red-400"
                  }`}
                >
                  <AlertCircle
                    size={error.includes("CONFLITO") ? 24 : 20}
                    className="mr-2 flex-shrink-0 mt-1"
                  />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : scannedUser ? (
                <div className="flex items-center w-full text-blue-400">
                  <Check size={20} className="mr-2 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    <span className="text-gray-400">Participante:</span>{" "}
                    {scannedUser.name}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-medium">
                  {scanMethod === "qrcode"
                    ? "Posicione o QR Code no centro do leitor"
                    : "Aproxime o cartão NFC do dispositivo"}
                </p>
              )}
            </div>
          </div>

          {/* Container para QR/NFC SCANNER com altura ajustada */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gray-800">
            {scanMethod === "qrcode" ? (
              <div id="qr-reader" style={{ width: "100%", maxWidth: "100%" }} />
            ) : (
              <div
                className="w-full p-6 bg-gray-800 text-white rounded-lg text-center flex flex-col items-center justify-center"
                style={{ height: "400px" }}
              >
                <div className="animate-pulse mb-4">
                  <Wifi size={64} className="text-emerald-400" />
                </div>
                <p className="text-lg font-medium mb-2">Leitura NFC ativa</p>
                <p className="text-sm text-gray-300 max-w-[280px] mx-auto">
                  Aproxime o cartão NFC do dispositivo para fazer o check-in-
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informação sobre NFC não suportado */}
      {nfcSupported === false && !showScanner && scanMethod === "nfc" && (
        <div className="w-full p-3 bg-yellow-600 text-white rounded-lg text-sm mt-2">
          <p className="font-medium">
            NFC não suportado neste dispositivo ou navegador
          </p>
          <p className="mt-1">
            NFC funciona apenas em Chrome/Edge em dispositivos Android com NFC .
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner;
