import { useEffect, useState } from 'react';
import axios from 'axios';

const WaitingPage = () => {
    const [caseId, setCaseId] = useState(null);
    const [responderInfo, setResponderInfo] = useState(null);  // معلومات المسعف
    const [statusMessage, setStatusMessage] = useState('جاري البحث عن مسعف...');
    const [isAccepted, setIsAccepted] = useState(false);  // حالة قبول المسعف
    const [isCompleted, setIsCompleted] = useState(false);  // حالة الإكمال
    const [rating, setRating] = useState(null);  // التقييم
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);  // حالة تقديم التقييم
    const [loading, setLoading] = useState(true); // حالة تحميل البيانات

    useEffect(() => {
        const storedCaseId = localStorage.getItem('case_id');
        if (storedCaseId) {
            setCaseId(storedCaseId);
            fetchCaseDetails(storedCaseId);
            const interval = setInterval(() => {
                fetchCaseDetails(storedCaseId);
            }, 10000); // التحقق كل 10 ثوانٍ
            return () => clearInterval(interval); // تنظيف الـ interval عند الخروج
        }
    }, []);

    // جلب تفاصيل الحالة باستخدام case_id
    const fetchCaseDetails = async (id) => {
        setLoading(true); // بداية تحميل البيانات
        try {
            const response = await axios.get(`https://67073bf9a0e04071d2298046.mockapi.io/users/${id}`);
            const caseData = response.data;

            // إذا تم تعيين مسعف وتم قبول الحالة
            if (caseData.is_accepted && caseData.assigned_responder) {
                setIsAccepted(true);
                setResponderInfo(caseData.assigned_responder);
                setStatusMessage('تم قبول طلبك، المسعف في طريقه إليك.');
            } else {
                // إذا لم يتم قبول الحالة بعد
                setStatusMessage('جاري البحث عن مسعف...');
            }

            if (caseData.status === 'مكتملة') {
                // إذا كانت الحالة مكتملة
                setIsCompleted(true);
                setStatusMessage('تم إنهاء الحالة.');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            setStatusMessage('حدث خطأ أثناء جلب تفاصيل الحالة.');
        } finally {
            setLoading(false); // انتهاء تحميل البيانات
        }
    };

    const handleFeedbackSubmit = () => {
        setFeedbackSubmitted(true);
        // يمكنك إرسال التقييم إلى الخادم هنا
    };

    return (
        <div>
            <style>
                {`
                    .spinner-border {
                        border-top-color: #ab1c1c;
                        border-right-color: transparent;
                        border-bottom-color: transparent;
                        border-left-color: #ab1c1c;
                        border-width: 4px;
                    }
                `}
            </style>

            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-3xl font-bold text-red-600 mb-8">صفحة الانتظار</h1>
                <p className="text-lg text-gray-600 mb-4">{statusMessage}</p>

                {loading && (
                    <div className="flex items-center justify-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        </div>
                    </div>
                )}

                {!loading && caseId && (
                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
                        <p className="text-gray-500 mb-4">معرف الحالة: {caseId}</p>

                        {/* حالة الانتظار */}
                        {!isAccepted && !isCompleted && (
                            <div className="flex items-center justify-center">
                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                </div>
                            </div>
                        )}

                        {/* حالة قبول المسعف الطلب */}
                        {isAccepted && !isCompleted && responderInfo && (
                            <div className="bg-green-100 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold text-green-700 mb-4">المسعف متوجه إليك!</h2>
                                <div className="mb-4">
                                    <strong>الاسم:</strong> {responderInfo.name}
                                </div>
                                <div className="mb-4">
                                    <strong>رقم الهاتف:</strong> {responderInfo.phone}
                                </div>
                                <div className="mb-4">
                                    <strong>الوقت المتوقع للوصول:</strong> 10 دقائق
                                </div>
                                <button className="py-2 px-4 bg-green-600 text-white rounded-full shadow-lg">
                                    اتصل بالمسعف
                                </button>
                            </div>
                        )}

                        {/* حالة إكمال الحالة */}
                        {isCompleted && !feedbackSubmitted && (
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">تم إنهاء الحالة!</h2>
                                <p className="text-lg mb-4">كيف كانت تجربتك؟</p>
                                <div className="flex justify-center space-x-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`py-2 px-4 rounded-full ${rating === star ? 'bg-yellow-400' : 'bg-gray-300'}`}
                                        >
                                            {star} ★
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleFeedbackSubmit} className="py-2 px-4 bg-blue-600 text-white rounded-full shadow-lg">
                                    إرسال التقييم
                                </button>
                            </div>
                        )}

                        {/* حالة تقييم مكتملة */}
                        {feedbackSubmitted && (
                            <div className="bg-green-100 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold text-green-700 mb-4">شكرًا لتقييمك!</h2>
                                <p>تم تقديم تقييمك بنجاح. شكرًا لك على المساهمة في تحسين خدماتنا.</p>
                            </div>
                        )}
                    </div>
                )}

                {!caseId && (
                    <p className="text-red-500">لا توجد حالة حالية.</p>
                )}
            </div>
        </div>
    );
};

export default WaitingPage;
