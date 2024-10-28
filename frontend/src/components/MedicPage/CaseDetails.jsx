import { useEffect, useState } from 'react';
// import MedicMap from '../components/MedicPage/MedicMap';
import MedicMap from '../../components/MedicPage/MedicMap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CaseDetailsPage = () => {
  const { caseId } = useParams(); // الحصول على caseId من المسار
  const [caseInfo, setCaseInfo] = useState(null);
  const [loading, setLoading] = useState(false); // لتتبع حالة الإكمال
  const navigate = useNavigate(); // للتوجيه إلى MedicPage بعد الإكمال
  const BASE_URL = import.meta.env.VITE_API_URL;

// جلب تفاصيل الحالة
useEffect(() => {
  const fetchCaseDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cases/${caseId}`);
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
    setLoading(true);
    const updatedCase = { ...caseInfo, status: 'تم إكمال الحالة', is_accepted: false };

    // تحديث الحالة في الـ API
    await axios.put(`${BASE_URL}/cases/${caseId}`, updatedCase);

    Swal.fire({
      title: 'تم إكمال الحالة بنجاح!',
      icon: 'success',
      confirmButtonColor: '#892222',
      confirmButtonText: 'موافق'
    }).then(() => {
      const medicId = localStorage.getItem('medicId');
      navigate(`/MedicPage/${medicId}`);
    });
  } catch (error) {
    console.error("Error completing case:", error);
    Swal.fire({
      title: 'حدث خطأ!',
      text: 'يرجى المحاولة مرة أخرى.',
      icon: 'error',
      confirmButtonColor: '#892222',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col lg:flex-row h-auto min-h-screen bg-gray-50 p-8" dir="rtl">
      {/* يمين */}
      <div className="w-full lg:w-1/2 p-8 bg-white mb-8 lg:mb-0 lg:mr-6">
        <h2 className="text-3xl font-bold text-[#892222] mb-8">تفاصيل الحالة</h2>
        {caseInfo ? (
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">معلومات المريض</h3>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700 text-lg">اسم المريض:</span>
                <span className="text-gray-900 font-semibold ml-auto mr-3 ">{caseInfo.patient.name}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700 text-lg">رقم الهاتف:</span>
                <span className="text-gray-900 font-semibold ml-auto mr-3 ">{caseInfo.patient.phone}</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">تفاصيل الحالة</h3>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700 text-lg">نوع الحالة:</span>
                <span className="text-gray-900 font-semibold ml-auto mr-3 ">{caseInfo.case_type}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700 text-lg">حالة الطلب:</span>
                <span className="text-lg font-semibold ml-auto mr-3"> {caseInfo.status} </span>
              </div>
            </div>
            

            {/* زر إكمال الحالة يظهر فقط إذا لم تكتمل الحالة بعد */}
            {caseInfo.status !== 'تم إكمال الحالة' && (
              <button
                onClick={handleCompleteCase}
                className="mt-6 bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white w-full py-3 rounded-full text-lg font-bold hover:bg-[#7b1e1e] transition"
                disabled={loading} // تعطيل الزر أثناء التحميل
              >
                {loading ? 'جاري الإكمال...' : 'إكمال الحالة'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600">جاري تحميل التفاصيل...</p>
        )}
      </div>

      {/* يسار  */}
      <div className="w-full lg:w-1/2 p-8 bg-white">
        <h3 className="text-3xl font-semibold text-[#892222] mb-6">موقع الحالة</h3>
        {caseInfo ? (
          <div className="rounded-lg overflow-hidden shadow-md">
            <MedicMap caseId={caseId} />
          </div>
        ) : (
          <p className="text-gray-600">جاري تحميل الموقع...</p>
        )}
      </div>
    </div>
  );
};

export default CaseDetailsPage;
