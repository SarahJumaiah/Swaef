const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 

const paramedicRoutes = require('./routes/paramedicRoute');
const port = process.env.PORT || 3024;

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
main().catch(err => console.log("Error connecting to MongoDB: ", err));

// Routes
app.use('/api/paramedics', paramedicRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
