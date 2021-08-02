const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
const userservices = require('../services/userServices');
const addmail = require("../services/email");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/refer_tran_id', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.num_user_id) required.push("num_user_id");
    if (required.length === 0) {
        let uservalueid = {
            id: req.body.num_user_id
        }
        let getUserByid = await userservices.findUser(uservalueid, "id");
        if (getUserByid.status == "success") {
            //============ email ========================
            let checkTran = await movieservices.checkReferTran(req.body.num_user_id);
            if (checkTran.status == "success") {
                obj = {
                    status: "success",
                    message: "refer amount",
                    response : checkTran.result
                };
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! not found.",
                };
            }
            //=============================================================
        } else {
            obj = {
                status: "fail",
                message: "Sorry! user not found.",
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