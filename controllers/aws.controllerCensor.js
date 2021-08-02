var stream = require('stream');
const s3 = require('../config/s3.config_documents.js');
const env = require('../config/s3.env');
const doc_bucket = env.Bucket_documents;
const movieservices = require('../services/movieServices');
 
exports.doUpload = async (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;
	let obj;
	
	if (req.file) {
		//console.log('====Success====='+req.body.num_movie_id+'============'+req.body.column_name);
		//============================ if req.file then insert or update ========================
		var filename = Date.now()+'-OTT-'+req.file.originalname;
		params.Key = filename;
		params.Body = req.file.buffer;

		let checMovie = await movieservices.findMovieById(req.body.id);
		if (checMovie.status == "success") {
			//console.log('21');
			s3Client.upload(params, async(err, data) => {
				if (err) {
					res.status(500).json({error:"Error -> " + err});
				}
				let path_url = 'https://'+doc_bucket+'.s3.ap-south-1.amazonaws.com/'+filename;
				let movie = {
					id: req.body.id,
					col_value: path_url,
					col_name: "txt_certificate_link",
				};
				console.log("abhi",movie)
				let getMovie = await movieservices.updateMovieCensor(movie);
				obj = {
					status: "success",
					message: "Files updated Successfully.",
					response: movie.col_value
				};
				res.json(obj);
			});
		}
            else{
                obj = {
                    status: "fail",
                    message: "You must select at least 1 file.",
                    response: ""
                };
                return res.send(obj);
              }
		//=======================================================================================
	} else {
        //console.log('51');
        let getMovieLinkB1 = await movieservices.findMovieById(req.body.id);
		if (getMovieLinkB1.status == "success") {
		  if (getMovieLinkB1.result.txt_certificate_link) {
			  obj = {
				status: "success",
				message: "Already exist txt_certificate_link File!",
				response: getMovieLinkB1.result.txt_certificate_link
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
		//=====================================================================================
		res.json(obj);
	}
}