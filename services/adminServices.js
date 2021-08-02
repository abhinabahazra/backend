const sleep = require('util').promisify(setTimeout);
const bcrypt = require('bcrypt');
var pgp = require('pg-promise')({});
const db=require('../config/db.config').pool;

const findMovieById = async (movie_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_movie_master WHERE id ='"+movie_id+"'").then(function(data) {
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
const findApprovalById = async (approval_id) => {
	let movie, obj;
	let movie_details;
	
        movie_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_approval_master WHERE id ='"+approval_id+"'").then(function(data) {
			// console.log(data.rows);
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
// Insert data in approval table
const add_approval_dtls = async (user_data) => {   

    let num_approval_type = user_data.num_approval_type;
	let num_movie_id = user_data.num_movie_id;
	let num_user_id = "0";
	let txt_approval_status = "pending";
	let txt_desc = user_data.txt_desc;
	let approved_by_id = user_data.approved_by_id;
	let dat_approval_date = user_data.dat_approval_date;
	let upload_id = user_data.upload_id;
	let upload_date = user_data.upload_date;
	
	let movie_link = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_approval_dtls(num_approval_type,num_movie_id,num_user_id,txt_approval_status,txt_desc,approved_by_id,dat_approval_date,upload_id,upload_date) VALUES('"+num_approval_type+"','"+num_movie_id+"','"+num_user_id+"','"+txt_approval_status+"','"+txt_desc+"','"+approved_by_id+"','"+dat_approval_date+"','"+upload_id+"','"+upload_date+"') RETURNING *;").then(function(data) {
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

  // get approve type

  const all_approve_type=async()=>{
	get_Approve_Type=new Promise(function(resolve, reject){
		try{
			db.query("SELECT * FROM ott_approval_master;").then(function(data) {
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
	return get_Approve_Type;
}

  exports.add_approval_dtls=add_approval_dtls;
  exports.all_approve_type=all_approve_type;
  exports.findMovieById=findMovieById;
  exports.findUserById=findUserById;
  exports.findApprovalById=findApprovalById;