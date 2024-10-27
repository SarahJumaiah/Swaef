
const Paramedic = require('../models/Paramedic'); 


const registerParamedic = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;


    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }


    const existingParamedic = await Paramedic.findOne({ email });
    if (existingParamedic) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }


    const newParamedic = new Paramedic({
      name,
      email,
      password,
      phone,
      isApproved: false,
    });


    await newParamedic.save();
    res.status(201).json({ message: 'Registration successful. Please wait for approval.' });
  } catch (error) {
    console.error('Error during paramedic registration:', error);
    res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
  }
};

const loginParamedic = async (req, res) => {
    try {
      const { email, password } = req.body;
  

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
  

      const paramedic = await Paramedic.findOne({ email, password });
      if (!paramedic) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  

      if (!paramedic.isApproved) {
        return res.status(403).json({ error: 'Account pending approval by admin.' });
      }
  

      res.status(200).json({
        id: paramedic._id,
        name: paramedic.name,
        phone: paramedic.phone,
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
  };
  
  module.exports = { registerParamedic, loginParamedic };

