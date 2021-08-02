var stream = require('stream');
const s3 = require('../config/s3.config_images.js');
const env = require('../config/s3.env');
const img_bucket = env.Bucket_images;
const movieservices = require('../services/movieServices');
const userservices=require('../services/userServices');
 
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

        let checkUser = await movieservices.findUserById(req.body.num_user_id);
       // console.log(checkUser);
		if (checkUser.status == "success") {
			//console.log('21');
			s3Client.upload(params, async(err, data) => {
				if (err) {
					res.status(500).json({error:"Error -> " + err});
				}
				let path_url = 'https://'+img_bucket+'.s3.ap-south-1.amazonaws.com/'+filename;
				let user = {
                    num_user_id: req.body.num_user_id,
                    col_value: path_url,
                    col_name: "txt_profile_pic",
       
                 };
				let getUser = await userservices.updateProfilePic(user);
				obj = {
					status: "success",
					message: "Files updated Successfully.",
					response: user.col_value
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
        let getMovieLinkB1 = await movieservices.findUserById(req.body.num_user_id);
       // console.log(getMovieLinkB1);
		if (getMovieLinkB1.status == "success") {
		  if (getMovieLinkB1.result.txt_profile_pic && getMovieLinkB1.result.txt_profile_pic != "" && getMovieLinkB1.result.txt_profile_pic != "undefined") {
			  obj = {
				status: "success",
				message: "Already exist txt_profile_pic File!",
				response: getMovieLinkB1.result.txt_profile_pic
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