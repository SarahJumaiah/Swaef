import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full flex flex-col items-center">
        

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-28 h-auto mb-4" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#ab1c1c] mb-2">تسجيل الدخول </h3>
            <p className="text-gray-600 text-base leading-relaxed text-center">
  استمر في مسيرتك مع مجتمع المتطوعين وشارك في تحسين حياة الآخرين. دورك مهم في إحداث تغيير إيجابي، قال تعالى:
  <br />
  <span className="font-bold text-[#ab1c1c]">
    وَجَعَلْنَاهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا وَأَوْحَيْنَا إِلَيْهِمْ فِعْلَ الْخَيْرَاتِ وَإِقَامَ الصَّلَاةِ وَإِيتَاء الزَّكَاةِ وَكَانُوا لَنَا عَابِدِينَ
  </span> 
  <br />
  (73) سورة الأنبياء.
</p>


          </div>
        </div>


        <form className="rtl w-full">

          <div className="mb-4 border-b-2 border-[#ab1c1c]">
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>


          <div className="mb-4 border-b-2 border-[#ab1c1c]">
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
              placeholder="أدخل كلمة المرور"
              required
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
          <p className="text-gray-600">ليس لديك حساب؟
            <Link to="/sign" className="text-[#ab1c1c] hover:underline"> تسجيل</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
