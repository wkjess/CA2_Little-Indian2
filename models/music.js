var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({ 
    name: { type: String, unique: true},
    item: String,
    price: Number
},
{ vegetarian: true }
);

module.exports = mongoose.model('Item', itemSchema);