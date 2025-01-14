import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect } from "react";
import axios from "axios";
import fe from "../assets/logos/feLogo.svg";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";

const HeaderEvents = ({ navigation = [], logoHref = "/" }) => {
  const { hash: currentPath } = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("/me");
        console.log("Resposta API:", userResponse.data);
        console.log("ID Group:", userResponse.data?.idGroup);
        console.log("Is Admin?", userResponse.data?.idGroup === 2);
        if (userResponse.status === 200 && userResponse.data?.id) {
          setUserId(userResponse.data.id);
          setIsAdmin(userResponse.data.idGroup === 2);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserId(null);
        setIsAdmin(false);
      }
    };

    fetchUserData();
  }, []);

  // Add scroll handling on mount and when hash changes
  useEffect(() => {
    if (currentPath) {
      const targetElement = document.querySelector(currentPath);
      if (targetElement) {
        const headerHeight = 80; // Altura aproximada do header em pixels
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  }, [currentPath]);

  const handleClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        const headerHeight = 80; // Altura aproximada do header em pixels
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }

    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const filteredNavigation = navigation.filter(item => 
    item.id !== "3" || isAdmin
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-1 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-1" : "bg-n-1/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem]" href={logoHref}>
          <img src={fe} width={140} height={40} alt="FutureDay" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-1 lg:static lg:flex lg:flex-1`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center w-full lg:flex-row lg:-ml-12">
            {filteredNavigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-4 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === currentPath
                    ? "z-2 lg:text-n-8"
                    : "lg:text-n-8/50"
                } lg:leading-5 lg:hover:text-color-4 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>
        
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

export default HeaderEvents;