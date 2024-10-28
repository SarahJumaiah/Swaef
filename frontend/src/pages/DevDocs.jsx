import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DevDocs = () => {
  const [completedCases, setCompletedCases] = useState([]);
  const [medics, setMedics] = useState([]);
  const navigate = useNavigate();

  const handleProductsClick = () => {
    navigate("/dev", { state: { scrollToProducts: true } });
  };

  useEffect(() => {
    const fetchCompletedCases = async () => {
      try {
        const response = await axios.get(
          "https://67073bf9a0e04071d2298046.mockapi.io/users"
        );

        const filteredCases = response.data.filter(
          (c) => c.status === "تم إكمال الحالة"
        );
        setCompletedCases(filteredCases);
      } catch (error) {
        console.error("Error fetching completed cases:", error);
      }
    };

    const fetchMedics = async () => {
      try {
        const response = await axios.get(
          "https://6717e676b910c6a6e02a7fd0.mockapi.io/log"
        );
        setMedics(response.data);
      } catch (error) {
        console.error("Error fetching medics:", error);
      }
    };

    fetchCompletedCases();
    fetchMedics();
  }, []);

  return (
    <div className="dev-container text-white" dir="rtl">
      <DevNav />
      <header className="w-full flex flex-col items-center justify-center text-center py-48 bg-gradient-to-r from-[#121212] to-[#3a3a3a]">
        <h1 className="text-4xl font-bold text-white mb-4">
          دليل استخدام (API) سواعف
        </h1>
        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
          تعرف على كيفية استخدام (API) لعرض الحالات المكتملة والمعلومات عن
          المسعفين من خلال التعامل مع (API) سواعف خطوة بخطوة.
        </p>
        <button
          onClick={handleProductsClick}
          className="bg-gray-100 text-gray-900 py-3 px-6 rounded-full hover:bg-gray-200 transition"
        >
          استعراض المنتجات
        </button>
      </header>

      <section className="py-20 bg-[#1e1e1e] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span dir="rtl">API : عرض الحالات المكتملة</span>
        </h2>
        <div className="container mx-auto w-1/2">
          <p className="text-gray-400 mb-4">
            يُستخدم هذا الـ API لعرض الحالات المكتملة فقط. من خلال إرسال طلب
            <code> GET</code> إلى العنوان المناسب، يمكن استرجاع جميع الحالات
            التي تم إكمالها بنجاح.
          </p>
          <div className="bg-gray-800 p-4 rounded mb-4 text-left" dir="ltr">
            <div className="text-green-400">
              axios.get("https://67073bf9a0e04071d2298046.mockapi.io/users")
              <br />
              .then(response => {`{`}
              <br />
              &nbsp;&nbsp;const completedCases = response.data.filter(c =>
              c.status === "تم إكمال الحالة");
              <br />
              &nbsp;&nbsp;console.log(completedCases);
              <br />
              {`}`})<br />
              .catch(error => console.error("Error fetching cases:", error));
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            هذا المثال يوضح كيفية جلب البيانات وتصفيتها لعرض الحالات التي تم
            إكمالها فقط.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#1b1b1b] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span dir="rtl">عرض نتائج API : الحالات المكتملة</span>
        </h2>
        <div className="container mx-auto">
          <p className="text-gray-400 mb-14 text-center">
            الآن، يمكننا عرض بعض الحالات المكتملة للمستخدمين. في هذا المثال، نقوم
            بعرض أربع حالات مكتملة من أنواع مختلفة.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-8">
            {completedCases
              .filter(
                (caseItem) =>
                  caseItem.case_type === "كسور" ||
                  caseItem.case_type === "حروق" ||
                  caseItem.case_type === "إغماء" ||
                  caseItem.case_type === "اختناق"
              )
              .slice(0, 4)
              .map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    {caseItem.case_type}
                  </h3>
                  <p className="text-gray-400 mb-2">
                    المريض: {caseItem.patient.name}
                  </p>
                  <p className="text-gray-400 mb-2">
                    الحالة: {caseItem.status}
                  </p>
                  <p className="text-gray-400">
                    المسعف: {caseItem.assigned_responder?.name || "غير متوفر"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1e1e1e] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span dir="rtl">API : عرض المسعفين ومعلوماتهم</span>
        </h2>
        <div className="container mx-auto w-1/2">
          <p className="text-gray-400 mb-4">
            هذا الـ API يُتيح الوصول إلى معلومات المسعفين، بما في ذلك أسماؤهم
            وتفاصيل الاتصال، مما يساعد على توفير البيانات اللازمة لخدمات الطوارئ.
            يمكن إرسال طلب <code>GET</code> لاسترجاع قائمة المسعفين المتاحة.
          </p>
          <div className="bg-gray-800 p-4 rounded mb-4 text-left" dir="ltr">
            <div className="text-green-400">
              axios.get("https://6717e676b910c6a6e02a7fd0.mockapi.io/log")
              <br />
              .then(response => {`{`}
              <br />
              &nbsp;&nbsp;const medicsData = response.data;
              <br />
              &nbsp;&nbsp;console.log(medicsData);
              <br />
              {`}`})<br />
              .catch(error => console.error("Error fetching medics:", error));
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            هنا نقوم بجلب قائمة المسعفين المتاحة مع معلوماتهم التفصيلية.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#1b1b1b] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span dir="rtl">عرض نتائج API 2: المسعفين ومعلوماتهم</span>
        </h2>
        <div className="container mx-auto">
          <p className="text-gray-400 mb-14 text-center">
            هنا نعرض قائمة المسعفين المتاحين مع معلومات الاتصال الخاصة بكل واحد
            منهم.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-9">
            {medics.slice(0, 4).map((medic) => (
              <div
                key={medic.id}
                className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {medic.name}
                </h3>
                <p className="text-gray-400 mb-2">
                  الهاتف: {medic.phone || "غير متوفر"}
                </p>
                <p className="text-gray-400">
                  الحالة: {medic.isApproved ? "مقبول" : "غير مقبول"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DevFooter />
    </div>
  );
};

export default DevDocs;
