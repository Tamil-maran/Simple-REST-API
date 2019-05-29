const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = Schema({
    name: {type: String, required: true },
    author: {type: String, required: true },
    price: Number
})

const userSchema = Schema({
    name: {type: String, required: true },
    phonenumber: String,
    email: String,
    books:[bookSchema]
}, { collection: 'Books' });

module.exports = mongoose.model('User', userSchema);
