import React, { useState, useEffect } from 'react';
import MedicMap from '../components/MedicPage/MedicMap';
import axios from 'axios'; // استخدام Axios لجلب البيانات

const MedicPage = () => {
  const [emergencyCases, setEmergencyCases] = useState([]); // لتخزين الحالات الطارئة
  const [selectedCase, setSelectedCase] = useState(null); // لتخزين الحالة المختارة

  // جلب الحالات الطارئة من API
  useEffect(() => {
    const fetchEmergencyCases = async () => {
      try {
        const response = await axios.get('https://6715da9e33bc2bfe40bb51e2.mockapi.io/Emergency');
        setEmergencyCases(response.data); // تخزين الحالات الطارئة
      } catch (error) {
        console.error('Error fetching emergency cases:', error);
      }
    };

    fetchEmergencyCases();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قسم الحالات الطارئة */}
        <div className="col-span-1">
          <h3 className="text-2xl font-bold mb-4">الحالات الطارئة النشطة</h3>
          {emergencyCases.length > 0 ? (
            <ul className="list-disc list-inside">
              {emergencyCases.map((caseItem) => (
                <li key={caseItem.id} className="mb-4">
                  <strong>نوع الحالة:</strong> {caseItem.case_type} <br />
                  <strong>الموقع:</strong> {caseItem.location.address} <br />
                  <strong>الحالة:</strong> {caseItem.status} <br />
                  {/* زر لقبول الحالة */}
                  <button 
                    className="bg-green-500 text-white py-1 px-3 rounded mt-2"
                    onClick={() => setSelectedCase(caseItem)} // اختيار الحالة وعرضها على الخريطة
                  >
                    قبول الحالة
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد حالات طارئة حالياً.</p>
          )}
        </div>

        {/* قسم الخريطة */}
        <div className="col-span-2">
          <MedicMap emergencyCases={emergencyCases} selectedCase={selectedCase} />
        </div>
      </div>
    </div>
  );
}

export default MedicPage;
