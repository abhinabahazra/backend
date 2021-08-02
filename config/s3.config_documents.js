const AWS = require('aws-sdk');
const env = require('./s3.env.js');
const multerS3 = require("multer");


const s3Client = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	region : env.REGION
});

var d = new Date();
var n = d.getTime();

const uploadParams = {
         Bucket: env.Bucket_documents, 
         Key: n, 
         Body: null, 
         ContentType: multerS3.AUTO_CONTENT_TYPE,
         ACL: 'public-read'
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;

module.exports = s3;
