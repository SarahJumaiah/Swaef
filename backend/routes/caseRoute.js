const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController'); // استيراد caseController

// مسار لإنشاء حالة جديدة
router.post('/', caseController.createCase);

// مسار لجلب جميع الحالات
router.get('/', caseController.getCases);

// مسار لجلب حالة معينة بواسطة ID
router.get('/:id', caseController.getCaseById);

// مسار لتحديث حالة معينة
router.put('/:id', caseController.updateCase);

// مسار لحذف حالة معينة
router.delete('/:id', caseController.deleteCase);

module.exports = router;
