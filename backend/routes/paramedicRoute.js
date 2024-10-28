
// const express = require('express');
// const router = express.Router();
// const { registerParamedic,loginParamedic , getAllParamedics, approveParamedic , deleteParamedic}
//  = require('../controllers/paramedicController'); 

// router.post('/register', registerParamedic);

// router.post('/login', loginParamedic);

// router.put('/approve/:id', approveParamedic);

// router.get('/all', getAllParamedics);
// router.delete('/delete/:id', deleteParamedic);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { registerParamedic, loginParamedic, getAllParamedics, approveParamedic, deleteParamedic, upload } = require('../controllers/paramedicController'); 

router.post('/register', upload.single('file-upload'), registerParamedic);

router.post('/login', loginParamedic);

router.put('/approve/:id', approveParamedic);

router.get('/all', getAllParamedics);

router.delete('/delete/:id', deleteParamedic);

module.exports = router;
