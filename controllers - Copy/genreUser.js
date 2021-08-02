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

app1.get('/genre_user_list', async (req, res, next) => {
    let obj;
    let genreUser=await movieservices.genre_user();
    if (genreUser.status == 'success') {
        obj = {
            status: "success",
            message: "Genre User list",
            response: genreUser.result
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