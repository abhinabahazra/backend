const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getMovieCastDetails', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.movie_id) required.push("movie_id");
    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;

        let movieDetails=await movieservices.findMovieCastById(num_movie_id);
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