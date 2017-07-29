// app/routes.js

var User = require('../app/models/user.js');
var mongoose = require('mongoose');
var domain = require('../config/domain.js');

var path = require('path'),
    fs = require('fs');

module.exports = function (app, passport, server) {

    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('signupMessage')});
        }
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function (req, res) {
        var user = req.user;
        res.render('index.ejs', {
            user: user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
