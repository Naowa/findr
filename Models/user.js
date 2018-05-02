var mongoose = require('mongoose');

var UserModel = mongoose.model('User', {
    email: {
        type: String,
        unique: true
    },
    password: String,
    salt: String,
    firstName: String,
    lastName: String,
    premium: {
        type: Boolean,
        default: false
    }
});

module.exports = UserModel