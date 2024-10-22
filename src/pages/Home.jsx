import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

const Home = () => {
  const aboutRef = useRef(null);
  const whySwa3efRef = useRef(null);
  const joinRef = useRef(null);
  const contactRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    status: "",
  });
  const [responderInfo, setResponderInfo] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rating, setRating] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // لإظهار حالة التحميل عند الإرسال
  const [timer, setTimer] = useState(180); // مؤقت العد التنازلي (3 دقائق)
  const [isCancelled, setIsCancelled] = useState(false); // حالة إلغاء الطلب
  const [caseId, setCaseId] = useState(null); // لتخزين معرف الحالة

  const statuses = ["كسور", "حروق", "اغماء", "اختناق"];

  // تغيير الحالة
  const handleStatusChange = (status) => {
    setFormData((prevData) => ({ ...prevData, status }));
  };

  // عند تغيير البيانات المدخلة
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // دالة لبدء العد التنازلي
  useEffect(() => {
    let countdown;
    if (isOrderSent && !isAccepted && !isCancelled) {
      countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsCancelled(true); // إلغاء الطلب
            updateCaseStatusToCancelled(); // تحديث الحالة إلى "ملغي"
          }
          return prevTime - 1;
        });
      }, 1000); // عد تنازلي كل ثانية
    }
    return () => clearInterval(countdown);
  }, [isOrderSent, isAccepted, isCancelled]);

  // تحديث الحالة إلى "ملغي" عند انتهاء الوقت
  const updateCaseStatusToCancelled = async () => {
    if (caseId) {
      try {
        await axios.put(
          `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`,
          {
            status: "ملغي",
          }
        );
      } catch (error) {
        console.error("Error updating case status to cancelled:", error);
      }
    }
  };

  // عند إرسال الطلب
  const handleSend = async () => {
    const newErrors = {
      name: !formData.name,
      phone: !formData.phone,
      status: !formData.status,
    };

    if (newErrors.name || newErrors.phone || newErrors.status) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى ملء جميع الحقول المطلوبة.",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#ab1c1c",
      });
      return; // توقف في حال وجود أخطاء
    }

    setLoading(true); // إظهار حالة التحميل أثناء الإرسال

    try {
      // إرسال بيانات الحالة إلى الخادم
      const caseData = {
        case_id: uuidv4(),
        case_type: formData.status,
        location: null, // لم يتم تحديد الموقع بعد
        assigned_responder: null,
        status: "الحالة معلقة حتى يتم قبولها",
        patient: {
          name: formData.name,
          phone: formData.phone,
        },
        is_accepted: false,
      };

      const postResponse = await axios.post(
        "https://67073bf9a0e04071d2298046.mockapi.io/users",
        caseData
      );
      setIsOrderSent(true);
      setTimer(180); // إعادة ضبط المؤقت إلى 3 دقائق
      setCaseId(caseData.case_id); // تخزين معرف الحالة للاستخدام لاحقًا

      // تحقق من حالة الطلب بشكل دوري كل 5 ثوانٍ
      const interval = setInterval(async () => {
        const updatedResponse = await axios.get(
          `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseData.case_id}`
        );
        const updatedData = updatedResponse.data;

        if (updatedData.is_accepted && updatedData.assigned_responder) {
          setResponderInfo(updatedData.assigned_responder);
          setIsAccepted(true);

          // بعد قبول المسعف، الحصول على الموقع
          getLocationAndUpdateCase(caseData.case_id);

          clearInterval(interval); // إيقاف التحقق عند قبول الحالة
        }

        if (updatedData.status === "مكتملة") {
          setIsCompleted(true);
          clearInterval(interval); // إيقاف التحقق بعد اكتمال الحالة
        }
      }, 5000); // تحديث كل 5 ثوانٍ
    } catch (error) {
      console.error("Error sending data:", error);

      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى لاحقًا.",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#ab1c1c",
      });
    } finally {
      setLoading(false); // إخفاء حالة التحميل بعد الإرسال
    }
  };

  // الحصول على الموقع وتحديث الحالة
  const getLocationAndUpdateCase = async (caseId) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // استخدام Mapbox API للحصول على العنوان من الإحداثيات
            const response = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoienlhZDIyIiwiYSI6ImNtMmhyZjYwbjBlNzUycXF2eW5ucjdrNTIifQ.gl1phZ7zs3yRryUmKgrKMQ`,
              { timeout: 10000 } // 10 ثوانٍ مهلة زمنية
            );

            const address =
              response.data.features[0]?.place_name || "العنوان غير متاح";

            // تحديث الحالة بالموقع
            await axios.put(
              `https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`,
              {
                location: {
                  latitude,
                  longitude,
                  address,
                },
              }
            );
          } catch (error) {
            console.error("Error fetching location:", error);
          }
        },
        (error) => {
          console.error("Error getting location", error);

          Swal.fire({
            icon: "error",
            title: "خطأ في تحديد الموقع",
            text: "فشل في تحديد الموقع. يرجى التأكد من تفعيل خدمات الموقع.",
            confirmButtonText: "حسنًا",
            confirmButtonColor: "#ab1c1c",
          });
        }
      );
    }
  };

  // إرسال التقييم
  const handleFeedbackSubmit = async () => {
    setFeedbackSubmitted(true);
    setIsModalOpen(false);
    setIsOrderSent(false); // السماح ببدء طلب جديد
    setFormData({ name: "", phone: "", status: "" }); // تصفية البيانات القديمة
    setRating(null); // إعادة ضبط التقييم
  };

  // إعادة إرسال الطلب بعد انتهاء الوقت
  const handleRetry = () => {
    setIsOrderSent(false);
    setIsCancelled(false);
    setTimer(10); // إعادة ضبط المؤقت إلى 3 دقائق
  };

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
    if (contactRef.current) observer.observe(contactRef.current);

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (whySwa3efRef.current) observer.unobserve(whySwa3efRef.current);
      if (joinRef.current) observer.unobserve(joinRef.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  return (
    <div>
      <header className="h-[79vh] relative p-8 text-center bg-white text-gray-800 shadow-lg flex flex-col justify-center items-center overflow-hidden header">
        <div className="relative z-10 mx-auto">
        <h1 className="text-4xl mb-16 leading-tight drop-shadow-lg headertxt">
 نحن هنا لمساعدتك في حالات
            <span className="text-red-600 font-extrabold"> الطوارئ</span>
            <br />
          </h1>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="relative text-3xl mx-auto bg-red-600 text-white font-bold w-44 h-44 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none wave-button"
          >
            نداء استغاثه
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
              <div className="bg-white p-10 rounded-lg max-w-md w-full relative shadow-lg">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 left-2 text-xl text-gray-600 hover:text-[#ab1c1c]"
                >
                  ✖
                </button>

                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div
                      className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
                      role="status"
                    ></div>
                    <p className="mt-4 text-lg text-gray-600">
                      جاري البحث عن مسعف...
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

                    <button
                      onClick={handleSend}
                      className="py-2 px-4 w-full bg-[#ab1c1c] text-white font-bold rounded-full"
                    >
                      إرسال
                    </button>
                  </>
                ) : isCancelled ? (
                  <div className="text-center">
                    <p className="text-red-600 mb-4">
                      عذرًا، لم يتوفر مسعف في الوقت المحدد. نقدر صبرك ونسأل الله
                      لك السلامة.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={handleRetry}
                        className="py-2 px-4 bg-[#ab1c1c] text-white rounded-full transition duration-300 hover:bg-[#9b1b1b]"
                      >
                        إعادة المحاولة
                      </button>
                      <button
                        onClick={() => (window.location.href = "tel:998")}
                        className="py-2 px-4 bg-[#ab1c1c] text-white rounded-full transition duration-300 hover:bg-[#9b1b1b]"
                      >
                        الاتصال بالهلال الأحمر (998)
                      </button>
                    </div>
                  </div>
                ) : !isAccepted ? (
                  <div className="flex flex-col items-center">
                    <div
                      className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-red-500 rounded-full"
                      role="status"
                    ></div>
                    <p className="mt-4 text-gray-600">
                      جاري البحث عن مسعف... ({timer} ثواني متبقية)
                    </p>
                  </div>
                ) : isCompleted ? (
                  <>
                    <div className="text-center text-[#ab1c1c]">
                      <p className="text-2xl">الحمدلله على سلامتك.</p>
                      <p className="text-lg mb-4">
                        تم التعامل مع الحالة بنجاح. ممتنين لمساعدتك، نتمنى لك
                        الشفاء العاجل!
                      </p>

                      <p className="mb-4">يرجى تقييم المسعف:</p>

                      <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${
                              rating >= star
                                ? "text-[#ab1c1c]"
                                : "text-gray-400"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleFeedbackSubmit}
                        className="mt-4 py-2 px-4 bg-[#ab1c1c] text-white rounded-full"
                      >
                        إرسال التقييم
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-lg mb-4 text-[#ab1c1c]">
                      تم استلام طلب الاستغاثة الخاص بك، وأقرب مسعف في طريقه إليك
                      الآن. نحن هنا لمساعدتك.
                    </p>

                    <p className="mb-4">
                      <strong>المسعف:</strong>{" "}
                      {responderInfo?.name || "غير متوفر"}
                      <br />
                      <strong>رقم الهاتف:</strong>{" "}
                      {responderInfo?.phone || "غير متوفر"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <Navbar scrollToSection={scrollToSection} />

      {/* من نحن */}
      <section
        ref={aboutRef}
        className="about my-24 opacity-0 transition-opacity duration-700 w-[90%] md:w-[70%] mx-auto"
      >
        <h2 className="text-right text-4xl text-[#ab1c1c] font-bold mb-6 mt-14">
          من نحن
        </h2>

        <div className="p-8">
          <p className="text-right leading-relaxed text-gray-900 font-medium mb-6">
            منصة{" "}
            <span className="text-[#ab1c1c] text-2xl font-bold">سواعف</span> هي
            الحل الأمثل للحالات الطبية الطارئة، حيث تتيح للمستخدمين المسجلين طلب
            أقرب مسعف معتمد مؤهل لتقديم المساعدة الطبية الفورية. تعتمد المنصة
            على نظام متطور لربط المرضى مباشرة مع المسعفين المتاحين في مناطقهم
            لتلبية احتياجاتهم الصحية في أسرع وقت ممكن.
            <br />
            <br /> هدفنا هو تقديم خدمة طبية موثوقة وسريعة، حيث نضمن أن يحصل
            المستخدم على الدعم اللازم من المسعف الأقرب في لحظات الطوارئ الحرجة.
            بفضل شبكة المسعفين المؤهلين والمساعدات الطبية، نساهم في تقليل الزمن
            المستغرق للوصول إلى المساعدة الصحية، مما يسهم في تحسين فرص التعافي
            وتقليل المخاطر الصحية.
          </p>

          <div className="flex flex-wrap md:flex-row justify-around gap-6 mt-8 lg:mx-32">
            <img
              src="https://images.unsplash.com/photo-1642438113516-982b9f57b01a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image 1"
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
            <img
              src="https://images.unsplash.com/photo-1624638764471-cffef5035746?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
            <img
              src="https://images.unsplash.com/photo-1649260257620-3fd04e1952e5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image 2"
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section
        ref={whySwa3efRef}
        className="whyswa3ef p-8 w-[75%] mx-auto my-24 opacity-0 transition-opacity duration-700"
      >
        <h2 className="text-[#ab1c1c] text-4xl font-bold mb-10 text-right">
          لماذا سواعف
        </h2>{" "}
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-user-md text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              المسعفون المعتمدون
            </h3>
            <p className="text-center text-gray-600">
              جميع المسعفين المسجلين لدينا مؤهلون ومعتمدون لتقديم الرعاية الطبية
              الطارئة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-ambulance text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              الاستجابة السريعة
            </h3>
            <p className="text-center text-gray-600">
              توصيل المريض بأقرب مسعف متواجد ضمن منطقة لتقديم المساعدة الفورية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-satellite-dish text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              التكنولوجيا المتقدمة
            </h3>
            <p className="text-center text-gray-600">
              نعتمد على تقنيات تحديد المواقع والتواصل الفوري لتقديم الخدمة في
              الوقت المناسب.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-shield-alt text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
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
        className="join relative flex flex-col md:flex-row items-center justify-between w-[80%] mx-auto my-24 p-12 opacity-0 transition-opacity duration-700"
      >
        <div className="text-right md:w-1/2 md:pr-12 ml-12">
          <h2 className="text-2xl text-[#ab1c1c] font-extrabold mb-4">
            كن جزءًا من شبكة الإنقاذ
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            انضم إلى منصة{" "}
            <span className="text-[#ab1c1c] font-bold">سواعف</span> وساهم في
            إنقاذ الأرواح من خلال خبرتك الطبية. نحن نربطك بالمرضى في لحظات
            الطوارئ لتقديم الدعم الفوري. كل مسعف يعدّ بطلًا .
          </p>
          <Link
            to="/sign"
            className="mt-6 text-lg bg-gradient-to-r from-[#ab1c1c] to-red-500 hover:scale-105 transform transition-transform text-white py-3 px-8 rounded-full shadow-lg font-bold"
          >
            انضم الآن
          </Link>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <img
            src="https://www.aedcpr.com/articles/wp-content/uploads/2023/07/shutterstock_657810997.jpg"
            alt="صورة مسعف"
            className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* تواصل معنا */}
      <section
        ref={contactRef}
        className="contact-us w-[80%] mx-auto mt-12 p-8 flex flex-col items-center justify-between my-24 opacity-0 transition-opacity duration-700"
      >
        <div className="text-center w-full mb-8">
          <h2 className="text-3xl text-[#ab1c1c] font-extrabold mb-4">
            تواصل معنا
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-4">
            نحن هنا لمساعدتك! لا تتردد في التواصل معنا للحصول على أي استفسار أو
            مساعدة.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            فريقنا جاهز لخدمتك على مدار الساعة. نقدر ملاحظاتك وسنرد عليك في أقرب
            وقت.
          </p>
        </div>

        <div className="w-full flex flex-col items-center">
          <h3 className="text-xl text-[#ab1c1c] font-bold mb-4">
            معلومات الاتصال
          </h3>
          <div className="flex items-center mb-4 gap-6">
            <i className="fas fa-phone-alt text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600 ml-5 ">96650875987+</span>
          </div>
          <div className="flex items-center mb-4 gap-6">
            <i className="fas fa-envelope text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600">info@swa3ef.com</span>
          </div>
          <div className="flex items-center gap-6">
            <i className="fas fa-map-marker-alt text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600 -ml-12">
              الرياض، المملكة العربية السعودية
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
