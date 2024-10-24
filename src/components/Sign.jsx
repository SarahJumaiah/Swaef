// import React from 'react';
// import logo from '../assets/logo.png';
// import { Link, useNavigate } from 'react-router-dom';

// function Sign() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
//       <div className="p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">


//         <div className="md:w-1/2 flex flex-col items-center justify-center space-y-6 mb-8 md:mb-0">
//           <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />

//           <div className="text-center">
//             <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">انضم كمسعف تطوعي</h3>
//             <p className="text-gray-600 text-base leading-relaxed">
//               كن جزءًا من فريق المسعفين التطوعي وساهم في تعزيز الرعاية الصحية. دورك كمسعف سيساعد في إنقاذ الأرواح ودعم المجتمع في أوقات الحاجة.
//             </p>
//           </div>
//         </div>


//         <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 space-y-6">
//           <form className="rtl space-y-4">

//             <div className="border-b-2 border-[#ab1c1c]">
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
//                 placeholder="أدخل اسمك الثلاثي"
//                 required
//               />
//             </div>


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


//             <div>
//               <label
//                 htmlFor="file-upload"
//                 className="w-full cursor-pointer p-3 border-b-2 border-[#ab1c1c] bg-transparent text-gray-700 flex justify-between items-center"
//               >
//                 <span id="file-label" className="text-gray-400">ارفع شهادتك الصحية</span>
//                 <span className="bg-[#ab1c1c] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
//                   اختر ملف
//                 </span>
//               </label>
//               <input
//                 type="file"
//                 id="file-upload"
//                 name="file-upload"
//                 className="hidden"
//                 onChange={(e) => {
//                   const fileLabel = document.getElementById('file-label');
//                   const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'ارفع شهادتك الصحية';
//                   fileLabel.textContent = fileName;
//                 }}
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
//             <p className="text-gray-600">
//               لديك حساب؟ 
//               <Link to="/login" className="text-[#ab1c1c] hover:underline"> تسجيل دخول</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sign;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';



function Sign() {
  const navigate = useNavigate();


  const goBack = () => {
    navigate('/'); 
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const { name, email, password ,phone} = formData;

    const nameValid = name.split(' ').length >= 3;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 6;
    const phoneValid = phone.length >= 10; 


    if (nameValid && emailValid && passwordValid) {
      setIsFormValid(true);
      setErrorMessage('');
    } else {
      setIsFormValid(false);
      if (!nameValid) {
        setErrorMessage('يرجى إدخال الاسم الثلاثي.');
      } else if (!emailValid) {
        setErrorMessage('يرجى إدخال بريد إلكتروني صالح.');
      } else if (!passwordValid) {
        setErrorMessage('يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل.');
      } else if (!phoneValid) {
        setErrorMessage('يرجى إدخال رقم جوال صحيح.');
      }
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone, 
      isApproved: false

    };

    console.log("Sending data:", submissionData); 
    axios.post('https://6717e676b910c6a6e02a7fd0.mockapi.io/log', submissionData)
      .then((response) => {
        if (response.status === 201) {
          navigate('/login');
        }
      })
      .catch((error) => {
        setErrorMessage('حدث خطأ أثناء التسجيل، الرجاء المحاولة مرة أخرى.');
        console.error('Error during registration:', error);
      });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">

<button onClick={goBack} className="absolute top-4 left-4 flex items-center text-[#ab1c1c] text-xl">
        <IoArrowBack className="mr-1" /> {/* Icon here */}

      </button>

      <div className="p-2 max-w-4xl w-full flex flex-col md:flex-row gap-8">
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
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          <form className="rtl space-y-4" onSubmit={handleSubmit}>
            <div className="border-b-2 border-[#ab1c1c]">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
            <div className="border-b-2 border-[#ab1c1c]">
  <input
    type="tel"
    id="phone"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className="w-full p-3 text-gray-700 bg-transparent focus:outline-none"
    placeholder="أدخل رقم الهاتف"
    required
  />
</div>
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
                className={`w-full py-3 bg-[#ab1c1c] text-white font-bold rounded-lg shadow-lg ${
                  isFormValid ? 'hover:bg-[#961a1a]' : 'opacity-50 cursor-not-allowed'
                } transition-all duration-300`}
                disabled={!isFormValid}
              >
                تسجيل
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-center">
            <p className="text-gray-600">
              لديك حساب؟{' '}
              <Link to="/login" className="text-[#ab1c1c] hover:underline">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;
