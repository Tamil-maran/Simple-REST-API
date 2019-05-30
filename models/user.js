const mongoose = require('mongoose');
const { Schema } = mongoose;
const {isEmail, isMobilePhone} = require('validator')

const bookSchema = Schema({
    name: {type: String, required: true },
    author: {type: String, required: true },
    price: Number
})

const userSchema = Schema({
    name: {type: String, required: true },
    phonenumber: { 
        type: String, 
        validate: {
            validator: isMobilePhone,
            message: '{VALUE} is not valid',
            isAsync: false
        }
    },
    email: { 
        type: String, 
        validate: {
            validator: isEmail,
            message: '{VALUE} is not valid',
            isAsync: false
        }
    },
    books:[bookSchema]
}, { collection: 'Books' });

module.exports = mongoose.model('User', userSchema);
