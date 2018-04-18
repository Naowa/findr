var ineed = require('ineed');
var models = require('./models');

var RestaurantModel = models.Restaurant;


RestaurantModel.find({}).then((response) => {
    response.forEach(function(restaurant) {
        
        //let foodImages = [];
        //url = restaurant.url.split('/');
        url = restaurant.url.replace("biz", "biz_photos") + "&tab=food";
        console.log(url);
        //url[url.length - 1] = "o.jpg";
        //console.log(url.join('/'));
        //images.push(url.join('/'));
        //imageUrls.push(url);

        ineed.collect.images.from(url, function(err, response, result) {
            var photos = [];
            result.images.forEach(function(image) {
                if (image.alt && image.alt.includes("Photo of ")) {
                    splitted = image.src.split('/');
                    splitted[splitted.length - 1] = 'o.jpg';
                    //foodImages.push(splitted.join('/'));
                    photos.push(splitted.join('/'));
                    
                    //console.log(splitted.join('/'))
                }
            })
            restaurant.photos.food = photos;
            restaurant.save();
        })
    })
})