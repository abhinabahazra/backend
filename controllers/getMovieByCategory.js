const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getMovieByCategory', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.category) required.push("category");
    if (required.length === 0) {
        let category = req.body.category;

        let movieDetails=await movieservices.findMovieByCategory(category);
        //console.log(movieDetails);
        if (movieDetails.status == 'success') {
            obj = {
                status: "success",
                message: "Movie Found",
                response: movieDetails.result
            };
        } else {
            obj = {
                status: "fail",
                message: "not found",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;