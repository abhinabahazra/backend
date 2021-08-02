const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getBasicMovieDetails', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.id) required.push("id");
    if (required.length === 0) {
        let id = req.body.id;

        let movieDetails=await movieservices.findbasicMovieDetailsById(id);
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