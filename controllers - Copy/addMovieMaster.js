const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
const upload = require("../upload_services/upload_movie_censor");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

let image_path = "upload/image/";
let video_path = "upload/video/";
let certificate_path = "upload/document/";


//=============== user registration ==========
app1.post('/add_movie', async (req, res, next) => {
  let obj;
  let required = [];
  let censor_certificate = 0;
  let certificate_link = "";

  if (!req.body.movie_title) required.push("movie_title");
  if (!req.body.movie_category) required.push("movie_category");
  if (!req.body.movie_language) required.push("movie_language");
  if (!req.body.length_min) required.push("length_min");
  if (!req.body.user_created) required.push("user_created");
  if (!req.body.release_date) required.push("release_date");
  if (!req.body.subtitle) required.push("subtitle");
  if (!req.body.director) required.push("director");
  if (!req.body.producer) required.push("producer");
  if (!req.body.publication) required.push("publication");
  if (!req.body.synopsis) required.push("synopsis");

  if (required.length === 0) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        if(req.body.movie_genre){
          movie_genre = req.body.movie_genre;
        }
        if(req.body.censor_certificate){
          censor_certificate = req.body.censor_certificate;
        }
        if(req.body.certificate_link){
          certificate_link = req.body.certificate_link;
        }
        if(req.body.director){
          director = req.body.director;
        }
        if(req.body.producer){
          producer = req.body.producer;
        }
        if(req.body.publication){
          publication = req.body.publication;
        }
        if(req.body.release_date){
          release_date = req.body.release_date;
        }
        if(req.body.synopsis){
          synopsis = req.body.synopsis;
        }

            let movie = {
              txt_movie_title: req.body.movie_title,
              num_movie_category: req.body.movie_category,
              length_min: req.body.length_min,
              num_movie_language: req.body.movie_language,
              txt_user_created: req.body.user_created,
              //num_movie_genre: movie_genre,
              num_movie_genre: req.body.movie_genre,
              yn_censor_certificate: censor_certificate, 
              txt_certificate_link: certificate_link,
              txt_director: req.body.director,
              txt_producer: req.body.producer,
              txt_publication: req.body.publication,
              dat_release_date: release_date,
              txt_synopsis: req.body.synopsis,
              yn_active: "1",
              num_movie_page: "1",
              dat_update_date: finaldt,
              yn_movie_subtitle:req.body.subtitle
          };

           // console.log(movie);
          // return;

          if (req.body.movie_id && req.body.movie_id != "") {
            console.log('if condition');
            let num_movie_id = req.body.movie_id;
            let getMovie = await movieservices.update_movie_master(movie,num_movie_id);
            console.log(getMovie);
            if (getMovie.status == "success") {
                obj = { 
                  status: "success", 
                  message: "Movie update successfully",
                  response:getMovie.result 
                };
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! An unknown error occurred"
                };
            }
          } else {
            console.log('else');
            let getMovie = await movieservices.addMovie(movie);
            //console.log(getMovie);
            if (getMovie.status == "success") {
                obj = { 
                  status: "success", 
                  message: "Movie added successfully",
                  response:getMovie.result 
                };
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! An unknown error occurred"
                };
            }
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


// app1.post('/multiple_upload', async (req, res, next) => {
//   try {
//     await upload(req, res);
//     console.log(req.files);

//     if (req.files.length <= 0) {
//       return res.send(`You must select at least 1 file.`);
//     }

//     return res.send(`Files has been uploaded.`);
//   } catch (error) {
//     console.log(error);

//     if (error.code === "LIMIT_UNEXPECTED_FILE") {
//       return res.send("Too many files to upload.");
//     }
//     return res.send(`Error when trying upload many files: ${error}`);
//   }
// });


// app1.post('/add_movie_links', async (req, res, next) => {
//   let obj;
//   let required = [];

//   let txt_banner1 = "";
//   let txt_banner2 = "";

//   let txt_screenshot1 = "";
//   let txt_screenshot2 = "";
//   let txt_screenshot3 = "";
//   let txt_screenshot4 = "";

//   let txt_trailer1 = "";
//   let txt_trailer2 = "";

//   let txt_movie = "";

//   if (!req.body.num_movie_id) required.push("num_movie_id");

//   if(!req.files)
//   {
//       console.log(req.files);
//       res.send("File was not found");
//       return;
//   }
//   return;


//   if (required.length === 0) {
      
//     let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
//     if (checkMovie.status == "success") {

//       if(req.body.txt_banner1){
//         txt_banner1 = req.body.txt_banner1;
//       }
//       if(req.body.txt_banner2){
//         txt_banner2 = req.body.txt_banner2;
//       }
//       if(req.body.txt_screenshot1){
//         txt_screenshot1 = req.body.txt_screenshot1;
//       }
//       if(req.body.txt_screenshot2){
//         txt_screenshot2 = req.body.txt_screenshot2;
//       }
//       if(req.body.txt_screenshot3){
//         txt_screenshot3 = req.body.txt_screenshot3;
//       }
//       if(req.body.txt_screenshot4){
//         txt_screenshot4 = req.body.txt_screenshot4;
//       }
//       if(req.body.txt_trailer1){
//         txt_trailer1 = req.body.txt_trailer1;
//       }
//       if(req.body.txt_trailer2){
//         txt_trailer2 = req.body.txt_trailer2;
//       }
//       if(req.body.txt_movie){
//         txt_movie = req.body.txt_movie;
//       }

//           let movie = {
//             num_movie_id: req.body.num_movie_id,
//             txt_banner1: txt_banner1,
//             txt_banner2: txt_banner2,
//             txt_screenshot1: txt_screenshot1,
//             txt_screenshot2: txt_screenshot2,
//             txt_screenshot3: txt_screenshot3,
//             txt_screenshot4: txt_screenshot4,
//             txt_trailer1: txt_trailer1,
//             txt_trailer2: txt_trailer2,
//             txt_movie: txt_movie
//         };

//         // console.log(movie);
//         // return;
        
//             let getMovie = await movieservices.addMovieLink(movie);
//           //   return;
//             if (getMovie.status == "success") {
//                 obj = { 
//                   status: "success", 
//                   message: "Movie Files added successfully",
//                   response:getMovie.result 
//                 };
//             } else {
//                 obj = {
//                     status: "fail",
//                     message: "Sorry! An unknown error occurred"
//                 };
//             }

//     } else {
//         obj = {
//             status: "fail",
//             message: "Sorry! no movie by this id",
//             response: ""
//         };
//     }
//   } else {
//       let message = required.map((item) => {
//           return " " + item;
//       });
//       obj = {
//           status: "fail",
//           message: "Following fields are required for signing up - " + message,
//       };
//   }
//   res.json(obj);
// });
app1.post('/upload_CensorCertificate', async (req, res) => {
  let obj;

  try {
        let upimg = await upload(req, res);
        //console.log(req.files);
        //console.log(req.body);
      
    let checMovie = await movieservices.findMovieById(req.body.id);
    if (checMovie.status == "success") {
        //let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
      if (req.files.length > 0 && req.body.id != "") {
        let movie = {
           id: req.body.id,
           col_value: image_path + req.files[0].filename,
           col_name: "txt_certificate_link",
        };
        let getMovie = await movieservices.updateMovieCensor(movie);
        obj = {
            status: "Success",
            message: "Files has been uploaded.",
            response: ""
        };
        return res.send(obj);
      }
      else{
        obj = {
            status: "fail",
            message: "You must select at least 1 file.",
            response: ""
        };
        return res.send(obj);
      }
    } else {
      obj = {
          status: "fail",
          message: "Sorry! no movie by this id",
          response: ""
      };
      return res.send(obj);
  }
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
});


module.exports = app1;