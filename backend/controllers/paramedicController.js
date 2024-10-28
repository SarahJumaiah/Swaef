
// const Paramedic = require('../models/Paramedic'); 


// const registerParamedic = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;


//     if (!name || !email || !password || !phone) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }


//     const existingParamedic = await Paramedic.findOne({ email });
//     if (existingParamedic) {
//       return res.status(409).json({ error: 'This email is already registered.' });
//     }


//     const newParamedic = new Paramedic({
//       name,
//       email,
//       password,
//       phone,
//       isApproved: false,
//     });


//     await newParamedic.save();
//     res.status(201).json({ message: 'Registration successful. Please wait for approval.' });
//   } catch (error) {
//     console.error('Error during paramedic registration:', error);
//     res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
//   }
// };

// const loginParamedic = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  

//       if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required.' });
//       }
  

//       const paramedic = await Paramedic.findOne({ email, password });
//       if (!paramedic) {
//         return res.status(401).json({ error: 'Invalid email or password.' });
//       }
  

//       if (!paramedic.isApproved) {
//         return res.status(403).json({ error: 'Account pending approval by admin.' });
//       }
  

//       res.status(200).json({
//         id: paramedic._id,
//         name: paramedic.name,
//         phone: paramedic.phone,
//       });
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.status(500).json({ error: 'An error occurred during login. Please try again.' });
//     }
//   };

//   const getAllParamedics = async (req, res) => {
//     try {
//       const paramedics = await Paramedic.find();
//       res.status(200).json(paramedics);
//     } catch (error) {
//       console.error('Error fetching paramedics:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };


//   const approveParamedic = async (req, res) => {
//     const { id } = req.params;
//     const { isApproved } = req.body; // Use approval status from request body

//     console.log(`Approving paramedic with ID: ${id}, isApproved: ${isApproved}`);

//     try {
//         const updatedParamedic = await Paramedic.findByIdAndUpdate(
//             id,
//             { isApproved },
//             { new: true } // Return the updated document
//         );

//         if (!updatedParamedic) {
//             return res.status(404).json({ message: 'Paramedic not found' });
//         }

//         const statusMessage = isApproved ? 'approved' : 'rejected';
//         res.status(200).json({
//             message: `Paramedic ${statusMessage} successfully`,
//             paramedic: updatedParamedic,
//         });
//     } catch (error) {
//         console.error('Error updating approval status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const deleteParamedic = async (req, res) => {
//     const { id } = req.params; // Extract ID from the request parameters
  
//     try {
//       const deletedParamedic = await Paramedic.findByIdAndDelete(id); // Find and delete the paramedic by ID
  
//       if (!deletedParamedic) {
//         return res.status(404).json({ message: 'Paramedic not found' }); // Return a 404 if not found
//       }
  
//       res.status(200).json({ message: 'Paramedic deleted successfully' }); // Return success message
//     } catch (error) {
//       console.error('Error deleting paramedic:', error);
//       res.status(500).json({ message: 'Server error' }); // Return a 500 for any server errors
//     }
//   };
  

  
  
//   module.exports = { registerParamedic, loginParamedic , getAllParamedics , approveParamedic , deleteParamedic };
const multer = require('multer');
const path = require('path');
const Paramedic = require('../models/Paramedic');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

const registerParamedic = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone || !req.file) {
      return res.status(400).json({ error: 'All fields and a PDF file are required.' });
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
      pdfFile: req.file.path, 
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
      return res.status(403).json({ error: 'جاري انتظار قبولك من قبل المسؤولين' });
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

const getAllParamedics = async (req, res) => {
  try {
    const paramedics = await Paramedic.find();
    res.status(200).json(paramedics);
  } catch (error) {
    console.error('Error fetching paramedics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveParamedic = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body; // Use approval status from request body

  console.log(`Approving paramedic with ID: ${id}, isApproved: ${isApproved}`);

  try {
    const updatedParamedic = await Paramedic.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } // Return the updated document
    );

    if (!updatedParamedic) {
      return res.status(404).json({ message: 'Paramedic not found' });
    }

    const statusMessage = isApproved ? 'approved' : 'rejected';
    res.status(200).json({
      message: `Paramedic ${statusMessage} successfully`,
      paramedic: updatedParamedic,
    });
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteParamedic = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedParamedic = await Paramedic.findByIdAndDelete(id);

    if (!deletedParamedic) {
      return res.status(404).json({ message: 'Paramedic not found' });
    }

    res.status(200).json({ message: 'Paramedic deleted successfully' });
  } catch (error) {
    console.error('Error deleting paramedic:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerParamedic,
  loginParamedic,
  getAllParamedics,
  approveParamedic,
  deleteParamedic,
  upload,
};
