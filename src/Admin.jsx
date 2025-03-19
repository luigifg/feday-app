import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./Components/HeaderEvents";
import Footer from "./Components/Footer";
import Hero from "./Views/Admin/Admin";
import Table from "./Views/Admin/Table";
import { navigationAdmin } from "./constants/index";


const Admin = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] ">
      <Header navigation={navigationAdmin} />
      <Hero />
      {/* <Table /> */}
      <ButtonGradient />
      <Footer />
    </div>
  );
};

export default Admin;
