import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiMenu, FiX } from "react-icons/fi"; 



const Navbar = ({ scrollToSection }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 500); 
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className={`${
        isSticky ? "sticky-navbar" : "initial-navbar"
      } transition-all duration-500 ease-in-out w-full z-1`}
    >
      <div
        className={`flex items-center justify-between w-full px-8 pl-24 ${
          isSticky ? "" : "flex-col"
        }`}
      >
        {!isSticky && (
          <div className="flex items-center justify-between w-full px-40 flex-col lg:flex-row">
            <ul className="flex flex-row space-x-2 lg:space-x-8 text-center text-black mb-4 lg:mb-0 mr-32">
              <li
                onClick={() => scrollToSection("home")}
                className="hidden lg:flex hover:text-red-500 font-bold cursor-pointer text-xl"
                style={{ position: "relative", top: "-9px", left: "20px" }}
              >
                الرئيسية
              </li>
              <li
                onClick={() => scrollToSection("contact")}
                className="hidden lg:flex hover:text-red-500 font-bold cursor-pointer text-xl"
                style={{ position: "relative", top: "14px", right: "30px" }}
              >
تواصل معنا
              </li>
            </ul>

            <div className="logo-container flex justify-center mb-4 lg:mb-0">
              <img
                src={logo}
                alt="Logo"
                className={`${
                  isSticky
                    ? "h-8 w-8"
                    : "h-24 w-40 md:h-24 md:w-24 lg:h-32 lg:w-32 lg:mt-10 "
                } transition-all duration-500 transform ${
                  isSticky ? "" : "rotate-[360deg]"
                }`}
              />
            </div>

            <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 text-center text-black ">
            <li
                onClick={() => scrollToSection("join")}
                className="hidden lg:flex hover:text-red-500 font-bold cursor-pointer pl-10 text-xl"
                style={{ position: "relative", top: "15px", left: "1px" }}

              >
                الانضمام كمسعف
              </li>
              <li
                onClick={() => scrollToSection("about")}
                className="hidden lg:flex hover:text-red-500 font-bold cursor-pointer text-xl"
                style={{ position: "relative", top: "0px", left: "-9px" }}
              >
                من نحن
              </li>
           
            </ul>
          </div>
        )}

        {/* mobile nav */}
        {isSticky && (
          <div className="flex items-center justify-between w-full px-8">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 transition-all duration-500"
              />
              <span className="text-lg transition-all duration-500 text-black font-semibold ml-4 mr-1">
                سواعف
              </span>
            </div>

            {/* Burger Menu */}
            <div className="md:hidden flex items-center pt-5">
              <button
                onClick={toggleMenu}
                className="text-3xl text-black focus:outline-none mt-1"
                style={{ position: "relative", top: "-10px" }}
              >
                {menuOpen ? <FiX /> : <FiMenu />}{" "}
              </button>
            </div>

            {/* Nav links for large screens */}
            <ul className="hidden md:flex space-x-8 text-center text-black">
              <li
                onClick={() => scrollToSection("home")}
                className="hover:text-red-500 font-bold cursor-pointer ml-8"
              >
                الرئيسية
              </li>
            
            
              <li
                onClick={() => scrollToSection("contact")}
                className="hover:text-red-500 font-bold cursor-pointer"
              >
                تواصل معنا
              </li>
              <li
                onClick={() => scrollToSection("join")}
                className="hover:text-red-500 font-bold cursor-pointer"
              >
                الانضمام كمسعف
              </li>
              <li
                onClick={() => scrollToSection("about")}
                className="hover:text-red-500 font-bold cursor-pointer"
              >
                من نحن
              </li>
            </ul>

            <div className="hidden md:block">
              <Link to="/login" className="py-2 px-3 text-xs bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white font-semibold rounded-full transition-all duration-300 shadow-md">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4 text-black">
            <li
              onClick={() => scrollToSection("home")}
              className="hover:text-red-500 font-bold cursor-pointer"
            >
              الرئيسية
            </li>
            <li
              onClick={() => scrollToSection("about")}
              className="hover:text-red-500 font-bold cursor-pointer"
            >
              من نحن
            </li>
            <li
              onClick={() => scrollToSection("contact")}
              className="hover:text-red-500 font-bold cursor-pointer"
            >
              تواصل معنا
            </li>
            <li
              onClick={() => scrollToSection("join")}
              className="hover:text-red-500 font-bold cursor-pointer"
            >
              الانضمام كمسعف
            </li>
            <li>
              <Link to='/login' className="py-3 px-2 text-sm bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white font-semibold rounded-full transition-all duration-300 shadow-md">
                تسجيل الدخول
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
