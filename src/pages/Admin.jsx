import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import logo from '../assets/logo.png'

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState("الملخص");
  const [selectedParamedic, setSelectedParamedic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fake data
  const paramedics = [
    {
      id: 1,
      name: "أحمد علي",
      license: "L12345",
      experience: "5 سنوات",
      status: "في الانتظار",
    },
    {
      id: 2,
      name: "سارة خالد",
      license: "L98765",
      experience: "3 سنوات",
      status: "مقبول",
    },
    {
      id: 3,
      name: "ماجد فهد",
      license: "L56478",
      experience: "7 سنوات",
      status: "في الانتظار",
    },
    {
      id: 4,
      name: "ريما محمد",
      license: "L87654",
      experience: "4 سنوات",
      status: "مقبول",
    },
  ];

  const totalParamedics = paramedics.length;
  const acceptedParamedics = paramedics.filter(
    (p) => p.status === "مقبول"
  ).length;
  const pendingParamedics = paramedics.filter(
    (p) => p.status === "في الانتظار"
  ).length;

  const donutData = {
    labels: ["المسعفين المقبولين", "المسعفين في الانتظار"],
    datasets: [
      {
        data: [acceptedParamedics, pendingParamedics], // Data for donut
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
      confirmButtonColor: "#892222",
      cancelButtonColor: "#CACACA",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "تم القبول",
          icon: "success",
          confirmButtonColor: "#892222",
        });
        console.log("تم قبول المسعف", id);
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "هل تريد رفض هذا المسعف؟",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
      icon: "warning",
      confirmButtonColor: "#892222",
      cancelButtonColor: "#CACACA",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "تم الرفض",
          icon: "error",
          confirmButtonColor: "#892222",
        });
        console.log("تم رفض المسعف", id);
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
      <div className="p-6 rounded-lg text-center bg-[#be828233] border-4 border-[#892222]">
        <h3 className="text-lg font-extrabold text-[#892222]">
          إجمالي المسعفين
        </h3>
        <p className="text-4xl font-bold text-[#892222]">{totalParamedics}</p>
      </div>
      <div className="p-6 rounded-lg text-center bg-[#be828233] border-4 border-[#892222]">
        <h3 className="text-lg font-extrabold text-[#892222]">
          المسعفين المقبولين
        </h3>
        <p className="text-4xl font-bold text-[#892222]">
          {acceptedParamedics}
        </p>
      </div>
      <div className="p-6 rounded-lg text-center bg-[#be828233] border-4 border-[#892222]">
        <h3 className="text-lg font-extrabold text-[#892222]">
          المسعفين في الانتظار
        </h3>
        <p className="text-4xl font-bold text-[#892222]">{pendingParamedics}</p>
      </div>
    </div>
  );

  const renderParamedicsList = () => (
    <section className="bg-gray-100 p-6 lg:p-10 h-[50vh]">
      <h2 className="text-2xl font-semibold text-[#ab1c1c] mb-4">
        طلبات المسعفين
      </h2>
      <ul>
        {paramedics.map((paramedic) => (
          <li
            key={paramedic.id}
            className="p-4 mb-4 bg-[#be828233] border-2 border-[#892222] rounded-lg flex flex-col lg:flex-row justify-between items-start lg:items-center"
          >
            <div className="mb-4 lg:mb-0">
              <p>
                <strong>الاسم:</strong> {paramedic.name}
              </p>
              <p>
                <strong>الحالة:</strong> {paramedic.status}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleOpenModal(paramedic)}
                className="bg-[#892222] text-white px-4 py-2 rounded"
              >
                التفاصيل
              </button>
              <button
                onClick={() => handleAccept(paramedic.id)}
                className="bg-[#892222] text-white px-4 py-2 rounded"
              >
                قبول
              </button>
              <button
                onClick={() => handleReject(paramedic.id)}
                className="bg-[#892222] text-white px-4 py-2 rounded"
              >
                رفض
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
          <h2 className="text-2xl font-semibold text-[#ab1c1c] mb-4">
            تفاصيل المسعف
          </h2>
          <p>
            <strong>الاسم:</strong> {selectedParamedic.name}
          </p>
          <p>
            <strong>الترخيص:</strong> {selectedParamedic.license}
          </p>
          <p>
            <strong>الخبرة:</strong> {selectedParamedic.experience}
          </p>
          <button
            onClick={handleCloseModal}
            className="bg-[#892222] text-white px-4 py-2 rounded mt-4 "
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
              <h1 className="text-3xl font-bold text-[#ab1c1c]">الملخص</h1>
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
              <h1 className="text-3xl font-bold text-[#ab1c1c]">المسعفين</h1>
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
        className="absolute top-4 left-4 lg:hidden bg-[#892222] text-white px-4 py-2 rounded"
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
          selectedSection === "الملخص" ? "text-[#ab1c1c]" : "text-[#333333]"
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
          selectedSection === "المسعفين" ? "text-[#ab1c1c]" : "text-[#333333]"
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
          selectedSection === "تسجيل خروج" ? "text-[#ab1c1c]" : "text-[#333333]"
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




<main className="w-full lg:w-3/4 p-4 sm:p-10 h-screen">{renderContent()}</main>
    </div>
  );
};

export default Admin;
