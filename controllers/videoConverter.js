const express = require('express');
const router = express.Router();
const videoeditor = require('../services/videoChange');
var app = express();

var config = require('../config');
const base_url = config.base_url;

app.post('/videoEdit',function(req,res){   
  let obj;
  let required = [];

  let link = './upload/video/3.Idiots.MP4';
  console.log(link);

  let editvideo = videoeditor.videoEdite(link);
  console.log(editvideo);

});  

module.exports = app;