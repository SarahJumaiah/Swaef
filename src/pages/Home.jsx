import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    status: '',
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

  const statuses = ['كسور', 'حروق', 'اغماء', 'اختناق'];

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
        await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`, {
          status: 'ملغي',
        });
      } catch (error) {
        console.error('Error updating case status to cancelled:', error);
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
      alert("يرجى ملء جميع الحقول المطلوبة.");
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
        status: 'الحالة معلقة حتى يتم قبولها',
        patient: {
          name: formData.name,
          phone: formData.phone,
        },
        is_accepted: false,
      };

      const postResponse = await axios.post('https://67073bf9a0e04071d2298046.mockapi.io/users', caseData);
      setIsOrderSent(true);
      setTimer(180); // إعادة ضبط المؤقت إلى 3 دقائق
      setCaseId(caseData.case_id); // تخزين معرف الحالة للاستخدام لاحقًا

      // تحقق من حالة الطلب بشكل دوري كل 5 ثوانٍ
      const interval = setInterval(async () => {
        const updatedResponse = await axios.get(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseData.case_id}`);
        const updatedData = updatedResponse.data;

        if (updatedData.is_accepted && updatedData.assigned_responder) {
          setResponderInfo(updatedData.assigned_responder);
          setIsAccepted(true);

          // بعد قبول المسعف، الحصول على الموقع
          getLocationAndUpdateCase(caseData.case_id);

          clearInterval(interval); // إيقاف التحقق عند قبول الحالة
        }

        if (updatedData.status === 'مكتملة') {
          setIsCompleted(true);
          clearInterval(interval); // إيقاف التحقق بعد اكتمال الحالة
        }
      }, 5000); // تحديث كل 5 ثوانٍ
    } catch (error) {
      console.error('Error sending data:', error);
      alert('حدث خطأ أثناء إرسال البيانات.');
    } finally {
      setLoading(false); // إخفاء حالة التحميل بعد الإرسال
    }
  };

  // الحصول على الموقع وتحديث الحالة
  const getLocationAndUpdateCase = async (caseId) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // استخدام Mapbox API للحصول على العنوان من الإحداثيات
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoienlhZDIyIiwiYSI6ImNtMmhyZjYwbjBlNzUycXF2eW5ucjdrNTIifQ.gl1phZ7zs3yRryUmKgrKMQ`,
            { timeout: 10000 } // 10 ثوانٍ مهلة زمنية
          );

          const address = response.data.features[0]?.place_name || 'العنوان غير متاح';

          // تحديث الحالة بالموقع
          await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`, {
            location: {
              latitude,
              longitude,
              address,
            },
          });
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      }, (error) => {
        console.error('Error getting location', error);
        alert('فشل في تحديد الموقع. يرجى التأكد من تفعيل خدمات الموقع.');
      });
    }
  };

  // إرسال التقييم
  const handleFeedbackSubmit = async () => {
    setFeedbackSubmitted(true);
    setIsModalOpen(false);
    setIsOrderSent(false); // السماح ببدء طلب جديد
    setFormData({ name: '', phone: '', status: '' }); // تصفية البيانات القديمة
    setRating(null); // إعادة ضبط التقييم
  };

  // إعادة إرسال الطلب بعد انتهاء الوقت
  const handleRetry = () => {
    setIsOrderSent(false);
    setIsCancelled(false);
    setTimer(180); // إعادة ضبط المؤقت إلى 3 دقائق
  };

  return (
    <div>
      <header className="h-[79vh] relative p-8 text-center bg-white text-gray-800 shadow-lg flex flex-col justify-center items-center overflow-hidden header">
        <div className="relative z-10 mx-auto">
          <h1 className="text-4xl mb-16 leading-tight drop-shadow-lg headertxt">
            هل انت في حالة <span className="text-red-600 mx-2 font-extrabold">طوارئ؟</span>
          </h1>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="relative text-3xl mx-auto bg-[#ab1c1c] text-white font-bold w-44 h-44 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl"
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
                  <div className="flex flex-col items-center">
                    {/* لودر التحميل */}
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-red-500" role="status"></div>
                    <p className="mt-4 text-gray-600">جاري البحث عن مسعف...</p>
                  </div>
                ) : !isOrderSent ? (
                  <>
                    {/* نموذج إدخال المعلومات */}
                    <div className="mb-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك"
                        className="p-2 w-full border-b-2 border-[#ab1c1c] focus:outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                        maxLength={10}
                        className="p-2 w-full border-b-2 border-[#ab1c1c] focus:outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`p-2 rounded-full ${formData.status === status ? 'bg-[#ab1c1c] text-white' : 'border-[#ab1c1c] border'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleSend} className="py-2 px-4 w-full bg-[#ab1c1c] text-white font-bold rounded-full">
                      إرسال
                    </button>
                  </>
                ) : isCancelled ? (
                  <div className="text-center">
                    <p className="text-red-600 mb-4">تم إلغاء الطلب لعدم توفر مسعف في الوقت المحدد.</p>
                    <button
                      onClick={handleRetry}
                      className="py-2 px-4 bg-[#ab1c1c] text-white rounded-full"
                    >
                      إعادة المحاولة
                    </button>
                    <button
                      onClick={() => window.location.href = 'tel:998'}
                      className="py-2 px-4 bg-[#ab1c1c] text-white rounded-full mt-4"
                    >
                      الاتصال بالهلال الأحمر (998)
                    </button>
                  </div>
                ) : !isAccepted ? (
                  <div className="flex flex-col items-center">
                    {/* لودر أثناء البحث عن مسعف */}
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-red-500" role="status"></div>
                    <p className="mt-4 text-gray-600">جاري البحث عن مسعف... ({timer} ثواني متبقية)</p>
                  </div>
                ) : isCompleted ? (
                  <>
                    <p>تم إنهاء الحالة! كيف كانت تجربتك؟</p>
                    <div className="flex justify-around mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)}>
                          {star} ★
                        </button>
                      ))}
                    </div>
                    <button onClick={handleFeedbackSubmit} className="mt-4 py-2 px-4 bg-[#ab1c1c] text-white rounded-full">
                      إرسال التقييم
                    </button>
                  </>
                ) : (
                  <div>
                    <p>المسعف في طريقه إليك:</p>
                    <p>الاسم: {responderInfo?.name}</p>
                    <p>رقم الهاتف: {responderInfo?.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Home;
