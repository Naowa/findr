var ineed = require('ineed');
var models = require('./models');

var RestaurantModel = models.Restaurant;

async () => {
    response = await RestaurantModel.find({});
    response.forEach(function(restaurant) {

        url = restaurant.url.replace("biz", "biz_photos");

        const p = new Promise((resolve, reject) => {
            ineed.collect.images.from(url, function(err, response, result) {
                result.images.forEach(function(image) {
                    if (image.alt && image.alt.includes("Photo of ")) {
                        splitted = image.src.split('/');
                        splitted[splitted.length - 1] = 'o.jpg';
                        restaurant.photos.food.push(splitted.join('/'));
                        //restaurant.save();
                        resolve();
                    }
                })
            })
        })

        p.then((value) => {
            
        })
    })
}
