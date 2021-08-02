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

app1.get('/get_all_active_previous_movie_list', async (req, res, next) => {
    let obj;
    let time = "168";
    let moviedetails=await movieservices.findallActiveMovie(time);
    if (moviedetails.status == 'success') {
        obj = {
            status: "success",
            message: "All New Release Movie lists",
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

module.exports = app1;