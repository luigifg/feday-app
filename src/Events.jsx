import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import HeaderEvents from "./Components/HeaderEvents";
import Footer from "./Components/Footer";
import QrCode from "./Views/Events/QrCode";
import SelectedEvents from "./Views/Events/SelectedEvents";
import ScheduleSection from "./Views/Events/ScheduleSection";
import { EventsProvider } from "./Views/Events/EventsContext";
import { navigationEvents } from "./constants/index";

const Events = () => {
  return (
    <EventsProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem]">
        <HeaderEvents navigation={navigationEvents} />
        <QrCode />
        <SelectedEvents />
        <ScheduleSection />
        <ButtonGradient />
        <Footer />
      </div>
    </EventsProvider>
  );
};

export default Events;