import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = () => {
  const aboutRef = useRef(null);
  const whySwa3efRef = useRef(null);
  const joinRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slideIn");
        } else {
          entry.target.classList.remove("animate-slideIn");
        }
      });
    }, observerOptions);

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (whySwa3efRef.current) observer.observe(whySwa3efRef.current);
    if (joinRef.current) observer.observe(joinRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (whySwa3efRef.current) observer.unobserve(whySwa3efRef.current);
      if (joinRef.current) observer.unobserve(joinRef.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  return (
    <div>
      <Navbar />

      <header
        className="relative h-screen p-8 text-center bg-cover bg-center bg-no-repeat text-white rounded-b-lg shadow-lg flex flex-col justify-center items-center"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/564x/7c/b5/13/7cb513e24793c6384fcb48dad0f5b88e.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a7d77a6] to-[#073d3d] opacity-70"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            هل انت في حالة
            <span className="text-red-500 mx-2 font-black">طوارئ</span>؟
            <br />
            اضغط هنا لطلب أقرب مسعف إليك!
          </h1>

          <button className="text-2xl bg-red-700 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
            نداء استغاثه
          </button>
        </div>
      </header>

      {/* من نحن */}
      <section
        ref={aboutRef}
        className="about my-24 opacity-0 transition-opacity duration-700"
      >
        <h2 className="text-right text-teal-700 text-xl font-bold mb-4 w-[70%] mx-auto mt-14">
          من نحن؟
        </h2>
        <p className="text-right leading-relaxed text-gray-900 font-medium p-8 bg-gray-100 rounded-lg mt-8 w-[70%] mx-auto shadow-md">
          منصة <span className="text-teal-600 font-bold">سواعف</span> هي الحل
          الأمثل للحالات الطبية الطارئة، حيث تتيح للمستخدمين المسجلين طلب أقرب
          مسعف معتمد مؤهل لتقديم المساعدة الطبية الفورية. تعتمد المنصة على نظام
          متطور لربط المرضى مباشرة مع المسعفين المتاحين في مناطقهم لتلبية
          احتياجاتهم الصحية في أسرع وقت ممكن.
          <br />
          <br /> هدفنا هو تقديم خدمة طبية موثوقة وسريعة، حيث نضمن أن يحصل
          المستخدم على الدعم اللازم من المسعف الأقرب في لحظات الطوارئ الحرجة.
          بفضل شبكة المسعفين المؤهلين والمساعدات الطبية، نساهم في تقليل الزمن
          المستغرق للوصول إلى المساعدة الصحية، مما يسهم في تحسين فرص التعافي
          وتقليل المخاطر الصحية.
        </p>
      </section>

      {/* لماذا سواعف */}
      <section
        ref={whySwa3efRef}
        className="whyswa3ef p-8 w-[70%] mx-auto my-24 opacity-0 transition-opacity duration-700"
      >
        <h2 className="text-teal-700 text-xl font-bold mb-6 text-right">
          لماذا سواعف؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#aad4d2c1] p-6 rounded-lg shadow-md">
            <h3 className="text-teal-700 font-bold mb-4 flex flex-row-reverse items-center justify-end">
              المسعفون المعتمدون
              <span className="ml-2 text-teal-700">
                <i className="fas fa-user-md"></i>
              </span>
            </h3>
            <p className="text-right text-gray-900">
              جميع المسعفين المسجلين لدينا مؤهلون ومعتمدون لتقديم الرعاية الطبية
              الطارئة.
            </p>
          </div>

          <div className="bg-[#aad4d2c1] p-6 rounded-lg shadow-md">
            <h3 className="text-teal-700 font-bold mb-4 flex flex-row-reverse items-center justify-end">
              الاستجابة السريعة
              <span className="ml-2 text-teal-700">
                <i className="fas fa-ambulance"></i>
              </span>
            </h3>
            <p className="text-right text-gray-900">
              توصيل المريض بأقرب مسعف متواجد ضمن منطقة لتقديم المساعدة الفورية.
            </p>
          </div>

          <div className="bg-[#aad4d2c1] p-6 rounded-lg shadow-md">
            <h3 className="text-teal-700 font-bold mb-4 flex flex-row-reverse items-center justify-end">
              التكنولوجيا المتقدمة
              <span className="ml-2 text-teal-700">
                <i className="fas fa-satellite-dish"></i>
              </span>
            </h3>
            <p className="text-right text-gray-900">
              نعتمد على تقنيات تحديد المواقع والتواصل الفوري لتقديم الخدمة في
              الوقت المناسب.
            </p>
          </div>

          <div className="bg-[#aad4d2c1] p-6 rounded-lg shadow-md">
            <h3 className="text-teal-700 font-bold mb-4 flex flex-row-reverse items-center justify-end">
              الأمان والثقة
              <span className="ml-2 text-teal-700">
                <i className="fas fa-shield-alt"></i>
              </span>
            </h3>
            <p className="text-right text-gray-900">
              نوفر للمستخدمين وسيلة آمنة وموثوقة للتواصل مع محترفي الرعاية
              الصحية.
            </p>
          </div>
        </div>
      </section>

      {/* الانضمام */}
      <section
        ref={joinRef}
        className="join flex flex-col md:flex-row items-center justify-between w-[70%] mx-auto my-24 p-8 opacity-0 transition-opacity duration-700"
      >
        <div className="text-right md:w-1/2">
          <h2 className="text-xl text-[#0a7d77] font-bold mb-4">ساهم</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            في إنقاذ الأرواح بمهارتك الطبية وخبرتك
          </p>
          <button className="mt-6 text-lg bg-[#0a7d77] hover:bg-teal-600 text-white py-2 px-6 rounded-lg">
            الانضمام
          </button>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://www.aedcpr.com/articles/wp-content/uploads/2023/07/shutterstock_657810997.jpg"
            alt="صورة غير"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* تواصل معنا */}
      <section
        ref={contactRef}
        className="contact-us w-[70%] mx-auto mt-12 p-8 flex flex-col md:flex-row justify-between my-24 opacity-0 transition-opacity duration-700"
      >
        <div className="text-right md:w-1/2">
          <h2 className="text-2xl text-teal-700 font-bold mb-4">تواصل معنا</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            لا تتردد في التواصل معنا للحصول على أي استفسار أو مساعدة. فريقنا هنا
            لخدمتك على مدار الساعة.
          </p>
        </div>

        <div className="mt-4 md:mt-0 md:w-1/2 text-left">
          <br />
          <p className="text-gray-600 mb-2">الهاتف: +966 123456789</p>
          <p className="text-gray-600 mb-2">
            البريد الإلكتروني: info@swa3ef.com
          </p>
          <p className="text-gray-600">
            العنوان: الرياض، المملكة العربية السعودية
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
