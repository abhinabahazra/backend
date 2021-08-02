const sleep = require('util').promisify(setTimeout);
const bcrypt = require('bcrypt');
var pgp = require('pg-promise')({});
const db=require('../config/db.config').pool;

const all_user=async()=>{
	get_Movie_Language=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_movie_language;").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Movie_Language;
}


const all_movie=async()=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("SELECT otmm.*, otug.genre FROM ott_movie_master otmm INNER JOIN ott_user_genres otug ON otug.id = otmm.num_movie_genre").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Movie;
}
// Order By Desc 5 Movies
const all_latest_movie=async()=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("select *from public.ott_movie_master order by id desc limit 5;").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Movie;
}

const category_movie=async()=>{
	get_Movie_category=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_movie_category;").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Movie_category;
}

const genre_user=async()=>{
	get_Genre_user=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_user_genres;").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Genre_user;
}

const addMovie = async (movie_data) => {   
	// console.log(movie_data);return; 
	let txt_movie_title = movie_data.txt_movie_title;
	let num_movie_category = movie_data.num_movie_category;
	let num_movie_genre = movie_data.num_movie_genre;
	let num_movie_language = movie_data.num_movie_language;
	let length_min = movie_data.length_min;
	let yn_censor_certificate = movie_data.yn_censor_certificate; 
	let txt_certificate_link = movie_data.txt_certificate_link;
	let txt_director = movie_data.txt_director;
	let txt_producer = movie_data.txt_producer;
	let txt_publication = movie_data.txt_publication;
	let dat_release_date = movie_data.dat_release_date;
	let txt_synopsis = movie_data.txt_synopsis;
	let yn_active = movie_data.yn_active;
	let txt_user_created = movie_data.txt_user_created;
	let dat_update_date = movie_data.dat_update_date;

	let movieDetails = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_master(txt_movie_title,num_movie_category,num_movie_genre,num_movie_language,length_min,yn_censor_certificate,txt_certificate_link,txt_director,txt_producer,txt_publication,dat_release_date,txt_synopsis,yn_active,txt_user_created,dat_update_date) VALUES ('"+txt_movie_title+"','"+num_movie_category+"','"+num_movie_genre+"','"+num_movie_language+"','"+length_min+"','"+yn_censor_certificate+"','"+txt_certificate_link+"','"+txt_director+"','"+txt_producer+"','"+txt_publication+"','"+dat_release_date+"','"+txt_synopsis+"','"+yn_active+"','"+txt_user_created+"','"+dat_update_date+"') RETURNING *;").then(function(data) {
			// console.log(data.rows[0]);
			// console.log(data);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movieDetails;
}

//----------------------------------------------------------------
const addMovieLink = async (movie_data) => {    
	let num_movie_id = movie_data.num_movie_id;
	let txt_banner1 = movie_data.txt_banner1;
	let txt_banner2 = movie_data.txt_banner2;
	let txt_screenshot1 = movie_data.txt_screenshot1;
	let txt_screenshot2 = movie_data.txt_screenshot2;
	let txt_screenshot3 = movie_data.txt_screenshot3;
	let txt_screenshot4 = movie_data.txt_screenshot4;
	let txt_trailer1 = movie_data.txt_trailer1;
	let txt_trailer2 = movie_data.txt_trailer2;
	let txt_movie = movie_data.txt_movie;
	
	let movie_master_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_link_dtls(num_movie_id,txt_banner1,txt_banner2,txt_screenshot1,txt_screenshot2,txt_screenshot3,txt_screenshot4,txt_trailer1,txt_trailer2,txt_movie) VALUES ('"+num_movie_id+"','"+txt_banner1+"','"+txt_banner2+"','"+txt_screenshot1+"','"+txt_screenshot2+"','"+txt_screenshot3+"','"+txt_screenshot4+"','"+txt_trailer1+"','"+txt_trailer2+"','"+txt_movie+"') RETURNING *;").then(function(data) {
			// console.log(data);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_master_link;
  }

//----------------------------------------------------------------
const findMovieById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_master WHERE id ='"+movie_id+"'").then(function(data) {
			  //console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};
// get movie by category
const findMovieByCategory = async (movie_category) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_master WHERE num_movie_category ='"+movie_category+"'").then(function(data) {
			  //console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};
