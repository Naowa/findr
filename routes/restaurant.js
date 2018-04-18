var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var crypto = require('crypto');
var axios = require('axios');

var RestaurantModel = models.Restaurant;

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

module.exports = router;