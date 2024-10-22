import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import MedicMap from '../components/MedicPage/MedicMap';
import CaseDetails from '../components/MedicPage/CaseDetails';
import logo from '../assets/logo.png';

const MedicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("حالة المريض");
  const navigate = useNavigate(); 

  const [caseInfo, setCaseInfo] = useState({
    patient: { name: 'صالح', phone: '9665527572' },
    case_type: 'ارتفاع في السكر',
    location: { address: 'العنوان غير متاح', latitude: 24.82549285000001, longitude: 46.66156005000012 },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setSelectedSection("تسجيل خروج");
    navigate('/'); 
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-full bg-gray-100" dir="rtl">
      
      {/* Sidebar */}
      <button
        className="absolute top-4 left-4 lg:hidden bg-[#892222] text-white px-4 py-2 rounded"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`fixed top-0 right-0 min-h-screen w-1/2 bg-[#f9f9f9] text-[#ab1c1c] p-6 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} transition-transform lg:relative lg:w-1/4 lg:translate-x-0 z-50 shadow-xl`}
      >
        <div className="mb-8 text-center">
          <img src={logo} alt="Logo" className="w-16" />
        </div>
        <nav>
          <ul className="space-y-6">
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${selectedSection === "حالة المريض" ? "text-[#ab1c1c]" : "text-[#333333]"} hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("حالة المريض")}
            >
              حالة المريض
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${selectedSection === "حالة المريض" ? "opacity-100" : "opacity-0"}`}
              />
            </li>
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${selectedSection === "معلومات الموقع" ? "text-[#ab1c1c]" : "text-[#333333]"} hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("معلومات الموقع")}
            >
              معلومات الموقع
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${selectedSection === "معلومات الموقع" ? "opacity-100" : "opacity-0"}`}
              />
            </li>
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${selectedSection === "تسجيل خروج" ? "text-[#ab1c1c]" : "text-[#333333]"} hover:text-[#ab1c1c]`}
              onClick={handleLogout} 
            >
              تسجيل خروج
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${selectedSection === "تسجيل خروج" ? "opacity-100" : "opacity-0"}`}
              />
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main  */}
      <main className="w-full lg:w-3/4 h-full p-6">
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-6 h-full">
          <div className="lg:w-1/2 p-6 rounded-lg my-auto">
            <CaseDetails caseInfo={caseInfo} />
          </div>

          <div className="lg:w-1/2 p-6 rounded-lg my-auto">
            <MedicMap caseLocation={[caseInfo.location.longitude, caseInfo.location.latitude]} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicPage;