// Insert data in ott_movie_player
const add_movie_player = async (user_data) => {    

	let num_movie_id = user_data.num_movie_id;

	let txt_player1 = user_data.txt_player1;
	let txt_player1_role = user_data.txt_player1_role;
	let txt_player1_image = user_data.txt_player1_image;

	let txt_player2 = user_data.txt_player2;
	let txt_player2_role = user_data.txt_player2_role;
	let txt_player2_image = user_data.txt_player2_image;

	let txt_player3 = user_data.txt_player3;
	let txt_player3_role = user_data.txt_player3_role;
	let txt_player3_image = user_data.txt_player3_image;

	let txt_player4 = user_data.txt_player4;
	let txt_player4_role = user_data.txt_player4_role;
	let txt_player4_image = user_data.txt_player4_image;

	let txt_player5 = user_data.txt_player5;
	let txt_player5_role = user_data.txt_player5_role;
	let txt_player5_image = user_data.txt_player5_image;

	let txt_player6 = user_data.txt_player6;
	let txt_player6_role = user_data.txt_player6_role;
	let txt_player6_image = user_data.txt_player6_image;

	let txt_player7 = user_data.txt_player7;
	let txt_player7_role = user_data.txt_player7_role;
	let txt_player7_image = user_data.txt_player7_image;

	let txt_player8 = user_data.txt_player8;
	let txt_player8_role = user_data.txt_player8_role;
	let txt_player8_image = user_data.txt_player8_image;


	let movie_player = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_player(num_movie_id,txt_player1,txt_player1_role,txt_player1_image,txt_player2,txt_player2_role,txt_player2_image,txt_player3,txt_player3_role,txt_player3_image,txt_player4,txt_player4_role,txt_player4_image,txt_player5,txt_player5_role,txt_player5_image,txt_player6,txt_player6_role,txt_player6_image,txt_player7,txt_player7_role,txt_player7_image,txt_player8,txt_player8_role,txt_player8_image) VALUES ('"+num_movie_id+"','"+txt_player1+"','"+txt_player1_role+"','"+txt_player1_image+"','"+txt_player2+"','"+txt_player2_role+"','"+txt_player2_image+"','"+txt_player3+"','"+txt_player3_role+"','"+txt_player3_image+"','"+txt_player4+"','"+txt_player4_role+"','"+txt_player4_image+"','"+txt_player5+"','"+txt_player5_role+"','"+txt_player5_image+"','"+txt_player6+"','"+txt_player6_role+"','"+txt_player6_image+"','"+txt_player7+"','"+txt_player7_role+"','"+txt_player7_image+"','"+txt_player8+"','"+txt_player8_role+"','"+txt_player8_image+"') RETURNING *;").then(function(data) {
			//console.log(data);
			obj = { status: "success", result: data.rows };
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_player;
  }

//Insert data into ott_movie_cast

const add_movie_cast = async (user_data) => {    
	let num_movie_id = user_data.num_movie_id;
	let txt_cast_1 = user_data.txt_cast_1;
	let txt_cast_2 = user_data.txt_cast_2;
	let txt_cast_3 = user_data.txt_cast_3;
	let txt_cast_4 = user_data.txt_cast_4;
	let txt_cast_5 = user_data.txt_cast_5;
	let txt_cast_6 = user_data.txt_cast_6;
	let yn_launch_event=user_data.yn_launch_event;
	
	let movie_cast = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_cast(num_movie_id,txt_cast_1,txt_cast_2,txt_cast_3,txt_cast_4,txt_cast_5,txt_cast_6,yn_launch_event) VALUES ('"+num_movie_id+"','"+txt_cast_1+"','"+txt_cast_2+"','"+txt_cast_3+"','"+txt_cast_4+"','"+txt_cast_5+"','"+txt_cast_6+"','"+yn_launch_event+"') RETURNING *;").then(function(data) {
			//console.log(data);
			obj = { status: "success", result: data.rows };
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_cast;
  }

//Insert data into ott_movie_link_dtls
const add_movie_link = async (user_data) => {    
	let num_movie_id = user_data.num_movie_id;
	let txt_banner1 = user_data.txt_banner1;
	let txt_banner2 = user_data.txt_banner2;
	let txt_screenshot1 = user_data.txt_screenshot1;
	let txt_screenshot2 = user_data.txt_screenshot2;
	let txt_screenshot3 = user_data.txt_screenshot3;
	let txt_screenshot4 = user_data.txt_screenshot4;
	let txt_trailer1 = user_data.txt_trailer1;
	let txt_trailer2 = user_data.txt_trailer2;
	let txt_movie = user_data.txt_movie;
	
	let movie_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_link_dtls(num_movie_id,txt_banner1,txt_banner2,txt_screenshot1,txt_screenshot2,txt_screenshot3,txt_screenshot4,txt_trailer1,txt_trailer2,txt_movie) VALUES('"+num_movie_id+"','"+txt_banner1+"','"+txt_banner2+"','"+txt_screenshot1+"','"+txt_screenshot2+"','"+txt_screenshot3+"','"+txt_screenshot4+"','"+txt_trailer1+"','"+txt_trailer2+"','"+txt_movie+"') RETURNING *;").then(function(data) {
			//console.log(data);
			obj = { status: "success", result: data.rows };
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_link;
}

