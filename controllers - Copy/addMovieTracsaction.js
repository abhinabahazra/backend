const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
const userservices = require('../services/userServices');
const upload = require("../upload_services/upload_movie_censor");
var app1 = express();
const crypto = require("crypto");
var configpayment = require('../config/payment.config');
const payment = configpayment;



//=============== user registration ==========
app1.post('/insert_transaction', async (req, res, next) => {
  let obj,referby;
  let required = [];
  let randNumber = crypto.randomInt(10000000000000, 99999999999999);


  if (!req.body.num_amount) required.push("num_amount");
  if (!req.body.payment_id) required.push("payment_id");
  if (!req.body.order_id) required.push("order_id");
  if (!req.body.transaction_signature) required.push("transaction_signature");


  if (!req.body.num_user_id) required.push("num_user_id");
  if (!req.body.num_movie_id) required.push("num_movie_id");


  if (required.length === 0) {
    let uservalueid = {
        id: req.body.num_user_id
    }
    let getUserById = await userservices.findUser(uservalueid, "id");
    if(getUserById.status == "success"){
      if(getUserById.result.txt_joining_code != ""){
        referby =  getUserById.result.txt_joining_code;
      }
      
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        
         //=========== check time movie category =========================
         let addHour = '0';
         let checkCategoryMovie = await movieservices.checkCatByMovie(req.body.num_movie_id);
         if (checkCategoryMovie.status == "success") {
           addHour = checkCategoryMovie.result.num_duration_in_hrs;
         }

        var myDate = new Date() // your date object
        myDate.setHours(myDate.getHours() + parseInt(addHour));

        let date2 = ("0" + myDate.getDate()).slice(-2);
        let month2 = ("0" + (myDate.getMonth() + 1)).slice(-2);
        let year2 = myDate.getFullYear();
        let hours2 = myDate.getHours();
        let minutes2 = myDate.getMinutes();
        let seconds2 = myDate.getSeconds();
        let endDt = year2 + "-" + month2 + "-" + date2 + " " + hours2 + ":" + minutes2 + ":" + seconds2;

          let movieTran = {
              txt_transaction_no: randNumber,
              dat_transaction_date: finaldt,
              num_amount: req.body.num_amount,
              payment_id: req.body.payment_id,
              order_id: req.body.order_id,
              transaction_signature: req.body.transaction_signature
          };

          // let ifTran = await movieservices.checkTran(movieTran);

          // if (ifTran.status == "fail") {
            let getTran = await movieservices.insertMovieTran(movieTran);
            if (getTran.status == "success") {
                let movieTranUser = {
                  num_user_id : req.body.num_user_id,
                  num_movie_id : req.body.num_movie_id,
                  num_price : req.body.num_amount,
                  txt_transaction_no : randNumber,
                  dat_start_time : finaldt,
                  dat_end_time : endDt,
                  dat_update_date : finaldt
                };

                // console.log(movieTranUser);

                  let getTranUser = await movieservices.insertMovieTranUser(movieTranUser);
                  if (getTranUser.status == "success") {
                    //============= refer tran store procedure call ================
                    if(referby != ""){
                      console.log('refer===='+referby);
                      console.log('tran===='+randNumber);
                      let referTran = await userservices.insertReferTran(randNumber);
                    }
                      obj = { 
                        status: "success", 
                        message: "Transaction successfully",
                        response: "",
                        title: "Success",
                        text: "Transaction successfully completed!",
                        icon: "success",
                      };
                  } else {
                      obj = {
                          status: "fail",
                          message: "Sorry! An unknown error occurred",
                          title: "Failed",
                          text: "Transaction could not complete!",
                          icon: "error",
                      };
                  }
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! An unknown error occurred",
                    title: "Failed",
                    text: "Transaction could not complete!",
                    icon: "error",
                };
            }
          // } else {
          //     obj = {
          //       status: "fail",
          //       message: "Sorry! already added",
          //       title: "Failed",
          //       text: "Transaction could not complete!",
          //       icon: "error",
          //   };
          // }   
    } else {
        obj = {
            status: "fail",
            message: "Sorry! user not found by id"
        };
    }
  } else {
      let message = required.map((item) => {
          return " " + item;
      });
      obj = {
          status: "fail",
          message: "Following fields are required for signing up - " + message,
          title: "Failed",
          text: "Transaction could not complete!",
          icon: "error",
      };
  }
  res.json(obj);
});


app1.post('/get_tran_by_id', async (req, res, next) => {
  let obj;
  let required = [];

  if (!req.body.num_user_id) required.push("num_user_id");
  if (!req.body.num_movie_id) required.push("num_movie_id");

  if (required.length === 0) {
    let chkobj ={
      user_id: req.body.num_user_id,
      movie_id: req.body.num_movie_id
    }

  let moviedetails=await movieservices.findalTranDetailsById(chkobj);
  // return;
  if (moviedetails.status == 'success') {
      obj = {
          status: "success",
          message: "All Tran details below!",
          response: moviedetails.result
      };
  } else {
      obj = {
          status: "fail",
          message: "list not found",
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