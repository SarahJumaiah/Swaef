// import React from 'react';
// import logo from '../assets/logo.png';
// import { Link } from 'react-router-dom';

// function Login() {
//   return (
//     <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
//       <div className="p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8"> 
//         <div className="md:w-1/2 flex flex-col items-center justify-center  mb-8 md:mb-0">
//           <img src={logo} alt="Logo" className="w-32 h-auto mb-2" />

//           <div className="text-center">
//             <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">تسجيل الدخول</h3>
//             <p className="text-gray-600 text-sm leading-relaxed lg:mb-10">
//               استمر في مسيرتك مع مجتمع المتطوعين. دورك مهم في إحداث تغيير إيجابي، قال تعالى:
//               <span className="font-bold text-[#ab1c1c]">
//                 ﴿وَجَعَلْنَاهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا وَأَوْحَيْنَا إِلَيْهِمْ فِعْلَ الْخَيْرَاتِ وَإِقَامَ الصَّلَاةِ وَإِيتَاء الزَّكَاةِ وَكَانُوا لَنَا عَابِدِينَ﴾
//               </span>

//               <span className='text-xs'>
//                  (73) سورة الأنبياء.
//               </span>      
//             </p>
//           </div>
//         </div>


//         <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-8 space-y-6 h-96 flex flex-col justify-center"> {/* Added flex properties */}
//           <form className="rtl space-y-4">
//             <div className="border-b-2 border-[#ab1c1c]">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
//                 placeholder="أدخل البريد الإلكتروني"
//                 required
//               />
//             </div>

//             <div className="border-b-2 border-[#ab1c1c]">
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
//                 placeholder="أدخل كلمة المرور"
//                 required
//               />
//             </div>

//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-[#ab1c1c] text-white font-bold rounded-lg shadow-lg hover:bg-[#961a1a] focus:outline-none transition-all duration-300"
//               >
//                 تسجيل
//               </button>
//             </div>
//           </form>


//           <div className="mt-4 text-sm text-center">
//             <p className="text-gray-600">ليس لديك حساب؟
//               <Link to="/sign" className="text-[#ab1c1c] hover:underline"> تسجيل</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';


function Login() {
  const navigate = useNavigate();


  const goBack = () => {
    navigate(-1); // This will go back one page in history
  };


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // بيانات الإدمن 
  const adminCredentials = {
    email: 'admin@Swaef.com', 
    password: 'admin1234', 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
      navigate('/admin'); 
    } else {
      axios.get('https://6717e676b910c6a6e02a7fd0.mockapi.io/log')
        .then((response) => {
          const users = response.data;
          const user = users.find((user) => user.email === formData.email && user.password === formData.password);

          if (user) {
            navigate('/MedicPage');
          } else {
            setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          }
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setErrorMessage('حدث خطأ أثناء محاولة تسجيل الدخول.');
        });
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">

<button onClick={goBack} className="absolute top-4 left-4 flex items-center text-[#ab1c1c] text-xl">
        <IoArrowBack className="mr-1" /> {/* Icon here */}

      </button>

      <div className="p-2 max-w-4xl w-full flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-2" />

          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">تسجيل الدخول</h3>
            <p className="text-gray-600 text-sm leading-relaxed lg:mb-10">
              استمر في مسيرتك مع مجتمع المتطوعين. دورك مهم في إحداث تغيير إيجابي، قال تعالى:
              <span className="font-bold text-[#ab1c1c]">
                ﴿وَجَعَلْنَاهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا وَأَوْحَيْنَا إِلَيْهِمْ فِعْلَ الْخَيْرَاتِ وَإِقَامَ الصَّلَاةِ وَإِيتَاء الزَّكَاةِ وَكَانُوا لَنَا عَابِدِينَ﴾
              </span>
              <span className='text-xs'>
                 (73) سورة الأنبياء.
              </span>      
            </p>
          </div>
        </div>

        <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-8 space-y-6 h-96 flex flex-col justify-center">
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          <form className="rtl space-y-4" onSubmit={handleSubmit}>
            <div className="border-b-2 border-[#ab1c1c]">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
    </div>
  );
}

export default Login;
