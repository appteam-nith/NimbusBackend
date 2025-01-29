const mongoose = require('mongoose');
const Club = require('club');
const eventSchema = new mongoose.Schema({
    clubId: {type: mongoose.Schema.Type.ObjectId, ref:'Club'},
    name: {type: String, required: true},
    description: {type: String, required: true},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    winners: { type: Map, of: String }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
