import React from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Sign() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">


        <div className="md:w-1/2 flex flex-col items-center justify-center space-y-6 mb-8 md:mb-0">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />

          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">انضم كمسعف تطوعي</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              كن جزءًا من فريق المسعفين التطوعي وساهم في تعزيز الرعاية الصحية. دورك كمسعف سيساعد في إنقاذ الأرواح ودعم المجتمع في أوقات الحاجة.
            </p>
          </div>
        </div>


        <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 space-y-6">
          <form className="rtl space-y-4">

            <div className="border-b-2 border-[#ab1c1c]">
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
                placeholder="أدخل اسمك الثلاثي"
                required
              />
            </div>


            <div className="border-b-2 border-[#ab1c1c]">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>


            <div className="border-b-2 border-[#ab1c1c]">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="file-upload"
                className="w-full cursor-pointer p-3 border-b-2 border-[#ab1c1c] bg-transparent text-gray-700 flex justify-between items-center"
              >
                <span id="file-label" className="text-gray-400">ارفع شهادتك الصحية</span>
                <span className="bg-[#ab1c1c] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
                  اختر ملف
                </span>
              </label>
              <input
                type="file"
                id="file-upload"
                name="file-upload"
                className="hidden"
                onChange={(e) => {
                  const fileLabel = document.getElementById('file-label');
                  const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'ارفع شهادتك الصحية';
                  fileLabel.textContent = fileName;
                }}
              />
            </div>


            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-[#ab1c1c] text-white font-bold rounded-lg shadow-lg hover:bg-[#961a1a] focus:outline-none transition-all duration-300"
              >
                تسجيل
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-center">
            <p className="text-gray-600">
              لديك حساب؟ 
              <Link to="/login" className="text-[#ab1c1c] hover:underline"> تسجيل دخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;
