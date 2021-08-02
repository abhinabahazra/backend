var stream = require('stream');
const s3 = require('../config/s3.config_videos');
const env = require('../config/s3.env');
const img_bucket = env.Bucket_images;
const vdo_bucket = env.Bucket_videos;

const movieservices = require('../services/movieServices');
//https://newott.s3.ap-south-1.amazonaws.com/davide-dalfovo-1rQs3661lq4-unsplash.jpg
 
exports.doUpload = async (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;
	let obj;

	if (req.file) {
		//console.log('====Success====='+req.body.num_movie_id+'============'+"txt_movie");
		//============================ if req.file then insert or update ========================
		var filename = Date.now()+'-OTT-'+req.file.originalname;
		params.Key = filename;
		params.Body = req.file.buffer;

		let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
		if (getMovieLink.status == "success") {
			s3Client.upload(params, async(err, data) => {
				if (err) {
					res.status(500).json({error:"Error -> " + err});
				}
				let path_url = 'https://'+vdo_bucket+'.s3.ap-south-1.amazonaws.com/'+filename;
				let movie = {
					num_movie_id: req.body.num_movie_id,
					col_value: path_url,
					col_name: "txt_movie"
				};
				let getMovie = await movieservices.updateMovieLink(movie);
				obj = {
					status: "success",
					message: "Files has been updated Successfully.",
					response: movie.col_value
				};
				res.json(obj);
			});
		}
		else{
			s3Client.upload(params, async(err, data) => {
				if (err) {
					res.status(500).json({error:"Error -> " + err});
				}
				let path_url = 'https://'+vdo_bucket+'.s3.ap-south-1.amazonaws.com/'+filename;
				let movie = {
					num_movie_id: req.body.num_movie_id,
					col_value: path_url,
					col_name: "txt_movie"
				};
				let getMovie = await movieservices.addMovieLinkByCol(movie);
				obj = {
					status: "success",
					message: "Files added Successfully.",
					response: movie.col_value
				};
				res.json(obj);
			});
		}
		//=======================================================================================
	} else {
		//console.log('===Fail======'+req.body.num_movie_id+'============'+"txt_movie");
		//================== file check from db and return ====================================
		let getMovieLinkB1 = await movieservices.findMovieLinkById(req.body.num_movie_id);
		if (getMovieLinkB1.status == "success") {
		  if (getMovieLinkB1.result.txt_movie) {
			  obj = {
				status: "success",
				message: "Already exist Movie File!",
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
		res.json(obj);
		//=====================================================================================
	}
	// res.json(obj);
}