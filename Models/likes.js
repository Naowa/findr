var mongoose = require('mongoose');

var LikeModel = mongoose.model('Likes', new mongoose.Schema({
    image_url: String,
    email: String, 
    restaurant_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    
},
{
    timestamps: true
}));

module.exports = LikeModel;