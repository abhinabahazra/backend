const express = require('express');
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')

var app1 = express();

var configpayment = require('../config/payment.config');
const payment = configpayment;
var config = require('../config');
const redirect_url =config.redirect_url; 

const razorpay = new Razorpay({
	key_id: payment.key_id,
	key_secret: payment.key_secret
})

app1.post('/razor_pay', async (req, res) => {
	const payment_capture = 1
	const amount = req.body.amount;
	const currency = payment.currency;

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options);
		console.log(response)
		res.json({
			data: response
		})
        // res.redirect(redirect_url);
	} catch (error) {
		console.log(error);
        res.json({
			data: error
		})
	}
})


module.exports = app1;