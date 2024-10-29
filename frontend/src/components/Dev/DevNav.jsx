import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const DevNav = ({ scrollToProducts }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const pageTitle = location.pathname === "/docs" ? "مستندات سواعف" : "بوابة المطورين";

  return (
    <nav className="bg-[#1f1f1f] text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 px-4 md:px-14">
      <div className="flex items-center lg:flex-none">
        <img src={logo} alt="Logo" className="w-12 h-12 mr-2 " />
        <span className="text-lg md:text-2xl font-bold ml-8">{pageTitle}</span>
      </div>

      <div className="hidden lg:flex justify-center gap-8 mx-auto mr-72">
        <Link to="/dev" className="hover:text-red-500">
          الرئيسية
        </Link>
        <Link to="/docs" className="hover:text-red-500">
          المستندات
        </Link>
      </div>

      <div className="hidden lg:block">
        <Link
          to="/"
          className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
        >
          العودة
        </Link>
      </div>

      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-3xl text-white focus:outline-none">
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#1f1f1f] text-white shadow-lg lg:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link to="/dev" onClick={toggleMenu} className="hover:text-red-500">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/docs" onClick={toggleMenu} className="hover:text-red-500">
                المستندات
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
              >
                العودة
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default DevNav;
