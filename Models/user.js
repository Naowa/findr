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
});

module.exports = UserModel