import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { useEffect, useRef, useState } from "react";
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
      <header className="h-[79vh] relative p-8 text-center bg-white text-gray-800 shadow-lg flex flex-col justify-center items-center overflow-hidden header">        <div className="relative z-10 mx-auto">
          <h1 className="text-4xl mb-16 leading-tight drop-shadow-lg headertxt">
            هل انت في حالة
            <span className="text-red-600 mx-2 font-extrabold">طوارئ</span>؟
            <br />
          </h1>

          <button className="relative text-3xl mx-auto bg-red-600 text-white font-bold w-44 h-44 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none wave-button">
            نداء استغاثه
            <span className="absolute inset-0 bg-transparent rounded-full pointer-events-none wave-effect mx-auto"></span>
          </button>
        </div>
      </header>

      <Navbar />

      {/* من نحن */}
      <section
        ref={aboutRef}
        className="about my-24 opacity-0 transition-opacity duration-700 w-[90%] md:w-[70%] mx-auto"
      >
        <h2 className="text-right text-4xl text-[#ab1c1c] font-bold mb-6 mt-14">
          من نحن
        </h2>

        <div className="p-8">
          <p className="text-right leading-relaxed text-gray-900 font-medium mb-6">
            منصة{" "}
            <span className="text-[#ab1c1c] text-2xl font-bold">سواعف</span> هي
            الحل الأمثل للحالات الطبية الطارئة، حيث تتيح للمستخدمين المسجلين طلب
            أقرب مسعف معتمد مؤهل لتقديم المساعدة الطبية الفورية. تعتمد المنصة
            على نظام متطور لربط المرضى مباشرة مع المسعفين المتاحين في مناطقهم
            لتلبية احتياجاتهم الصحية في أسرع وقت ممكن.
            <br />
            <br /> هدفنا هو تقديم خدمة طبية موثوقة وسريعة، حيث نضمن أن يحصل
            المستخدم على الدعم اللازم من المسعف الأقرب في لحظات الطوارئ الحرجة.
            بفضل شبكة المسعفين المؤهلين والمساعدات الطبية، نساهم في تقليل الزمن
            المستغرق للوصول إلى المساعدة الصحية، مما يسهم في تحسين فرص التعافي
            وتقليل المخاطر الصحية.
          </p>

          <div className="flex flex-wrap md:flex-row justify-around gap-6 mt-8 lg:mx-32">
            <img
              src="https://images.unsplash.com/photo-1642438113516-982b9f57b01a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image 1"
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
            <img
              src="https://images.unsplash.com/photo-1624638764471-cffef5035746?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
            <img
              src="https://images.unsplash.com/photo-1649260257620-3fd04e1952e5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image 2"
              className="h-60 w-48 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section
        ref={whySwa3efRef}
        className="whyswa3ef p-8 w-[75%] mx-auto my-24 opacity-0 transition-opacity duration-700"
      >
        <h2 className="text-[#ab1c1c] text-4xl font-bold mb-10 text-right">
          لماذا سواعف
        </h2>{" "}
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-user-md text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              المسعفون المعتمدون
            </h3>
            <p className="text-center text-gray-600">
              جميع المسعفين المسجلين لدينا مؤهلون ومعتمدون لتقديم الرعاية الطبية
              الطارئة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-ambulance text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              الاستجابة السريعة
            </h3>
            <p className="text-center text-gray-600">
              توصيل المريض بأقرب مسعف متواجد ضمن منطقة لتقديم المساعدة الفورية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-satellite-dish text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              التكنولوجيا المتقدمة
            </h3>
            <p className="text-center text-gray-600">
              نعتمد على تقنيات تحديد المواقع والتواصل الفوري لتقديم الخدمة في
              الوقت المناسب.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl relative flex flex-col items-center">
            <div className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] p-4 rounded-full shadow-lg absolute -top-10 left-1/2 transform -translate-x-1/2">
              <i className="fas fa-shield-alt text-white text-4xl"></i>
            </div>
            <h3 className="text-[#ab1c1c] font-bold text-2xl mb-4 text-center mt-12">
              الأمان والثقة
            </h3>
            <p className="text-center text-gray-600">
              نوفر للمستخدمين وسيلة آمنة وموثوقة للتواصل مع محترفي الرعاية
              الصحية.
            </p>
          </div>
        </div>
      </section>

      {/* الانضمام */}
      <section
        ref={joinRef}
        className="join relative flex flex-col md:flex-row items-center justify-between w-[80%] mx-auto my-24 p-12 opacity-0 transition-opacity duration-700"
      >
        <div className="text-right md:w-1/2 md:pr-12 ml-12">
          <h2 className="text-2xl text-[#ab1c1c] font-extrabold mb-4">
            كن جزءًا من شبكة الإنقاذ
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            انضم إلى منصة{" "}
            <span className="text-[#ab1c1c] font-bold">سواعف</span> وساهم في
            إنقاذ الأرواح من خلال خبرتك الطبية. نحن نربطك بالمرضى في لحظات
            الطوارئ لتقديم الدعم الفوري. كل مسعف يعدّ بطلًا .
          </p>
          <button className="mt-6 text-lg bg-gradient-to-r from-[#ab1c1c] to-red-500 hover:scale-105 transform transition-transform text-white py-3 px-8 rounded-full shadow-lg font-bold">
            انضم الآن
          </button>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <img
            src="https://www.aedcpr.com/articles/wp-content/uploads/2023/07/shutterstock_657810997.jpg"
            alt="صورة مسعف"
            className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* تواصل معنا */}
      <section
        ref={contactRef}
        className="contact-us w-[80%] mx-auto mt-12 p-8 flex flex-col items-center justify-between my-24 opacity-0 transition-opacity duration-700"
      >
        <div className="text-center w-full mb-8">
          <h2 className="text-3xl text-[#ab1c1c] font-extrabold mb-4">
            تواصل معنا
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-4">
            نحن هنا لمساعدتك! لا تتردد في التواصل معنا للحصول على أي استفسار أو
            مساعدة.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            فريقنا جاهز لخدمتك على مدار الساعة. نقدر ملاحظاتك وسنرد عليك في أقرب
            وقت.
          </p>
        </div>

        <div className="w-full flex flex-col items-center">
          <h3 className="text-xl text-[#ab1c1c] font-bold mb-4">
            معلومات الاتصال
          </h3>
          <div className="flex items-center mb-4 gap-6">
            <i className="fas fa-phone-alt text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600 ml-5 ">96650875987+</span>
          </div>
          <div className="flex items-center mb-4 gap-6">
            <i className="fas fa-envelope text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600">info@swa3ef.com</span>
          </div>
          <div className="flex items-center gap-6">
            <i className="fas fa-map-marker-alt text-[#ab1c1c] text-2xl"></i>
            <span className="text-gray-600 -ml-12">
              الرياض، المملكة العربية السعودية
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
