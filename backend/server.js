// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // استيراد مكتبة CORS
// const caseRoutes = require('./routes/caseRoute'); // استيراد مسارات الحالات
// const paramedicRoutes = require('./routes/paramedicRoute')

// const app = express();
// const PORT = process.env.PORT || 3024;

// // استخدام CORS للسماح بالطلبات من localhost:5173
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:5174']
//   }));
  

// // إعدادات Middleware
// app.use(express.json());

// // الاتصال بقاعدة البيانات MongoDB بدون الخيارات القديمة
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.error("MongoDB connection error:", error));

// // ربط مسارات الحالات
// app.use('/api/cases', caseRoutes);
// app.use('/api/paramedics', paramedicRoutes);

// // إعداد المسار الرئيسي للتأكد من أن الخادم يعمل
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // بدء تشغيل الخادم
// app.listen(PORT, () => {
//   console.log(Server running on port ${PORT});
// });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // استيراد مكتبة CORS
const caseRoutes = require('./routes/caseRoute'); // استيراد مسارات الحالات
const paramedicRoutes = require('./routes/paramedicRoute');
const path = require('path'); // لإعداد مسار المجلد

const app = express();
const PORT = process.env.PORT || 3024;



// استخدام CORS للسماح بالطلبات من localhost:5173 و localhost:5174
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));

// إعدادات Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // تقديم الملفات من مجلد uploads

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// ربط مسارات الحالات والمسعفين
app.use('/api/cases', caseRoutes);
app.use('/api/paramedics', paramedicRoutes);

// إعداد المسار الرئيسي للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('API is running...');
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



