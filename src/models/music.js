const mongoose = require('mongoose');

var musicSchema = new mongoose.Schema({

    name: { type: String, unique: true},
    description: String
});

module.exports = mongoose.model('music', musicSchema);