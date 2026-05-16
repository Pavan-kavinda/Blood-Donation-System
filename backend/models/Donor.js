const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bloodType: { type: String, required: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true }, 
    idNumber: { type: String, required: true },
    district: { type: String, required: true }
});

module.exports = mongoose.model('Donor', donorSchema);