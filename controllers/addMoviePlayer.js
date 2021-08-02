const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');

const upload_player1=require('../upload_services/upload_player1');
const upload_player2=require('../upload_services/upload_player2');
const upload_player3=require('../upload_services/upload_player3');
const upload_player4=require('../upload_services/upload_player4');
const upload_player5=require('../upload_services/upload_player5');
const upload_player6=require('../upload_services/upload_player6');
const upload_player7=require('../upload_services/upload_player7');
const upload_player8=require('../upload_services/upload_player8');

let image_path = "upload/image/";
let video_path = "upload/video/";
let certificate_path = "upload/document/";



var app1 = express();

var config = require('../config');
const { fail } = require('assert');
const base_url = config.base_url;

app1.post('/add_movie_player', async (req, res, next) => {
  let obj;
  let required = [];
  
  if (!req.body.movie_id) required.push("movie_id");

  if (!req.body.player_name_1) required.push("player_name_1");
  if (!req.body.player_name_role_1) required.push("player_name_role_1");
  //if (!req.body.player_image_1) required.push("player_image_1");

  if (!req.body.player_name_2) required.push("player_name_2");
  if (!req.body.player_name_role_2) required.push("player_name_role_2");
  //if (!req.body.player_image_2) required.push("player_image_2");

  if (!req.body.player_name_3) required.push("player_name_3");
  if (!req.body.player_name_role_3) required.push("player_name_role_3");
  //if (!req.body.player_image_3) required.push("player_image_3");


  if (required.length === 0) {
      let num_movie_id = req.body.movie_id;

      let checkMovie = await movieservices.findMovieById(num_movie_id);
      // console.log(checkMovie);
      // return;

      if (checkMovie.status == "success") {
          //======================================================
          let checkMoviePlayer = await movieservices.findMoviePlayerById(num_movie_id);
          // console.log(checkMovieCast);
          // return;

          if (checkMoviePlayer.status == "fail") {
              //================== insert ==========================
          let movieobj = {
            num_movie_id: req.body.movie_id,

            txt_player1:req.body.player_name_1,
            txt_player1_role:req.body.player_name_role_1,
            txt_player1_image:req.body.player_image_1,

            txt_player2:req.body.player_name_2,
            txt_player2_role:req.body.player_name_role_2,
            txt_player2_image:req.body.player_image_2,

            txt_player3:req.body.player_name_3,
            txt_player3_role:req.body.player_name_role_3,
            txt_player3_image:req.body.player_image_3,

            txt_player4:req.body.player_name_4,
            txt_player4_role:req.body.player_name_role_4,
            txt_player4_image:req.body.player_image_4,

            txt_player5:req.body.player_name_5,
            txt_player5_role:req.body.player_name_role_5,
            txt_player5_image:req.body.player_image_5,

            txt_player6:req.body.player_name_6,
            txt_player6_role:req.body.player_name_role_6,
            txt_player6_image:req.body.player_image_6,

            txt_player7:req.body.player_name_7,
            txt_player7_role:req.body.player_name_role_7,
            txt_player7_image:req.body.player_image_7,

            txt_player8:req.body.player_name_8,
            txt_player8_role:req.body.player_name_role_8,
            txt_player8_image:req.body.player_image_8,
      
              };
              // console.log(movieobj);
              // return;
              let addMoviePlayer = await movieservices.add_movie_player(movieobj);
              //console.log(addMovieCast);
              if (addMoviePlayer.status == "success") {
                let status_no = '3';
                let updateMoviePage = await movieservices.updateMasterPage(status_no,num_movie_id);
                  obj = {
                      status: "success",
                      message: "Movie Player is addeded successfully",
                      response:addMoviePlayer.result 
                      };
              
              } else {
                  obj = {
                      status: "fail",
                      message: "Sorry! An unknown error occurred",
                      response: ""
                  };
              }
          } else {
              //================= update ===================
              let movieobj = {
                  num_movie_id: req.body.movie_id,

                  txt_player1:req.body.player_name_1,
                  txt_player1_role:req.body.player_name_role_1,
                  txt_player1_image:req.body.player_image_1,
      
                  txt_player2:req.body.player_name_2,
                  txt_player2_role:req.body.player_name_role_2,
                  txt_player2_image:req.body.player_image_2,
      
                  txt_player3:req.body.player_name_3,
                  txt_player3_role:req.body.player_name_role_3,
                  txt_player3_image:req.body.player_image_3,
      
                  txt_player4:req.body.player_name_4,
                  txt_player4_role:req.body.player_name_role_4,
                  txt_player4_image:req.body.player_image_4,
      
                  txt_player5:req.body.player_name_5,
                  txt_player5_role:req.body.player_name_role_5,
                  txt_player5_image:req.body.player_image_5,
      
                  txt_player6:req.body.player_name_6,
                  txt_player6_role:req.body.player_name_role_6,
                  txt_player6_image:req.body.player_image_6,
      
                  txt_player7:req.body.player_name_7,
                  txt_player7_role:req.body.player_name_role_7,
                  txt_player7_image:req.body.player_image_7,
      
                  txt_player8:req.body.player_name_8,
                  txt_player8_role:req.body.player_name_role_8,
                  txt_player8_image:req.body.player_image_8,
                  
              };
              // console.log(movieobj);
              // return;
              let updateMoviePlayer = await movieservices.update_movie_player(movieobj);
              //console.log(updateMovieCast);
              if (updateMoviePlayer.status == "success") {
                  obj = {
                      status: "success",
                      message: "Movie Player is updated successfully",
                      response:updateMoviePlayer.result 
                      };
              
              } else {
                  obj = {
                      status: "fail",
                      message: "Sorry! An unknown error occurred",
                      response: ""
                  };
              }
              
          }

          //======================================================
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


app1.post('/upload_ImagePlayer1', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player1(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player1_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player1_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
app1.post('/upload_ImagePlayer2', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player2(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player2_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player2_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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

app1.post('/upload_ImagePlayer3', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player3(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player3_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player3_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
app1.post('/upload_ImagePlayer4', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player4(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player4_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player4_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
app1.post('/upload_ImagePlayer5', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player5(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player5_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player5_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
 
app1.post('/upload_ImagePlayer6', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player6(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player6_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player6_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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

app1.post('/upload_ImagePlayer7', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player7(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player7_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player7_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
app1.post('/upload_ImagePlayer8', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_player8(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      //console.log(checkMovie);
      //return;
      if (checkMovie.status == "success") {
          let getMoviePlayer = await movieservices.findMoviePlayerById(req.body.num_movie_id);
          //console.log(getMoviePlayer);
          if (getMoviePlayer.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path+req.files[0].filename,
                  col_name: "txt_player8_image",
              };
                let getMovie = await movieservices.updateMoviePlayer(movie);
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
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path+req.files[0].filename,
                    col_name: "txt_player8_image",
                };
                let getMovie = await movieservices.addMoviePlayerByCol(movie);
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