const add_movie_contract = async (user_data) => {    
	let num_movie_id = user_data.num_movie_id;
	let num_producer_percentage = user_data.num_producer_percentage;
	let num_admin_percentage = user_data.num_admin_percentage;
	let txt_user = user_data.txt_user;
	let dat_update = user_data.dat_update;
	let approval_status = "0";

	let movie_contract = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_contract(num_movie_id,num_producer_percentage,num_admin_percentage,txt_user,dat_update,approval_status) VALUES('"+num_movie_id+"','"+num_producer_percentage+"','"+num_admin_percentage+"','"+txt_user+"','"+dat_update+"','"+approval_status+"') RETURNING *;").then(function(data) {
			//console.log(data);
			obj = { status: "success", result: data.rows };
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_contract;
}


// Insert Contract details
const contract_details=async()=>{
	get_contract_details=new Promise(function(resolve, reject){
		try{
			db.query("select  num_admin_share,num_producer_share from  ott_contract_dtls where  num_contract_type = 1 and    to_char(now(),'yyyymmdd') between to_char(dat_from_date,'yyyymmdd')and to_char(dat_to_date,'yyyymmdd'); ").then(function(data) {
			if (data != null) {
			obj = { status:"success", result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_contract_details;
}

//Insert KYC Data
const add_kyc_data = async (user_data) => {    

	let num_user_id = user_data.num_user_id;

	let txt_pancard_no = user_data.txt_pancard_no;
	let txt_pancard_link = user_data.txt_pancard_link;
	let account_no = user_data.account_no;
	let ifsc_code = user_data.ifsc_code;
	let txt_bank_name = user_data.txt_bank_name;
	let txt_branch_name = user_data.txt_branch_name;
	let txt_cheque_link = user_data.txt_cheque_link;
	
	
	

	let kyc_data = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_kyc_dtls(num_user_id,txt_pancard_no,txt_pancard_link,account_no,ifsc_code,txt_bank_name,txt_branch_name,txt_cheque_link) VALUES('"+num_user_id+"','"+txt_pancard_no+"','"+txt_pancard_link+"','"+account_no+"','"+ifsc_code+"','"+txt_bank_name+"','"+txt_branch_name+"','"+txt_cheque_link+"') RETURNING *;").then(function(data) {
			//console.log(data);
			obj = { status: "success", result: data.rows };
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return kyc_data;
}

// Get Kyc Data
const kyc_data=async(user_id)=>{
	get_kyc_data=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_kyc_dtls WHERE num_user_id="+user_id+";").then(function(data) {
				//console.log(data);
			if (data.rows.length > 0) {
			obj = { status:"success", result:data.rows[0] };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_kyc_data;
}
  
  const findUserById = async (user_id) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_user_dtls WHERE num_user_id ='"+user_id+"'").then(function(data) {
			//   console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return user_details;
};

// Update Kyc Data
const updateKycData = async(user_data,user_id) =>{

	let txt_pancard_no = user_data.txt_pancard_no;
	let txt_pancard_link = user_data.txt_pancard_link;
	let account_no = user_data.account_no;
	let ifsc_code = user_data.ifsc_code;
	let txt_bank_name = user_data.txt_bank_name;
	let txt_branch_name = user_data.txt_branch_name;
	let txt_cheque_link = user_data.txt_cheque_link;
	
	
	kyc_details = new Promise(function(resolve, reject) {
		try {
		db.query("UPDATE ott_kyc_dtls SET txt_pancard_no = '"+txt_pancard_no+"',txt_pancard_link = '"+txt_pancard_link+"',account_no = '"+account_no+"',ifsc_code = '"+ifsc_code+"',txt_bank_name = '"+txt_bank_name+"',txt_branch_name = '"+txt_branch_name+"',txt_cheque_link = '"+txt_cheque_link+"' WHERE num_user_id = "+user_id+" RETURNING *;").then(function(data) {
			//console.log(data);
			if (data != null) {
			obj = { status: "success", result: data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}
		catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
		}
	});
	return kyc_details;
}
// Update Kyc Pan
const updateKycPan = async (user_data) => { 
	let num_user_id = user_data.num_user_id;
	//let txt_pancard_link = user_data.txt_pancard_link;
	let col_value = user_data.col_value;
	let col_name = user_data.col_name;
	let update_kyc_pan = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_kyc_dtls SET "+col_name+" = '"+col_value+"' WHERE num_user_id = "+num_user_id+" RETURNING *;").then(function(data) {
			  console.log(data);
			  if (data.rows.length > 0) {
				  obj = { status: "success", result: data.rows[0] };
			  } else {
				  obj = { status: "fail", result: "" };
			  }
				resolve(obj); 
		  }).catch (function (e) {
			  obj = { status: "fail", result: e };
			  resolve(obj);
		  });
		}
		catch (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		}
	  });
	  return update_kyc_pan;
}
// Update Kyc Cheque
const updateKycCheque = async (user_data) => { 
	let num_user_id = user_data.num_user_id;
	//let txt_cheque_link = user_data.txt_cheque_link;
	let col_value = user_data.col_value;
	let col_name = user_data.col_name;
	let update_kyc_cheque = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_kyc_dtls SET "+col_name+" = '"+col_value+"' WHERE num_user_id = "+num_user_id+" RETURNING *;").then(function(data) {
			  //console.log(data);
			  if (data.rows.length > 0) {
				  obj = { status: "success", result: data.rows[0] };
			  } else {
				  obj = { status: "fail", result: "" };
			  }
				resolve(obj); 
		  }).catch (function (e) {
			  obj = { status: "fail", result: e };
			  resolve(obj);
		  });
		}
		catch (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		}
	  });
	  return update_kyc_cheque;
}

