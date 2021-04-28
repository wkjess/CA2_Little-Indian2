const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const MusicSchema = new Schema({

    name: { type: String, unique: true},
    description: String
});

module.exports = mongoose.model('music', MusicSchema);