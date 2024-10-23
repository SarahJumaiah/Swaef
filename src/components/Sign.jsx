import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Sign() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form using useEffect whenever formData changes
  useEffect(() => {
    const { name, email, password } = formData;

    // Basic validation logic
    const nameValid = name.split(' ').length >= 3;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 6;

    // Set validation state
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
      }
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form is valid before sending the data
    if (!isFormValid) {
      return;
    }

    // Create an object with the form data to send it as JSON
    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    console.log("Sending data:", submissionData);  // تحقق من القيم

    axios.post('https://67073bf9a0e04071d2298046.mockapi.io/Medic', submissionData)
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
