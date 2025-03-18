import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";
import fe from "../assets/logos/feLogo.svg";
import { navigation } from "../constants";
import Button from "./design/Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/HamburgerMenu";
import api from "../constants/Axios";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);
  const [buttonText, setButtonText] = useState({
    signup: "Novo Usuário",
    signin: "Entrar",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = async () => {
    try {
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      await api.post("/logout");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAuthButtonClick = (key) => {
    setButtonText((prev) => ({ ...prev, [key]: "EM BREVE" }));
    setTimeout(() => {
      setButtonText((prev) => ({
        ...prev,
        [key]: key === "signup" ? "Novo Usuário" : "Entrar",
      }));
    }, 2000);
  };

  const filteredNavigation = navigation.filter((item) => {
    if (user && ["signup", "signin"].includes(item.id)) {
      return false;
    }
    return !item.onlyMobile || !user;
  });

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-1/90 lg:backdrop-blur-sm py-5 ${
        openNavigation ? "bg-n-1" : "bg-n-1/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Logo à esquerda */}
        <a className="block w-[12rem]" href="/">
          <img src={fe} width={140} height={40} alt="FutureDay" />
        </a>

        {/* Navegação centralizada (apenas visível em desktop) */}
        <nav className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center justify-center px-4">
            {filteredNavigation.map((item) => (
              !item.onlyMobile && (
                <a
                  key={item.id}
                  href={item.url}
                  className={`font-code text-xs uppercase font-semibold px-6 py-4 transition-colors hover:text-color-4 ${
                    item.url === pathname.hash ? "text-n-8" : "text-n-8/50"
                  }`}
                >
                  {item.title}
                </a>
              )
            ))}
          </div>
        </nav>

        {/* Área de autenticação à direita (desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <>
              <a
                href="/events"
                className="font-code text-xs uppercase font-semibold text-n-8/50 hover:text-color-4 transition-colors"
              >
                Meus Eventos
              </a>
              <button
                onClick={handleLogout}
                className="font-code text-xs uppercase font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <a
                className="font-code text-xs uppercase font-semibold text-n-8/50 transition-colors hover:text-color-4"
                onClick={() => handleAuthButtonClick("signup")}
                style={{ cursor: "pointer" }}
              >
                {buttonText.signup}
              </a>
              <Button onClick={() => handleAuthButtonClick("signin")}>
                {buttonText.signin}
              </Button>
            </>
          )}
        </div>

        {/* Menu mobile */}
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[7.59rem] left-0 right-0 bottom-0 bg-n-1 lg:hidden`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto">
            {filteredNavigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-4 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8`}
              >
                {item.title}
              </a>
            ))}

            {user && (
              <>
                <a
                  href="/events"
                  onClick={handleClick}
                  className="block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-4 px-6 py-6 md:py-8"
                >
                  Meus Eventos
                </a>
                <button
                  onClick={handleLogout}
                  className="block relative font-code text-2xl uppercase text-red-500 transition-colors hover:text-red-600 px-6 py-6 md:py-8"
                >
                  Sair
                </button>
              </>
            )}
          </div>
          <HamburgerMenu />
        </nav>

        {/* Botão de menu mobile */}
        <Button
          className="lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;