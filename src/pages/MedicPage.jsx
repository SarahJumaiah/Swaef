import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { Link } from 'react-router-dom';

// دالة لحساب المسافة باستخدام صيغة Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // نصف قطر الأرض بالكيلومترات
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // المسافة بالكيلومترات

  return distance;
};

const MedicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cases, setCases] = useState([]); // لتخزين الحالات
  const [medicLocation, setMedicLocation] = useState(null); // موقع المسعف
  const navigate = useNavigate();

  // تتبع موقع المسعف باستخدام Geolocation API
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMedicLocation([latitude, longitude]); // تحديث موقع المسعف
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
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

    return () => clearInterval(intervalId); // إيقاف التحديث الدوري عند تدمير المكون
  }, []);

  const handleCaseAccept = async (caseItem) => {
    // Check if there's any case already accepted
    const activeCase = cases.find((c) => c.is_accepted);
    if (activeCase) {
      alert('لا يمكنك قبول حالة جديدة حتى تنهي الحالة الحالية.');
      return;
    }
  
    // Accept the case
    const updatedCase = { ...caseItem, is_accepted: true, status: 'تم قبول الحالة', assigned_responder: 'المسعف' };
  
    await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`, updatedCase);
    setCases((prevCases) => prevCases.map((c) => (c.id === caseItem.id ? updatedCase : c)));
  
    // تأكد من تمرير `caseItem.id` بشكل صحيح هنا
    navigate(`/CaseDetailsPage/${caseItem.id}`);
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

  // إكمال الحالة
  const handleCaseComplete = async (caseItem) => {
    try {
      const updatedCase = { ...caseItem, status: 'تم إكمال الحالة', is_accepted: false };
  
      await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`, updatedCase);
  
      // إزالة الحالة المكتملة من القائمة
      setCases((prevCases) => prevCases.filter(c => c.id !== caseItem.id));
    } catch (error) {
      console.error("Error completing case:", error);
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
            <li className="font-bold text-xl cursor-pointer relative p-3">
              <Link to="/MedicPage" className="hover:text-[#ab1c1c]">حالة المريض</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="w-full lg:w-3/4 h-full p-6">
        {/* عرض الحالات في كروت */}
        {cases.length > 0 ? (
          cases
            .filter((caseItem) => caseItem.status !== 'تم إكمال الحالة') // لا تعرض الحالات المكتملة
            .map((caseItem) => {
              const distance = medicLocation && caseItem.location.latitude && caseItem.location.longitude
                ? calculateDistance(medicLocation[0], medicLocation[1], caseItem.location.latitude, caseItem.location.longitude)
                : null;

              return (
                <div
                  key={caseItem.case_id}
                  className={`w-full lg:w-[48%] p-4 mb-4 rounded-lg shadow-lg 
                    ${caseItem.case_type === 'كسور' ? 'bg-red-100 border-red-500' 
                    : caseItem.case_type === 'حروق' ? 'bg-orange-100 border-orange-500' 
                    : caseItem.case_type === 'اغماء' ? 'bg-blue-100 border-blue-500' 
                    : 'bg-green-100 border-green-500'} border-l-4 mb-3`}
                >
                  <h3 className="font-bold text-lg text-gray-800">نوع الحالة: {caseItem.case_type}</h3>
                  <p className="text-sm text-gray-600">المريض: {caseItem.patient.name}</p>
                  {caseItem.is_accepted && (
                    <p className="text-sm text-gray-600">الهاتف: {caseItem.patient.phone}</p>
                  )}
                  <p className="text-sm text-gray-600">الحالة: {caseItem.status}</p>
                  
                  {distance && (
                    <p className="text-sm text-gray-600">المسافة: {distance.toFixed(2)} كم</p>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {!caseItem.is_accepted && (
                      <>
                        <button 
                          onClick={() => handleCaseAccept(caseItem)}
                          className="bg-green-500 ml-3 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          قبول
                        </button>
                        <button 
                          onClick={() => handleCaseReject(caseItem)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          رفض
                        </button>
                      </>
                    )}
                    {caseItem.is_accepted && (
                      <button 
                        onClick={() => handleCaseComplete(caseItem)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        مكتمل
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <p className="text-center text-gray-500">لا توجد حالات حالياً.</p>
        )}
      </main>
    </div>
  );
};

export default MedicPage;
