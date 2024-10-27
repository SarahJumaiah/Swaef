
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

module.exports = { registerParamedic,};