// Update Movie cenSor Certificate
const updateMovieCensor = async (user_data) => { 
	let id = user_data.id;
	//let txt_certificate_link = user_data.txt_certificate_link;
	let col_value = user_data.col_value;
	let col_name = user_data.col_name;


	let update_censor_link = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_master SET "+col_name+" = '"+col_value+"',yn_censor_certificate = '1' WHERE id = "+id+" RETURNING *;").then(function(data) {
			  //console.log(data);
			  if (data.rows.length > 0) {
				  obj = { status: "success", result: data.rows[0] };
			  } else {
				  obj = { status: "fail", result: "" };
			  }
				resolve(obj); 
		  }).catch (function (e) {
			  obj = { status: "fail", result: e };
			  resolve(obj);
		  });
		}
		catch (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		}
	  });
	  return update_censor_link;
}

// Get movie by invidual user creator
const movieUploadDetailsByUser=async(user_created)=>{
	get_Movie_List=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_movie_master WHERE txt_user_created='"+user_created+"'").then(function(data) {
				//console.log(data.rows);
				if (data.rows.length > 0) {
					obj = { status: "success",  result:data.rows };
		  } else {
			  obj = { status: "fail", result: "" };
		  }
		  resolve(obj); 
		}).catch (function (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		});
		}catch(e){		
			obj={status:"Fail",result:e};
			resolve(obj);
		}
	});
	return get_Movie_List;
}
const findMovieLinkById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_link_dtls WHERE num_movie_id ='"+movie_id+"'").then(function(data) {
			//   console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};
const findMoviePlayerById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_player WHERE num_movie_id ='"+movie_id+"'").then(function(data) {
			//   console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};
