import React from "react";
import ScheduleComponent from "../../Components/design/ScheduleComponent";


const HomeScheduleSection = () => {
  // Descrição customizada para a página inicial
  const homeDescription = "Confira a programação completa do Future Day e planeje sua participação no evento. Para selecionar palestras e workshops, acesse a área de eventos.";

  return (
    <ScheduleComponent 
      isViewOnly={true} 
      customDescription={homeDescription}
      sectionId="home-schedule"
    />
  );
};

export default HomeScheduleSection;