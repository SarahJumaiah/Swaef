import React from 'react';

const CaseDetails = ({ caseInfo }) => {
  return (
    <div className="p-6 rounded-lg mb-4 border-2 border-[#ab1c1c] bg-[#be828233]">
      <h2 className="text-2xl font-bold mb-6 text-[#ab1c1c]">معلومات الحالة الطارئة</h2>
      {caseInfo ? (
        <div className="space-y-6">
          <div className="flex flex-col">
            <strong className="text-gray-700 mb-1">اسم المريض:</strong>
            <p className="text-lg text-gray-800">{caseInfo.patient.name}</p>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 mb-1">رقم الهاتف:</strong>
            <p className="text-lg text-gray-800">{caseInfo.patient.phone}</p>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 mb-1">نوع الحالة:</strong>
            <p className="text-lg text-gray-800">{caseInfo.case_type}</p>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 mb-1">العنوان:</strong>
            <p className="text-lg text-gray-800">{caseInfo.location.address !== 'العنوان غير متاح' ? caseInfo.location.address : 'العنوان غير متاح'}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">لم يتم العثور على تفاصيل الحالة بعد.</p>
      )}
    </div>
  );
};

export default CaseDetails;
