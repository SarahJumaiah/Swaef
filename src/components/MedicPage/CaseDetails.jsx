import React from 'react';

const CaseDetails = ({ caseInfo }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">معلومات الحالة الطارئة</h2>
      {caseInfo ? (
        <div className="space-y-4">
          <p><strong className="text-gray-600">اسم المريض:</strong> {caseInfo.patient.name}</p>
          <p><strong className="text-gray-600">رقم الهاتف:</strong> {caseInfo.patient.phone}</p>
          <p><strong className="text-gray-600">نوع الحالة:</strong> {caseInfo.case_type}</p>
          <p><strong className="text-gray-600">العنوان:</strong> {caseInfo.location.address !== 'العنوان غير متاح' ? caseInfo.location.address : 'العنوان غير متاح'}</p>
        </div>
      ) : (
        <p className="text-gray-500">لم يتم العثور على تفاصيل الحالة بعد.</p>
      )}
    </div>
  );
};

export default CaseDetails;
