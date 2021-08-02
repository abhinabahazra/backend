const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const movieservices = require('../services/movieServices');
const addmail = require("../services/email");
var app1 = express();



app1.post('/give_rating', async (req, res) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (!req.body.movie_id) required.push("movie_id");
    if (!req.body.movie_rating) required.push("movie_rating");
    if (!req.body.user_feedback) required.push("user_feedback");
    
    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;
        let checkMovie = await movieservices.findMovieById(num_movie_id);
        if (checkMovie.status == "success") {
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
           
            let uservalueid = {
                id: req.body.user_id
            }
            let getUserByid = await userservices.findUser(uservalueid, "id");
                if (getUserByid.status == "success") {
                //====================================
                let ratingobj = {
                        num_user_id: getUserByid.result.num_user_id,
                        txt_user_id: getUserByid.result.txt_user_id,
                        num_movie_id: req.body.movie_id,
                        num_movie_rating: req.body.movie_rating,
                        txt_feedback: req.body.user_feedback,
                        dat_feedback_date: finaldt
                    };
                    // console.log(ratingobj);
                    //return;
                let getRating = await movieservices.check_user_rating(req.body.user_id,req.body.movie_id);
                if (getRating.status == "success") {
                    let giverating = await movieservices.update_user_rating(ratingobj);
                    if (giverating.status == "success") {
                        obj = {
                            status: "success",
                            message: "rating updated successfully",
                            response: giverating.result 
                            };
                    
                    } else {
                        obj = {
                            status: "fail",
                            message: "Sorry! An unknown error occurred",
                            response: ""
                        };
                    }
                } else {
                    let giverating = await movieservices.add_user_rating(ratingobj);
                    if (giverating.status == "success") {
                        obj = {
                            status: "success",
                            message: "rating given successfully",
                            response: giverating.result 
                            };
                    
                    } else {
                        obj = {
                            status: "fail",
                            message: "Sorry! An unknown error occurred",
                            response: ""
                        };
                    }
                }
                //====================================
                } else {
                    obj = { 
                        status: "fail", 
                        message: "user does not exist", 
                        response: "" 
                    };
                }
        } else {
            obj = {
                status: "fail",
                message: "Sorry! no movie by this id",
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
});



module.exports = app1;