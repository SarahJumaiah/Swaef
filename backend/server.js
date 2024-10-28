require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // استيراد مكتبة CORS
const caseRoutes = require('./routes/caseRoute'); // استيراد مسارات الحالات

const app = express();
const PORT = process.env.PORT || 5000;

// استخدام CORS للسماح بالطلبات من localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

// إعدادات Middleware
app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB بدون الخيارات القديمة
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// ربط مسارات الحالات
app.use('/api/cases', caseRoutes);

// إعداد المسار الرئيسي للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('API is running...');
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
