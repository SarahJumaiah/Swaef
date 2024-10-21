import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiMenu, FiX } from "react-icons/fi"; 

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 600); 
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
      } transition-all duration-500 ease-in-out w-full z-50 `}
    >
      <div
        className={`flex items-center justify-between w-full px-8 ${
          isSticky ? "" : "flex-col"
        }`}
      >
        {!isSticky && (
          <div className="flex items-center justify-between w-full px-40 flex-col lg:flex-row">
            <ul className="flex flex-row space-x-2 lg:space-x-8 text-center text-black mb-4 lg:mb-0 mr-12">
              <li>
                <Link
                  to="/"
                  className="hidden lg:flex  hover:text-red-500 font-bold border-b-2 border-red-500 "
                  style={{ position: "relative", top: "-14px" }}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hidden lg:flex hover:text-red-500 font-bold border-b-2 border-red-500"
                  style={{ position: "relative", top: "4px", right: "30px" }}
                >
                  من نحن
                </Link>
              </li>
            </ul>

            <div className="logo-container flex justify-center mb-4 lg:mb-0">
              <img
                src={logo}
                alt="Logo"
                className={`${
                  isSticky
                    ? "h-8 w-8 "
                    : "h-24 w-40 md:h-24 md:w-24 lg:h-32 lg:w-32 lg:mt-10 "
                } transition-all duration-500 transform ${
                  isSticky ? "" : "rotate-[360deg]"
                }`}
              />
            </div>

            <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 text-center text-black">
              <li>
                <Link
                  to="/contact"
                  className="hidden lg:flex hover:text-red-500 font-bold border-b-2 border-red-500"
                  style={{ position: "relative", top: "4px", left: "30px" }}
                >
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  className="hidden lg:flex hover:text-red-500 font-bold border-b-2 border-red-500"
                >
                  انضم كمسعف
                </Link>
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
                className={`h-8 w-8 transition-all duration-500`}
              />
              <span className="text-lg transition-all duration-500 text-black font-semibold ml-4">
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

            {/* Nav links for large  */}
            <ul className="hidden md:flex space-x-8 text-center text-black">
              <li>
                <Link to="/" className="hover:text-red-500 font-bold ml-7">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 font-bold">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 font-bold">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-red-500 font-bold">
                  الانضمام كمسعف
                </Link>
              </li>
            </ul>

            <div className="hidden md:block">
              <button className="py-1 px-2 text-sm bg-red-700 text-white font-semibold rounded-full transition-all duration-300 shadow-md">
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4 text-black">
            <li>
              <Link to="/" className="hover:text-red-500 font-bold">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-500 font-bold">
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red-500 font-bold">
                تواصل معنا
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-red-500 font-bold">
                الانضمام كمسعف
              </Link>
            </li>
            <li>
              <button className="py-1 px-2 text-sm bg-red-700 text-white font-semibold rounded-full transition-all duration-300 shadow-md">
                تسجيل الدخول
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
