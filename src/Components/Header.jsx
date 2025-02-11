import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";
import fe from "../assets/logos/feLogo.svg";
import { navigation } from "../constants";
import Button from "./design/Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/HamburgerMenu";
import api from "../Axios";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthButtons, setShowAuthButtons] = useState(true);
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
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-1/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-1" : "bg-n-1/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src={fe} width={140} height={40} alt="FutureDay" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-1 lg:static lg:flex lg:bg-transparent lg:flex-1`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:justify-center">
            {filteredNavigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-4 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash
                    ? "z-2 lg:text-n-8"
                    : "lg:text-n-8/50"
                } lg:leading-5 lg:hover:text-color-4 xl:px-8`}
              >
                {item.title}
              </a>
            ))}

            {user && (
              <>
                <a
                  href="/events"
                  onClick={handleClick}
                  className="block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-4 px-6 py-6 md:py-8 lg:hidden"
                >
                  Meus Eventos
                </a>
                <button
                  onClick={handleLogout}
                  className="block relative font-code text-2xl uppercase text-red-500 transition-colors hover:text-red-600 px-6 py-6 md:py-8 lg:hidden"
                >
                  Sair
                </button>
              </>
            )}
          </div>
          <HamburgerMenu />
        </nav>

        {user ? (
          <div className="hidden lg:flex items-center ml-auto gap-8">
            <a
              href="/events"
              className="text-n-8/50 hover:text-color-4 transition-colors"
            >
              <span className="text-sm font-semibold">Meus Eventos</span>
            </a>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        ) : showAuthButtons ? (
          <>
            <a
              className="hidden button mr-8 text-n-8/50 transition-colors hover:text-color-4 lg:block"
              onClick={() => handleAuthButtonClick("signup")}
              style={{ cursor: "pointer" }}
            >
              {buttonText.signup}
            </a>

            <Button
              className="hidden lg:flex"
              onClick={() => handleAuthButtonClick("signin")}
            >
              {buttonText.signin}
            </Button>
          </>
        ) : (
          <div className="hidden lg:flex ml-auto w-[150px]" />
        )}

        <Button
          className="ml-auto lg:hidden"
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