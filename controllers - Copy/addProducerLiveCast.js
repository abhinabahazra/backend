const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/add_Producer_Live_Cast', async (req, res, next) => {
    let obj;
    let required = [];
    
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    
    if (!req.body.user_id) required.push("user_id");
    if (!req.body.txt_user) required.push("txt_user");
    if (!req.body.movie_id) required.push("movie_id");

    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;
        let num_user_id = req.body.user_id;
        let txt_user_id=req.body.txt_user;

        let checkMovie = await movieservices.findMovieById(num_movie_id);
        let checkUser1 = await movieservices.findUserById(num_user_id);
        let checkUser2 = await movieservices.findUserByTxtUser(txt_user_id);
        
        // console.log(checkMovie);
        // console.log(checkUser1);
        // console.log(checkUser2);
        // return;

        if (checkMovie.status == "success" && checkUser1.status=="success" && checkUser2.status=="success") {

            let liveCastObj = {
                num_movie_id: req.body.movie_id,
                num_user_id:req.body.user_id,
                txt_user_id:req.body.txt_user,
                dat_release_date:req.body.release_date,
                dat_livecast_date: req.body.livecast_date,
                num_duration_mins:req.body.duration_mins,
                txt_livecast_link:req.body.livecast_link,
                txt_livecast: req.body.livecast_name,
                dat_update_date:finaldt,
            };
            // console.log(liveCastObj);
            // return;
                let addProducerLiveCast = await movieservices.addProducerLiveCast(liveCastObj);
                // console.log(addProducerLiveCast);
                // return;
                if (addProducerLiveCast.status == "success") {
                    obj = {
                        status: "success",
                        message: "Producer Live cast Data Added successfully",
                        text:"Producer Live cast Data Added successfully",
                        icon:"success",
                        response: addProducerLiveCast.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        text:"Sorry! An unknown error occurred",
                        icon:"error",
                        response: ""
                    };
                }
        } else {
            obj = {
                status: "fail",
                message: "Sorry! no movie or user id or username not found by this id",
                text:"Sorry! no movie or user id or username not found by this id",
                icon:"error",
                //response: ""
            };
        }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for Insert " + message,
            text:"Following fields are required for Insert " + message,
            icon:"error",
        };
    }
    res.json(obj);
})
module.exports = app1;
