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

app1.get('/get_All_Livecast_link', async (req, res, next) => {
    let obj;
    let movieList=await movieservices.all_livecast_link();
    if (movieList.status == 'success') {
        obj = {
            status: "success",
            message: "Movie list Found",
            response: movieList.result
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