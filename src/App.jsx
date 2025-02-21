import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Hero from "./Views/Home/Hero";
import Previous from "./Views/Home/PreviousEvent";
import Location from "./Views/Home/EventLocation"
import Banner from "./Views/Home/Banner"



const App = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] ">
      <Header />
      <Hero />
      <Banner />
      <Previous />
      <Location />
      <ButtonGradient />
      <Footer />
    </div>
  );
};

export default App;
