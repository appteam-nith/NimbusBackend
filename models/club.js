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
    },
    image:{
        type: String,
        required: false
    },
    clubAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }
});


const Club = mongoose.model('Club', clubSchema);
module.exports = Club;