const updateMovieLink = async (movie_data) => { 
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;
	let movie_master_link = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_link_dtls SET "+col_name+" = '"+col_value+"' WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
			  //console.log(data);
			  if (data.rows.length > 0) {
				  obj = { status: "success", result: data.rows[0] };
			  } else {
				  obj = { status: "fail", result: "" };
			  }
				resolve(obj); 
		  }).catch (function (e) {
			  obj = { status: "fail", result: e };
			  resolve(obj);
		  });
		}
		catch (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		}
	  });
	  return movie_master_link;
  }
  const updateMoviePlayer = async (movie_data) => { 
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;
	let movie_master_link = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_player SET "+col_name+" = '"+col_value+"' WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
			  //console.log(data);
			  if (data.rows.length > 0) {
				  obj = { status: "success", result: data.rows[0] };
			  } else {
				  obj = { status: "fail", result: "" };
			  }
				resolve(obj); 
		  }).catch (function (e) {
			  obj = { status: "fail", result: e };
			  resolve(obj);
		  });
		}
		catch (e) {
		  obj = { status: "fail", result: e };
		  resolve(obj);
		}
	  });
	  return movie_master_link;
  }
  const addMovieLinkByCol = async (movie_data) => {    
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;


	let movie_master_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_link_dtls(num_movie_id,"+col_name+") VALUES ('"+num_movie_id+"','"+col_value+"') RETURNING *;").then(function(data) {
			// console.log(data);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_master_link;
  }

  const addMoviePlayerByCol = async (movie_data) => {    
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;


	let movie_master_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_player(num_movie_id,"+col_name+") VALUES ('"+num_movie_id+"','"+col_value+"') RETURNING *;").then(function(data) {
			// console.log(data);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
		  	resolve(obj); 
		}).catch (function (e) {
			obj = { status: "fail", result: e };
			resolve(obj);
		});
	  }
	  catch (e) {
		obj = { status: "fail", result: e };
		resolve(obj);
	  }
	});
	return movie_master_link;
  }

  const findalWholelMovieDetails = async () => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select a.*,b.*,c.*,d.*,e.*,f.genre,g.language,h.category from ott_movie_master a,ott_movie_cast b,ott_movie_player c, ott_movie_link_dtls d,ott_movie_contract e,ott_user_genres f,ott_movie_language g,ott_movie_category h where  a.id = b.num_movie_id and  b.num_movie_id = c.num_movie_id and  c.num_movie_id = d.num_movie_id and  d.num_movie_id = e.num_movie_id and  a.num_movie_genre = f.id and  a.num_movie_language = g.id and  a.num_movie_category= h.id;").then(function(data) {
			  //console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};

// Home Page Movie Details
const findalHomeMovieDetails = async () => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select  a.txt_movie_title, a.id,b.category , c.language,d.num_movie_price_inr,e.txt_banner1 from   ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e where   a.id = d.num_movie_id and   a.num_movie_category =b.id and   a.num_movie_language = c.id and   d.txt_active= '1' and   a.id = e.num_movie_id;").then(function(data) {
			  //console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};


const checkExistingMovieInApprovalDtls = async (movie_id,uploadtest_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {

			//console.log("SELECT * FROM ott_approval_dtls WHERE num_movie_id ='"+movie_id+"' and upload_id = '"+ uploadtest_id+"'");
			//return;
          db.query("SELECT * FROM ott_approval_dtls WHERE num_movie_id ='"+movie_id+"' and upload_id = '"+ uploadtest_id+"'").then(function(data) {
			  //console.log(data.rows);
			if (data.rows.length > 0) {
				obj = { status: "success", result: data.rows[0] };
			} else {
				obj = { status: "fail", result: "" };
			}
            resolve(obj); 
          }).catch (function (e) {
            obj = { status: "fail", result: e };
            resolve(obj);
          });
          }
          catch (e) {
          obj = { status: "fail", result: e };
          resolve(obj);
          }
      });
 
  return movie_details;
};

exports.all_user=all_user;
exports.all_movie=all_movie;
exports.category_movie=category_movie;
exports.genre_user=genre_user;
exports.contract_details=contract_details;
exports.movieUploadDetailsByUser=movieUploadDetailsByUser;
exports.kyc_data=kyc_data;
exports.updateKycPan=updateKycPan;
exports.updateKycCheque=updateKycCheque;
exports.updateMovieCensor=updateMovieCensor;
exports.findMovieLinkById=findMovieLinkById;
exports.updateMovieLink=updateMovieLink;
exports.addMovieLinkByCol=addMovieLinkByCol;
exports.findMoviePlayerById=findMoviePlayerById;
exports.updateMoviePlayer=updateMoviePlayer;
exports.addMoviePlayerByCol=addMoviePlayerByCol;
exports.findalWholelMovieDetails=findalWholelMovieDetails;
exports.findMovieByCategory=findMovieByCategory;
exports.all_latest_movie=all_latest_movie;
exports.findalHomeMovieDetails=findalHomeMovieDetails;
exports.checkExistingMovieInApprovalDtls=checkExistingMovieInApprovalDtls;


exports.addMovie=addMovie;
exports.addMovieLink=addMovieLink;
exports.add_movie_player=add_movie_player;
exports.add_movie_cast=add_movie_cast;
exports.add_movie_link=add_movie_link;
exports.add_movie_contract=add_movie_contract;
exports.add_kyc_data=add_kyc_data;

exports.updateKycData=updateKycData;


exports.findMovieById=findMovieById;
exports.findUserById=findUserById;