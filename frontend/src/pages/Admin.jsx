import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Doughnut } from "react-chartjs-2";
import ScrollReveal from 'scrollreveal';
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"; 
import logo from "../assets/logo.png";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState("الملخص");
  const [selectedParamedic, setSelectedParamedic] = useState(null);
  const [paramedics, setParamedics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    axios
      .get("https://6717e676b910c6a6e02a7fd0.mockapi.io/log")
      .then((response) => {
        setParamedics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching paramedics:", error);
      });
  }, []);

  const totalParamedics = paramedics.length;
  const acceptedParamedics = paramedics.filter(
    (p) => p.isApproved === true
  ).length;
  const pendingParamedics = paramedics.filter(
    (p) => p.isApproved === false
  ).length;

  const donutData = {
    labels: ["المسعفين المقبولين", "المسعفين في الانتظار"],
    datasets: [
      {
        data: [acceptedParamedics, pendingParamedics],
        backgroundColor: ["#6c1111", "#910210"],
        borderColor: ["#fff"],
        borderWidth: 2,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "حالة المسعفين",
      },
    },
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleAccept = (id) => {
    Swal.fire({
      title: "هل تريد قبول هذا المسعف؟",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
      icon: "question",
      confirmButtonColor: "#28a745", 
      cancelButtonColor: "#CACACA",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`https://6717e676b910c6a6e02a7fd0.mockapi.io/log/${id}`, {
            isApproved: true,
          })
          .then(() => {
            setParamedics((prev) =>
              prev.map((paramedic) =>
                paramedic.id === id
                  ? { ...paramedic, isApproved: true }
                  : paramedic
              )
            );
            Swal.fire({
              title: "تم القبول",
              icon: "success",
              confirmButtonColor: "#28a745", 
            });
          })
          .catch((error) => {
            console.error("Error approving paramedic:", error);
          });
      }
    });
  };

  useEffect(() => {
    ScrollReveal().reveal('.headline', {
      duration: 1000, 
      origin: 'bottom',
      distance: '50px',
    });
  }, []);

  const handleReject = (id) => {
    Swal.fire({
      title: "هل تريد رفض هذا المسعف؟",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
      icon: "warning",
      confirmButtonColor: "#dc3545", 
      cancelButtonColor: "#CACACA",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://6717e676b910c6a6e02a7fd0.mockapi.io/log/${id}`)
          .then(() => {
            setParamedics((prev) =>
              prev.filter((paramedic) => paramedic.id !== id)
            );
            Swal.fire({
              title: "تم الرفض",
              icon: "error",
              confirmButtonColor: "#dc3545",
            });
          })
          .catch((error) => {
            console.error("Error rejecting paramedic:", error);
          });
      }
    });
  };

  const handleOpenModal = (paramedic) => {
    setSelectedParamedic(paramedic);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParamedic(null);
  };

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="p-6 rounded-lg text-center bg-white shadow-md border border-gray-300 transition duration-300 ease-in-out hover:scale-105">
        <h3 className="text-lg font-bold text-[#892222]">إجمالي المسعفين</h3>
        <p className="text-4xl font-bold text-[#892222]">{totalParamedics}</p>
      </div>
      <div className="p-6 rounded-lg text-center bg-white shadow-md border border-gray-300 transition duration-300 ease-in-out hover:scale-105">
        <h3 className="text-lg font-bold text-[#892222]">المسعفين المقبولين</h3>
        <p className="text-4xl font-bold text-[#892222]">
          {acceptedParamedics}
        </p>
      </div>
      <div className="p-6 rounded-lg text-center bg-white shadow-md border border-gray-300 transition duration-300 ease-in-out hover:scale-105">
        <h3 className="text-lg font-bold text-[#892222]">
          المسعفين في الانتظار
        </h3>
        <p className="text-4xl font-bold text-[#892222]">{pendingParamedics}</p>
      </div>
    </div>
  );

  const renderParamedicsList = () => (
    <section className="bg-gray-100 p-6 lg:p-10 h-[70vh] ">
      <h2 className="text-2xl font-semibold text-[#892222] mb-4">
        طلبات المسعفين
      </h2>
      <ul className="flex flex-col-reverse">
        {paramedics.map((paramedic) => (
          <li
            key={paramedic.id}
            className="p-6 mb-4 bg-white shadow-md border border-gray-300 rounded-lg transition duration-300 ease-in-out hover:scale-105 flex flex-col lg:flex-row justify-between items-start lg:items-center headline"
          >
            <div className="mb-4 lg:mb-0">
              <p>
                <strong>الاسم:</strong> {paramedic.name}
              </p>
              <p>
                <strong>الحالة:</strong>{" "}
                {paramedic.isApproved ? "مقبول" : "في الانتظار"}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleOpenModal(paramedic)}
                className="bg-[#ffffffb9] border-2 border-[#cccc] text-black font-medium px-4 py-2 rounded-full hover:bg-[#f1f0f0b9] transition flex justify-center items-center"
              >
               <FaInfoCircle /> <span className="mr-2">التفاصيل</span> 
              </button>
              {!paramedic.isApproved && (
                <button
                  onClick={() => handleAccept(paramedic.id)}
                  className="bg-[#ffffffb9] border-2 border-[#cccc] text-black font-medium w-[7vw] py-2 rounded-full hover:bg-[#f1f0f0b9] transition flex justify-center items-center"
                >
                  <FaCheckCircle className="text-green-500 text-xl" />
                </button>
              )}
              <button
                onClick={() => handleReject(paramedic.id)}
                className="bg-[#b02e2e] text-white py-2 rounded-full hover:bg-[#c43a3a] transition w-[7vw] flex justify-center items-center"
              >
                <FaTimesCircle className="text-white text-xl" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  const renderParamedicModal = () => {
    if (!showModal || !selectedParamedic) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/3 z-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            تفاصيل المسعف
          </h2>
          <p>
            <strong>الاسم:</strong> {selectedParamedic.name}
          </p>
          <p>
            <strong>الايميل الشخصي:</strong> {selectedParamedic.email}
          </p>
          <p>
            <strong>رقم الجوال:</strong>{" "}
            {selectedParamedic.phone || "غير متوفر"}
          </p>
          <button
            onClick={handleCloseModal}
            className="bg-[#892222] text-white px-4 py-2 rounded-lg mt-4"
          >
            إغلاق
          </button>
        </div>
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={handleCloseModal}
        ></div>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "الملخص":
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[#892222]">الملخص</h1>
            </header>
            {renderSummaryCards()}
            <section className="bg-gray-100 p-6 overflow-hidden">
              <div
                style={{ width: "340px", height: "310px", margin: "0 auto" }}
              >
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </section>
          </>
        );
      case "المسعفين":
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[#892222]">المسعفين</h1>
            </header>
            {renderParamedicsList()}
            {renderParamedicModal()}
          </>
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
      className="relative flex flex-col lg:flex-row h-auto min-h-screen bg-gray-100"
      dir="rtl"
    >
      <button
        className="absolute top-4 left-4 lg:hidden bg-[#892222] text-white px-4 py-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}{" "}
      </button>

      <aside
        className={`fixed top-0 right-0 h-screen w-1/2 bg-[#f9f9f9] border shadow-xl text-[#ab1c1c] p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform lg:relative lg:translate-x-0 lg:w-1/4 z-50`}
      >
        <div className="mb-8 text-center">
          <img src={logo} alt="" className="w-16" />
        </div>
        <nav>
          <ul className="space-y-6">
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "الملخص"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("الملخص")}
            >
              الملخص
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "الملخص" ? "opacity-100" : "opacity-0"
                }`}
              />
            </li>
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "المسعفين"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={() => setSelectedSection("المسعفين")}
            >
              المسعفين
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "المسعفين" ? "opacity-100" : "opacity-0"
                }`}
              />
            </li>
            <li
              className={`font-bold text-xl cursor-pointer relative p-3 transition duration-200 ease-in-out ${
                selectedSection === "تسجيل خروج"
                  ? "text-[#ab1c1c]"
                  : "text-[#333333]"
              } hover:text-[#ab1c1c]`}
              onClick={handleLogout}
            >
              تسجيل خروج
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#ab1c1c] transition-all duration-200 ease-in-out ${
                  selectedSection === "تسجيل خروج" ? "opacity-100" : "opacity-0"
                }`}
              />
            </li>
          </ul>
        </nav>
      </aside>

      <main className="w-full lg:w-3/4 p-4 sm:p-10 h-screen overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
