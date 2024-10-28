const mongoose = require('mongoose');

// تعريف المخطط (Schema) للحالة
const caseSchema = new mongoose.Schema({
    case_id: { type: Number, required: true, unique: true }, // معرف فريد للحالة
    case_type: { type: String, required: true }, // نوع الحالة (مثال: حروق، كسور، إغماء)
    location: {
        latitude: { type: Number, required: true }, // خط العرض للموقع
        longitude: { type: Number, required: true } // خط الطول للموقع
    },
    assigned_responder: {
        name: { type: String, required: false }, // اسم المسعف
        phone: { type: String, required: false } // رقم الهاتف للمسعف
    },
    status: { type: String, required: true }, // حالة الحالة (مثال: قيد الانتظار، تم قبول الحالة)
    patient: {
        name: { type: String, required: true }, // اسم المريض
        phone: { type: String, required: true } // رقم الهاتف للمريض
    },
    is_accepted: { type: Boolean, default: false } // هل تم قبول الحالة أم لا
}, {
    timestamps: true // إضافة توقيت الإنشاء والتحديث تلقائيًا
});

// إنشاء نموذج (Model) بناءً على المخطط (Schema)
module.exports = mongoose.model('Case', caseSchema);
