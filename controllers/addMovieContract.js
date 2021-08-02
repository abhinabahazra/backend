const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/add_movie_contract', async (req, res, next) => {
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
    
    if (!req.body.movie_id) required.push("movie_id");

    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;
        let checkMovie = await movieservices.findMovieById(num_movie_id);
        if (checkMovie.status == "success") {

            let movieobj = {
                num_movie_id: req.body.movie_id,
                num_producer_percentage:req.body.producer_percentage,
                num_admin_percentage:req.body.admin_percentage,
                txt_user:req.body.user,
                dat_update:finaldt,
            };

            let getMovieContract = await movieservices.get_movie_contract_by_movie(num_movie_id);
            // console.log(getMovieContract);
            // return;
            if (getMovieContract.status == "fail") {
                let addMovieContract = await movieservices.add_movie_contract(movieobj);
                if (addMovieContract.status == "success") {
                    let status_no = '5';
                    let updateMoviePage = await movieservices.updateMasterPage(status_no,num_movie_id);
                    obj = {
                        status: "success",
                        message: "Movie Contract added successfully",
                        response:addMovieContract.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                }
            } else {
                let addMovieContract = await movieservices.update_movie_contract(movieobj);
                if (addMovieContract.status == "success") {
                    obj = {
                        status: "success",
                        message: "Movie Contract updated successfully",
                        response:addMovieContract.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                }
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
})
module.exports = app1;
