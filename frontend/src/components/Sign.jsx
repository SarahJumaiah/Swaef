
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { name, email, password, phone } = formData;
    const file = document.getElementById('file-upload').files[0];
  
    // Validation checks
    const nameValid = name.split(' ').length >= 3;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 6;
    const phoneValid = phone.length >= 10;
    const fileValid = file && file.type === 'application/pdf';

  
    if (!nameValid) {
      setErrorMessage('يرجى إدخال الاسم الثلاثي.');
      return;
    } else if (!emailValid) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح.');
      return;
    } else if (!passwordValid) {
      setErrorMessage('يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل.');
      return;
    } else if (!phoneValid) {
      setErrorMessage('يرجى إدخال رقم جوال صحيح.');
      return;
    } else if (!file) {
      setErrorMessage('يرجى إرفاق شهادة صحية.');
      return;
    } else if (!fileValid) {
      setErrorMessage('يجب أن يكون الملف بصيغة PDF.');
      return;
    }
  
    setErrorMessage(''); // Clear error message if all validations pass
  
    // إعداد FormData
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('phone', phone);
    formDataToSend.append('file-upload', file); // تأكد من مطابقة اسم الحقل هنا لـ file-upload
  
    axios
      .post('http://localhost:3024/api/paramedics/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center text-[#ab1c1c] text-3xl"
      >
        عودة <IoArrowBack className="mr-1" />
      </button>

      <div className="p-2 max-w-4xl w-full flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center justify-center space-y-6 mb-8 md:mb-0">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#ab1c1c] mb-2">
              انضم كمسعف تطوعي
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              كن جزءًا من فريق المسعفين التطوعي وساهم في تعزيز الرعاية الصحية.
              دورك كمسعف سيساعد في إنقاذ الأرواح ودعم المجتمع في أوقات الحاجة.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-6 space-y-6">
      <form className="rtl space-y-4" onSubmit={handleSubmit}>
        <div className="border-b border-[#ab1c1c]">
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

        <div className="border-b border-[#ab1c1c]">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 text-gray-700 bg-transparent focus:outline-none text-right"
            placeholder="أدخل رقم الهاتف"
            required
          />
        </div>

        <div>
          <label
            htmlFor="file-upload"
            className="w-full cursor-pointer p-3 border-b border-[#ab1c1c] bg-transparent text-gray-700 flex justify-between items-center"
          >
            <span id="file-label" className="text-gray-400">
              ارقق شهادتك الصحية
            </span>
            <span className="bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition duration-300">
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
              const fileName =
                e.target.files.length > 0
                  ? e.target.files[0].name
                  : 'ارقق شهادتك الصحية';
              fileLabel.textContent = fileName;
            }}
          />
        </div>
        <div className="">
  <label className="flex items-center p-3 text-gray-700 text-right text-xs">
    <input
      type="checkbox"
      onChange={handleChange}
      required
      className="ml-2 w-4 h-4 border-2 border-[#ab1c1c] rounded-md text-[#ab1c1c] focus:outline-none focus:ring-2 focus:ring-[#ab1c1c]"
    />
    <span className="leading-5">
      أقر بأنني أتحمل المسؤولية الكاملة وألتزم بتقديم الإسعافات الأولية وأوافق على استقبال إشعارات الحالات الطارئة القريبة مني.
    </span>
  </label>
</div>


        {errorMessage && (
          <div className="text-red-500 text-center mt-4">{errorMessage}</div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#ab1c1c] to-[#FF6B6B] text-white font-bold rounded-full shadow-lg hover:bg-[#961a1a] transition-all duration-300"
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