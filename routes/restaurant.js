var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var crypto = require('crypto');
var axios = require('axios');

var RestaurantModel = models.Restaurant;
var LikeModel = models.Likes;
var UserModel = models.Users;

router.get('/search', function (req, res, next) {
    let apiKey = 'z0NtsT7FSMqGMhpL4_pxXIXA7wDrUx-1UmLxKMIUzr3dgIBn-DLNw6JsfImoitqVgRxFvHnTjCtzXsyia9QgYi4Twj7P-ahlRkcKvTXe9Tx0DO2tv6EhPHhxEeLUWnYx'
    let requestUrl = 'https://api.yelp.com/v3/businesses/search'
    axios.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        params: {
            latitude: req.query.latitude,
            longitude: req.query.longitude,
            categories: req.query.categories,
        }
    }).then((response) => {
        console.log(response);
        res.json(response.data);
        let restaurants = response.data.businesses;
        restaurants.forEach(function(restaurant) {
            restaurant.photos = {
                food: [],
                drinks: [],
            }
            RestaurantModel.create(restaurant);
        })
    }).catch((error) => {
        console.log(error);
    })
})

router.get('/output', function(req, res, next) {
    RestaurantModel.find({}).then((response) => {
        res.json(response);
    }) 
})

router.get('/suggestions', function(req, res, next) {
    let slides = [];
    RestaurantModel.find({}).then((response) => {
        while (slides.length < 30) {
            let i = Math.floor(Math.random() * 20)
            slides.push({
                image: response[i].photos.food[Math.floor(Math.random() * 30)], 
                restaurant_id: response[i]._id
            });
        }
    
        res.send(slides);
    });
});

const determineLimit = (req,res,next) => {
    let session = req.session;
    let email = session.email;
    UserModel.findOne({'email': email}).then((person) => { 
        if  (!person.premium) {
            LikeModel.find({}).then((response) => {
                let likeCount = 0;
                response.forEach(function(like) {
                    let likeDate = new Date(like.createdAt);
                    let nowDate = new Date();
                    if (likeDate.getFullYear() == nowDate.getFullYear()
                        && likeDate.getMonth() == nowDate.getMonth()
                        && likeDate.getDate() == nowDate.getDate()) {
                            ++likeCount;
                        }
                })
                if (likeCount >= 10) {
                    res.status(402).send(`Payment Required. Please purchase premium subscription to like more
                    than 10 restaurants`);
                }
                else {
                    next();
                }
            })
        }
        else {
            next();
        }
    
    })
}

router.post('/likes', determineLimit, function(req, res, next) {
    let body = req.body;
    let image = body.image_url;
    let session = req.session;
    let email = session.email;
    let restaurant = body.restaurant_id;
    LikeModel.create({
        image_url: image,
        email: email,
        restaurant_id: restaurant
    });
    res.send(200);
});

router.get('/likes', function(req, res, next) {
    LikeModel.find({email: req.session.email}).populate('restaurant_id').then((response) => {
        res.send(response);
    }).catch(function(err) {
        console.log(err);
    })
});

router.delete('/likes', function(req, res, next) {
    LikeModel.find({_id: req.body.id}).remove().exec();
    res.status(200).send();
});

module.exports = router;