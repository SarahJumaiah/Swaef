import React, { useState } from 'react';

const Admin = () => {
  // State to track the selected menu item
  const [selectedSection, setSelectedSection] = useState('الملخص');

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedSection) {
      case 'الملخص':
        return (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">الملخص</h2>
            <p className="text-gray-700">
              هنا يمكنك الاطلاع على ملخص النشاطات والمعلومات الخاصة بلوحة التحكم.
            </p>
          </section>
        );
      case 'المسعفين':
        return (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">المسعفين</h2>
            <p className="text-gray-700">
              هنا يمكنك إدارة قائمة المسعفين، إضافة أو حذف المسعفين، أو عرض تفاصيلهم.
            </p>
          </section>
        );
      case 'تسجيل خروج':
        return (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">تسجيل خروج</h2>
            <p className="text-gray-700">تم تسجيل الخروج بنجاح.</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row h-screen bg-gray-100" dir="rtl">
           {/* Sidebar */}
      <aside className="w-1/4 bg-red-600 text-white p-6">
        <nav>
          <ul className="space-y-8">
            <li
              className={`font-bold text-xl cursor-pointer hover:bg-red-700 p-3 rounded-lg ${selectedSection === 'الملخص' ? 'bg-red-700' : ''}`}
              onClick={() => setSelectedSection('الملخص')}
            >
              الملخص
            </li>
            <li
              className={`font-bold text-xl cursor-pointer hover:bg-red-700 p-3 rounded-lg ${selectedSection === 'المسعفين' ? 'bg-red-700' : ''}`}
              onClick={() => setSelectedSection('المسعفين')}
            >
              المسعفين
            </li>
            <li
              className={`font-bold text-xl cursor-pointer hover:bg-red-700 p-3 rounded-lg ${selectedSection === 'تسجيل خروج' ? 'bg-red-700' : ''}`}
              onClick={() => setSelectedSection('تسجيل خروج')}
            >
              تسجيل خروج
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="w-3/4 bg-white p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-red-600">لوحة تحكم المشرف</h1>
        </header>

        {/* Render Content based on selected menu item */}
        {renderContent()}
      </main>

   
    </div>
  );
};

export default Admin;
