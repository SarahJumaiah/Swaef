import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [acceptedCase, setAcceptedCase] = useState(null); // لتخزين الحالة المقبولة
  const [location, setLocation] = useState(null); // لتخزين الموقع
  const [isAccepted, setIsAccepted] = useState(false); // لتحديد قبول الحالة أو لا

  const statuses = ['كسور', 'حروق', 'اغماء', 'اختناق'];

  // تحديد الموقع باستخدام متصفح المستخدم
  const handleLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("لم نتمكن من تحديد موقعك. تأكد من تفعيل خدمات الموقع.");
        }
      );
    } else {
      alert("خدمات تحديد الموقع غير مدعومة في هذا المتصفح.");
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
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (!location) {
      alert("يرجى تحديد موقعك أولاً.");
      return;
    }

    setLoading(true);

    const newCase = {
      case_id: Date.now(),
      case_type: formData.status,
      location: location,
      assigned_responder: null,
      status: 'الحالة معلقة حتى يتم قبولها',
      patient: {
        name: formData.name,
        phone: formData.phone,
      },
      is_accepted: false,
    };

    try {
      // إرسال الحالة إلى الـ MockAPI
      await axios.post('https://67073bf9a0e04071d2298046.mockapi.io/users', newCase);
      setIsOrderSent(true);
    } catch (error) {
      console.error("Error sending case:", error);
    } finally {
      setLoading(false);
    }
  };

  // جلب الحالة بشكل دوري
  useEffect(() => {
    const fetchCaseStatus = async () => {
      try {
        const response = await axios.get('https://67073bf9a0e04071d2298046.mockapi.io/users');
        const lastCase = response.data[response.data.length - 1];
        setAcceptedCase(lastCase); // تخزين آخر حالة
        if (lastCase.is_accepted) {
          setIsAccepted(true);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    if (isOrderSent) {
      const intervalId = setInterval(fetchCaseStatus, 5000); // التحقق كل 5 ثوانٍ
      return () => clearInterval(intervalId); // تنظيف عند تدمير المكون
    }
  }, [isOrderSent]);

  return (
    <header className="h-[79vh] relative p-8 text-center bg-white text-gray-800 shadow-lg flex flex-col justify-center items-center overflow-hidden header">
      <div className="relative z-10 mx-auto">
        <h1 className="text-4xl mb-16 leading-tight drop-shadow-lg headertxt">
          هل انت في حالة <span className="text-red-600 mx-2 font-extrabold">طوارئ؟</span>
        </h1>
        <button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            handleLocation(); // تحديد الموقع عند فتح النافذة
          }}
          className="relative text-3xl mx-auto bg-[#ab1c1c] text-white font-bold w-44 h-44 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl"
        >
          نداء استغاثة
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
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-red-500" role="status"></div>
                  <p className="mt-4 text-gray-600">جاري الإرسال...</p>
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
                  <button
                    onClick={handleSend}
                    className="py-2 px-4 w-full bg-[#ab1c1c] text-white font-bold rounded-full"
                  >
                    إرسال
                  </button>
                </>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-2">حالة الحالة:</h3>
                  <p><strong>نوع الحالة:</strong> {acceptedCase?.case_type}</p>
                  <p><strong>اسم المريض:</strong> {acceptedCase?.patient?.name}</p>
                  <p><strong>رقم الهاتف:</strong> {isAccepted ? acceptedCase?.patient?.phone : 'سيظهر بعد قبول الحالة'}</p>
                  <p><strong>حالة القبول:</strong> {isAccepted ? "تم قبول الحالة" : "الحالة معلقة حتى يتم قبولها"}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Home;
