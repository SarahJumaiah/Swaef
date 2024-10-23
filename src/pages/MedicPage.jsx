import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";

// دالة لحساب المسافة باستخدام صيغة Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // نصف قطر الأرض بالكيلومترات
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lat2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // المسافة بالكيلومترات

  return distance;
};

const MedicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("حالة المريض");
  const [cases, setCases] = useState([]);
  const [medicLocation, setMedicLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMedicLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          "https://67073bf9a0e04071d2298046.mockapi.io/users"
        );
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchCases();
    const intervalId = setInterval(fetchCases, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCaseAccept = async (caseItem) => {
    const activeCase = cases.find((c) => c.is_accepted);
    if (activeCase) {
      Swal.fire({
        title: "خطأ!",
        text: "لا يمكنك قبول حالة جديدة حتى تنهي الحالة الحالية.",
        icon: "error",
        confirmButtonText: "موافق",
        confirmButtonColor: "#892222",
      });
      return;
    }

    Swal.fire({
      title: "هل تريد قبول هذه الحالة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c1111",
      cancelButtonColor: "#b02e2e",
      confirmButtonText: "نعم، قبول",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedCase = {
          ...caseItem,
          is_accepted: true,
          status: "تم قبول الحالة",
          assigned_responder: "المسعف",
        };
        await axios.put(
          `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`,
          updatedCase
        );
        setCases((prevCases) =>
          prevCases.map((c) => (c.id === caseItem.id ? updatedCase : c))
        );
        navigate(`/CaseDetailsPage/${caseItem.id}`);
        Swal.fire({
          title: "تم قبول الحالة!",
          icon: "success",
          confirmButtonColor: "#892222",
        });
      }
    });
  };

  const handleCaseReject = async (caseItem) => {
    Swal.fire({
      title: "هل تريد رفض هذه الحالة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c1111",
      cancelButtonColor: "#b02e2e",
      cancelButtonText: "إلغاء",
      confirmButtonText: "نعم، رفض",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(
          `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`,
          {
            status: "تم رفض الحالة",
            assigned_responder: null,
          }
        );
        setCases((prevCases) => prevCases.filter((c) => c.id !== caseItem.id));
        Swal.fire({
          title: "تم رفض الحالة!",
          icon: "success",
          confirmButtonColor: "#892222",
        });
      }
    });
  };

  const handleCaseComplete = async (caseItem) => {
    try {
      const updatedCase = {
        ...caseItem,
        status: "تم إكمال الحالة",
        is_accepted: false,
      };
      await axios.put(
        `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseItem.id}`,
        updatedCase
      );
      setCases((prevCases) => prevCases.filter((c) => c.id !== caseItem.id));
    } catch (error) {
      console.error("Error completing case:", error);
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "حالة المريض":
        return (
          <main className="w-full lg:w-3/4 p-4 sm:p-10 h-auto min-h-screen bg-gray-100">
            <h2 className="text-3xl font-semibold text-[#ab1c1c] mb-6">
              الحالات المتاحة
            </h2>
            {cases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases
                  .filter((caseItem) => caseItem.status !== "تم إكمال الحالة")
                  .map((caseItem) => {
                    const distance =
                      medicLocation &&
                      caseItem.location.latitude &&
                      caseItem.location.longitude
                        ? calculateDistance(
                            medicLocation[0],
                            medicLocation[1],
                            caseItem.location.latitude,
                            caseItem.location.longitude
                          )
                        : null;

                    return (
                      <div
                        key={caseItem.case_id}
                        className="p-6 rounded-lg bg-[#be828233] border-4 border-[#892222] transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          نوع الحالة: {caseItem.case_type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          المريض: {caseItem.patient.name}
                        </p>
                        {caseItem.is_accepted && (
                          <p className="text-sm text-gray-600">
                            الهاتف: {caseItem.patient.phone}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          الحالة: {caseItem.status}
                        </p>

                        {distance && (
                          <p className="text-sm text-gray-600">
                            المسافة: {distance.toFixed(2)} كم
                          </p>
                        )}

                        <div className="flex mt-4 gap-3">
                          {!caseItem.is_accepted && (
                            <>
                              <button
                                onClick={() => handleCaseAccept(caseItem)}
                                className="bg-[#6c1111] text-white px-4 py-2 rounded-lg hover:bg-[#8a1a1a] transition"
                              >
                                قبول
                              </button>
                              <button
                                onClick={() => handleCaseReject(caseItem)}
                                className="bg-[#b02e2e] text-white px-4 py-2 rounded-lg hover:bg-[#c43a3a] transition"
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
                  })}
              </div>
            ) : (
              <p className="text-center text-gray-500">لا توجد حالات حالياً.</p>
            )}
          </main>
        );
      case "الاحصائيات":
        return (
          <main className="w-full lg:w-3/4 p-4 sm:p-10 h-auto min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold text-[#ab1c1c] mb-6">
              الاحصائيات
            </h2>
          </main>
        );
      case "تسجيل خروج":
        handleLogout();
        return null;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative flex flex-col lg:flex-row h-full bg-gray-100"
      dir="rtl"
    >
      {/* Sidebar */}
      <button
        className="absolute top-4 left-4 lg:hidden bg-[#892222] text-white px-4 py-2 rounded"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`fixed top-0 right-0 min-h-screen w-1/2 bg-[#f9f9f9] text-[#ab1c1c] p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform lg:relative lg:w-1/4 lg:translate-x-0 z-50 shadow-xl`}
      >
        <div className="mb-8 text-center">
          <img src={logo} alt="Logo" className="w-16" />
        </div>
        <nav>
          <ul className="space-y-6">
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "حالة المريض"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("حالة المريض")}
            >
              حالة المريض
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "حالة المريض"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </li>
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "الاحصائيات"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("الاحصائيات")}
            >
              الاحصائيات
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "الاحصائيات" ? "opacity-100" : "opacity-0"
                }`}
              />
            </li>
            <li
              className="text-black font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out hover:text-[#ab1c1c]"
              onClick={handleLogout}
            >
              تسجيل خروج
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out"></span>
            </li>
          </ul>
        </nav>
      </aside>

      {renderContent()}
    </div>
  );
};

export default MedicPage;
