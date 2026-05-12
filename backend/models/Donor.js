const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bloodType: { type: String, required: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true }, 
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    }
});

donorSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Donor', donorSchema);