import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import img1 from "../assets/rb_63409.png";
import img2 from "../assets/rb_63411.png";
import img3 from "../assets/rb.png";
import img4 from "../assets/paramedic.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { FaGithub, FaLinkedin } from "react-icons/fa";


const Home = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const whySwa3efRef = useRef(null);
  const joinRef = useRef(null);
  const vision = useRef(null);
  const contactRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [acceptedCase, setAcceptedCase] = useState(null);
  const [location, setLocation] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRating, setUserRating] = useState(0); // لحفظ التقييم الحالي
  const [hoverRating, setHoverRating] = useState(0); // لحفظ التقييم عند تمرير المؤشر فوق النجوم
  const [isSubmitted, setIsSubmitted] = useState(false); // لتحديد ما إذا كان التقييم قد أُرسل
  const [isModalOpen, setIsModalOpen] = useState(false); // لفتح أو إغلاق البوب آب

  // دالة لإغلاق البوب بعد 30 ثانية
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 15000); 

      return () => clearTimeout(timer); // تنظيف التايمر
    }
  }, [isSubmitted]);

  // عند الضغط على زر "إرسال التقييم"
  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false); // إعادة تعيين الحالة بعد ظهور الرسالة
    }, 3000); // رسالة الشكر تظهر لمدة 3 ثوانٍ
  };
  const statuses = ["كسور", "حروق", "اغماء", "اختناق"];

  // تحديد الموقع باستخدام المتصفح
  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location", error);
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "لم نتمكن من تحديد موقعك. تأكد من تفعيل خدمات الموقع.",
            confirmButtonText: "حسنًا",
            confirmButtonColor: "#ab1c1c",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "خدمات تحديد الموقع غير مدعومة في هذا المتصفح.",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#ab1c1c",
      });
    }
  };

  // تغيير حالة الحالة المختارة
  const handleStatusChange = (status) => {
    setFormData((prevData) => ({ ...prevData, status }));
  };

  // تغيير المدخلات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

// إرسال الحالة
const handleSend = async () => {
  if (!formData.name || !formData.phone || !formData.status) {
    setErrorMessage("يرجى ملء جميع الحقول المطلوبة.");
    return;
  }

  if (!location) {
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "يرجى تحديد موقعك أولاً.",
      confirmButtonText: "حسنًا",
      confirmButtonColor: "#ab1c1c",
    });
    return;
  }

  setLoading(true);
  setErrorMessage("");

  const newCase = {
    case_id: Date.now(),
    case_type: formData.status,
    location: location,
    assigned_responder: null,
    status: "الحالة معلقة حتى يتم قبولها",
    patient: {
      name: formData.name,
      phone: formData.phone,
    },
    is_accepted: false,
  };

  try {
    await axios.post(`${BASE_URL}/cases`, newCase);
    setIsOrderSent(true);

    const response = await axios.get(`${BASE_URL}/cases`);
    const lastCase = response.data[response.data.length - 1];
    setAcceptedCase(lastCase);
    if (lastCase.is_accepted) {
      setIsAccepted(true);
    }
  } catch (error) {
    console.error("Error sending case:", error);
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى لاحقًا.",
      confirmButtonText: "حسنًا",
      confirmButtonColor: "#ab1c1c",
    });
  } finally {
    setLoading(false);
  }
};


  // إزالة جلب الحالة بشكل دوري، والاعتماد على جلب البيانات مرة واحدة بعد الإرسال

