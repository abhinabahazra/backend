const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getMovieByTitle', async (req, res, next) => {
    let obj;
    //console.log('jiiii');
    let required = [];
    if (!req.body.movie_title) required.push("movie_title");
    if (required.length === 0) {
        let txt_movie_title = req.body.movie_title;
        console.log(txt_movie_title);
        let movieDetails=await movieservices.findbasicMovieDetailsByTitle(txt_movie_title);
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
      
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for search - " + message,
        };
    }
    res.json(obj);
    })

module.exports = app1;