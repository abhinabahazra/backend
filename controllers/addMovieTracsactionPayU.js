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
const cors = require('cors');


app1.use(cors());
app1.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app1.use(bodyParser.json());
app1.use(bodyParser.urlencoded({
    extended: true
}));


let randNumber = crypto.randomInt(10000000000000, 99999999999999);
let key = 'B013Qo';
let salt = '2YhyQwuH';

var txnid = "";
var amount = '';
var status = '';
var mihpayid = '';

let payment_id = 'PID'+randNumber;
let order_id = 'OD'+randNumber;
let transaction_signature = 'TRAN'+randNumber;

let movie_id = '';
let user_id = '';


app1.post('/hash', (req, res) => {

  // console.log("aaaa test 4444 ====>>>",req.body);


    key = req.body.key;
    salt = req.body.salt;
    txnid = req.body.txnid;
    amount = req.body.amount;

    user_id = req.body.user_id;
    movie_id = req.body.movie_id;

    let prodinfo = req.body.productinfo;
    let fname = req.body.firstname;
    let email = req.body.email;
    let hashStr = key + "|" + txnid + "|" + amount + "|" + prodinfo + "|" + fname + "|" + email +  "|||||||||||" + salt;
    let hash = calcHash(hashStr);
    res.send({"hash": hash});
});

function calcHash(hashStr) {
    let cryp = crypto.createHash('sha512'); 
    cryp.update(hashStr);
    let hash = cryp.digest('hex');
    return hash;
}

app1.post('/response', async (req, res) => {
  try {

    // console.log(req.body);

    let referby = "";
    txnid = req.body.txnid;
    amount = req.body.amount;
    let prodinfo = req.body.productinfo;
    let fname = req.body.firstname;
    let email = req.body.email;
    status = req.body.status;
    mihpayid = req.body.mihpayid;
    
    let hashStr = salt + "|" + status + "|||||||||||" + email + "|" + fname + "|" + prodinfo + "|" + amount + "|" + txnid + "|" + key;
    if(req.body.additionalCharges) {
        let addChrges = req.body.additionalCharges;
        hashStr = addChrges + "|" + hashStr;
    }
    let hash = calcHash(hashStr);
    if(hash == req.body.hash) {
        // console.log('Success');
        // console.log("aaa",status,txnid,amount);
        // res.redirect('https://www.digimovieplex.com/response');
        //=========================== payment insert ====================
          // 'status': status, 'txnid': txnid, 'amount': amount
          // console.log('status==='+ status, 'txnid==='+ txnid, 'amount==='+ amount);
          if(status == "success")
          {
  
            let uservalueid = {
                id: req.body.num_user_id
            }
            let getUserById = await userservices.findUser(uservalueid, "id");
            if(getUserById.status == "success"){
                if(getUserById.result.txt_joining_code != ""){
                    referby =  getUserById.result.txt_joining_code;
                  }
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
                let checkCategoryMovie = await movieservices.checkCatByMovie(movie_id);
                if (checkCategoryMovie.status == "success") {
                  addHour = checkCategoryMovie.result.num_duration_in_hrs;
                }
                // console.log("========addHour==========>",addHour);
                var myDate = new Date() // your date object
                myDate.setHours(myDate.getHours() + parseInt(addHour));
  
                let date2 = ("0" + myDate.getDate()).slice(-2);
                let month2 = ("0" + (myDate.getMonth() + 1)).slice(-2);
                let year2 = myDate.getFullYear();
                let hours2 = myDate.getHours();
                let minutes2 = myDate.getMinutes();
                let seconds2 = myDate.getSeconds();
                let endDt = year2 + "-" + month2 + "-" + date2 + " " + hours2 + ":" + minutes2 + ":" + seconds2;
  // console.log("=========end time=========>",endDt);
                  let movieTran = {
                      txt_transaction_no: txnid,
                      dat_transaction_date: finaldt,
                      num_amount: amount,
                      payment_id: payment_id,
                      order_id: order_id,
                      transaction_signature: transaction_signature
                  };

                  // console.log(movieTran);
  
                  let getTran = await movieservices.insertMovieTran(movieTran);
                  if (getTran.status == "success") {
                      let movieTranUser = {
                        num_user_id : user_id,
                        num_movie_id : movie_id,
                        num_price : amount,
                        txt_transaction_no : txnid,
                        dat_start_time : finaldt,
                        dat_end_time : endDt,
                        dat_update_date : finaldt
                      };
  
                      // console.log(movieTranUser);
  
                        let getTranUser = await movieservices.insertMovieTranUser(movieTranUser);
                        if (getTranUser.status == "success") {
                          //============= refer tran store procedure call ================
                          if(referby != ""){
                            // console.log('refer===='+referby);
                            // console.log('tran===='+txnid);
                            let referTran = await userservices.insertReferTran(txnid);
                          }
                            // obj = { 
                            //   status: "success", 
                            //   message: "Transaction successfully",
                            //   response: "",
                            //   title: "Success",
                            //   text: "Transaction successfully completed!",
                            //   icon: "success",
                            // };
                            res.redirect('https://www.digimovieplex.com/getResponse');
                        } else {
                            // obj = {
                            //     status: "fail",
                            //     message: "Sorry! An unknown error occurred",
                            //     title: "Failed",
                            //     text: "Transaction could not complete!",
                            //     icon: "error",
                            // };
                            res.redirect('https://www.digimovieplex.com/getResponse');
                        }
                  } else {
                      // obj = {
                      //     status: "fail",
                      //     message: "Sorry! An unknown error occurred",
                      //     title: "Failed",
                      //     text: "Transaction could not complete!",
                      //     icon: "error",
                      // };
                      res.redirect('https://www.digimovieplex.com/getResponse');
                  }
          }
          else
          {
            // obj = {
            //     status: "fail",
            //     message: "Sorry! Transaction fail",
            //     title: "Failed",
            //     text: "Transaction could not complete!",
            //     icon: "error",
            // };
            res.redirect('https://www.digimovieplex.com/getResponse');
          }  
          //===============================================================
      } else {
          // console.log('Failure');
        //   obj = {
        //     status: "fail",
        //     message: "Sorry! Transaction fail",
        //     title: "Failed",
        //     text: "Transaction could not complete!",
        //     icon: "error",
        // };
        res.redirect('https://www.digimovieplex.com/getResponse');
      }
    } catch (error) {
      //   obj = {
      //     status: "fail",
      //     message: "Sorry! Transaction fail",
      //     response: error,
      //     title: "Failed",
      //     text: "Transaction could not complete!",
      //     icon: "error",
      // };
      res.redirect('https://www.digimovieplex.com/getResponse');
    }
    // res.send(obj);
});

app1.get('/getResponse', (req, res) => {
  // console.log('status==='+ status, 'txnid==='+ txnid, 'amount==='+ amount);
  res.send({'status': status, 'txnid': txnid, 'amount': amount, 'payUId': mihpayid});
});




module.exports = app1;