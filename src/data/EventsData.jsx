import micrologo from "../assets/micrologo.jpg";
import nxplogo from "../assets/nxplogo.jpg";
import ramos from "../assets/ramos.png";

export const horariosEvento = [
    { id: '1', label: '09:00 às 10:00' },
    { id: '2', label: '10:10 às 11:10' },
    { id: '3', label: '11:20 às 12:20' },
    { id: '4', label: '14:00 às 15:00' },
    { id: '5', label: '15:10 às 16:10' },
    { id: '6', label: '17:00 às 18:00' }
  ];

  export const events = [
    // Eventos para o horário das 09h00 às 10h00
    { id: 1, title: "Evento 1", description: "Descrição do evento: 1", palestrante: "José Pereira", hour: "1", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 2, title: "Evento 2", description: "Descrição do evento 2", palestrante: "José Pereira", hour: "1", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: micrologo },
    { id: 3, title: "Evento 3", description: "Descrição do evento 3", palestrante: "José Pereira", hour: "1", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 4, title: "Evento 4", description: "Descrição do evento 4", palestrante: "José Pereira", hour: "1", room: "Barigui", link: "#", image: ramos, companyLogo: micrologo },

    // Eventos para o horário das 10h10 às 11h10
    { id: 5, title: "Evento 5", description: "Descrição do evento 5", palestrante: "José Pereira", hour: "2", room: "Barigui", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 6, title: "Evento 6", description: "Descrição do evento 6", palestrante: "José Pereira", hour: "2", room: "Bacacheri", link: "#", image: ramos, companyLogo: micrologo },
    { id: 7, title: "Evento 7", description: "Descrição do evento 7", palestrante: "José Pereira", hour: "2", room: "Tangua", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 8, title: "Evento 8", description: "Descrição do evento 8", palestrante: "José Pereira", hour: "2", room: "Tingui", link: "#", image: ramos, companyLogo: micrologo },

    // Eventos para o horário das 11h20 às 12h20
    { id: 9, title: "Evento 9", description: "Descrição do evento 9", palestrante: "José Pereira", hour: "3", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 10, title: "Evento 10", description: "Descrição do evento 10", palestrante: "José Pereira", hour: "3", room: "Barigui", link: "#", image: ramos, companyLogo: micrologo },
    { id: 11, title: "Evento 11", description: "Descrição do evento 11", palestrante: "José Pereira", hour: "3", room: "Bacacheri", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 12, title: "Evento 12", description: "Descrição do evento 12", palestrante: "José Pereira", hour: "3", room: "Tangua", link: "#", image: ramos, companyLogo: micrologo },

    // Eventos para o horário das 14h00 às 15h00
    { id: 13, title: "Evento 13", description: "Descrição do evento 13", palestrante: "José Pereira", hour: "4", room: "Tangua", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 14, title: "Evento 14", description: "Descrição do evento 14", palestrante: "José Pereira", hour: "4", room: "Tingui", link: "#", image: ramos, companyLogo: micrologo },
    { id: 15, title: "Evento 15", description: "Descrição do evento 15", palestrante: "José Pereira", hour: "4", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 16, title: "Evento 16", description: "Descrição do evento 16", palestrante: "José Pereira", hour: "4", room: "Barigui", link: "#", image: ramos, companyLogo: micrologo },

    // Eventos para o horário das 15h10 às 16h10
    { id: 17, title: "Evento 17", description: "Descrição do evento 17", palestrante: "José Pereira", hour: "5", room: "Tangua", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 18, title: "Evento 18", description: "Descrição do evento 18", palestrante: "José Pereira", hour: "5", room: "Tingui", link: "#", image: ramos, companyLogo: micrologo },
    { id: 19, title: "Evento 19", description: "Descrição do evento 19", palestrante: "José Pereira", hour: "5", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 20, title: "Evento 20", description: "Descrição do evento 20", palestrante: "José Pereira", hour: "5", room: "Barigui", link: "#", image: ramos, companyLogo: micrologo },

    // Eventos para o horário das 17h00 às 18h00
    { id: 21, title: "Evento 21", description: "Descrição do evento 21", palestrante: "José Pereira", hour: "6", room: "Tangua", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 22, title: "Evento 22", description: "Descrição do evento 22", palestrante: "José Pereira", hour: "6", room: "Tingui", link: "#", image: ramos, companyLogo: micrologo },
    { id: 23, title: "Evento 23", description: "Descrição do evento 23", palestrante: "José Pereira", hour: "6", room: "Sao Lourenco", link: "#", image: ramos, companyLogo: nxplogo },
    { id: 24, title: "Evento 24", description: "Descrição do evento 24", palestrante: "José Pereira", hour: "6", room: "Barigui", link: "#", image: ramos, companyLogo: micrologo },
    { id: 25, title: "Evento 25", description: "Descrição do evento 24", palestrante: "José Pereira", hour: "6", room: "Barigui", link: "#", image: ramos, companyLogo: nxplogo },
    
  ];

  export const ROOM_COLORS = {
    tangua: {
      name: "Tanguá",
      color: "bg-green-500"
    },
    tingui: {
      name: "Tingüi", 
      color: "bg-blue-500"
    },
    "sao lourenco": {
      name: "São Lourenço",
      color: "bg-orange-500"
    },
    barigui: {
      name: "Barigüi",
      color: "bg-yellow-500"
    },
    bacacheri: {
      name: "Bacacheri",
      color: "bg-pink-500"
    }
  };
  
  // Função para obter a cor da sala
  export const getRoomColor = (room) => {
    const roomData = ROOM_COLORS[room.toLowerCase()];
    return roomData ? roomData.color : "bg-gray-300";
  };