import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-50">
        <h1 className="text-5xl font-extrabold text-red-600 mb-6">الصفحة غير موجودة</h1>
        <p className="text-lg text-gray-700 mb-8">عذراً، الصفحة التي تحاول الوصول إليها غير موجودة.</p>
        <Link
          to="/"
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-md transition duration-300"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
    </div>
  );
};

export default NotFoundPage;
