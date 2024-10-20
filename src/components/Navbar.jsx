import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg w-[97%] mr-5 ml-5 rounded-b-xl p-4 flex items-center fixed top-0 z-50">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 mr-4" />
        <span className="text-xl text-white mr-2 font-semibold">سواعف</span>
      </div>
      <ul className="flex space-x-4 items-center text-right list-none mx-auto">
        <li className="text-white hover:text-[#0a7d77] font-bold cursor-pointer ml-4">
          الرئيسية
        </li>
        <li className="text-white hover:text-[#0a7d77] font-bold cursor-pointer">من نحن </li>
        <li className="text-white hover:text-[#0a7d77] font-bold cursor-pointer">تواصل معنا</li>
        <li className="text-white hover:text-[#0a7d77] font-bold cursor-pointer">
          الانضمام كمسعف
        </li>
      </ul>

      <div>
        <button className="bg-[#0a7d77] text-white font-semibold py-2 px-4 rounded-lg">
          تسجيل الدخول
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
