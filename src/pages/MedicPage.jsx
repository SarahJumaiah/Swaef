import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MedicMap from '../components/MedicPage/MedicMap'; 
import CaseDetails from '../components/MedicPage/CaseDetails'; // استيراد مكون تفاصيل الحالة
import logo from '../assets/logo.png'; 

const MedicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("حالة المريض");
  const [cases, setCases] = useState([]); // لتخزين الحالات
  const [isAccepted, setIsAccepted] = useState(false); // حالة قبول الحالة
  const [acceptedCase, setAcceptedCase] = useState(null); // الحالة المقبولة
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setSelectedSection("تسجيل خروج");
    navigate('/');
  };

  // جلب جميع الحالات بشكل دوري كل 10 ثوانٍ
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('https://67073bf9a0e04071d2298046.mockapi.io/users');
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    // جلب الحالات لأول مرة
    fetchCases();

    // جلب الحالات بشكل دوري كل 10 ثوانٍ
    const intervalId = setInterval(fetchCases, 10000);

    // إيقاف التحديث الدوري عند تدمير المكون
    return () => clearInterval(intervalId);
  }, []);

  // قبول الحالة
  const handleCaseAccept = async (caseItem) => {
    try {
      const updatedCase = { ...caseItem, is_accepted: true, status: 'تم قبول الحالة', assigned_responder: 'المسعف' };
      
      await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`, updatedCase);

      setAcceptedCase(updatedCase); // تحديد الحالة المقبولة
      setIsAccepted(true); // تعيين حالة القبول
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === caseItem.id ? updatedCase : c
        )
      ); // تحديث الحالات في الواجهة لعرض رقم الجوال بعد القبول
    } catch (error) {
      console.error("Error accepting case:", error);
    }
  };

  // رفض الحالة
  const handleCaseReject = async (caseItem) => {
    try {
      await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`, {
        status: 'تم رفض الحالة',
        assigned_responder: null, 
      });

      // إزالة الحالة المرفوضة من القائمة
      setCases((prevCases) => prevCases.filter(c => c.id !== caseItem.id));
    } catch (error) {
      console.error("Error rejecting case:", error);
    }
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

      {/* Main */}
      <main className="w-full lg:w-3/4 h-full p-6">
        <div className="flex flex-wrap justify-between space-y-6 lg:space-y-0">
          {/* عرض الحالات في كروت */} 
          {cases.length > 0 ? (
            cases.map((caseItem) => (
              <div key={caseItem.case_id} className="w-full lg:w-[48%] p-4 border-b border-gray-300 mb-4 rounded-lg bg-white shadow-lg">
                <h3 className="font-bold text-lg">نوع الحالة: {caseItem.case_type}</h3>
                <p className="text-sm">المريض: {caseItem.patient.name}</p>
                {caseItem.is_accepted && (
                  <p className="text-sm">الهاتف: {caseItem.patient.phone}</p>
                )}
                <p className="text-sm">الحالة: {caseItem.status}</p>
                <div className="flex space-x-2 mt-2">
                  {!caseItem.is_accepted && (
                    <>
                      <button 
                        onClick={() => handleCaseAccept(caseItem)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        قبول
                      </button>
                      <button 
                        onClick={() => handleCaseReject(caseItem)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        رفض
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>لا توجد حالات.</p>
          )}

          {/* مكون الخريطة وتفاصيل الحالة */}
          {selectedSection === "معلومات الموقع" && isAccepted && acceptedCase && (
            <div className="lg:w-full p-6 rounded-lg my-auto">
              <MedicMap />
              <CaseDetails caseInfo={acceptedCase} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicPage;
