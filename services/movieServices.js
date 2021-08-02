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
	let movie_title = movie_data.txt_movie_title.replace("'", "''");
	let movie_synposis=movie_data.txt_synopsis.replace("'", "''");
	let movie_producer=movie_data.txt_producer.replace("'", "''");
	let movie_director=movie_data.txt_director.replace("'", "''");
	let movie_publication=movie_data.txt_publication.replace("'", "''");

	let num_movie_category = movie_data.num_movie_category;
	let num_movie_genre = movie_data.num_movie_genre;
	let num_movie_language = movie_data.num_movie_language;
	let length_min = movie_data.length_min;
	let yn_censor_certificate = movie_data.yn_censor_certificate; 
	//let txt_certificate_link = movie_data.txt_certificate_link;
	let dat_release_date = movie_data.dat_release_date;
	let txt_user_created = movie_data.txt_user_created;
	let dat_update_date = movie_data.dat_update_date;
	let yn_active = movie_data.yn_active;
	let yn_movie_subtitle=movie_data.yn_movie_subtitle;
	let num_movie_page = movie_data.num_movie_page;

	let txt_movie_title = movie_title;
	let txt_synopsis = movie_synposis;
	let txt_director = movie_director;
	let txt_producer = movie_producer;
	let txt_publication = movie_publication;
	
	let movieDetails = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_master(txt_movie_title,num_movie_category,num_movie_genre,num_movie_language,length_min,yn_censor_certificate,txt_director,txt_producer,txt_publication,dat_release_date,txt_synopsis,yn_active,txt_user_created,dat_update_date,yn_movie_subtitle,num_movie_page) VALUES ('"+txt_movie_title+"','"+num_movie_category+"','"+num_movie_genre+"','"+num_movie_language+"','"+length_min+"','"+yn_censor_certificate+"','"+txt_director+"','"+txt_producer+"','"+txt_publication+"','"+dat_release_date+"','"+txt_synopsis+"','"+yn_active+"','"+txt_user_created+"','"+dat_update_date+"','"+yn_movie_subtitle+"','"+num_movie_page+"') RETURNING *;").then(function(data) {
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
// Update Movie Master
const update_movie_master = async (movie_data,num_movie_id) => { 
	let movie_title = movie_data.txt_movie_title.replace("'", "''");
	let movie_synposis=movie_data.txt_synopsis.replace("'", "''");
	let movie_producer=movie_data.txt_producer.replace("'", "''");
	let movie_director=movie_data.txt_director.replace("'", "''");
	let movie_publication=movie_data.txt_publication.replace("'", "''");

	let num_movie_category = movie_data.num_movie_category;
	let num_movie_genre = movie_data.num_movie_genre;
	let num_movie_language = movie_data.num_movie_language;
	let length_min = movie_data.length_min;
	

	let dat_release_date = movie_data.dat_release_date;
	let txt_user_created = movie_data.txt_user_created;
	let dat_update_date = movie_data.dat_update_date;
	let yn_active = movie_data.yn_active;
	let yn_movie_subtitle=movie_data.yn_movie_subtitle;

	let txt_movie_title = movie_title;
	let txt_synopsis = movie_synposis;
	let txt_director = movie_director;
	let txt_producer = movie_producer;
	let txt_publication = movie_publication;

	let update_movie_details = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_master SET txt_movie_title = '"+txt_movie_title+"',txt_synopsis = '"+txt_synopsis+"',txt_director = '"+txt_director+"',txt_producer = '"+txt_producer+"',txt_publication = '"+txt_publication+"',num_movie_category = '"+num_movie_category+"',num_movie_genre = '"+num_movie_genre+"',num_movie_language = '"+num_movie_language+"',length_min = '"+length_min+"',dat_release_date = '"+dat_release_date+"',txt_user_created = '"+txt_user_created+"',dat_update_date = '"+dat_update_date+"',yn_active = '"+yn_active+"',yn_movie_subtitle = '"+yn_movie_subtitle+"'  WHERE id = "+num_movie_id+" RETURNING *;").then(function(data) {
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
	  return update_movie_details;
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

	let user_player1="";
	let user_player2="";
	let user_player3="";
	let user_player4="";
	let user_player5="";
	let user_player6="";
	let user_player7="";
	let user_player8="";

	let user_player1_role="";
	let user_player2_role="";
	let user_player3_role="";
	let user_player4_role="";
	let user_player5_role="";
	let user_player6_role="";
	let user_player7_role="";
	let user_player8_role="";

	if(user_data.txt_player1 != "")
	{
		user_player1 = user_data.txt_player1.replace("'", "''");
	}
	if(user_data.txt_player2 != "")
	{
		user_player2 = user_data.txt_player2.replace("'", "''");
	}
	if(user_data.txt_player3 != "")
	{
		user_player3 = user_data.txt_player3.replace("'", "''");
	}
	if(user_data.txt_player4 && user_data.txt_player4 != "")
	{
		user_player4 = user_data.txt_player4.replace("'", "''");
	}
	if(user_data.txt_player5 && user_data.txt_player5 != "")
	{
		user_player5 = user_data.txt_player5.replace("'", "''");
	}
	if(user_data.txt_player6 && user_data.txt_player6 != "")
	{
		user_player6 = user_data.txt_player6.replace("'", "''");
	}
	if(user_data.txt_player7 && user_data.txt_player7 != "")
	{
		user_player7 = user_data.txt_player7.replace("'", "''");
	}
	if(user_data.txt_player8 && user_data.txt_player8 != "")
	{
		user_player8 = user_data.txt_player8.replace("'", "''");
	}

	if(user_data.txt_player1_role != "")
	{
		user_player1_role = user_data.txt_player1_role.replace("'", "''");
	}
	if(user_data.txt_player2_role != "")
	{
		user_player2_role = user_data.txt_player2_role.replace("'", "''");
	}
	if(user_data.txt_player3_role != "")
	{
		user_player3_role = user_data.txt_player3_role.replace("'", "''");
	}
	if(user_data.txt_player4_role && user_data.txt_player4_role != "")
	{
		user_player4_role = user_data.txt_player4_role.replace("'", "''");
	}
	if(user_data.txt_player5_role && user_data.txt_player5_role != "")
	{
		user_player5_role = user_data.txt_player5_role.replace("'", "''");
	}
	if(user_data.txt_player6_role && user_data.txt_player6_role != "")
	{
		user_player6_role = user_data.txt_player6_role.replace("'", "''");
	}
	if(user_data.txt_player7_role && user_data.txt_player7_role != "")
	{
		user_player7_role = user_data.txt_player7_role.replace("'", "''");
	}
	if(user_data.txt_player8_role && user_data.txt_player8_role != "")
	{
		user_player8_role = user_data.txt_player8_role.replace("'", "''");
	}

	let txt_player1 = user_player1;
	let txt_player2 = user_player2;
	let txt_player3 = user_player3;
	let txt_player4 = user_player4;
	let txt_player5 = user_player5;
	let txt_player6 = user_player6;
	let txt_player7 = user_player7;
	let txt_player8 = user_player8;

	let txt_player1_role = user_player1_role;
	let txt_player2_role = user_player2_role;
	let txt_player3_role = user_player3_role;
	let txt_player4_role = user_player4_role;
	let txt_player5_role = user_player5_role;
	let txt_player6_role = user_player6_role;
	let txt_player7_role = user_player7_role;
	let txt_player8_role = user_player8_role;
	
	let txt_player1_image = user_data.txt_player1_image;
	let txt_player2_image = user_data.txt_player2_image;
	let txt_player3_image = user_data.txt_player3_image;
	let txt_player4_image = user_data.txt_player4_image;
	let txt_player5_image = user_data.txt_player5_image;
	let txt_player6_image = user_data.txt_player6_image;
	let txt_player7_image = user_data.txt_player7_image;
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
// Update data in Movie Player
const update_movie_player = async (user_data) => { 
	let num_movie_id = user_data.num_movie_id;

	let user_player1="";
	let user_player2="";
	let user_player3="";
	let user_player4="";
	let user_player5="";
	let user_player6="";
	let user_player7="";
	let user_player8="";

	let user_player1_role="";
	let user_player2_role="";
	let user_player3_role="";
	let user_player4_role="";
	let user_player5_role="";
	let user_player6_role="";
	let user_player7_role="";
	let user_player8_role="";

	if(user_data.txt_player1 != "")
	{
		user_player1 = user_data.txt_player1.replace("'", "''");
	}
	if(user_data.txt_player2 != "")
	{
		user_player2 = user_data.txt_player2.replace("'", "''");
	}
	if(user_data.txt_player3 != "")
	{
		user_player3 = user_data.txt_player3.replace("'", "''");
	}
	if(user_data.txt_player4 && user_data.txt_player4 != "")
	{
		user_player4 = user_data.txt_player4.replace("'", "''");
	}
	if(user_data.txt_player5 && user_data.txt_player5 != "")
	{
		user_player5 = user_data.txt_player5.replace("'", "''");
	}
	if(user_data.txt_player6 && user_data.txt_player6 != "")
	{
		user_player6 = user_data.txt_player6.replace("'", "''");
	}
	if(user_data.txt_player7 && user_data.txt_player7 != "")
	{
		user_player7 = user_data.txt_player7.replace("'", "''");
	}
	if(user_data.txt_player8 && user_data.txt_player8 != "")
	{
		user_player8 = user_data.txt_player8.replace("'", "''");
	}

	if(user_data.txt_player1_role != "")
	{
		user_player1_role = user_data.txt_player1_role.replace("'", "''");
	}
	if(user_data.txt_player2_role != "")
	{
		user_player2_role = user_data.txt_player2_role.replace("'", "''");
	}
	if(user_data.txt_player3_role != "")
	{
		user_player3_role = user_data.txt_player3_role.replace("'", "''");
	}
	if(user_data.txt_player4_role && user_data.txt_player4_role != "")
	{
		user_player4_role = user_data.txt_player4_role.replace("'", "''");
	}
	if(user_data.txt_player5_role && user_data.txt_player5_role != "")
	{
		user_player5_role = user_data.txt_player5_role.replace("'", "''");
	}
	if(user_data.txt_player6_role && user_data.txt_player6_role != "")
	{
		user_player6_role = user_data.txt_player6_role.replace("'", "''");
	}
	if(user_data.txt_player7_role && user_data.txt_player7_role != "")
	{
		user_player7_role = user_data.txt_player7_role.replace("'", "''");
	}
	if(user_data.txt_player8_role && user_data.txt_player8_role != "")
	{
		user_player8_role = user_data.txt_player8_role.replace("'", "''");
	}

	let txt_player1 = user_player1;
	let txt_player2 = user_player2;
	let txt_player3 = user_player3;
	let txt_player4 = user_player4;
	let txt_player5 = user_player5;
	let txt_player6 = user_player6;
	let txt_player7 = user_player7;
	let txt_player8 = user_player8;

	let txt_player1_role = user_player1_role;
	let txt_player2_role = user_player2_role;
	let txt_player3_role = user_player3_role;
	let txt_player4_role = user_player4_role;
	let txt_player5_role = user_player5_role;
	let txt_player6_role = user_player6_role;
	let txt_player7_role = user_player7_role;
	let txt_player8_role = user_player8_role;
	
	let txt_player1_image = user_data.txt_player1_image;
	let txt_player2_image = user_data.txt_player2_image;
	let txt_player3_image = user_data.txt_player3_image;
	let txt_player4_image = user_data.txt_player4_image;
	let txt_player5_image = user_data.txt_player5_image;
	let txt_player6_image = user_data.txt_player6_image;
	let txt_player7_image = user_data.txt_player7_image;
	let txt_player8_image = user_data.txt_player8_image;


	
	let update_movie_player = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_player SET txt_player1 = '"+txt_player1+"',txt_player2 = '"+txt_player2+"',txt_player3 = '"+txt_player3+"',txt_player4 = '"+txt_player4+"',txt_player5 = '"+txt_player5+"',txt_player6 = '"+txt_player6+"',txt_player7 = '"+txt_player7+"',txt_player8 = '"+txt_player8+"',txt_player1_role = '"+txt_player1_role+"',txt_player2_role = '"+txt_player2_role+"',txt_player3_role = '"+txt_player3_role+"',txt_player4_role = '"+txt_player4_role+"',txt_player5_role = '"+txt_player5_role+"',txt_player6_role = '"+txt_player6_role+"',txt_player7_role = '"+txt_player7_role+"',txt_player8_role = '"+txt_player8_role+"' WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
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
	  return update_movie_player;
}
//Insert data into ott_movie_cast

const add_movie_cast = async (user_data) => {  
	let user_cast1 =  "";
	let user_cast2 = "";
	let user_cast3 =  "";
	let user_cast4 =  "";
	let user_cast5 =  "";
	let user_cast6 =  "";
	let num_movie_id = user_data.num_movie_id;

	if(user_data.txt_cast_1 != "")
	{
		user_cast1 = user_data.txt_cast_1.replace("'", "''");
	}

	if(user_data.txt_cast_2 != "")
	{
		user_cast2 = user_data.txt_cast_2.replace("'", "''");
	}

	if(user_data.txt_cast_3 != "")
	{
		user_cast3 = user_data.txt_cast_3.replace("'", "''");
	}
	if(user_data.txt_cast_4 && user_data.txt_cast_4 != "")
	{
		user_cast4 = user_data.txt_cast_4.replace("'", "''");
	}
	if(user_data.txt_cast_5 && user_data.txt_cast_5 != "")
	{
		user_cast5 = user_data.txt_cast_5.replace("'", "''");
	}
	if(user_data.txt_cast_6 && user_data.txt_cast_6 != "")
	{
		user_cast6 = user_data.txt_cast_6.replace("'", "''");
	}

	let txt_cast_1 = user_cast1;
	let txt_cast_2 = user_cast2;
	let txt_cast_3 = user_cast3;
	
	let txt_cast_4 = user_cast4;
	let txt_cast_5 = user_cast5
	let txt_cast_6 = user_cast6;
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

// Update Movie Cast Data  
const update_movie_cast = async (user_data) => { 
	let user_cast1 =  "";
	let user_cast2 = "";
	let user_cast3 =  "";
	let user_cast4 =  "";
	let user_cast5 =  "";
	let user_cast6 =  "";
	let num_movie_id = user_data.num_movie_id;

	if(user_data.txt_cast_1 != "")
	{
		user_cast1 = user_data.txt_cast_1.replace("'", "''");
	}

	if(user_data.txt_cast_2 != "")
	{
		user_cast2 = user_data.txt_cast_2.replace("'", "''");
	}

	if(user_data.txt_cast_3 != "")
	{
		user_cast3 = user_data.txt_cast_3.replace("'", "''");
	}
	if(user_data.txt_cast_4 && user_data.txt_cast_4 != "")
	{
		user_cast4 = user_data.txt_cast_4.replace("'", "''");
	}
	if(user_data.txt_cast_5 && user_data.txt_cast_5 != "")
	{
		user_cast5 = user_data.txt_cast_5.replace("'", "''");
	}
	if(user_data.txt_cast_6 && user_data.txt_cast_6 != "")
	{
		user_cast6 = user_data.txt_cast_6.replace("'", "''");
	}

	let txt_cast_1 = user_cast1;
	let txt_cast_2 = user_cast2;
	let txt_cast_3 = user_cast3;
	
	let txt_cast_4 = user_cast4;
	let txt_cast_5 = user_cast5
	let txt_cast_6 = user_cast6;
	let yn_launch_event=user_data.yn_launch_event;


	let update_movie_cast = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_cast SET txt_cast_1 = '"+txt_cast_1+"',txt_cast_2 = '"+txt_cast_2+"',txt_cast_3 = '"+txt_cast_3+"',txt_cast_4 = '"+txt_cast_4+"',txt_cast_5 = '"+txt_cast_5+"',txt_cast_6 = '"+txt_cast_6+"',yn_launch_event = '"+yn_launch_event+"'  WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
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
	  return update_movie_cast;
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

const get_movie_contract_by_movie=async(num_movie_id)=>{

	get_contract_details2=new Promise(function(resolve, reject){
		try{
			db.query("select * from ott_movie_contract WHERE num_movie_id = '"+num_movie_id+"'").then(function(data) {
			if (data && data.rows.length > 0) {
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
	return get_contract_details2;
}

const update_movie_contract = async (movie_data) => {    
	let num_movie_id = movie_data.num_movie_id;
	let num_producer_percentage = movie_data.num_producer_percentage;
	let num_admin_percentage = movie_data.num_admin_percentage;
	let txt_user = movie_data.txt_user;
	let dat_update = movie_data.dat_update;
	let approval_status = "0";

	let movie_contract = new Promise(function(resolve, reject) {
	  try {
		db.query("UPDATE ott_movie_contract SET num_producer_percentage = '"+num_producer_percentage+"',num_admin_percentage = '"+num_admin_percentage+"',txt_user = '"+txt_user+"',dat_update = '"+dat_update+"',approval_status = '"+approval_status+"'  WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
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
			obj = { status: "success", result: data.rows[0] };
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
	//let txt_pancard_link = user_data.txt_pancard_link;
	let account_no = user_data.account_no;
	let ifsc_code = user_data.ifsc_code;
	let txt_bank_name = user_data.txt_bank_name;
	let txt_branch_name = user_data.txt_branch_name;
	//let txt_cheque_link = user_data.txt_cheque_link;
	
	
	kyc_details = new Promise(function(resolve, reject) {
		try {
		db.query("UPDATE ott_kyc_dtls SET txt_pancard_no = '"+txt_pancard_no+"',account_no = '"+account_no+"',ifsc_code = '"+ifsc_code+"',txt_bank_name = '"+txt_bank_name+"',txt_branch_name = '"+txt_branch_name+"' WHERE num_user_id = "+user_id+" RETURNING *;").then(function(data) {
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

	let qu = "UPDATE ott_movie_master SET "+col_name+" = '"+col_value+"',yn_censor_certificate = '1' WHERE id = "+id;
	console.log(qu);


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
 //console.log(movie_details);
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


const movieDetailsSaveType = async (savetype,txt_user_created) => {
	let movie, obj;
	let movie_details;
	let approved_con = "";
	let con = "";
	let qu = "";
	if (savetype && savetype == "5") {
		con = " AND a.num_movie_page = '5' AND i.num_approval_type = '1' AND a.txt_user_created = '"+txt_user_created+"'";
		qu = "select a.*,f.genre,g.language,h.category,i.txt_approval_status from ott_movie_master a,ott_user_genres f,ott_movie_language g,ott_movie_category h,ott_approval_dtls i where a.num_movie_genre = f.id and a.num_movie_language = g.id and a.id=i.num_movie_id and a.num_movie_category= h.id "+con;
	}
	else
	{
		con = " AND a.num_movie_page < '5' AND a.txt_user_created = '"+txt_user_created+"'";
		qu = "select a.*,f.genre,g.language,h.category from ott_movie_master a,ott_user_genres f,ott_movie_language g,ott_movie_category h where a.num_movie_genre = f.id and a.num_movie_language = g.id and a.num_movie_category= h.id "+con;
	}

	// let qu = "select a.*,f.genre,g.language,h.category,i.txt_approval_status from ott_movie_master a,ott_user_genres f,ott_movie_language g,ott_movie_category h,ott_approval_dtls i where a.num_movie_genre = f.id and a.num_movie_language = g.id and a.id=i.num_movie_id and a.num_movie_category= h.id "+con;
	// console.log(qu);
	// return;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query(qu).then(function(data) {
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
          db.query("Select mm.num_movie_category, mm.num_movie_id,mm.txt_movie_title,mm.txt_synopsis,mm.txt_director,mm.txt_producer,mm.length_min,mm.category,mm.language,mm.genre,mm.num_movie_price_inr,mm.num_movie_price_dollar,mm.txt_banner1,mm.txt_banner2 ,mm.txt_trailer1,mm.txt_trailer2,mm.txt_screenshot1,mm.txt_screenshot2,mm.txt_screenshot3,mm.txt_screenshot4,mm.txt_movie,mm.txt_movie_rating ,nn.txt_livecast from (select a.num_movie_category, d.num_movie_id,a.txt_movie_title,a.txt_synopsis,a.txt_director,a.txt_producer,a.length_min,b.category,c.language,h.genre,d.num_movie_price_inr,d.num_movie_price_dollar,e.txt_banner1,e.txt_banner2 ,e.txt_trailer1,e.txt_trailer2,e.txt_screenshot1,e.txt_screenshot2,e.txt_screenshot3,e.txt_screenshot4,e.txt_movie,f.txt_movie_rating from   ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h where   a.id = d.num_movie_id and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and   a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id and now()::timestamp + interval'5 hours 30 minutes'>= d.movie_start_time) mm left outer join(select a11.num_movie_id,a11.dat_livecast_date,a11.txt_livecast from ott_producer_livecast a11,ott_approval_dtls b11 where a11.num_movie_id = b11.num_movie_id and   b11.num_approval_type = 3 and b11.txt_approval_status='approved') nn on mm.num_movie_id = nn.num_movie_id;").then(function(data) {
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


const checkExistingMovieInApprovalDtls = async (movie_id,uploadtest_id,approval_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {

			//console.log("SELECT * FROM ott_approval_dtls WHERE num_movie_id ='"+movie_id+"' and upload_id = '"+ uploadtest_id+"'");
			//return;
          db.query("SELECT * FROM ott_approval_dtls WHERE num_movie_id ='"+movie_id+"' and upload_id = '"+ uploadtest_id+"'  and num_approval_type = '"+ approval_id+"' ").then(function(data) {
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




const insertMovieTran = async (tran_data) => {    
	let txt_transaction_no = tran_data.txt_transaction_no;
	let dat_transaction_date = tran_data.dat_transaction_date;
	let num_amount = tran_data.num_amount;
	let payment_id = tran_data.payment_id;
	let order_id = tran_data.order_id;
	let transaction_signature = tran_data.transaction_signature;

	let qu = "INSERT INTO ott_transaction_dtls(txt_transaction_no,dat_transaction_date,num_amount,payment_id,order_id,transaction_signature) VALUES ('"+txt_transaction_no+"','"+dat_transaction_date+"','"+num_amount+"','"+payment_id+"','"+order_id+"','"+transaction_signature+"')";

	// console.log(qu);
	// return;

	let movie_tran = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_transaction_dtls(txt_transaction_no,dat_transaction_date,num_amount,payment_id,order_id,transaction_signature) VALUES ('"+txt_transaction_no+"','"+dat_transaction_date+"','"+num_amount+"','"+payment_id+"','"+order_id+"','"+transaction_signature+"') RETURNING *;").then(function(data) {
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
	return movie_tran;
  }

  const insertMovieTranUser = async (tran_data_user) => {    
	let num_user_id = tran_data_user.num_user_id;
	let num_movie_id = tran_data_user.num_movie_id;
	let num_price = tran_data_user.num_price;
	let txt_transaction_no = tran_data_user.txt_transaction_no;
	let dat_start_time = tran_data_user.dat_start_time;
	let dat_end_time = tran_data_user.dat_end_time;
	let dat_update_date = tran_data_user.dat_update_date;
	

	let movie_tran = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_user_movie_dtls(num_user_id,num_movie_id,num_price,txt_transaction_no,dat_start_time,dat_end_time,dat_update_date) VALUES ('"+num_user_id+"','"+num_movie_id+"','"+num_price+"','"+txt_transaction_no+"','"+dat_start_time+"','"+dat_end_time+"','"+dat_update_date+"') RETURNING *;").then(function(data) {
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
	return movie_tran;
  }

  const checkTran = async (tran_data) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_transaction_dtls WHERE order_id ='"+tran_data.order_id+"' and payment_id = '"+ tran_data.payment_id+"' and transaction_signature = '"+ tran_data.transaction_signature+"'").then(function(data) {
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

const checkCatByMovie = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT omm.*,omc.num_duration_in_hrs FROM ott_movie_master as omm left join ott_movie_category omc on omc.id = omm.num_movie_category WHERE omm.id ='"+ movie_id +"'").then(function(data) {
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

const findalTranDetailsById = async (chk_data) => {
	let movie, obj;
	let movie_details;
	// let now = new DateTime();
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_user_movie_dtls WHERE num_user_id ='"+chk_data.user_id+"' and num_movie_id = '"+ chk_data.movie_id+"' and now()::timestamp + interval'5 hours 30 minutes' between dat_start_time and dat_end_time").then(function(data) {
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
const findMovieCastById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_cast WHERE num_movie_id ='"+movie_id+"'").then(function(data) {
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
const findMovieContractById = async (id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_contract_dtls WHERE id ='"+id+"'").then(function(data) {
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

const updateMasterPage = async (status_no,id) => { 
	let update_page_master = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_movie_master SET num_movie_page = "+status_no+" WHERE id = "+id+" RETURNING *;").then(function(data) {
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
	  return update_page_master;
}

const findUserKycById = async (user_id) => {
	let user_kyc;
	
        user_kyc = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_kyc_dtls WHERE num_user_id ='"+user_id+"'").then(function(data) {
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
 
  return user_kyc;
};

const movieUploadDetailsByProducer=async(user_created)=>{
	get_Movie_List=new Promise(function(resolve, reject){
		try{
			db.query("select sum(mov_dtls.total_movie) as total_movie,sum(mov_dtls.approve_movie) as approve_movie,sum(mov_dtls.pending_movie) as pending_movie,sum(mov_dtls.reject_movie) as reject_movie from (select count(*) as total_movie,0 as approve_movie,0 as pending_movie,0 as reject_movie from  ott_movie_master a,ott_approval_dtls b where  a.txt_user_created = '"+user_created+"' and  b.num_movie_id = a.id and  b.num_approval_type= 1 Union all select 0 as total_movie,count(*) as approve_movie,0 as pending_movie,0 as reject_movie from  ott_movie_master a,ott_approval_dtls b where  a.txt_user_created = '"+user_created+"' and  b.num_movie_id = a.id and  b.num_approval_type= 1 and  b.txt_approval_status = 'approved' Union all select 0 as total_movie,0 approve_movie,count(*) as pending_movie,0 as reject_movie from  ott_movie_master a,ott_approval_dtls b where  a.txt_user_created = '"+user_created+"' and  b.num_movie_id = a.id and  b.num_approval_type= 1 and  b.txt_approval_status in ('review','pending') Union all select 0 as total_movie,0 as approve_movie,0 as pending_movie,count(*) as reject_movie from  ott_movie_master a,ott_approval_dtls b where  a.txt_user_created = '"+user_created+"' and  b.num_movie_id = a.id and  b.num_approval_type= 1 and  b.txt_approval_status ='rejected') mov_dtls ; ").then(function(data) {
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
const producerWalletBalance=async(user_created)=>{
	get_Movie_List=new Promise(function(resolve, reject){
		try{
			db.query(" select sum(c.num_amount*d.num_producer_percentage*0.01)from  ott_movie_master a,ott_user_movie_dtls b,ott_transaction_dtls c,ott_movie_contract d where  a.id = b.num_movie_id and  b.txt_transaction_no = c.txt_transaction_no and  a.id = d.num_movie_id and  a.txt_user_created = '"+user_created+"';").then(function(data) {
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
const producerWholeDetailsAboutMovie=async(user_created)=>{
	get_Movie_List=new Promise(function(resolve, reject){
		try{
			db.query(" select tot.id,tot.txt_movie_title,tot.language,tot.txt_movie_rating,tot.contract,tot.num_movie_price_inr,count(*),sum(producer_income)from (select  a.id,a.txt_movie_title,e.txt_movie_rating,d.num_producer_percentage||':'||d.num_admin_percentage as contract,f.num_movie_price_inr,(f.num_movie_price_inr*d.num_producer_percentage*0.01) producer_income,g.language from  ott_movie_master a,ott_user_movie_dtls b,ott_transaction_dtls c,ott_movie_contract d,ott_approval_dtls e,ott_movie_ticket f,ott_movie_language g where  a.id = b.num_movie_id and  b.txt_transaction_no = c.txt_transaction_no and  a.id = d.num_movie_id and  e.num_approval_type = 1 and  e.num_movie_id = a.id and  f.num_movie_id = a.id and  g.id = a.num_movie_language and  a.txt_user_created = '"+user_created+"') tot group by tot.id,tot.txt_movie_title,tot.txt_movie_rating,tot.contract,tot.num_movie_price_inr,tot.language;").then(function(data) {
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
const userTransactionDetails = async (user_id) => {
	let user_trasaction_history;
	
	user_trasaction_history= new Promise(function(resolve, reject) {
          try {
          db.query("SELECT ott_movie_master.txt_movie_title,ott_transaction_dtls.dat_transaction_date,ott_transaction_dtls.num_amount,ott_transaction_dtls.payment_id,ott_user_movie_dtls.num_price,ott_user_movie_dtls.txt_transaction_no FROM ott_transaction_dtls,ott_movie_master, ott_user_movie_dtls WHERE ott_transaction_dtls.txt_transaction_no=ott_user_movie_dtls.txt_transaction_no and ott_movie_master.id=ott_user_movie_dtls.num_movie_id and ott_user_movie_dtls.num_user_id='"+user_id+"'order by dat_transaction_date desc;").then(function(data) {
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
 
  return user_trasaction_history;
};


const checkReferTran = async (user_id) => {
	let movie, obj;
	let refer_details;

// let qu = "SELECT COALESCE(sum(num_amount), 0.00) as total_amount FROM ott_refered_transaction WHERE num_user_id ='"+user_id+"'";
// console.log(qu);
	
        refer_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT COALESCE(sum(num_amount), 0.00) as total_amount FROM ott_refered_transaction WHERE num_user_id ='"+user_id+"'").then(function(data) {
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
  return refer_details;
};

const add_user_feedback = async (user_data) => {    
	let txt_name = user_data.txt_name;
	let txt_emailid = user_data.txt_emailid;
	let num_mobile_no = user_data.num_mobile_no;
	let txt_feedback = user_data.txt_feedback;
	let dat_feedback_date = user_data.dat_feedback_date;

	let user_feedback = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_user_feedback(txt_name,txt_emailid,num_mobile_no,txt_feedback,dat_feedback_date) VALUES('"+txt_name+"','"+txt_emailid+"','"+num_mobile_no+"','"+txt_feedback+"','"+dat_feedback_date+"') RETURNING *;").then(function(data) {
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
	return user_feedback;
}

const check_user_feedback = async (phone) => {
	let getFeedback;
	
        getFeedback = new Promise(function(resolve, reject) {
          try {
			db.query("SELECT * FROM ott_user_feedback WHERE num_mobile_no ='"+phone+"'").then(function(data) {
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
  return getFeedback;
};

const add_user_rating = async (user_data) => {    
	let num_user_id = user_data.num_user_id;
	let txt_user_id = user_data.txt_user_id;
	let num_movie_id = user_data.num_movie_id;
	let num_movie_rating = user_data.num_movie_rating;
	let txt_feedback = user_data.txt_feedback;
	let dat_feedback_date = user_data.dat_feedback_date;

	let user_feedback = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_movie_rating(num_user_id,txt_user_id,num_movie_id,num_movie_rating,txt_feedback,dat_feedback_date) VALUES("+num_user_id+",'"+txt_user_id+"',"+num_movie_id+","+num_movie_rating+",'"+txt_feedback+"','"+dat_feedback_date+"') RETURNING *;").then(function(data) {
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
	return user_feedback;
}

const check_user_rating = async (user_id,movie_id) => {
	let getrating;
	
        getrating = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_rating WHERE num_user_id ='"+user_id+"' and num_movie_id ='"+movie_id+"'").then(function(data) {
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
  return getrating;
};

const update_user_rating = async (movie_data) => {    
	let num_user_id = movie_data.num_user_id;
	// let txt_user_id = movie_data.txt_user_id;
	let num_movie_id = movie_data.num_movie_id;
	let num_movie_rating = movie_data.num_movie_rating;
	let txt_feedback = movie_data.txt_feedback;
	let dat_feedback_date = movie_data.dat_feedback_date;

	let movie_rating = new Promise(function(resolve, reject) {
	  try {
		db.query("UPDATE ott_movie_rating SET num_movie_rating = "+num_movie_rating+",txt_feedback = '"+txt_feedback+"',dat_feedback_date = '"+dat_feedback_date+"' WHERE num_user_id ="+num_user_id+" and num_movie_id ="+num_movie_id+" RETURNING *;").then(function(data) {
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
	return movie_rating;
}
const findbasicMovieDetailsById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select omm.txt_movie_title,omm.txt_synopsis,oml.language,omld.txt_banner1,omld.txt_banner2,omld.txt_trailer1,omld.txt_trailer2 from ott_movie_master omm LEFT JOIN ott_movie_rating omr ON omr.num_movie_id=omm.id LEFT JOIN ott_movie_language oml ON oml.id=omm.num_movie_language LEFT JOIN ott_movie_link_dtls omld ON omld.num_movie_id=omm.id Where omm.id='"+movie_id+"'").then(function(data) {
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

const findbasicMovieDetailsByTitle = async (movie_search) => {
	let movie, obj;
	let movie_details;
	let movie_title = movie_search.replace("'", "''");


	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select a.txt_movie_title,a.txt_synopsis,a.txt_producer,a.txt_director,b.txt_banner1,b.txt_banner2,b.txt_trailer1,b.txt_trailer2,b.txt_movie,c.txt_movie_rating,e.category,d.language,  f.num_movie_price_inr from ott_movie_master a,ott_movie_link_dtls b, ott_approval_dtls c, ott_movie_language d,ott_movie_category e,ott_movie_ticket f Where a.id = b.num_movie_id and b.num_movie_id = c.num_movie_id and a.num_movie_language = d.id and a.num_movie_category = e.id and a.id = f.num_movie_id and c.num_approval_type = 1 and c.txt_approval_status = 'approved' and upper(a.txt_movie_title) ILIKE upper('%"+movie_title+"%')").then(function(data) {
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

const checkDebitTran = async (user_id) => {
	let movie, obj;
	let refer_details;

// let qu = "SELECT COALESCE(sum(cur_debit_amount), 0.00) as total_amount FROM ott_user_wallet WHERE num_user_id ='"+user_id+"'";
// console.log(qu);
	
        refer_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT *,cur_debit_amount as total_amount FROM ott_user_wallet WHERE num_user_id ='"+user_id+"'").then(function(data) {
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
  return refer_details;
};

const checkReferTranAmount = async (user_id) => {
	let movie, obj;
	let refer_details;

// let qu = "SELECT COALESCE(sum(num_amount), 0.00) as total_amount FROM ott_refered_transaction WHERE num_user_id ='"+user_id+"'";
// console.log(qu);
	
        refer_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT COALESCE((cur_balance_amount), 0.00) as total_amount FROM ott_user_wallet WHERE num_user_id ='"+user_id+"'").then(function(data) {
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
  return refer_details;
};
const getProducerLivecast=async(user_id)=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query(" select  c.num_user_id,c.txt_user_id,a.id,a.txt_movie_title,d.movie_start_time from  ott_movie_master a, ott_approval_dtls b,ott_user_dtls c,ott_movie_ticket d where  a.id = b.num_movie_id and  b.num_movie_id = d.num_movie_id and  b.num_approval_type = 1 and  b.txt_approval_status = 'approved' and  a.txt_user_created = c.txt_user_id and c.num_user_id ='"+user_id+"';").then(function(data) {
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
const addProducerLiveCast = async (user_data) => {    
	let num_user_id = user_data.num_user_id;
	let txt_user_id = user_data.txt_user_id;
	let num_movie_id = user_data.num_movie_id;
	let dat_release_date = user_data.dat_release_date;
	let dat_livecast_date = user_data.dat_livecast_date;
	let num_duration_mins = user_data.num_duration_mins;
	let dat_update_date = user_data.dat_update_date;
	let txt_livecast_link = user_data.txt_livecast_link;
	let txt_livecast = user_data.txt_livecast;

	let user_feedback = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_Producer_livecast(num_user_id,txt_user_id,num_movie_id,dat_release_date,dat_livecast_date,num_duration_mins,dat_update_date,txt_livecast_link,txt_livecast) VALUES('"+num_user_id+"','"+txt_user_id+"','"+num_movie_id+"','"+dat_release_date+"','"+dat_livecast_date+"','"+num_duration_mins+"','"+dat_update_date+"','"+txt_livecast_link+"','"+txt_livecast+"') RETURNING *;").then(function(data) {
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
	return user_feedback;
}
const findUserByTxtUser = async (user_txt) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_user_dtls WHERE txt_user_id ='"+user_txt+"'").then(function(data) {
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
const getProducerLivecastById=async(user_id)=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("select a.id,a.txt_movie_title,b.id as launch_id,b.dat_release_date,b.dat_livecast_date,b.num_duration_mins from ott_movie_master a,ott_producer_livecast b where a.id=b.num_movie_id and now()::timestamp + interval'5 hours 30 minutes'between  b.dat_livecast_date - interval'30 minutes' and b.dat_livecast_date and b.num_user_id='"+user_id+"';").then(function(data) {
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

const findLiveCastId = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_producer_livecast WHERE num_movie_id ='"+movie_id+"'").then(function(data) {
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

const addProducerLiveCastByCol = async (movie_data) => {    
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;


	let movie_master_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_producer_livecast(num_movie_id,"+col_name+") VALUES ('"+num_movie_id+"','"+col_value+"') RETURNING *;").then(function(data) {
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

const updateProducerMovieCast = async (movie_data) => { 
	let num_movie_id = movie_data.num_movie_id;
	let col_value = movie_data.col_value;
	let col_name = movie_data.col_name;
	let movie_master_link = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_producer_livecast SET "+col_name+" = '"+col_value+"' WHERE num_movie_id = "+num_movie_id+" RETURNING *;").then(function(data) {
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

  const findalHomeMovieDetailsByCat = async (id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select d.num_movie_id,a.txt_movie_title,a.txt_synopsis,a.txt_director,a.txt_producer,a.length_min,b.category,c.language,h.genre,d.num_movie_price_inr,d.num_movie_price_dollar,e.txt_banner1,e.txt_banner2 ,e.txt_trailer1,e.txt_trailer2,e.txt_screenshot1,e.txt_screenshot2,e.txt_screenshot3,e.txt_screenshot4,e.txt_movie,f.txt_movie_rating from   ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h where   a.id = d.num_movie_id and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and   a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id and now()::timestamp + interval'5 hours 30 minutes'>= d.movie_start_time and b.id='"+id+"'").then(function(data) {
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
const findbasicMovieDetailsByTitleCat = async (id,movie_search) => {
	let movie, obj;
	let movie_details;
	let movie_title = movie_search.replace("'", "''");

        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("select d.num_movie_id,a.txt_movie_title,a.txt_synopsis,a.txt_director,a.txt_producer,a.length_min,b.category,c.language,h.genre,d.num_movie_price_inr,d.num_movie_price_dollar,e.txt_banner1,e.txt_banner2 ,e.txt_trailer1,e.txt_trailer2,e.txt_screenshot1,e.txt_screenshot2,e.txt_screenshot3,e.txt_screenshot4,e.txt_movie,f.txt_movie_rating from   ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h where   a.id = d.num_movie_id and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and   a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id and now()::timestamp + interval'5 hours 30 minutes'>= d.movie_start_time and b.id='"+id+"' and upper(a.txt_movie_title) ILIKE upper('%"+movie_title+"%')").then(function(data) {
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
 
//=========================================
const findallActiveMovie = async (hrs) => {
	let movie, obj;
	let movie_details;

	let qry = "select d.num_movie_id,a.txt_movie_title,a.txt_synopsis,a.txt_director,a.txt_producer,a.length_min,b.category,c.language,h.genre,d.movie_start_time,d.num_movie_price_inr,d.num_movie_price_dollar,e.txt_banner1,e.txt_banner2 ,e.txt_trailer1,e.txt_trailer2,e.txt_screenshot1,e.txt_screenshot2,e.txt_screenshot3,e.txt_screenshot4,e.txt_movie,f.txt_movie_rating from ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h where a.id = d.num_movie_id and a.yn_active = '1' and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id";
	
	if (hrs != "") {
		qry += "  and (d.movie_start_time <= now()::timestamp + interval'0 hours' and d.movie_start_time >= now()::timestamp - interval'"+hrs+" hours') "
		
	}

	// console.log(qry);
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query(qry).then(function(data) {
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

const findallActiveMovie2 = async (hrs) => {
	let movie, obj;
	let movie_details;

	let qry = "select d.num_movie_id,a.txt_movie_title,a.txt_synopsis,a.txt_director,a.txt_producer,a.length_min,b.category,c.language,h.genre,d.movie_start_time,d.num_movie_price_inr,d.num_movie_price_dollar,e.txt_banner1,e.txt_banner2 ,e.txt_trailer1,e.txt_trailer2,e.txt_screenshot1,e.txt_screenshot2,e.txt_screenshot3,e.txt_screenshot4,e.txt_movie,f.txt_movie_rating from ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h where a.id = d.num_movie_id and a.yn_active = '1' and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id and f.txt_approval_status='approved' and now()::timestamp + interval'5 hours 30 minutes'>= d.movie_start_time";
	
	// console.log(qry);
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query(qry).then(function(data) {
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

const findallLivecatMovie = async (status) => {
	let movie, obj;
	let movie_details;
	let dat = "";
	let whr = "";
	
	if (status == "p") {
		whr = " and i.dat_livecast_date < now()::timestamp + interval'5 hours 30 minutes' "
	} else {

		dat = "DATE_PART('day', i.dat_livecast_date::timestamp - now()::timestamp + interval'5 hours 30 minutes') || ' Day(s) '||DATE_PART('hour', i.dat_livecast_date::timestamp - now()::timestamp + interval'5 hours 30 minutes') ||' Hour(s) '|| DATE_PART('minute', i.dat_livecast_date::timestamp - now()::timestamp + interval'5 hours 30 minutes')||' Minute(s)' as duration,";
		whr = " and i.dat_livecast_date >= now()::timestamp + interval'5 hours 30 minutes' "
	}

	let qry = "select "+dat+" d.num_movie_id, a.txt_movie_title, a.txt_synopsis, a.txt_director, a.txt_producer, a.length_min, b.category, c.language, h.genre, d.num_movie_price_inr, d.num_movie_price_dollar, e.txt_banner1, e.txt_banner2, e.txt_trailer1, e.txt_trailer2, e.txt_screenshot1,e.txt_screenshot2, e.txt_screenshot3, e.txt_screenshot4, e.txt_movie, f.txt_movie_rating, i.dat_release_date, i.dat_livecast_date, i.txt_livecast_link, i.txt_livecast from ott_movie_master a,ott_movie_category b,ott_movie_language c,ott_movie_ticket d ,ott_movie_link_dtls e ,ott_approval_dtls f,ott_user_genres h,ott_producer_livecast i where a.id = d.num_movie_id  and a.num_movie_category =b.id and a.num_movie_genre=h.id and a.num_movie_language = c.id and d.txt_active= '1' and a.id = e.num_movie_id and f.num_approval_type = 1 and f.num_movie_id= a.id and i.num_movie_id= a.id "+whr;
	
	console.log(qry);

        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query(qry).then(function(data) {
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

const all_live_Cast_By_time=async()=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("select b.txt_movie_title ,a.txt_livecast_link from ott_producer_livecast a, ott_movie_master b where a.num_movie_id = b.id and  now()::timestamp + interval'5 hours 30 minutes'  between  a.dat_livecast_date and  a.dat_livecast_date + (a.num_duration_mins||' minutes')::interval;").then(function(data) {
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

const getProducerLivecastById2=async(user_id)=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("select a.id,a.txt_movie_title,b.id as launch_id,b.dat_release_date,b.dat_livecast_date,b.num_duration_mins from ott_movie_master a,ott_producer_livecast b where a.id=b.num_movie_id  and b.num_user_id='"+user_id+"';").then(function(data) {
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
const all_livecast_link=async()=>{
	get_Movie=new Promise(function(resolve, reject){
		try{
			db.query("select b.txt_movie_title ,a.txt_livecast_link from ott_producer_livecast a, ott_movie_master b where a.num_movie_id = b.id and  now()::timestamp + interval'5 hours 30 minutes'  between a.dat_livecast_date and  a.dat_livecast_date + (a.num_duration_mins||' minutes')::interval;").then(function(data) {
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



exports.findallLivecatMovie=findallLivecatMovie;
exports.findallActiveMovie=findallActiveMovie;
exports.findallActiveMovie2=findallActiveMovie2;




exports.checkReferTranAmount=checkReferTranAmount;
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
exports.update_movie_cast=update_movie_cast;
exports.update_movie_player=update_movie_player;
exports.update_movie_master=update_movie_master;
exports.producerWalletBalance=producerWalletBalance;
exports.producerWholeDetailsAboutMovie=producerWholeDetailsAboutMovie;
exports.userTransactionDetails=userTransactionDetails;
exports.checkDebitTran=checkDebitTran;

exports.updateMovieLink=updateMovieLink;
exports.addMovieLinkByCol=addMovieLinkByCol;
exports.updateMoviePlayer=updateMoviePlayer;
exports.addMoviePlayerByCol=addMoviePlayerByCol;
exports.findalWholelMovieDetails=findalWholelMovieDetails;
exports.findMovieByCategory=findMovieByCategory;
exports.all_latest_movie=all_latest_movie;
exports.findalHomeMovieDetails=findalHomeMovieDetails;
exports.checkExistingMovieInApprovalDtls=checkExistingMovieInApprovalDtls;
exports.movieUploadDetailsByProducer=movieUploadDetailsByProducer;
exports.findbasicMovieDetailsById=findbasicMovieDetailsById;

exports.addMovie=addMovie;
exports.addMovieLink=addMovieLink;
exports.add_movie_player=add_movie_player;
exports.add_movie_cast=add_movie_cast;
exports.add_movie_link=add_movie_link;
exports.add_movie_contract=add_movie_contract;
exports.get_movie_contract_by_movie=get_movie_contract_by_movie;
exports.update_movie_contract=update_movie_contract;
exports.add_kyc_data=add_kyc_data;
exports.updateKycData=updateKycData;
exports.findMovieById=findMovieById;
exports.findMovieLinkById=findMovieLinkById;
exports.findMovieCastById=findMovieCastById;
exports.findMoviePlayerById=findMoviePlayerById;
exports.findMovieContractById=findMovieContractById;
exports.findUserKycById=findUserKycById;
exports.findUserById=findUserById;
exports.insertMovieTran=insertMovieTran;
exports.insertMovieTranUser=insertMovieTranUser;
exports.checkTran=checkTran;
exports.checkCatByMovie=checkCatByMovie;
// exports.findalWholelMovieDetailsById=findalWholelMovieDetailsById;
exports.findalTranDetailsById=findalTranDetailsById;
exports.updateMasterPage=updateMasterPage;
exports.movieDetailsSaveType=movieDetailsSaveType;
exports.checkReferTran=checkReferTran;
exports.findbasicMovieDetailsByTitle=findbasicMovieDetailsByTitle;

exports.add_user_feedback=add_user_feedback;
exports.check_user_feedback=check_user_feedback;
exports.add_user_rating=add_user_rating;
exports.check_user_rating=check_user_rating;
exports.update_user_rating=update_user_rating;
exports.getProducerLivecast=getProducerLivecast;
exports.addProducerLiveCast=addProducerLiveCast;
exports.findUserByTxtUser=findUserByTxtUser;
exports.getProducerLivecastById=getProducerLivecastById;
exports.getProducerLivecastById2=getProducerLivecastById2;
exports.findLiveCastId=findLiveCastId;
exports.updateProducerMovieCast=updateProducerMovieCast;
exports.addProducerLiveCastByCol=addProducerLiveCastByCol;
exports.findalHomeMovieDetailsByCat=findalHomeMovieDetailsByCat;
exports.findbasicMovieDetailsByTitleCat=findbasicMovieDetailsByTitleCat;
exports.all_live_Cast_By_time=all_live_Cast_By_time;
exports.all_livecast_link=all_livecast_link;