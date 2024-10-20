import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">الصفحة غير موجودة</h1>
      <p className="text-lg mb-6">عذراً، الصفحة التي تحاول الوصول إليها غير موجودة.</p>
      <Link to="/" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFoundPage;
