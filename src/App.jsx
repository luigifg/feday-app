import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
// import Hero from "./Views/Home/Hero";
import Previous from "./Views/Home/PreviousEvent";
import Location from "./Views/Home/EventLocation";
import Banner from "./Views/Home/Banner";
import HomeSchedule from "./Views/Home/HomeSchedule";
import { EventsProvider } from "./Views/Events/EventsContext";

const App = () => {
  return (
    // Envolvemos o App com EventsProvider para garantir que o HomeScheduleSection funcione corretamente,
    // mesmo que não utilizemos todas as funcionalidades interativas
    <EventsProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] ">
        <Header />
        {/* <Hero /> */}
        <Banner />
        <Previous />
        <Location />
        <HomeSchedule />
        <ButtonGradient />
        <Footer />
      </div>
    </EventsProvider>
  );
};

export default App;