import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaHeartbeat, FaLock } from "react-icons/fa"; // استدعاء الأيقونات
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

const Dev = () => {
  const productsRef = useRef(null);
  const location = useLocation();

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.state?.scrollToProducts) {
      scrollToProducts();
    }
  }, [location.state]);

  return (
    <div className="dev-container text-white mt-20">
      <DevNav scrollToProducts={scrollToProducts} />
      <header className="w-full grid grid-cols-12 items-center py-32 bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#3a3a3a] relative overflow-hidden px-14">
  {/* خلفية زخرفية */}
  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-gray-600 to-black opacity-30 blur-3xl transform scale-150 -translate-y-1/2 -rotate-45"></div>

  {/* المحتوى النصي في الجهة اليمنى ويأخذ ثمانية أعمدة */}
  <div className="col-span-8 flex flex-col items-start z-10 text-right pr-7">
  <h1 className="text-5xl font-extrabold text-white text-opacity-0 bg-clip-text bg-gradient-to-r from-white via-gray-300 to-red-500 leading-tight mb-4">
  اربط نظامك ببيانات سواعف المتقدمة
</h1>


    <p className="text-xl text-gray-400 mb-8">
      استفد من بيانات المسعفين والحالات مباشرةً من خلال الربط الإلكتروني مع منصة سواعف عبر واجهات برمجة التطبيقات (API) المتقدمة، وادخل عالم التحليل الفوري وإدارة الأزمات.
    </p>

    {/* أزرار التفاعل */}
    <div className="flex gap-4">
    <Link to="/docs" className="hover:text-red-500">

      <button
        className="bg-gradient-to-r from-red-600 to-gray-800 text-white py-3 px-8 rounded-full hover:from-gray-800 hover:to-red-600 transition-transform transform hover:scale-105 shadow-lg"
      >
            ابدأ الآن
      </button>
      </Link>

      <button
      onClick={scrollToProducts}
        className="bg-transparent border-2 border-red-500 text-red-500 py-3 px-8 rounded-full hover:bg-red-500 hover:text-white transition-transform transform hover:scale-105 shadow-lg"
      >
       المنتجات
      </button>
    </div>

    {/* أيقونات التقنيات في الأسفل */}
    <div className="flex gap-8 mt-10 animate-pulse z-10">
      <div className="text-gray-400 text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-react"></i></div>
      <div className="text-gray-400 text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-node-js"></i></div>
      <div className="text-gray-400 text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-js-square"></i></div>
      <div className="text-gray-400 text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-docker"></i></div>
    </div>
  </div>

  {/* الشعار الكبير في الجهة اليسرى ويأخذ أربعة أعمدة */}
  <div className="col-span-4 flex justify-center animate-float z-20">
    <img
      src={logo}
      alt="شعار سواعف"
      className="w-72 h-72 object-contain transform transition-all duration-500 ease-in-out shadow-red-500"
      style={{
        filter: "drop-shadow(0 0 20px rgba(255, 0, 0, 0.7))",
        background: "none",
        border: "none",
      }}
    />
  </div>
</header>





<section className="py-20 bg-[#1e1e1e] text-gray-200">
  <h2 className="text-3xl font-bold mb-12 text-center text-white">
    كيف تستفيد من المنصة؟
  </h2>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
    <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
      <div className="text-4xl font-bold text-red-500 mb-4 bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        ١
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">استعرض التوثيق</h3>
      <p className="text-gray-400">ابدأ بقراءة التوثيق للحصول على معلومات شاملة عن الـ API.</p>
    </div>
    <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
      <div className="text-4xl font-bold text-red-500 mb-4 bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        ٢
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">اختر الـ API</h3>
      <p className="text-gray-400">حدد الـ API المناسب لاحتياجاتك وابدأ بتنفيذه في تطبيقك.</p>
    </div>
    <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
      <div className="text-4xl font-bold text-red-500 mb-4 bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        ٣
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">ابدأ التطبيق</h3>
      <p className="text-gray-400">قم بدمج الـ API في تطبيقك واستفد من البيانات المقدمة.</p>
    </div>
  </div>
</section>

<section ref={productsRef} className="py-20 bg-[#121212] text-gray-200">
  <h2 className="text-3xl font-bold mb-12 text-center text-gray-100">
    المنتجات
  </h2>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-5 relative z-10">
    
    {/* بطاقة عرض الحالات السابقة - مجاني */}
    <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
      <div className="flex flex-col items-center text-center">
        {/* أيقونة مجانية */}
        <div className="flex items-center justify-center mb-4 bg-green-500 rounded-full w-16 h-16 shadow-lg">
          <FaHeartbeat className="text-white text-3xl" /> {/* أيقونة مجانية */}
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-2">عرض الحالات السابقة</h3>
        <p className="text-gray-400 mb-4 px-4">
          يمكنك استخدام هذا الـ API للوصول إلى قائمة بالحالات السابقة لأغراض التحليل. يتم إخفاء هوية المستخدم حفاظاً على الخصوصية.
        </p>
      </div>
    </div>

    {/* بطاقة عرض الحالات المتقدمة - مدفوع */}
    <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
      <div className="flex flex-col items-center text-center">
        {/* أيقونة مدفوع */}
        <div className="flex items-center justify-center mb-4 bg-red-500 rounded-full w-16 h-16 shadow-lg">
          <FaLock className="text-white text-3xl" /> {/* أيقونة مدفوع */}
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-2">عرض الحالات المتقدمة</h3>
        <p className="text-gray-400 mb-4 px-4">
          هذا الـ API يقدم بيانات متقدمة للحالات الطارئة لأغراض تحليلية دقيقة. يتطلب الوصول إلى هذه البيانات مفتاح API مدفوع للاستفادة من التفاصيل الكاملة.
        </p>
      </div>
    </div>
  </div>
</section>


<section className="py-20 bg-gradient-to-r from-[#1a1a1a] to-[#111111] text-gray-200">
  <h2 className="text-4xl font-extrabold mb-12 text-center text-white tracking-wide">
    أهداف منصة المطورين
  </h2>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
    
    <div className="relative p-8 bg-[#2b2b2b] rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tr from-blue-700 to-blue-900">
      <div className="flex justify-center mb-6">
        <i className="fas fa-certificate text-5xl text-blue-400 animate-pulse"></i>
      </div>
      <h3 className="text-xl font-bold mb-4 text-blue-300">شفافية وتمكين</h3>
      <p className="text-gray-400 leading-relaxed">
        تزويد الجهات المختصة والشركات بإمكانية الوصول إلى معلومات دقيقة حول المسعفين والحالات الطارئة، مما يسهم في تحسين جودة الخدمات الطارئة وتسهيل عمليات المتابعة واتخاذ القرار.
      </p>
      <span className="absolute top-2 right-2 bg-blue-500 rounded-full w-3 h-3"></span>
    </div>

    <div className="relative p-8 bg-[#2b2b2b] rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tr from-red-700 to-red-900">
      <div className="flex justify-center mb-6">
        <i className="fas fa-rocket text-5xl text-red-400 animate-pulse"></i>
      </div>
      <h3 className="text-xl font-bold mb-4 text-red-300">ابتكار وتحول رقمي</h3>
      <p className="text-gray-400 leading-relaxed">
        تمكين المطورين من بناء تطبيقات ذكية تستفيد من البيانات المقدمة، ما يدعم التحول الرقمي ويساهم في تطوير حلول مبتكرة لمواجهة التحديات الطارئة وتقديم خدمات محسنة.
      </p>
      <span className="absolute top-2 right-2 bg-red-500 rounded-full w-3 h-3"></span>
    </div>
    
  </div>
</section>


      <DevFooter />
    </div>
  );
};

export default Dev;
