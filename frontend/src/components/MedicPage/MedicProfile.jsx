import React, { useEffect, useState } from 'react';

const MedicProfile = () => {
  const [medicData, setMedicData] = useState(null); // لتخزين بيانات المسعف
  const [completedCases, setCompletedCases] = useState([]); // لتخزين الحالات المكتملة
  const [ratings, setRatings] = useState([]); // لتخزين التقييمات
  const [isLoadingCases, setIsLoadingCases] = useState(true); // حالة البحث عن الحالات

  // Fetch medic data from API
  useEffect(() => {
    const fetchMedicData = async () => {
      try {
        const response = await fetch('https://6715da9e33bc2bfe40bb51e2.mockapi.io/users');
        const data = await response.json();
        const medic = data[0]; // Assuming the first user is the medic
        setMedicData(medic); // تخزين بيانات المسعف
      } catch (error) {
        console.error('Error fetching medic data:', error);
      }
    };

    const fetchCompletedCases = async () => {
      try {
        const response = await fetch('https://6715da9e33bc2bfe40bb51e2.mockapi.io/Emergency');
        const data = await response.json();
        const completedCases = data.filter((caseItem) => caseItem.status === 'Completed'); // الحالات المكتملة فقط
        setCompletedCases(completedCases);
      } catch (error) {
        console.error('Error fetching completed cases:', error);
      } finally {
        setIsLoadingCases(false); // إنهاء حالة البحث
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await fetch('https://6715da9e33bc2bfe40bb51e2.mockapi.io/Rating');
        const data = await response.json();
        setRatings(data); // تخزين جميع التقييمات
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchMedicData();
    fetchCompletedCases();
    fetchRatings();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-2xl font-bold mb-4">الملف الشخصي للمسعف</h2>
      {medicData ? (
        <div>
          <p><strong>الاسم:</strong> {medicData.name}</p>
          <p><strong>الخبرة:</strong> {medicData.experience} سنوات</p>
          <p><strong>رقم التعريف:</strong> {medicData.id}</p>
          <p><strong>العمر:</strong> {medicData.age} سنوات</p>
        </div>
      ) : (
        <p>جاري تحميل بيانات المسعف...</p>
      )}

      {/* قسم الحالات المكتملة */}
      <h3 className="text-xl font-bold mt-6">الحالات المكتملة:</h3>
      <div>
        {isLoadingCases ? (
          <p>جاري البحث عن الحالات...</p> // لودر أو رسالة البحث عن الحالات
        ) : completedCases.length > 0 ? (
          <ul className="list-disc list-inside">
            {completedCases.map((caseItem) => (
              <li key={caseItem.id}>
                <strong>نوع الحالة:</strong> {caseItem.case_type} - <strong>الموقع:</strong> {caseItem.location.address !== 'العنوان غير متاح' ? caseItem.location.address : 'العنوان غير متاح'}
              </li>
            ))}
          </ul>
        ) : (
          <p>لم يتم إتمام أي حالات بعد.</p>
        )}
      </div>

      {/* قسم التقييمات */}
      <h3 className="text-xl font-bold mt-6">التقييمات:</h3>
      <ul className="list-disc list-inside">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <li key={rating.id}>
              <strong>التقييم:</strong> {rating.rating}/5 - <strong>ملاحظات:</strong> {rating.feedback || 'لا توجد ملاحظات'}
            </li>
          ))
        ) : (
          <p>لم يتم تقديم أي تقييمات بعد.</p>
        )}
      </ul>
    </div>
  );
};

export default MedicProfile;
