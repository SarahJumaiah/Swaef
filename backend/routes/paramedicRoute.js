
const express = require('express');
const router = express.Router();
const { registerParamedic } = require('../controllers/paramedicController'); // Adjust the path to the controller

router.post('/register', registerParamedic);

router.get('/', (req, res) => {
    res.send('List of paramedics');
  });
  

module.exports = router;
