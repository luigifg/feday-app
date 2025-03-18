import React from "react";
import ScheduleComponent from "../../Components/design/ScheduleComponent";

const ScheduleSection = () => {
  // Este componente agora é apenas um wrapper para o componente reutilizável
  return (
    <ScheduleComponent 
      isViewOnly={false} 
      sectionId="schedule"
    />
  );
};

export default ScheduleSection;