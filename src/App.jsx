import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./Components/Benefits";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Previous from "./Components/PreviousEvent";
import Location from "./Components/EventLocation"


const App = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <Hero />
      <Previous />
      <Location />
      {/* <Benefits /> */}
      <ButtonGradient />
      <Footer />
    </div>
  );
};

export default App;
