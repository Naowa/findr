var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var crypto = require('crypto');



/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

var UserModel = models.Users;

var genRandomString = function(length) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

var sha512 = function(password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  }
}

function saltHashPassword(userpassword) {
  var salt = genRandomString(16);
  var passwordData = sha512(userpassword, salt);
  return passwordData;
}


// router.post('/register', function(req, res, next) {
//   var body = req.body;
//   var user = new User({ email: body.email, password: body.password});
//   user.save().then(() => console.log('saved'));
// })

router.post('/register', function(req, res, next){
  var body = req.body;
  var email = body.email;
  var passwordData = saltHashPassword(body.password);
  var password = passwordData.passwordHash;
  var salt = passwordData.salt;

  var newUser = {
    email,
    password,
    salt
  };

  UserModel.create(newUser)
    .then(() => {
      res.status(200).end();
     })
    .catch((error) => { console.log(error)
      if (error.code === 11000) {
        res.status(400).send("Email already associated with an account.");
      }
    })
}) 

router.post('/login', function(req, res, next){
  if (req.session.email) res.redirect('http://localhost:3000'); //res.status(200).end();
  else if (req.body.email && req.body.password) {
    UserModel.findOne({ email: req.body.email}).then((person) => {
      if (!person) {
        res.status(400).send("Invalid email");
      }
      else {
        passwordHash = sha512(req.body.password, person.salt).passwordHash;
        console.log("ENTERED PASS: ", req.body.password, " SALT: ", person.salt, " STORED HASH PASS: ", 
        person.password, " GEN HASH PASS: ", passwordHash);
        if (passwordHash === person.password) {
          req.session.email = person.email;
          req.session.firstName = person.firstName;
          req.session.lastName = person.lastName;
          res.status(200).end();
        }
        else {
          res.status(400).send("Invalid password");
        }
      }
    })
  }
  else {
    res.status(200).send("no_cookie");
  }
})

router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.status(200).end();
})

router.get('/profile', function(req, res, next) {
  var data = {
    firstName: "",
    lastName: "",
    premium: ""
  }
  if (req.session.email) {
    UserModel.findOne({ email: req.session.email}).then((person) => {
      console.log(person);
      data.firstName = person.firstName;
      data.lastName = person.lastName;
      data.premium = person.premium;
      res.status(200).send(data);
    })
  }
  else res.status(400).end();
})

router.patch('/', function(req, res, next) {
  if (req.session.email) {
    UserModel.findOne({ email: req.session.email}).then((person) => { 
      if (!person) {
        res.status(400).send("Invalid login");
      }
      person.firstName = req.body.firstName;
      person.lastName = req.body.lastName;
      person.premium = req.body.premium;
      // UserModel.update({ email: req.session.email}, {
      //   firstName: req.body.firstName,
      //   lastName: req.body.lastName,
      // })
      person.save();
      res.status(200).end();
    })
  }
  else res.status(400).send('Outdated session');
})

module.exports = router;
