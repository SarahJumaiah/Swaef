import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaLightbulb } from "react-icons/fa";
import logo from "../assets/logo.png";
import ScrollReveal from "scrollreveal";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./MedicPage.css";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const calculateDistance = (lat1, lon1, lat2, lon2) => {

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const MedicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("حالة المريض");
  const [cases, setCases] = useState([]);
  const [medicLocation, setMedicLocation] = useState(null);
  const navigate = useNavigate();
  const driverRef = useRef(null);
  const [medicName, setMedicName] = useState("");
  const [savedCases, setSavedCases] = useState(0);
  const [rejectedCases, setRejectedCases] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedMedicName = localStorage.getItem("medicName");
    if (storedMedicName) {
      setMedicName(storedMedicName);
    }
  }, []);

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

    driverRef.current = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      allowClose: false,
      nextBtnText: "التالي",
      prevBtnText: "السابق",
      doneBtnText: "إنهاء",
      showButtons: ["next", "previous", "close"],
      steps: [
        {
          element: "#tour-example11",
          popover: {
            title: "الطلبات",
            description: "هنا يمكنك استعراض طلبات الاستغاثه",
            side: "left",
            align: "start",
          },
          onHighlightStarted: () => setIsSidebarOpen(true),
          onDeselected: () => setIsSidebarOpen(false),
        },
        {
          element: "#tour-example1",
          popover: {
            title: "الطلب",
            description: "طلب الاستغاثه وتفاصيله",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-example3",
          popover: {
            title: "تفاصيل الحالة",
            description: "هنا تظهر تفاصيل الحالة ورقم الهاتف عند القبول",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#notifications",
          popover: {
            title: "المسافة",
            description: "هنا يظهر بعد المسافة بين المسعف والمريض",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-example2",
          popover: {
            title: "القبول والرفض",
            description:
              "هنا يمكنك قبول او رفض الحالة, علما ب أن لايمكنك قبول حالة بينما يوجد حالة قيد التنفيذ",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-example4",
          popover: {
            title: "الاحصائيات",
            description: "هنا يمكنك رؤية احصائيات ادائك وساعاتك التطوعية",
            side: "right",
            align: "start",
          },
          onHighlightStarted: () => setIsSidebarOpen(true),
          onDeselected: () => setIsSidebarOpen(false),
        },
      ],
    });
  }, []);

  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.drive();
    } else {
      console.error("Driver.js instance not initialized.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    ScrollReveal().reveal(".headline", {
      duration: 1000,
      origin: "bottom",
      distance: "50px",
    });
  }, []);


  useEffect(() => {
    const fetchCases = async () => {
      try {
        // استدعاء الباك إند لجلب جميع الحالات
        const response = await axios.get(`${BASE_URL}/cases`);
        setCases(response.data);
        
        ///////// الاحصائيات//////////////
        const saved = response.data.filter(
          (c) => c.status === "تم إكمال الحالة"
        ).length;
        const rejected = response.data.filter(
          (c) => c.status === "تم رفض الحالة"
        ).length;
        setSavedCases(saved);
        setRejectedCases(rejected);
        setVolunteerHours(saved * 2); // حسبة من راسي
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };
  
    fetchCases();
    
    // تحديث قائمة الحالات كل 10 ثوانٍ
    const intervalId = setInterval(fetchCases, 1000);
    return () => clearInterval(intervalId);
  }, []);
  

// قبول الحالة
const handleCaseAccept = async (caseItem) => {
  Swal.fire({
    title: "هل تريد قبول هذه الحالة؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6c1111",
    cancelButtonColor: "#b02e2e",
    cancelButtonText: "إلغاء",
    confirmButtonText: "نعم، قبول",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const medicName = localStorage.getItem("medicName");
      const medicPhone = localStorage.getItem("medicPhone");

      const activeCase = cases.find((c) => c.is_accepted);
      if (activeCase) {
        Swal.fire({
          title: "لا يمكنك قبول حالة جديدة حتى تنهي الحالة الحالية.",
          icon: "error",
          confirmButtonColor: "#ab1c1c",
        });
        return;
      }

      const updatedCase = {
        ...caseItem,
        is_accepted: true,
        status: "تم قبول الحالة",
        assigned_responder: {
          name: medicName,
          phone: medicPhone,
        },
      };

      try {
        await axios.put(`${BASE_URL}/cases/${caseItem._id}`, updatedCase);
        setCases((prevCases) =>
          prevCases.map((c) => (c._id === caseItem._id ? updatedCase : c))
        );
        navigate(`/CaseDetailsPage/${caseItem._id}`);
      } catch (error) {
        console.error("Error accepting case:", error.response?.data || error.message);
      }
    }
  });
};


