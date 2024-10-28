import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const DevNav = ({ scrollToProducts }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-[#1f1f1f] text-white p-4 flex items-center justify-between">
      <div className="flex-1 text-right flex items-center justify-start">
        <img src={logo} alt="Logo" className="w-12 h-12 inline-block" />
        <span className="text-2xl font-bold ml-3">بوابة المطورين</span>
      </div>

      <div className="flex-1 hidden lg:flex justify-center gap-8">
        <button
          onClick={scrollToProducts}
          className="hover:text-red-500 focus:outline-none"
        >
          المنتجات
        </button>
        <Link to="/docs" className="hover:text-red-500">
          المستندات
        </Link>
      </div>

      <div className="flex-1 text-left">
        <Link
          to="/Dev"
          className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-6 rounded-full hover:bg-red-700 transition"
        >
          انضم لنا
        </Link>
      </div>

      {/* phone nav */}
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-3xl text-white focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white shadow-lg lg:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
            </li>
            <li>
              <button
                onClick={() => {
                  scrollToProducts();
                  toggleMenu();
                }}
                className="hover:text-red-500 focus:outline-none"
              >
                المنتجات
              </button>
            </li>
            <li>
              <Link
                to="/dev"
                onClick={toggleMenu}
                className="hover:text-red-500"
              >
                التوثيق
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default DevNav;
