import React from 'react';
import { Link } from 'react-router-dom'; // استخدم Link لتوجيه التنقل

const Sidebar = ({ navigationItems }) => {
  return (
    <div className="h-full bg-gray-800 text-white p-6 w-64">
      <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
      <ul>
        {navigationItems.map((item, index) => (
          <li key={index} className="mb-4">
            <Link 
              to={item.link} 
              className="text-white hover:text-gray-300"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
