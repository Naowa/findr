var mongoose = require('mongoose');
var Users = require('./user');
var Restaurant = require('./restaurant');
mongoose.connect('mongodb://localhost/fndr', function(error) {
    if(error) throw error
    console.log('Connected to DB');
});

module.exports = {
    Users,
    Restaurant
}