var mongoose = require('mongoose');

var RestaurantModel = mongoose.model('Restaurant', new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    alias: String,
    name: String,
    image_url: String,
    is_closed: Boolean,
    url: String,
    review_count: Number,
    categories: {},
    rating: Number,
    coordinates: {},
    rating: Number,
    transactions: [],
    price: String,
    location: {},
    phone: String,
    display_phone: String,
    distance: Number,
    photos: {
        food: [],
        drinks: []
    }
}));

module.exports = RestaurantModel;