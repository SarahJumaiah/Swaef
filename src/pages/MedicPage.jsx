import React, { useState } from 'react';
import MedicMap from '../components/MedicPage/MedicMap';
import CaseDetails from '../components/MedicPage/CaseDetails';

const MedicPage = () => {
  const [caseInfo, setCaseInfo] = useState({
    patient: { name: 'صالح', phone: '9665527572' },
    case_type: 'ارتفاع في السكر',
    location: { address: 'العنوان غير متاح', latitude: 24.82549285000001, longitude: 46.66156005000012 },
  });

  return (
    <div className="flex space-x-6 p-6">
        
      {/* تفاصيل الحالة على اليمين */}
      <div className="w-1/2 ml-5">
        <CaseDetails caseInfo={caseInfo} />
      </div>
      {/* خريطة على اليسار */}
      <div className="w-2/3">
        <MedicMap caseLocation={[caseInfo.location.longitude, caseInfo.location.latitude]} />
      </div>

    </div>
  );
};

export default MedicPage;
