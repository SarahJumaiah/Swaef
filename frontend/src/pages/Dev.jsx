import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaHeartbeat, FaLock } from "react-icons/fa";
import logo from "../assets/logo.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";

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
      <header className="w-full grid grid-cols-1 lg:grid-cols-12 items-center py-20 lg:py-32 bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#3a3a3a] relative overflow-hidden px-6 lg:px-14">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-gray-600 to-black opacity-30 blur-3xl transform scale-150 -translate-y-1/2 -rotate-45"></div>

        <div className="lg:col-span-8 flex flex-col items-start z-10 text-right lg:pr-7 px-4 lg:px-0">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-opacity-0 bg-clip-text bg-gradient-to-r from-white via-gray-300 to-red-500 leading-tight mb-4">
            اربط نظامك ببيانات سواعف المتقدمة
          </h1>

          <p className="text-lg lg:text-xl text-gray-400 mb-8">
            استفد من بيانات المسعفين والحالات مباشرةً من خلال الربط الإلكتروني مع منصة سواعف عبر واجهات برمجة التطبيقات (API) المتقدمة، وادخل عالم التحليل الفوري وإدارة الأزمات.
          </p>

          <div className="flex gap-4">
            <Link to="/docs" className="hover:text-red-500">
              <button className="bg-gradient-to-r from-red-600 to-gray-800 text-white py-2 lg:py-3 px-6 lg:px-8 rounded-full hover:from-gray-800 hover:to-red-600 transition-transform transform hover:scale-105 shadow-lg">
                ابدأ الآن
              </button>
            </Link>

            <button onClick={scrollToProducts} className="bg-transparent border-2 border-red-500 text-red-500 py-2 lg:py-3 px-6 lg:px-8 rounded-full hover:bg-red-500 hover:text-white transition-transform transform hover:scale-105 shadow-lg">
              المنتجات
            </button>
          </div>

          <div className="flex gap-4 lg:gap-8 mt-6 lg:mt-10 animate-pulse z-10">
            <div className="text-gray-400 text-3xl lg:text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-react"></i></div>
            <div className="text-gray-400 text-3xl lg:text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-node-js"></i></div>
            <div className="text-gray-400 text-3xl lg:text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-js-square"></i></div>
            <div className="text-gray-400 text-3xl lg:text-5xl transform hover:scale-110 transition duration-300"><i className="fab fa-docker"></i></div>
          </div>
        </div>

        <div className="col-span-4 flex justify-center mt-8 lg:mt-0 animate-float z-20">
          <img src={logo} alt="شعار سواعف" className="w-36 h-36 lg:w-72 lg:h-72 object-contain transform transition-all duration-500 ease-in-out shadow-red-500" style={{ filter: "drop-shadow(0 0 20px rgba(255, 0, 0, 0.7))" }} />
        </div>
      </header>

      <section className="py-16 lg:py-20 bg-[#1e1e1e] text-gray-200 p-4">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 lg:mb-12 text-center text-white">
          كيف تستفيد من المنصة؟
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {['استعرض التوثيق', 'اختر الـ API', 'ابدأ التطبيق'].map((title, index) => (
            <div key={index} className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-red-500 mb-4 bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">{index + 1}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
              <p className="text-gray-400">{["ابدأ بقراءة التوثيق للحصول على معلومات شاملة عن الـ API.", "حدد الـ API المناسب لاحتياجاتك وابدأ بتنفيذه في تطبيقك.", "قم بدمج الـ API في تطبيقك واستفد من البيانات المقدمة."][index]}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={productsRef} className="py-16 lg:py-20 bg-[#121212] text-gray-200 p-4">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 lg:mb-12 text-center text-gray-100">
          المنتجات
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-5 relative z-10">
          {[{
            title: 'عرض الحالات السابقة',
            description: 'يمكنك استخدام هذا الـ API للوصول إلى قائمة بالحالات السابقة لأغراض التحليل. يتم إخفاء هوية المستخدم حفاظاً على الخصوصية.',
            icon: FaHeartbeat,
            color: 'bg-green-500'
          }, {
            title: 'عرض الحالات المتقدمة',
            description: 'هذا الـ API يقدم بيانات متقدمة للحالات الطارئة لأغراض تحليلية دقيقة. يتطلب الوصول إلى هذه البيانات مفتاح API مدفوع للاستفادة من التفاصيل الكاملة.',
            icon: FaLock,
            color: 'bg-red-500'
          }].map((product, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className={`flex items-center justify-center mb-4 ${product.color} rounded-full w-16 h-16 shadow-lg`}>
                  <product.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{product.title}</h3>
                <p className="text-gray-400 mb-4 px-4">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-r from-[#1a1a1a] to-[#111111] text-gray-200 p-4">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 lg:mb-12 text-center text-white tracking-wide">
          أهداف منصة المطورين
        </h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-center">
          {['شفافية وتمكين', 'ابتكار وتحول رقمي'].map((goal, index) => (
            <div key={index} className={`relative p-8 bg-[#2b2b2b] rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tr ${index === 0 ? 'from-blue-700 to-blue-900' : 'from-red-700 to-red-900'}`}>
              <div className="flex justify-center mb-6">
                <i className={`fas ${index === 0 ? 'fa-certificate' : 'fa-rocket'} text-5xl ${index === 0 ? 'text-blue-400' : 'text-red-400'} animate-pulse`}></i>
              </div>
              <h3 className={`text-xl font-bold mb-4 ${index === 0 ? 'text-blue-300' : 'text-red-300'}`}>{goal}</h3>
              <p className="text-gray-400 leading-relaxed">
                {["تزويد الجهات المختصة والشركات بإمكانية الوصول إلى معلومات دقيقة حول المسعفين والحالات الطارئة، مما يسهم في تحسين جودة الخدمات الطارئة وتسهيل عمليات المتابعة واتخاذ القرار.",
                  "تمكين المطورين من بناء تطبيقات ذكية تستفيد من البيانات المقدمة، ما يدعم التحول الرقمي ويساهم في تطوير حلول مبتكرة لمواجهة التحديات الطارئة وتقديم خدمات محسنة."][index]}
              </p>
              <span className={`absolute top-2 right-2 ${index === 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full w-3 h-3`}></span>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 lg:py-20 bg-[#1a1a1a] text-gray-200">
  <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 lg:mb-12 text-center text-white tracking-wide">
    فريق الدعم
  </h2>
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {[{
      name: 'فهد القحطاني',
      github: 'https://github.com/fl71-1',
      linkedin: 'https://www.linkedin.com/in/fahd-alghtani246',
    }, {
      name: 'ساره الجميعه',
      github: 'https://github.com/SarahJumaiah',
      linkedin: 'https://www.linkedin.com/in/sarah-aljumaiah-a6989b234',
    }, {
      name: 'زياد المغربي',
      github: 'https://github.com/zyad87',
      linkedin: 'https://www.linkedin.com/in/zyad-al-maghrabi-55928a304',
    }, {
      name: 'حسناء الصقر',
      github: 'https://github.com/ha20s',
      linkedin: 'https://www.linkedin.com/in/ha20s',
    }].map((member, index) => (
      <div key={index} className="text-center bg-[#2b2b2b] p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <h4 className="text-lg font-bold mb-4 text-gray-100">{member.name}</h4>
        <div className="flex justify-center gap-6">
          <a href={member.github} target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-4xl text-[#ab1c1c] hover:text-gray-300 transition duration-300" />
          </a>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-4xl text-[#ab1c1c] hover:text-blue-700 transition duration-300" />
          </a>
        </div>
      </div>
    ))}
  </div>
</section>


      <DevFooter />
    </div>
  );
};

export default Dev;