// جلب الحالة بشكل دوري للتحقق من حالة القبول
useEffect(() => {
  const fetchCaseStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cases`);
      const lastCase = response.data[response.data.length - 1];
      setAcceptedCase(lastCase);
      if (lastCase.is_accepted) {
        setIsAccepted(true);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  if (isOrderSent) {
    const intervalId = setInterval(fetchCaseStatus, 5000);
    return () => clearInterval(intervalId);
  }
}, [isOrderSent]);


  const scrollToSection = (section) => {
    let sectionRef;
    switch (section) {
      case "about":
        sectionRef = aboutRef;
        break;
      case "whySwa3ef":
        sectionRef = whySwa3efRef;
        break;
      case "join":
        sectionRef = joinRef;
        break;
      case "visioj":
        sectionRef = vision;
        break;
      case "contact":
        sectionRef = contactRef;
        break;
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      default:
        sectionRef = null;
    }

    if (sectionRef && sectionRef.current) {
      const topOffset =
        sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slideIn");
        } else {
          entry.target.classList.remove("animate-slideIn");
        }
      });
    }, observerOptions);

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (whySwa3efRef.current) observer.observe(whySwa3efRef.current);
    if (joinRef.current) observer.observe(joinRef.current);
    if (vision.current) observer.observe(vision.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (whySwa3efRef.current) observer.unobserve(whySwa3efRef.current);
      if (joinRef.current) observer.unobserve(joinRef.current);
      if (vision.current) observer.observe(vision.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  return (
    <div>
      <header className="h-screen lg:h-[70vh] relative p-8 text-center bg-white text-gray-800 flex flex-col justify-center items-center overflow-hidden header">
        <div className="relative z-10 mx-auto">
          <h1 className="text-4xl mb-16 leading-tight drop-shadow-lg headertxt">
            نحن هنا لمساعدتك في حالات
            <span className="text-[#ab1c1c] font-extrabold"> الطوارئ</span>
            <br />
          </h1>
          <button
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              handleLocation(); // Get the location when the modal opens
            }}
            className="relative text-3xl p-3 mx-auto bg-red-600 text-white font-bold w-44 h-44 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none wave-button"
          >
            نداء استغاثه
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-10 rounded-lg max-w-md w-full relative shadow-lg z-[1010] m-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-xl text-gray-600 hover:text-[#ab1c1c]"
            >
              ✖
            </button>

            {/* {edit the pop fahd} */}
            {loading ? (
              <div className="flex flex-col justify-center items-center p-4 border-2 border-[#ab1c1c] rounded-lg w-full min-h-[246px]">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ab1c1c]"></div>
                </div>
                <p className="mt-4 text-lg text-gray-600 text-center">
                  نقوم الآن بمعالجة طلبك ...
                </p>
              </div>
            ) : !isOrderSent ? (
              <>
                <div className="mb-4 flex items-center border-b-2 border-[#ab1c1c]">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك"
                    className="p-2 w-full bg-transparent focus:outline-none"
                  />
                </div>
                <div className="mb-4 flex items-center border-b-2 gap-2 border-[#ab1c1c]">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="أدخل رقم هاتفك"
                    className="p-2 w-full bg-transparent focus:outline-none"
                  />
                  <span className="mr-2 text-[#ab1c1c]">966+</span>
                </div>

                <div className="mb-4">
                  <p className="block mb-1 text-right text-gray-500">
                    اختر الحالة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => handleStatusChange(statusOption)}
                        className={`flex-1 p-2 border rounded-full transition duration-300 ease-in-out ${
                          formData.status === statusOption
                            ? "bg-[#ab1c1c] text-white"
                            : "border-[#ab1c1c] text-[#ab1c1c] hover:bg-[#ab1c1c] hover:text-white"
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-[#ab1c1c] text-center mb-4">
                    {errorMessage}
                  </p>
                )}
                <button
                  onClick={handleSend}
                  className="py-2 px-4 w-full bg-[#ab1c1c] text-white font-bold rounded-full"
                >
                  إرسال
                </button>
              </>
            ) : (
              <div className="flex flex-col p-4 border-2 border-[#ab1c1c] rounded-lg w-full">
                <h3 className="text-xl font-bold mb-4 text-[#ab1c1c]">
                  ملخص الحالة:
                </h3>

{/* عرض نوع الحالة وصاحب البلاغ فقط إذا لم يتم قبول المسعف بعد */}
{!isAccepted && (
  <>
    <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md flex items-center">
      <i
        className={`text-xl text-[#ab1c1c] ml-3 ${
          acceptedCase?.case_type === "كسور"
            ? "fas fa-bone"
            : acceptedCase?.case_type === "حروق"
            ? "fas fa-fire"
            : acceptedCase?.case_type === "إغماء"
            ? "fas fa-dizzy"
            : acceptedCase?.case_type === "اختناق"
            ? "fas fa-wind"
            : "fas fa-info-circle"
        }`}
      ></i>{" "}
      <div>
        <p className="text-lg font-semibold text-gray-600">
          <strong>نوع الحالة:</strong> {acceptedCase?.case_type}
        </p>
      </div>
    </div>

    <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md flex items-center">
      <i className="fas fa-user text-xl text-[#ab1c1c] ml-3"></i>
      <div>
        <p className="text-lg font-semibold text-gray-600">
          <strong>صاحب البلاغ:</strong>{" "}
          {acceptedCase?.patient?.name}
        </p>
      </div>
    </div>

    <div className="p-4 bg-gray-100 rounded-lg shadow-md flex items-center">
      <i className="fas fa-phone-alt text-xl text-[#ab1c1c] ml-3"></i>
      <div>
        <p className="text-lg font-semibold text-gray-600">
          <strong>رقم الهاتف:</strong>{" "}
          {acceptedCase?.patient?.phone}
        </p>
      </div>
    </div>
  </>
)}

{/* معلومات المسعف تظهر فقط في حال القبول */}
{/* معلومات المسعف تظهر فقط في حال القبول وغير مكتملة */} 
{isAccepted && acceptedCase?.assigned_responder && acceptedCase?.status !== "تم إكمال الحالة" ? (
  <>
    {/* حالة القبول */}

    {/* معلومات المسعف */}
    <div className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center mb-4">
      <div className="text-center">
        <p className="text-lg text-[#ab1c1c] font-semibold">
          <i className="fas fa-user-md mr-2"></i> اسم المسعف
        </p>
        <p className="text-gray-800 font-medium">
          {acceptedCase.assigned_responder.name}
        </p>
      </div>
      <div className="text-center mt-3">
        <p className="text-lg text-[#ab1c1c] font-semibold">
          <i className="fas fa-phone-alt mr-2"></i> رقم الهاتف
        </p>
        <p className="text-gray-800 font-medium">
          {acceptedCase.assigned_responder.phone}
        </p>
      </div>
    </div>
    <p className="text-lg text-gray-600 text-center">
      <strong className="text-sm">حالة القبول:</strong>
      <br />
      "المسعف في الطريق اليك حالا!"
    </p>

    {/* الوقت المتوقع للوصول */}
    <div className="p-4 bg-red-50 rounded-lg shadow-md text-center">
      <p className="text-lg text-[#ab1c1c] font-bold">
        <i className="far fa-clock mr-2"></i> الوقت المتوقع للوصول:
      </p>
      <p className="text-gray-700 font-medium">حوالي دقيقة</p>
    </div>
  </>
) : acceptedCase?.status === "تم إكمال الحالة" ? (
  // التقييم
  <div className="text-center p-6 rounded-lg animate__animated animate__fadeIn">
    {/* أيقونة "صح" متحركة تشير إلى اكتمال الحالة */}
    <div className="flex justify-center items-center mb-4">
      <div className="bg-green-800 rounded-full p-4 px-5 animate__animated animate__bounceIn">
        <i className="fas fa-check text-white text-4xl"></i>
      </div>
    </div>

    {/* العبارة */}
    <h2 className="text-2xl font-bold text-gray-900 mb-2 animate__animated animate__fadeInUp">
      الحمدلله على السلامة!
    </h2>
    <p className="text-gray-600 mb-4 animate__animated animate__fadeInUp">
      يمكنك تقييم المسعف أدناه:
    </p>

    {/* نجوم التقييم */}
    <div className="flex justify-center mb-4 animate__animated animate__bounceIn">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`cursor-pointer text-3xl transition-transform duration-200 ${
            star <= (hoverRating || userRating)
              ? "fas fa-star text-yellow-500 animate__animated animate__pulse"
              : "far fa-star text-gray-300"
          }`}
          onClick={() => setUserRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        ></i>
      ))}
    </div>

    {/* زر إرسال التقييم */}
    <button
      className="py-2 px-4 bg-[#ab1c1c] text-white font-bold rounded-full animate__animated animate__fadeInUp"
      onClick={() => {
        setIsSubmitted(true); // عرض رسالة الشكر
        setTimeout(() => {
          setIsModalOpen(false); // إغلاق البوب بعد فترة
        }, 3000); // إغلاق البوب بعد 3 ثوانٍ
      }}
    >
      إرسال التقييم
    </button>

    {isSubmitted && (
      <p className="text-green-800 mt-4 animate__animated animate__fadeIn">
        شكرًا على تقييمك!
      </p>
    )}
  </div>
  // التقييم
) : (
  <p className="text-lg text-gray-600 text-center">
    <strong className="text-sm">حالة القبول:</strong>
    <br />
    <div className="flex justify-center mt-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ab1c1c]"></div>
    </div>
    "جاري البحث عن أقرب مسعف لك، تطمن!"
  </p>
)}




              </div>
            )}
          </div>
        </div>
      )}
      {/* { end edit the pop fahd} */}

      {<Navbar scrollToSection={scrollToSection} />}

      <section
        ref={aboutRef}
        className="about my-24 opacity-0 transition-opacity duration-700 w-[90%] md:w-[100%] mx-auto"
      >
        <h2 className="text-center md:text-right text-3xl sm:text-4xl text-[#ab1c1c] font-bold mb-6 mt-14 w-[90%] sm:w-[70%] mx-auto">
          من نحن
        </h2>

        <div className="p-4 sm:p-8">
          <p className="text-right leading-relaxed text-gray-900 font-medium mb-6 w-[90%] sm:w-[70%] mx-auto">
            منصة{" "}
            <span className="text-[#ab1c1c] text-xl sm:text-2xl font-bold">
              سواعف
            </span>{" "}
            هي الحل الأمثل للحالات الطبية الطارئة، حيث تتيح للمستخدمين المسجلين
            طلب أقرب مسعف معتمد مؤهل لتقديم المساعدة الطبية الفورية. تعتمد
            المنصة على نظام متطور لربط المرضى مباشرة مع المسعفين المتاحين في
            مناطقهم لتلبية احتياجاتهم الصحية في أسرع وقت ممكن.
            <br />
            <br /> هدفنا هو تقديم خدمة طبية موثوقة وسريعة، حيث نضمن أن يحصل
            المستخدم على الدعم اللازم من المسعف الأقرب في لحظات الطوارئ الحرجة.
            بفضل شبكة المسعفين المؤهلين والمساعدات الطبية، نساهم في تقليل الزمن
            المستغرق للوصول إلى المساعدة الصحية، مما يسهم في تحسين فرص التعافي
            وتقليل المخاطر الصحية.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8 lg:mx-32">
            <img
              src={img1}
              alt="Image 1"
              className="h-40 sm:h-60 w-auto transform transition-transform hover:scale-105"
            />
            <img
              src={img3}
              alt="image 2"
              className="h-40 sm:h-60 w-auto transform transition-transform hover:scale-105"
            />
            <img
              src={img2}
              alt="image 3"
              className="h-40 sm:h-60 w-auto transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section
        ref={whySwa3efRef}
        className="whyswa3ef p-16 w-[80%] mx-auto my-16 opacity-0 transition-opacity duration-700"
      >
        <h2 className="text-[#ab1c1c] text-3xl md:text-4xl font-bold mb-16 text-center md:text-right">
          لماذا سواعف
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {" "}
          {/* Reduced gap */}
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center mb-8 lg:mb-0">
            {" "}
            {/* Reduced padding */}
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-user-md text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-lg mb-4 text-center mt-12">
              المسعفون المعتمدون
            </h3>
            <p className="text-center text-gray-600">
              جميع المسعفين المسجلين لدينا مؤهلون ومعتمدون لتقديم الرعاية الطبية
              الطارئة.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center mb-8 lg:mb-0">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-ambulance text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-lg mb-4 text-center mt-12">
              الاستجابة السريعة
            </h3>
            <p className="text-center text-gray-600">
              توصيل المريض بأقرب مسعف متواجد ضمن منطقة لتقديم المساعدة الفورية.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center mb-8 lg:mb-0">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-satellite-dish text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-lg mb-4 text-center mt-12">
              التكنولوجيا المتقدمة
            </h3>
            <p className="text-center text-gray-600">
              نعتمد على تقنيات تحديد المواقع والتواصل الفوري لتقديم الخدمة في
              الوقت المناسب.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center mb-8 lg:mb-0">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-shield-alt text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-lg mb-4 text-center mt-12">
              الأمان والثقة
            </h3>
            <p className="text-center text-gray-600">
              نوفر للمستخدمين وسيلة آمنة وموثوقة للتواصل مع محترفي الرعاية
              الصحية.
            </p>
          </div>
        </div>
      </section>

      {/* الانضمام */}
      <section
        ref={joinRef}
        className="join relative flex flex-col items-center md:flex-row w-[90%] sm:w-[85%] lg:w-[80%] mx-auto my-24 p-6 sm:p-8 md:px-12 lg:px-28"
      >
        <div className="text-center md:text-right md:w-1/2 md:pr-8 lg:pr-12 mb-8 md:mb-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#ab1c1c] font-extrabold mb-4">
            كن جزءًا من شبكة الإنقاذ
          </h2>
          <p className="text-gray-800 text-md sm:text-lg leading-relaxed mb-6">
            انضم إلى منصة{" "}
            <span className="text-[#ab1c1c] font-bold">سواعف</span> وساهم في
            إنقاذ الأرواح من خلال خبرتك الطبية. نحن نربطك بالمرضى في لحظات
            الطوارئ لتقديم الدعم الفوري. كل مسعف يعدّ بطلًا.
          </p>

          <p className="text-gray-700 text-sm sm:text-md leading-relaxed mb-6">
            إذا كنت تمتلك أحد المؤهلات التالية، يمكنك الانضمام إلينا في منصة
            سواعف
          </p>

          <ul className="list-disc list-inside text-gray-700 text-sm sm:text-md leading-relaxed mb-8 sm:mb-10">
            <li>الانتماء إلى القطاع الصحي.</li>
            <li>امتلاك شهادة في الإسعافات الأولية.</li>
            <li>القدرة على تقديم المساعدة الفورية في الحالات الطارئة.</li>
          </ul>

          <Link
            to="/sign"
            className="mt-6 text-sm sm:text-lg bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] hover:scale-105 transform transition-transform text-white py-3 px-6 sm:px-8 rounded-full shadow-lg font-bold"
          >
            انضم الآن
          </Link>
        </div>

        <div className="md:w-1/2 w-full flex justify-center md:justify-end">
          <img
            src={img4}
            alt="صورة مسعف"
            className="w-full max-w-xs sm:max-w-md md:max-w-full transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* رؤيتن */}
      <section
        ref={vision}
        className="vision p-8 w-[80%] md:w-[75%] mx-auto my-24 opacity-0 transition-opacity duration-700 flex flex-col items-center gap-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-10">
          <div className="our-vision flex flex-col items-center md:w-1/2 text-center md:text-right">
            <div className="vision-title text-2xl text-[#ab1c1c] font-bold mb-4 flex items-center justify-center md:justify-start">
              <i className="fas fa-lightbulb text-3xl ml-2"></i> رؤيتنا
            </div>
            <p className="sub-vision-title text-gray-800 text-lg leading-relaxed mb-6">
              أن نكون المنصة الرائدة في تقديم الاستجابة السريعة والفعالة لحالات
              الطوارئ، ونساهم في إنقاذ الأرواح عبر تسهيل الوصول الفوري إلى أقرب
              مسعف.
            </p>
          </div>

          <div className="our-mission flex flex-col items-center md:w-1/2 text-center md:text-right">
            <div className="mission-title text-2xl text-[#ab1c1c] font-bold mb-4 flex items-center justify-center md:justify-start">
              <i className="fas fa-bullseye text-3xl ml-2"></i> رسالتنا
            </div>
            <p className="sub-mission-title text-gray-800 text-lg leading-relaxed mb-6">
              تسريع زمن الاستجابة للطوارئ من خلال ربط الحالات الطارئة بأقرب مسعف
              متاح، لضمان وصول الدعم الأولي بسرعة وكفاءة حتى وصول فرق الإسعاف.
            </p>
          </div>
        </div>

        <div className="our-goals text-center mt-16">
          <h2 className="text-2xl font-bold text-[#ab1c1c] mb-6">أهدافنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* <div className="goal-card bg-white shadow-lg rounded-lg p-6 text-center">
        <i className="fas fa-link text-[#ab1c1c] text-4xl mb-4"></i>
        <h3 className="text-lg font-bold mb-2">ربط الحالات بالمسعفين</h3>
        <p className="text-gray-700">
          تحقيق استجابة فورية عبر ربط أصحاب الحالات بأقرب مسعف مؤهل.
        </p>
      </div> */}

            <div className="goal-card bg-white shadow-lg rounded-lg p-6 text-center">
              <i className="fas fa-heartbeat text-[#ab1c1c] text-4xl mb-4"></i>
              <h3 className="text-lg font-bold mb-2">
                تعزيز السلامة المجتمعية
              </h3>
              <p className="text-gray-700">
                تقديم دعم أولي سريع وفعّال للحفاظ على سلامة المجتمع.
              </p>
            </div>

            <div className="goal-card bg-white shadow-lg rounded-lg p-6 text-center">
              <i className="fas fa-user-graduate text-[#ab1c1c] text-4xl mb-4"></i>
              <h3 className="text-lg font-bold mb-2">
                رفع الوعي بالإسعافات الأولية
              </h3>
              <p className="text-gray-700">
                تشجيع الأفراد على التأهيل كمسعفين ورفع الوعي بأهمية الإسعافات
                الأولية.
              </p>
            </div>

            <div className="goal-card bg-white shadow-lg rounded-lg p-6 text-center">
              <i className="fas fa-clock text-[#ab1c1c] text-4xl mb-4"></i>
              <h3 className="text-lg font-bold mb-2">تحسين زمن الاستجابة</h3>
              <p className="text-gray-700">
                استخدام تقنيات متطورة لتحسين زمن الاستجابة للطوارئ.
              </p>
            </div>

            {/* <div className="goal-card bg-white shadow-lg rounded-lg p-6 text-center">
        <i className="fas fa-hands-helping text-[#ab1c1c] text-4xl mb-4"></i>
        <h3 className="text-lg font-bold mb-2">دعم جهود الإسعاف الوطنية</h3>
        <p className="text-gray-700">
          التعاون مع الجهات الرسمية لدعم جهود الإسعاف على المستوى الوطني.
        </p>
      </div> */}
          </div>
        </div>
      </section>

      <section
        ref={contactRef}
        className="contact-us w-full sm:w-[80%] lg:w-[90%] mx-auto mt-12 p-8 flex flex-col items-center justify-between my-24 opacity-0 transition-opacity duration-700"
      >
        <div className="text-center w-full ">
          <h2 className="text-3xl text-[#ab1c1c] font-extrabold mb-4">
            تواصل معنا
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-4 w-[65%] mx-auto">
            نحن هنا لمساعدتك! لا تتردد في التواصل معنا للحصول على أي استفسار أو
            مساعدة فريقنا جاهز لخدمتك على مدار الساعة. نقدر ملاحظاتك وسنرد عليك
            في أقرب وقت.
          </p>
        </div>

        <div className="w-full bg-gradient-to-r from-[#fff5f5] to-[#ffeaea] py-10 px-10 text-gray-800 relative overflow-hidden">
  {/* خلفية تفاعلية */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ff7a7a] to-[#ffb3b3] rounded-full blur-3xl opacity-20"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-[#ff7a7a] to-[#ffb3b3] rounded-full blur-3xl opacity-20"></div>
  </div>

  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
    {/* النص */}
    <div className="lg:w-1/2 text-center lg:text-right mb-4 lg:mb-0">
      <h2 className="text-2xl font-extrabold text-[#ab1c1c] mb-2 leading-tight">
        انضم إلى بوابة المطورين
      </h2>
      <p className="text-md text-gray-700 mb-4 leading-relaxed">
        اكتشف إمكانيات لا محدودة مع واجهات برمجة التطبيقات الخاصة بنا، وابدأ في بناء تطبيقاتك بخدمات مبتكرة.
      </p>
    </div>

    {/* زر التوجه إلى البوابة */}
    <Link
      to="/dev"
      className="inline-block py-2 px-6 text-white bg-gradient-to-r from-[#ab1c1c] to-[#ff5c5c] rounded-full shadow-md hover:from-[#ff5c5c] hover:to-[#ff7a7a] transform hover:-translate-y-1 transition-all duration-300 font-semibold"
    >
      استكشاف بوابة المطورين
    </Link>
  </div>
</div>






        <h3 className="text-xl text-[#ab1c1c] font-bold my-4 ">فريق الدعم</h3>

        <div className="flex flex-wrap justify-center gap-8 p-6 bg-gray-100">
          <div className="text-center bg-white p-4 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 flex flex-col items-center w-[250px]">
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              فهد القحطاني
            </h4>
            <div className="flex justify-around w-full">
              <a
                href="https://github.com/fl71-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-5xl text-[#ab1c1c] hover:text-black transition duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/fahd-alghtani246"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-5xl text-[#ab1c1c] hover:text-blue-700 transition duration-300" />
              </a>
            </div>
          </div>

          <div className="text-center bg-white p-4 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 flex flex-col items-center w-[250px]">
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              ساره الجميعه
            </h4>
            <div className="flex justify-around w-full">
              <a
                href="https://github.com/SarahJumaiah"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-5xl text-[#ab1c1c] hover:text-black transition duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/sarah-aljumaiah-a6989b234"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-5xl text-[#ab1c1c] hover:text-blue-700 transition duration-300" />
              </a>
            </div>
          </div>

          <div className="text-center bg-white p-4 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 flex flex-col items-center w-[250px]">
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              زياد المغربي
            </h4>
            <div className="flex justify-around w-full">
              <a
                href="https://github.com/zyad87"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-5xl text-[#ab1c1c] hover:text-black transition duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/zyad-al-maghrabi-55928a304"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-5xl text-[#ab1c1c] hover:text-blue-700 transition duration-300" />
              </a>
            </div>
          </div>

          <div className="text-center bg-white p-4 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 flex flex-col items-center w-[250px]">
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              حسناء الصقر
            </h4>
            <div className="flex justify-around w-full">
              <a
                href="https://github.com/ha20s"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-5xl text-[#ab1c1c] hover:text-black transition duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/ha20s"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-5xl text-[#ab1c1c] hover:text-blue-700 transition duration-300" />
              </a>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default Home;
