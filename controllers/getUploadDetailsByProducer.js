const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/movieUploadDetailsByProducer', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_created) required.push("user_created");
    if (required.length === 0) {
        let txt_user_created = req.body.user_created;

        let movielist=await movieservices.movieUploadDetailsByProducer(txt_user_created);
        //console.log(movielist);
        if (movielist.status == 'success') {
            obj = {
                status: "success",
                message: "Producer Movie  Upload list!",
                response: movielist.result
            };
        } else {
            obj = {
                status: "fail",
                message: "list not found",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;