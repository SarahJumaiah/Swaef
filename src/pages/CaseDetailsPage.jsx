import React, { useEffect, useState } from 'react';
import MedicMap from '../components/MedicPage/MedicMap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // إضافة useNavigate للتوجيه

const CaseDetailsPage = () => {
  const { caseId } = useParams(); // الحصول على caseId من المسار
  const [caseInfo, setCaseInfo] = useState(null);
  const [loading, setLoading] = useState(false); // لتتبع حالة الإكمال
  const navigate = useNavigate(); // للتوجيه إلى MedicPage بعد الإكمال

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`);
        setCaseInfo(response.data);
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };

    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  // دالة إكمال الحالة
  const handleCompleteCase = async () => {
    try {
      setLoading(true); // بدء حالة التحميل
      const updatedCase = { ...caseInfo, status: 'تم إكمال الحالة', is_accepted: false };

      // تحديث الحالة في الـ API
      await axios.put(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`, updatedCase);
      
      // عرض رسالة إكمال وتحويل المستخدم إلى صفحة المسعف
      alert('تم إكمال الحالة بنجاح!');
      const medicId = localStorage.getItem('medicId');
      navigate(`/MedicPage/${medicId}`);
    } catch (error) {
      console.error("Error completing case:", error);
    } finally {
      setLoading(false); // إنهاء حالة التحميل
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-100 p-6" dir="rtl">
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-6">تفاصيل الحالة</h2>
        {caseInfo ? (
          <div>
            <h3>اسم المريض: {caseInfo.patient.name}</h3>
            <p>رقم الهاتف: {caseInfo.patient.phone}</p>
            <p>نوع الحالة: {caseInfo.case_type}</p>
            <p>حالة الطلب: {caseInfo.status}</p>

            {/* زر إكمال الحالة يظهر فقط إذا لم تكتمل الحالة بعد */}
            {caseInfo.status !== 'تم إكمال الحالة' && (
              <button
                onClick={handleCompleteCase}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading} // تعطيل الزر أثناء التحميل
              >
                {loading ? 'جاري الإكمال...' : 'إكمال الحالة'}
              </button>
            )}
          </div>
        ) : (
          <p>جاري تحميل التفاصيل...</p>
        )}
      </div>

      <div className="w-full lg:w-1/2 p-4">
        <h3 className="text-xl font-semibold mb-4">موقع الحالة</h3>
        {caseInfo && <MedicMap caseId={caseId} />}
      </div>
    </div>
  );
};

export default CaseDetailsPage;
