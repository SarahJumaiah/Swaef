const Case = require('../models/Case'); // استيراد النموذج (model)

// إنشاء حالة جديدة
exports.createCase = async (req, res) => {
    try {
        const newCase = new Case(req.body); // إنشاء حالة جديدة من البيانات المرسلة في الطلب
        await newCase.save(); // حفظ الحالة الجديدة في قاعدة البيانات
        res.status(201).json(newCase); // إرجاع الحالة الجديدة مع رمز 201 (تم الإنشاء بنجاح)
    } catch (error) {
        res.status(500).json({ message: 'Error creating case', error }); // إرجاع رسالة خطأ في حالة الفشل
    }
};

// جلب جميع الحالات
exports.getCases = async (req, res) => {
    try {
        const cases = await Case.find(); // جلب جميع الحالات من قاعدة البيانات
        res.status(200).json(cases); // إرجاع جميع الحالات مع رمز 200 (نجاح)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error }); // إرجاع رسالة خطأ في حالة الفشل
    }
};

// جلب حالة معينة بواسطة ID
exports.getCaseById = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id); // جلب الحالة بواسطة ID
        if (!caseData) {
            return res.status(404).json({ message: 'Case not found' }); // إرجاع رسالة خطأ إذا لم يتم العثور على الحالة
        }
        res.status(200).json(caseData); // إرجاع الحالة المطلوبة مع رمز 200 (نجاح)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching case', error }); // إرجاع رسالة خطأ في حالة الفشل
    }
};

// تحديث حالة معينة
exports.updateCase = async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true }); // تحديث الحالة وإرجاع البيانات المحدثة
        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' }); // إرجاع رسالة خطأ إذا لم يتم العثور على الحالة
        }
        res.status(200).json(updatedCase); // إرجاع الحالة المحدثة مع رمز 200 (نجاح)
    } catch (error) {
        res.status(500).json({ message: 'Error updating case', error }); // إرجاع رسالة خطأ في حالة الفشل
    }
};

// حذف حالة معينة
exports.deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id); // حذف الحالة بواسطة ID
        if (!deletedCase) {
            return res.status(404).json({ message: 'Case not found' }); // إرجاع رسالة خطأ إذا لم يتم العثور على الحالة
        }
        res.status(200).json({ message: 'Case deleted successfully' }); // إرجاع رسالة تأكيد الحذف مع رمز 200 (نجاح)
    } catch (error) {
        res.status(500).json({ message: 'Error deleting case', error }); // إرجاع رسالة خطأ في حالة الفشل
    }
};