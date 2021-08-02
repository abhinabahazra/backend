const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);

const movieservices = require('../services/movieServices');
const upload_banner1=require('../upload_services/upload_banner1');
const upload_banner2 = require("../upload_services/upload_banner2");

const upload_screenshot1 = require("../upload_services/upload_screenshot1");
const upload_screenshot2 = require("../upload_services/upload_screenshot2");
const upload_screenshot3 = require("../upload_services/upload_screenshot3");
const upload_screenshot4 = require("../upload_services/upload_screenshot4");

const upload_trailer1 = require("../upload_services/upload_trailer1");
const upload_trailer2 = require("../upload_services/upload_trailer2");
const upload_movie = require("../upload_services/upload_movie");

var app1 = express();

var config = require('../config');
const base_url = config.base_url;
let image_path = "upload/image/";
let video_path = "upload/video/";
let certificate_path = "upload/document/";


const fs = require('fs');
const sizeOf = require('image-size');
const heightpx = 400;
const weidthpx = 320;

app1.post('/add_movie_link', async (req, res, next) => {
    let obj;
    let required = [];

    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;

        let checkMovie = await movieservices.findMovieById(num_movie_id);
        // console.log(checkMovie);
        // return;

        if (checkMovie.status == "success") {

            let movieobj = {
                num_movie_id: req.body.movie_id,
    
                txt_banner1:req.body.banner_1,
                txt_banner2:req.body.banner_2,
                txt_screenshot1:req.body.screenshot_1,
                txt_screenshot2:req.body.screenshot_2,
                txt_screenshot3:req.body.screenshot_3,
                txt_screenshot4:req.body.screenshot_4,
                txt_trailer1:req.body.trailer_1,
                txt_trailer2:req.body.trailer_2,
                txt_movie:req.body.movie,
    
            };
            //console.log(userobj);
            let addMovieLink = await movieservices.add_movie_link(movieobj);
            //console.log(addMovieLink);
            if (addMovieLink.status == "success") {
              // let status_no = '4';
              // let updateMoviePage = await movieservices.updateMasterPage(status_no,num_movie_id);
                obj = {
                    status: "success",
                    message: "Movie Link registration successfully",
                    response:addMovieLink.result 
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

app1.post('/upload_banner1', async (req, res) => {
    let obj;
    
    try {
      let upimg = await upload_banner1(req, res);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
         // console.log(getMovieLink);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                //========================= file size check ============
                let imgurl = image_path+req.files[0].filename;
                  const dimensions = sizeOf(imgurl);
                  if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                    // console.log(imgurl);
                    fs.unlinkSync(imgurl);
                    obj = {
                        status: "fail",
                        message: "File size not matched.",
                        response: ""
                    };
                  } else {
                      let movie = {
                        num_movie_id: req.body.num_movie_id,
                        col_value: image_path+req.files[0].filename,
                        col_name: "txt_banner1",
                    };
                      let getMovie = await movieservices.updateMovieLink(movie);
                      obj = {
                          status: "success",
                          message: "Files has been uploaded Successfully!",
                          response: movie.col_value
                      };
                  }
                return res.send(obj);
                //======================================================
              }
              else{
               // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                if (getMovieLinkB1.status == "success") {
                  if (getMovieLinkB1.result.txt_banner1) {
                      obj = {
                        status: "success",
                        message: "bannaer file",
                        response: getMovieLinkB1.result.txt_banner1
                    };
                  } else {
                      obj = {
                        status: "fail",
                        message: "No file Exist!!",
                        response: ""
                    };
                  }
                } else {
                    obj = {
                      status: "fail",
                      message: "No file Exist!!",
                      response: ""
                  };
                }
                return res.send(obj);
                    //------------------------------end---------------------------------------
               }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                //========================= file size check ============
                let imgurl = image_path+req.files[0].filename;
                  const dimensions = sizeOf(imgurl);
                  if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                    fs.unlinkSync(imgurl);
                    obj = {
                        status: "fail",
                        message: "File size not matched.",
                        response: ""
                    };
                  } else {
                    let movie = {
                        num_movie_id: req.body.num_movie_id,
                        col_value: image_path+req.files[0].filename,
                        col_name: "txt_banner1",
                    };
                    let getMovie = await movieservices.addMovieLinkByCol(movie);
                    obj = {
                        status: "success",
                        message: "Files has been uploaded Successfully.",
                        response: movie.col_value
                    };
                  }
                return res.send(obj);
                //======================================================
              }
              else
              {
                ///------------------------------Check data from db------------------------------------------------
                let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                if (getMovieLinkB1.status == "success") {
                  if (getMovieLinkB1.result.txt_banner1) {
                      obj = {
                        status: "success",
                        message: "bannaer file",
                        response: getMovieLinkB1.result.txt_banner1
                    };
                  } else {
                      obj = {
                        status: "fail",
                        message: "No file Exist!!",
                        response: ""
                    };
                  }
                } else {
                    obj = {
                      status: "fail",
                      message: "No file Exist!!",
                      response: ""
                  };
                }
                return res.send(obj);
                //----------------------------------------------------------------------------------------------------
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

  app1.post('/upload_banner2', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_banner2(req, res);
          console.log('controller ====>>>'+upimg);
          // return;
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                //=========== file size check=======================
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_banner2",
              };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
               }
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_banner2) {
                     obj = {
                       status: "success",
                       message: "Already exist! Banner File!",
                       response: getMovieLinkB1.result.txt_banner2
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                //========================== file size check==============================
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (imensions.width > heightpx && dimensions.height > weidthpx) {
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: image_path + req.files[0].filename,
                  col_name: "txt_banner2",
              };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                // "---------------------------Check data from db------------------------------------------");
                let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                if (getMovieLinkB1.status == "success") {
                  if (getMovieLinkB1.result.txt_banner2) {
                      obj = {
                        status: "success",
                        message: "Already exist! Banner File!",
                        response: getMovieLinkB1.result.txt_banner2
                    };
                  } else {
                      obj = {
                        status: "fail",
                        message: "No file Exist!!",
                        response: ""
                    };
                  }
                } else {
                    obj = {
                      status: "fail",
                      message: "No file Exist!!",
                      response: ""
                  };
                }
                return res.send(obj);
                    //------------------------------end---------------------------------------
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
  
  app1.post('/upload_screenshot1', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_screenshot1(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                   // console.log(imgurl);
                   fs.unlinkSync(imgurl);
                   obj = {
                       status: "fail",
                       message: "File size not matched.",
                       response: ""
                   };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot1",
                };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_screenshot1) {
                     obj = {
                       status: "success",
                       message: "Already exist! ScreenShot File!",
                       response: getMovieLinkB1.result.txt_screenshot1
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot1",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                if (getMovieLinkB1.status == "success") {
                  if (getMovieLinkB1.result.txt_screenshot1) {
                      obj = {
                        status: "success",
                        message: "Already exist! ScreenShot File!",
                        response: getMovieLinkB1.result.txt_screenshot1
                    };
                  } else {
                      obj = {
                        status: "fail",
                        message: "No file Exist!!",
                        response: ""
                    };
                  }
                } else {
                    obj = {
                      status: "fail",
                      message: "No file Exist!!",
                      response: ""
                  };
                }
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
  
  app1.post('/upload_screenshot2', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_screenshot2(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot2",
                };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_screenshot2) {
                     obj = {
                       status: "success",
                       message: "Already exist! ScreenShot File!",
                       response: getMovieLinkB1.result.txt_screenshot2
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot2",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_screenshot2) {
                     obj = {
                       status: "success",
                       message: "Already exist! ScreenShot File!",
                       response: getMovieLinkB1.result.txt_screenshot2
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
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
  
  app1.post('/upload_screenshot3', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_screenshot3(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot3",
                };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                  // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_screenshot3) {
                     obj = {
                       status: "success",
                       message: "Already exist! ScreenShot File!",
                       response: getMovieLinkB1.result.txt_screenshot3
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
                
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                    // console.log(imgurl);
                    fs.unlinkSync(imgurl);
                    obj = {
                        status: "fail",
                        message: "File size not matched.",
                        response: ""
                    };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot3",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_screenshot3) {
                       obj = {
                         status: "success",
                         message: "Already exist! ScreenShot File!",
                         response: getMovieLinkB1.result.txt_screenshot3
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
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
  
  app1.post('/upload_screenshot4', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_screenshot4(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                    // console.log(imgurl);
                    fs.unlinkSync(imgurl);
                    obj = {
                        status: "fail",
                        message: "File size not matched.",
                        response: ""
                    };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot4",
                };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_screenshot4) {
                       obj = {
                         status: "success",
                         message: "Already exist! ScreenShot File!",
                         response: getMovieLinkB1.result.txt_screenshot4
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let imgurl = image_path+req.files[0].filename;
                const dimensions = sizeOf(imgurl);
                if (dimensions.width > heightpx && dimensions.height > weidthpx) {
                  // console.log(imgurl);
                  fs.unlinkSync(imgurl);
                  obj = {
                      status: "fail",
                      message: "File size not matched.",
                      response: ""
                  };
                } else {
                  let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: image_path + req.files[0].filename,
                    col_name: "txt_screenshot4",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
              }
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_screenshot4) {
                       obj = {
                         status: "success",
                         message: "Already exist! ScreenShot File!",
                         response: getMovieLinkB1.result.txt_screenshot4
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
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
  
  app1.post('/upload_trailer1', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_trailer1(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: video_path + req.files[0].filename,
                  col_name: "txt_trailer1",
              };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_trailer1) {
                       obj = {
                         status: "success",
                         message: "Already exist! Trailer File!",
                         response: getMovieLinkB1.result.txt_trailer1
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: video_path + req.files[0].filename,
                    col_name: "txt_trailer1",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                return res.send(obj);
              }
              else{
                  // "---------------------------Check data from db------------------------------------------");
               let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
               if (getMovieLinkB1.status == "success") {
                 if (getMovieLinkB1.result.txt_trailer1) {
                     obj = {
                       status: "success",
                       message: "Already exist! Trailer File!",
                       response: getMovieLinkB1.result.txt_trailer1
                   };
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
               } else {
                   obj = {
                     status: "fail",
                     message: "No file Exist!!",
                     response: ""
                 };
               }
               return res.send(obj);
                   //------------------------------end---------------------------------------
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
  
  app1.post('/upload_trailer2', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_trailer2(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: video_path + req.files[0].filename,
                  col_name: "txt_trailer2",
              };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_trailer2) {
                       obj = {
                         status: "success",
                         message: "Already exist! Trailer File!",
                         response: getMovieLinkB1.result.txt_trailer2
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: video_path + req.files[0].filename,
                    col_name: "txt_trailer2",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_trailer2) {
                       obj = {
                         status: "success",
                         message: "Already exist! Trailer File!",
                         response: getMovieLinkB1.result.txt_trailer2
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
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
  
  app1.post('/upload_movie', async (req, res) => {
    let obj;
    try {
          let upimg = await upload_movie(req, res);
          // console.log(req.files);
          // console.log(req.body);
      let checkMovie = await movieservices.findMovieById(req.body.num_movie_id);
      if (checkMovie.status == "success") {
          let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
          if (getMovieLink.status == "success") {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                  num_movie_id: req.body.num_movie_id,
                  col_value: video_path + req.files[0].filename,
                  col_name: "txt_movie",
              };
                let getMovie = await movieservices.updateMovieLink(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                let status_no = '4';
                let updateMoviePage = await movieservices.updateMasterPage(status_no,req.body.num_movie_id);
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_movie) {
                       obj = {
                         status: "success",
                         message: "Already exist!Movie File!",
                         response: getMovieLinkB1.result.txt_movie
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
              }
          } else {
              if (req.files.length > 0 && req.body.num_movie_id != "") {
                let movie = {
                    num_movie_id: req.body.num_movie_id,
                    col_value: video_path + req.files[0].filename,
                    col_name: "txt_movie",
                };
                let getMovie = await movieservices.addMovieLinkByCol(movie);
                obj = {
                    status: "success",
                    message: "Files has been uploaded Successfully.",
                    response: movie.col_value
                };
                return res.send(obj);
              }
              else{
                 // "---------------------------Check data from db------------------------------------------");
                 let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
                 if (getMovieLinkB1.status == "success") {
                   if (getMovieLinkB1.result.txt_movie) {
                       obj = {
                         status: "success",
                         message: "Already exist!Movie File!",
                         response: getMovieLinkB1.result.txt_movie
                     };
                   } else {
                       obj = {
                         status: "fail",
                         message: "No file Exist!!",
                         response: ""
                     };
                   }
                 } else {
                     obj = {
                       status: "fail",
                       message: "No file Exist!!",
                       response: ""
                   };
                 }
                 return res.send(obj);
                     //------------------------------end---------------------------------------
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