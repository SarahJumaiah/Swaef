import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false); 
  };

  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg w-full md:w-[97%] md:mr-5 md:ml-5 rounded-b-xl p-4 flex items-center fixed top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 mr-4" />
          <span className="text-xl text-white mr-2 font-semibold">سواعف</span>
        </div>

        <button
          className="text-white md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-3xl`}></i>
        </button>

        <ul
          className={` md:flex md:space-x-4 items-center text-right list-none mx-auto space-y-4 md:space-y-0 md:static absolute left-0 w-full md:w-auto bg-[#02525] md:bg-transparent bg-opacity-90 md:translate-x-0 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:flex-row p-4 md:p-0`}
        >
          <li className="ml-4">
            <Link
              to="/"
              className="text-white  hover:text-[#0a7d77] font-bold"
              onClick={closeMenu} 
            >
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-white  hover:text-[#0a7d77] font-bold"
              onClick={closeMenu} 
            >
              من نحن
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-white  hover:text-[#0a7d77] font-bold"
              onClick={closeMenu}
            >
              تواصل معنا
            </Link>
          </li>
          <li>
            <Link
              to="/join"
              className="text-white  hover:text-[#0a7d77] font-bold"
              onClick={closeMenu} 
            >
              الانضمام كمسعف
            </Link>
          </li>
        </ul>

        <div className="hidden md:block">
          <button className="bg-[#0a7d77] text-white font-semibold py-2 px-4 rounded-lg">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