// رفض الحالة
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
      await axios.put(`${BASE_URL}/cases/${caseItem.id}`, {
        status: "تم رفض الحالة",
        assigned_responder: null,
      });
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
  if (!caseItem || !caseItem._id) { // استخدم _id بدلاً من id
    console.error("Case ID is undefined or caseItem is invalid.");
    return;
  }

  try {
    const updatedCase = {
      ...caseItem,
      status: "تم إكمال الحالة",
      is_accepted: false,
    };

    // تحديث الحالة في الـ API باستخدام _id
    await axios.put(`${BASE_URL}/cases/${caseItem._id}`, updatedCase);

    // إزالة الحالة المكتملة من القائمة المحلية
    setCases((prevCases) => prevCases.filter((c) => c._id !== caseItem._id));

    Swal.fire({
      title: "تم إكمال الحالة بنجاح!",
      icon: "success",
      confirmButtonText: "موافق",
    });
  } catch (error) {
    console.error("Error completing case:", error.response?.data || error.message);
    Swal.fire({
      title: "حدث خطأ!",
      text: "تعذر إكمال الحالة. يرجى المحاولة لاحقاً.",
      icon: "error",
      confirmButtonText: "موافق",
    });
  }
};



  const renderContent = () => {
    switch (selectedSection) {
      case "حالة المريض": {
        return (
          <main className="w-full lg:w-3/4 p-4 sm:p-10 h-auto min-h-screen bg-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-[#ab1c1c]">
                الحالات المتاحة
              </h2>
              <button
                onClick={startTour}
                className="text-[#b02e2e] p-2 hover:text-[#c43a3a] transition flex justify-center items-center ml-[38%] sm:ml-0"
              >
                <FaLightbulb size={30} />
              </button>
            </div>

            {cases.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                id="tour-example"
              >
                {cases
                  .filter((caseItem) => caseItem.status !== "تم إكمال الحالة")
                  .sort((a, b) => b.case_id - a.case_id)
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
                        id="tour-example1"
                        key={caseItem.case_id}
                        className="bg-white p-6 rounded-lg border border-[#d8c1c1cc] shadow-md transition duration-300 ease-in-out transform hover:scale-105 relative flex flex-col flex-grow headline"
                      >
                        {distance !== null && (
                          <p
                            className={`absolute top-2 left-2 text-sm font-semibold ${
                              distance === 0
                                ? "text-green-500"
                                : "text-blue-500"
                            }`}
                            id="notifications"
                          >
                            {distance === 0
                              ? "قريب جدًا"
                              : `${distance.toFixed(2)} كم`}
                          </p>
                        )}

                        <div className="flex justify-between items-start">
                          <h3
                            className="font-bold text-lg text-gray-800"
                            id="case-details"
                          >
                            نوع الحالة: {caseItem.case_type}
                          </h3>
                        </div>
                        <div className="mb-4 flex-grow" id="tour-example3">
                          <p className="text-sm text-gray-600">
                            المريض: {caseItem.patient.name}
                          </p>
                          <p className="text-sm">الحالة: {caseItem.status}</p>
                          {caseItem.is_accepted && (
                            <p className="text-sm text-gray-600">
                              الهاتف: {caseItem.patient.phone}
                            </p>
                          )}
                        </div>

                        <div
                          className="flex justify-between gap-3"
                          id="tour-example2"
                        >
                          {!caseItem.is_accepted && (
                            <>
                              <button
                                id="accept-case-button"
                                onClick={() => handleCaseAccept(caseItem)}
                                className="bg-[#ffffffb9] border-2 border-[#cccc] text-black font-medium w-1/2 py-2 rounded-full hover:bg-[#f1f0f0b9] transition flex justify-center items-center"
                              >
                                <FaCheckCircle className="text-green-500 text-xl" />
                              </button>
                              <button
                                onClick={() => handleCaseReject(caseItem)}
                                className="bg-[#b02e2e] text-white w-1/2 py-2 rounded-full hover:bg-[#c43a3a] transition flex justify-center items-center"
                              >
                                <FaTimesCircle className="text-white text-xl" />
                              </button>
                            </>
                          )}
                          {caseItem.is_accepted && (
                            <button
                              onClick={() => handleCaseComplete(caseItem)}
                              className="bg-[#ffffffb9] text-black font-medium border border-gray-400 w-full py-2 rounded-full transition"
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
      }
      case "الاحصائيات": {
        const data = {
          labels: ["تم إنقاذها", "تم رفضها", "ساعات التطوع"],
          datasets: [
            {
              label: "إحصائيات المسعف",
              data: [savedCases, rejectedCases, volunteerHours],
              backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
              hoverOffset: 4,
            },
          ],
        };

        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "إحصائيات المسعف",
            },
          },
          cutout: "60%",
        };

        return (
          <main className="w-full lg:w-3/4 p-4 sm:p-10 h-auto min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold text-[#ab1c1c] mb-6">
              الاحصائيات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-[#d8c1c1cc] shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  الحالات التي تم إنقاذها
                </h3>
                <p className="text-2xl font-bold text-green-500">{savedCases}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-[#d8c1c1cc] shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  الحالات التي تم رفضها
                </h3>
                <p className="text-2xl font-bold text-red-500">{rejectedCases}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-[#d8c1c1cc] shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ساعات التطوع
                </h3>
                <p className="text-2xl font-bold text-blue-500">{volunteerHours}</p>
              </div>
            </div>

            <div className="mt-8 mb-8" style={{ height: "400px" }}>
              <Doughnut data={data} options={options} />
            </div>
          </main>
        );
      }
      case "تسجيل خروج": {
        handleLogout();
        return null;
      }
      default:
        return null;
    }
  };

  return (
    <div
      className="relative flex flex-col lg:flex-row h-full bg-gray-100"
      dir="rtl"
    >
      <button
        className="absolute top-4 left-4 lg:hidden bg-[#892222] text-white px-4 py-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`fixed top-0 right-0 min-h-screen w-1/2 bg-[#f9f9f9] text-[#ab1c1c] p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform lg:relative lg:w-1/4 lg:translate-x-0 z-50 shadow-xl`}
      >
        <div className="mb-8 flex items-center justify-center lg:justify-start">
          <img src={logo} alt="Logo" className="w-16 ml-1" />
          {medicName && (
            <div
              className="text-lg font-bold text-[#ab1c1c] ml-4"
              id="tour-example22"
            >
              مرحبًا بالمسعف، {medicName}
            </div>
          )}
        </div>
        <nav>
          <ul className="space-y-6">
            <li
              id="tour-example11"
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "حالة المريض"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("حالة المريض")}
            >
              طلبات الاستغاثه
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "حالة المريض"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </li>
            <li
              id="tour-example4"
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
