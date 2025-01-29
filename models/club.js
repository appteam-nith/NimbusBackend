const mongoose = require('mongoose');


const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});


const Club = mongoose.model('Club', clubSchema);
module.exports = Club;