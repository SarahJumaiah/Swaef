import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    <div className="dev-container text-white">
      <DevNav scrollToProducts={scrollToProducts} />
      <header className="w-full flex flex-col items-center justify-center text-center py-48 bg-gradient-to-r from-[#121212] to-[#3a3a3a]">
        <h1 className="text-4xl font-bold text-white mb-4">
          اربط نظامك بالبيانات المقدمة من سواعف
        </h1>
        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
          استفد مباشرة من بيانات المسعفين و الحالات على منصة سواعف من خلال ربطها
          إلكترونياً بنظامك بتقنية واجهات برمجة التطبيقات (API)
        </p>
        <div className="flex gap-4">
          <button
            onClick={scrollToProducts}
            className="bg-gray-100 text-gray-900 py-3 px-6 rounded-full hover:bg-gray-200 transition"
          >
            استعراض المنتجات
          </button>
        </div>
      </header>

      <section className="py-20 bg-[#1e1e1e] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          كيف تستفيد من المنصة؟
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400 mb-2">١</div>
            <h3 className="text-xl font-bold mb-2">استعراض المنتجات</h3>
            <p>انتقل إلى قائمة المنتجات واستكشف الخدمات المتاحة.</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400 mb-2">٢</div>
            <h3 className="text-xl font-bold mb-2">سجل الدخول</h3>
            <p>اضغط على طلب اشتراك أو سجل الدخول بحسابك الحالي.</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400 mb-2">٣</div>
            <h3 className="text-xl font-bold mb-2">اشترك بالمنتج</h3>
            <p>اختر المنتج المناسب وقم بالاشتراك للحصول على الخدمة.</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400 mb-2">٤</div>
            <h3 className="text-xl font-bold mb-2">ابدأ تطبيقك</h3>
            <p>قم بإنشاء تطبيقك واستخدام المنصة بعد الاشتراك.</p>
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-20 bg-[#121212] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-100">
          المنتجات
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-5">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                API لعرض الحالات المكتملة
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              هذا الـ API يوفر لك إمكانية عرض كافة الحالات التي تمت معالجتها
              واكتملت بنجاح، مما يسهل تتبع تاريخ الحالات.
            </p>
            <button className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-6 rounded-full hover:bg-red-700 transition">
              استعراض API
            </button>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                API لعرض المسعفين ومعلوماتهم
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              هذا الـ API يتيح لك الوصول إلى معلومات المسعفين المتاحة، بما في
              ذلك بياناتهم التفصيلية والموقع الجغرافي لتقديم خدمات طوارئ مخصصة.
            </p>
            <button className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-6 rounded-full hover:bg-red-700 transition">
              استعراض API
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#2e2e2e] to-[#1a1a1a] text-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-center">
          أهداف منصة المطورين
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div>
            <div className="mb-4">
              <i className="fas fa-certificate text-6xl text-blue-400"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">
              شفافية وتمكين
            </h3>
            <p className="text-gray-400">
              تزويد الجهات المختصة والشركات بإمكانية الوصول إلى معلومات دقيقة
              حول المسعفين والحالات الطارئة، مما يسهم في تحسين جودة الخدمات
              الطارئة وتسهيل عمليات المتابعة واتخاذ القرار.
            </p>
          </div>
          <div>
            <div className="mb-4">
              <i className="fas fa-rocket text-6xl text-red-400"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">
              ابتكار وتحول رقمي
            </h3>
            <p className="text-gray-400">
              تمكين المطورين من بناء تطبيقات ذكية تستفيد من البيانات المقدمة، ما
              يدعم التحول الرقمي ويساهم في تطوير حلول مبتكرة لمواجهة التحديات
              الطارئة وتقديم خدمات محسنة.
            </p>
          </div>
        </div>
      </section>

      <DevFooter />
    </div>
  );
};

export default Dev;
