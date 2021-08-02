const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const movieservices = require('../services/movieServices');

const CONFIG = require('../config/config');
const app = express()


app.use(bodyParser.json())

const BUCKET_NAME = CONFIG['globals']["AWS-BUCKET-NAME"];
const s3 = new AWS.S3({
	accessKeyId: CONFIG['globals']["ACCESS-ID"], 
	secretAccessKey: CONFIG['globals']["AWS-SECRET-KEY"], 
	signatureVersion: CONFIG['globals']["VERSION"]
});

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', (req, res, next) => {
	res.send('Hello World!')
})

app.get('/start-upload', async (req, res) => {
	try {
        if (req.query.fileName == "") {
            //let num_movie_id = "277";
			let num_movie_id = req.query.num_movie_id;
            let col_name=req.query.col_name;

            if (col_name == "txt_livecast") {
                let getProducerCast = await movieservices.findLiveCastId(num_movie_id);
                if (getProducerCast.status == "success") {
                if ( getProducerCast.result.txt_livecast) {
                        obj = {
                            status: "success",
                            uploadId: "",
                            message: "Already exist Live_Cast File!",
                            response: getProducerCast.result.txt_livecast
                        };
                    } else {
                        obj = {
                            status: "fail",
                            uploadId: "",
                            message: "No file Exist!!",
                            response: ""
                        };
                    }
                } else {
                    obj = {
                        status: "fail",
                        uploadId: "",
                        message: "No file Exist!!",
                        response: ""
                    };
                }
            } else {
                //let col_name="txt_movie";
                let getMovieLinkB1 = await movieservices.findMovieLinkById(num_movie_id);
                if (getMovieLinkB1.status == "success") {
                if (getMovieLinkB1.result[col_name]) {
                        obj = {
                            status: "success",
                            uploadId: "",
                            message: "Already exist Movie File!",
                            response: getMovieLinkB1.result[col_name]
                        };
                    } else {
                        obj = {
                            status: "fail",
                            uploadId: "",
                            message: "No file Exist!!",
                            response: ""
                        };
                    }
                } else {
                    obj = {
                        status: "fail",
                        uploadId: "",
                        message: "No file Exist!!",
                        response: ""
                    };
                }
            }
            res.send(obj);
        } else {
			let params = {
				Bucket: BUCKET_NAME,
				Key: req.query.fileName,
				ContentType: req.query.fileType
			};
            return new Promise(
                (resolve, reject) => s3.createMultipartUpload(params, (err, uploadData) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.send({ uploadId: uploadData.UploadId }));
                    }
                })
            );
        }
	} catch (err) {
		bj = {
			status: "fail",
			message: "Error",
			response: err
		};
		res.json(obj);
	}
});

app.get('/get-upload-url', async (req, res) => {

	try {
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.query.fileName,
			PartNumber: req.query.partNumber,
			UploadId: req.query.uploadId
		}

		return new Promise(
			(resolve, reject) => s3.getSignedUrl('uploadPart', params, (err, presignedUrl) => {
				if (err) {
					reject(err);
				} else {
					resolve(res.send({ presignedUrl }));
				}
			})
		);
		
	} catch (err) {
		return err;
	}

})

app.post('/complete-upload', async (req, res) => {
	try {       
		let num_movie_id = req.body.params.num_movie_id;
        //let col_name="txt_movie";
        let col_name=req.body.params.col_name;
        
        //======= param =========================
        let params = {
			Bucket: BUCKET_NAME,
			Key: req.body.params.fileName,
			MultipartUpload: {
				Parts: req.body.params.parts
			},
			UploadId: req.body.params.uploadId
		}
        //======================================
        if (col_name == "txt_livecast") {
            let getMovieCast = await movieservices.findLiveCastId(num_movie_id);
            if (getMovieCast.status == "success") {
                return new Promise(
                    (resolve, reject) => s3.completeMultipartUpload(params, async(err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            let path_url = data.Location;
                            let movie = {
                                num_movie_id: num_movie_id,
                                col_value: path_url,
                                col_name: col_name,
                            };
                            let getMovie = await movieservices.updateProducerMovieCast(movie);
                            if (getMovie.status == "success") {
                                obj = {
                                    status: "success",
                                    message: "Files uploaded Successfully.",
                                    response: movie.col_value
                                };
                            } else {
                                obj = {
                                    status: "fail",
                                    message: "Files cannot upload.",
                                    response: ""
                                };
                            }
                            res.json(obj);
                        }
                    })
                );
            } else {
                return new Promise(
                    (resolve, reject) => s3.completeMultipartUpload(params, async(err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            let path_url = data.Location;
                            let movie = {
                                num_movie_id: num_movie_id,
                                col_value: path_url,
                                col_name: col_name,
                            };
                            let getMovie = await movieservices.addProducerLiveCastByCol(movie);
                            if (getMovie.status == "success") {
                                obj = {
                                    status: "success",
                                    message: "Files uploaded Successfully.",
                                    response: movie.col_value
                                };
                            } else {
                                obj = {
                                    status: "fail",
                                    message: "Files cannot upload.",
                                    response: ""
                                };
                            }
                            res.json(obj);
                        }
                    })
                );
            }   
        } else {
            let getMovieLink = await movieservices.findMovieLinkById(num_movie_id);
            if (getMovieLink.status == "success") {
                return new Promise(
                    (resolve, reject) => s3.completeMultipartUpload(params, async(err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            let path_url = data.Location;
                            let movie = {
                                num_movie_id: num_movie_id,
                                col_value: path_url,
                                col_name: col_name,
                            };
                            let getMovie = await movieservices.updateMovieLink(movie);
                            if (getMovie.status == "success") {
                                obj = {
                                    status: "success",
                                    message: "Files uploaded Successfully.",
                                    response: movie.col_value
                                };
                            } else {
                                obj = {
                                    status: "fail",
                                    message: "Files cannot upload.",
                                    response: ""
                                };
                            }
                            res.json(obj);
                        }
                    })
                );
            } else {
                return new Promise(
                    (resolve, reject) => s3.completeMultipartUpload(params, async(err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            let path_url = data.Location;
                            let movie = {
                                num_movie_id: num_movie_id,
                                col_value: path_url,
                                col_name: col_name,
                            };
                            let getMovie = await movieservices.addMovieLinkByCol(movie);
                            if (getMovie.status == "success") {
                                obj = {
                                    status: "success",
                                    message: "Files uploaded Successfully.",
                                    response: movie.col_value
                                };
                            } else {
                                obj = {
                                    status: "fail",
                                    message: "Files cannot upload.",
                                    response: ""
                                };
                            }
                            res.json(obj);
                        }
                    })
                );
            }
        }

	} catch (err) {
		bj = {
			status: "fail",
			message: "Error",
			response: err
		};
		res.json(obj);
	}
})
module.exports=app;