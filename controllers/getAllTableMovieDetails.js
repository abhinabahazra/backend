const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
//const movieservices = require('../user_service/movieService');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.get('/get_Whole_allMoviedetails', async (req, res, next) => {
    let obj;
    let moviedetails=await movieservices.findalWholelMovieDetails();
    if (moviedetails.status == 'success') {
        obj = {
            status: "success",
            message: "All Movie lists are below!",
            response: moviedetails.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found",
            response: ""
        };
    }
    res.json(obj);
})


app1.post('/get_Save_Movie', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.producer_email) required.push("producer_email");
    if (required.length === 0) {
    let moviedetails=await movieservices.movieDetailsSaveType("5",req.body.producer_email);
    if (moviedetails.status == 'success') {
        obj = {
            status: "success",
            message: "All Save Movie lists are below!",
            count: moviedetails.result.length,
            response: moviedetails.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found",
            response: ""
        };
    }
} else {
    let message = required.map((item) => {
        return " " + item;
    });
    obj = {
        status: "fail",
        message: "Following fields are required for signing up - " + message,
    };
}
res.json(obj);
});


app1.post('/get_Draft_Movie', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.producer_email) required.push("producer_email");
    if (required.length === 0) {
    let moviedetails=await movieservices.movieDetailsSaveType("",req.body.producer_email);
    if (moviedetails.status == 'success') {
        obj = {
            status: "success",
            message: "All Draft Movie lists are below!",
            count: moviedetails.result.length,
            response: moviedetails.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found",
            response: ""
        };
    }
} else {
    let message = required.map((item) => {
        return " " + item;
    });
    obj = {
        status: "fail",
        message: "Following fields are required for signing up - " + message,
    };
}
res.json(obj);
});

module.exports = app1;