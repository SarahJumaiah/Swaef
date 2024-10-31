import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isApproved: false

  });
  const [errorMessage, setErrorMessage] = useState('');

  // بيانات الإدمن 
  const adminCredentials = {
    email: 'admin@Swaef.com', 
    password: 'admin1234',
     
  };

  const goBack = () => {
    navigate('/'); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // تحقق من بيانات الإدمن
  //   if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
  //     navigate('/admin');
  //   } else {
  //     axios.get('https://6717e676b910c6a6e02a7fd0.mockapi.io/log')
  //       .then((response) => {
  //         const users = response.data;
  //         const user = users.find((user) => user.email === formData.email && user.password === formData.password);

  //         if (user) {
  //           if (user.isApproved) {  // التحقق من اعتماد المستخدم
  //             // تخزين معرف المسعف وبياناته في localStorage
  //             localStorage.setItem('medicId', user.id);
  //             localStorage.setItem('medicName', user.name);
  //             localStorage.setItem('medicPhone', user.phone);

  //             // الانتقال إلى صفحة المسعف
  //             navigate(`/MedicPage/${user.id}`);
  //           } else {
  //             // المستخدم لم يعتمد بعد
  //             setErrorMessage('حسابك قيد المراجعة. انتظر حتى يتم اعتمادك من قبل الأدمن.');
  //           }
  //         } else {
  //           // المستخدم غير موجود أو البيانات غير صحيحة
  //           setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching users:', error);
  //         setErrorMessage('حدث خطأ أثناء محاولة تسجيل الدخول.');
  //       });
  //   }
  // };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check for admin login
    if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
      navigate('/admin');
    } else {
      // Paramedic login
      axios.post('http://localhost:3024/api/paramedics/login', formData)
        .then((response) => {
          const { id, name, phone } = response.data;
  
          // Save paramedic data to localStorage
          localStorage.setItem('medicId', id);
          localStorage.setItem('medicName', name);
          localStorage.setItem('medicPhone', phone);
  
          // Navigate to the medic's page
          navigate(`/MedicPage/${id}`);
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.error || 'Error logging in. Please try again.';
          setErrorMessage(errorMessage);
        });
    }
  };
  

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <button onClick={goBack} className="absolute top-4 left-4 flex items-center text-[#ab1c1c] text-3xl ">
        عودة <IoArrowBack className="mr-1" /> 

      </button>
      <div className="p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-2" />

          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">تسجيل الدخول</h3>
            <p className="text-gray-600 text-sm leading-relaxed lg:mb-10">
              استمر في مسيرتك مع مجتمع المتطوعين. دورك مهم في إحداث تغيير إيجابي.
            </p>
          </div>
        </div>

        <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-8 space-y-6 h-96 flex flex-col justify-center">
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          <form className="rtl space-y-4" onSubmit={handleSubmit}>
            <div className="border-b border-[#ab1c1c]">
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

            <div className="border-b border-[#ab1c1c]">
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


            <div className="mt-10">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white font-bold rounded-full shadow-lg hover:bg-[#961a1a] focus:outline-none transition-all duration-300"
                style={{ position: "relative", top: "10px" }}
              >
                دخول
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-center" style={{ position: "relative", top: "5px" }}          >
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
