const mongoose = require('mongoose');


const paramedicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ 
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    isApproved: {
        type: Boolean,
        default: false 
    }
});


const Paramedic = mongoose.model('Paramedic', paramedicSchema);

module.exports = Paramedic;
