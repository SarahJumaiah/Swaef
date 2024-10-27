
const express = require('express');
const router = express.Router();
const { registerParamedic,loginParamedic } = require('../controllers/paramedicController'); // Adjust the path to the controller

router.post('/register', registerParamedic);

router.post('/login', loginParamedic);

router.get('/', (req, res) => {
    res.send('List of paramedics');
  });


  

module.exports = router;
