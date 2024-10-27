const express = require('express')
const mongoose = require('mongoose');
const app = express()
require('dotenv').config();
const paramedicRoutes = require('./routes/paramedicRoute');

const port = process.env.PORT  || 3024

app.use(express.json()); 

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
main().catch(err => console.log("Error connecting to MongoDB: ", err));

app.use('/api/paramedics', paramedicRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});