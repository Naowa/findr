var mongoose = require('mongoose');
var Users = require('./user');
mongoose.connect('mongodb://localhost/fndr', function(error) {
    if(error) throw error
    console.log('Connected to DB');
});

module.exports = {
    Users
}