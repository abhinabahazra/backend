const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/add_movie_cast', async (req, res, next) => {
    let obj;
    let required = [];
    
    if (!req.body.movie_id) required.push("movie_id");

    if (!req.body.cast_1) required.push("cast_1");
    if (!req.body.cast_2) required.push("cast_2");
    if (!req.body.cast_3) required.push("cast_3");

    if (!req.body.launch_event) required.push("launch_event");

    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;

        let checkMovie = await movieservices.findMovieById(num_movie_id);
        // console.log(checkMovie);
        // return;

        if (checkMovie.status == "success") {
            //======================================================
            let checkMovieCast = await movieservices.findMovieCastById(num_movie_id);
            // console.log(checkMovieCast);
            // return;

            if (checkMovieCast.status == "fail") {
                //================== insert ==========================
                let movieobj = {
                    num_movie_id: req.body.movie_id,
                    txt_cast_1:req.body.cast_1,
                    txt_cast_2:req.body.cast_2,
                    txt_cast_3:req.body.cast_3,
                    txt_cast_4:req.body.cast_4,
                    txt_cast_5:req.body.cast_5,
                    txt_cast_6:req.body.cast_6,
                    yn_launch_event:req.body.launch_event
        
                };
                let addMovieCast = await movieservices.add_movie_cast(movieobj);
                if (addMovieCast.status == "success") {
                    let status_no = '2';
                    let updateMoviePage = await movieservices.updateMasterPage(status_no,num_movie_id);
                    obj = {
                        status: "success",
                        message: "Movie Cast added successfully",
                        response:addMovieCast.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                }
            } else {
                obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                
            }
            //======================================================
        } else {
            obj = {
                status: "fail",
                message: "Sorry! Movie cast already added with this id",
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
})
module.exports = app1;
