import { fbg } from "../../assets";

export const SideLines = () => {
  return (
    <>
      <div className="absolute top-0 left-5 w-0.25 h-full bg-n-6"></div>
      <div className="absolute top-0 right-5 w-0.25 h-full bg-n-6"></div>
    </>
  );
};

export const HamburgerMenu = () => {
  return (
    <div className="absolute inset-0 pointer-events-none lg:hidden">
      <div className="absolute inset-0 opacity-[.1]">
        <img
          className="w-full h-full object-cover"
          src={fbg}
          width={688}
          height={953}
          alt="bg"
        />
      </div>


      <SideLines />
    </div>
  );
};