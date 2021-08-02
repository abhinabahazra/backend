const sleep = require('util').promisify(setTimeout);
const bcrypt = require('bcrypt');
var pgp = require('pg-promise')({});
const db=require('../config/db.config').pool;


//var db = pgp({ host: '13.233.117.90', port: 5432, database: 'dbott', user: 'magnox', password: 'DaTaBaSe#123' });



pgp.pg.types.setTypeParser(1114, function (stringValue) {
	return stringValue;
});

function now() {
	let curdate = new Date();
	return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
  }


  const findUser = async (param, paramType) => {
	let user, obj;
	let condition;
	let conditionVal;
	let user_details;
	
if (param && paramType) {
	switch (paramType) {
        case "id":
          condition = " WHERE num_user_id='"+param.id+"'";
          conditionVal = param.num_user_id;
          break;
        case "email":
          condition = " WHERE txt_emailid='"+param.email+"'";
          conditionVal = param.txt_emailid;
          break;
        case "phone":
          condition = " WHERE num_mobile_no='"+param.phone+"'";
          conditionVal = param.num_mobile_no;
          break;
		case "googleId":
          condition = " WHERE txt_google_id='"+param.googleId+"'";
          conditionVal = param.num_mobile_no;
          break;
		case "g_email":
			condition = " WHERE txt_emailid='"+param.email+"' AND txt_google_id IS NULL";
			conditionVal = param.txt_emailid;
			break;
		case "refer":
			condition = " WHERE txt_refer_code='"+param.refercode+"'";
			conditionVal = param.txt_refer_code;
			break;	
        default:
          return null;
      }

        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_user_dtls "+condition).then(function(data) {
			  //console.log(data);
			if (data) {
				if (data.rows.length > 0) {
					obj = { status: "success", result: data.rows[0] };
				} else {
					obj = { status: "fail", result: "" };
				}
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
    } else {
      user_details = { status: "fail", message: "pass searchByValue and searchByType" };
    }
  return user_details;
};


const addUser = async (user_data) => {   
	let txt_google_id = "";
	let txt_profile_pic = "";

	if (user_data.txt_google_id != "") {
		txt_google_id = user_data.txt_google_id;
	}
	if (user_data.txt_profile_pic != "") {
		txt_profile_pic = user_data.txt_profile_pic;
	}

	let hashPassword = await bcrypt.hash(user_data.txt_password, 10);  
	let dat_creation_date = user_data.dat_creation_date;
	let num_master_id = user_data.num_master_id;
	let first_name = user_data.first_name;
	let last_name = user_data.last_name;
	let txt_user_id = user_data.txt_user_id;
	let txt_password = hashPassword;
	let txt_gender = user_data.txt_gender;
	let txt_emailid = user_data.txt_emailid;
	let num_mobile_no = user_data.num_mobile_no;
	let txt_user_country = user_data.txt_user_country;
	let txt_active = user_data.txt_active;
	let txt_refer_code=user_data.txt_refer_code;
	let txt_joining_code=user_data.txt_joining_code;
	let yn_mobile_verified = "0";
	let yn_email_verified = "0";


	// console.log(txt_user_country);
	// return;

	let userdetails = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_user_dtls(num_master_id,txt_user_id,txt_password,txt_gender,txt_emailid,num_mobile_no,txt_user_country,txt_active,dat_creation_date,yn_mobile_verified,yn_email_verified,first_name,last_name,txt_google_id,txt_profile_pic,txt_refer_code,txt_joining_code) VALUES ('"+num_master_id+"','"+txt_user_id+"','"+txt_password+"','"+txt_gender+"','"+txt_emailid+"','"+num_mobile_no+"','"+txt_user_country+"','"+txt_active+"','"+dat_creation_date+"','"+yn_mobile_verified+"','"+yn_email_verified+"','"+first_name+"','"+last_name+"','"+txt_google_id+"','"+txt_profile_pic+"','"+txt_refer_code+"','"+txt_joining_code+"') RETURNING *;").then(function(data) {
			// console.log(data.rows[0]);
			if (data.rows.length > 0) {
				// let uid = data.rows[0].num_user_id;
				// getRefer(uid);
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
	return userdetails;
  }

  const signin = async(username, password, usertype) =>{
	user_details = new Promise(function(resolve, reject) {
		try {
			db.query("SELECT * FROM ott_user_dtls  WHERE txt_user_id='"+username+"' and num_master_id != '1' ").then(function(data) {
			if (data.rows.length > 0) {
			// console.log(data.rows[0].txt_password);
			// console.log(data.rows);
			match = bcrypt.compareSync(password, data.rows[0].txt_password);
			if (match) {
				// await Visitors.findByIdAndUpdate(user.num_user_id, { lastLogin: Date.now() });
				obj = { status: "success", message: "logged_in", result: data.rows[0] };
			} else {
				obj = { status: "fail", message: "invalid_password", result: "" };
			}
		  } else {
			  obj = { status: "fail", message: "not_found" , result: "" };
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
}

const updateEmailVerifyById = async(num_user_id) =>{
	user_details = new Promise(function(resolve, reject) {
		try {
		db.query("UPDATE ott_user_dtls SET yn_email_verified = '1' WHERE num_user_id='"+num_user_id+"' RETURNING num_user_id;").then(function(data) {
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
	return user_details;
}


const usertype = async () => {
	let obj;
	let user_type_list;
	
	
	user_type_list = new Promise(function(resolve, reject) {
		try {
		db.query("SELECT * FROM ott_user_master_dtls where num_master_id in(2,3) ").then(function(data) {
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

  return user_type_list;
};

// Update Profile
const updateProfile = async(user_data,user_id) =>{

	let first_name = user_data.first_name;
	let last_name = user_data.last_name;
	let txt_emailid = user_data.txt_emailid;
	let num_mobile_no = user_data.num_mobile_no;
	let txt_user_dob = user_data.txt_user_dob;
	let txt_gender = user_data.txt_gender;
	let txt_address_1 = user_data.txt_address_1;
	let txt_address_2 = user_data.txt_address_2;
	let num_pin_code = user_data.num_pin_code;
	//let txt_profile_pic=user_data.txt_profile_pic;
	let yn_email_verified = user_data.yn_email_verified;

	
	user_details = new Promise(function(resolve, reject) {
		try {
		db.query("UPDATE ott_user_dtls SET first_name = '"+first_name+"',last_name = '"+last_name+"',txt_emailid = '"+txt_emailid+"',num_mobile_no = '"+num_mobile_no+"',txt_user_dob = '"+txt_user_dob+"',txt_gender = '"+txt_gender+"',txt_address_1 = '"+txt_address_1+"',txt_address_2 = '"+txt_address_2+"',num_pin_code = '"+num_pin_code+"',yn_email_verified = '"+yn_email_verified+"' WHERE num_user_id = "+user_id+" RETURNING *;").then(function(data) {
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
	return user_details;
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

const updateProfilePic = async (user_data) => { 
	let num_user_id = user_data.num_user_id;
	//let txt_profile_pic = user_data.txt_profile_pic;
	let col_value = user_data.col_value;
	let col_name = user_data.col_name;
	let user_profile_pic = new Promise(function(resolve, reject) {
		try {
		  db.query("UPDATE ott_user_dtls SET "+col_name+" = '"+col_value+"' WHERE num_user_id = "+num_user_id+" RETURNING *;").then(function(data) {
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
	  return user_profile_pic;
  }


  const editUserPassword = async(num_user_id,newpassword) =>{
	  //console.log(num_user_id+ '   '    +newpassword);
	 // return;
	let hashPassword = await bcrypt.hash(newpassword, 10); 
	 
	user_details = new Promise(function(resolve, reject) {
		try {

		// var qr = "UPDATE ott_user_dtls SET txt_password = '"+hashPassword+"' WHERE num_user_id="+num_user_id+"";
		// console.log(qr);
		// return;

		db.query("UPDATE ott_user_dtls SET txt_password = '"+hashPassword+"' WHERE num_user_id="+num_user_id+" RETURNING num_user_id;").then(function(data) {
			//console.log(data);
			if (data != null) {
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
}

const getRefer=async(eid)=>{
	// console.log('======1111111111111======');
	get_refer=new Promise(function(resolve, reject){
		try{
			let rfqr = "call proc_refer_code_generation("+eid+",null,null);";
			db.query(rfqr).then(function(data) {
			// console.log('======asasasas======'+data);
			if (data != null) {
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
	return get_refer;
}

const insertReferTran = async(randNumber)=>{
	console.log('======1111111111111======');
	get_refer=new Promise(function(resolve, reject){
		try{
			let rfqr = "call proc_movie_refer_data('"+randNumber+"',null,null);";
			db.query(rfqr).then(function(data) {
			console.log('======asasasas======'+data);
			if (data != null) {
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
	return get_refer;
}

const findUserByJoiningCode = async (refer_code) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * FROM ott_user_dtls WHERE txt_refer_code ='"+refer_code+"'").then(function(data) {
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

const addReferUser = async (user_data) => {   
	  
	let num_user_id = user_data.num_user_id;
	let txt_user_id = user_data.txt_user_id;
	let master_user_id = user_data.master_user_id;
	let master_txt_user_id = user_data.master_txt_user_id;
	let dat_creation_date = user_data.dat_creation_date;

	// let qu = "INSERT INTO ott_refered_user(num_user_id,txt_user_id,master_user_id,master_txt_user_id,dat_creation_date) VALUES ('"+num_user_id+"','"+txt_user_id+"','"+master_user_id+"','"+master_txt_user_id+"','"+dat_creation_date+"')";
	// console.log(qu);
	
	let userreferdetails = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_refered_user(num_user_id,txt_user_id,master_user_id,master_txt_user_id,dat_creation_date) VALUES ('"+num_user_id+"','"+txt_user_id+"','"+master_user_id+"','"+master_txt_user_id+"','"+dat_creation_date+"') RETURNING *;").then(function(data) {
			// console.log(data.rows[0]);
			if (data.rows.length > 0) {
				// let uid = data.rows[0].num_user_id;
				// getRefer(uid);
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
	return userreferdetails;
  }
const findChildReferByMasterId = async (master_user_id) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("select ott_user_dtls.first_name,ott_user_dtls.last_name,ott_refered_user.num_user_id,ott_refered_user.txt_user_id,ott_refered_user.dat_creation_date from ott_user_dtls,ott_refered_user where ott_user_dtls.num_user_id=ott_refered_user.num_user_id and ott_refered_user.master_user_id='"+master_user_id+"'").then(function(data) {
			//   console.log(data.rows);
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
 
  return user_details;
};

const addUserWallet = async (user_data) => {   
	let user, obj;
	let num_user_id = user_data.num_user_id;
	let txt_user_id = user_data.txt_user_id;
	let cur_credit_amount = user_data.cur_credit_amount;
	let cur_debit_amount = user_data.cur_debit_amount;
	let cur_balance_amount = user_data.cur_balance_amount;
	let txt_transaction_no = user_data.txt_transaction_no;
	let dat_update_date = user_data.dat_update_date;

	let userdetails = new Promise(function(resolve, reject) {
	  try {
		db.query("INSERT INTO ott_user_wallet(num_user_id,txt_user_id,cur_credit_amount,cur_debit_amount,cur_balance_amount,txt_transaction_no,dat_update_date) VALUES ('"+num_user_id+"','"+txt_user_id+"','"+cur_credit_amount+"','"+cur_debit_amount+"','"+cur_balance_amount+"','"+txt_transaction_no+"','"+dat_update_date+"') RETURNING *;").then(function(data) {
			// console.log(data.rows[0]);
			if (data.rows.length > 0) {
				// let uid = data.rows[0].num_user_id;
				// getRefer(uid);
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
	return userdetails;
  }

  const updateUserWallet = async(user_data) =>{

	let cur_credit_amount = user_data.cur_credit_amount;
	let cur_debit_amount = user_data.cur_debit_amount;
	let cur_balance_amount = user_data.cur_balance_amount;
	let txt_transaction_no = user_data.txt_transaction_no;
	let dat_update_date = user_data.dat_update_date;

	// let qa = "UPDATE ott_user_wallet SET cur_credit_amount = '"+cur_credit_amount+"',cur_debit_amount = '"+cur_debit_amount+"',cur_balance_amount = '"+cur_balance_amount+"',txt_transaction_no = '"+txt_transaction_no+"',dat_update_date = '"+dat_update_date+"' WHERE num_user_id = "+user_data.num_user_id;
	// console.log(qa);
	//return;    
		
	
	user_details = new Promise(function(resolve, reject) {
		
		
		try {
		db.query("UPDATE ott_user_wallet SET cur_debit_amount = '"+cur_debit_amount+"',cur_balance_amount = '"+cur_balance_amount+"',txt_transaction_no = '"+txt_transaction_no+"',dat_update_date = '"+dat_update_date+"' WHERE num_user_id = "+user_data.num_user_id+" RETURNING *;").then(function(data) {
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
	return user_details;
}


const findUserAllWalletBalanceById = async (user_id) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT * from ott_user_wallet WHERE num_user_id ='"+user_id+"'").then(function(data) {
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

const updatePhoneVerifyById = async(num_user_id,status) =>{
	user_details = new Promise(function(resolve, reject) {
		try {
		db.query("UPDATE ott_user_dtls SET yn_mobile_verified = '"+status+"' WHERE num_user_id='"+num_user_id+"' RETURNING num_user_id;").then(function(data) {
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
}

const findUserWalletBalanceById = async (user_id) => {
	let user, obj;
	let user_details;
	
        user_details = new Promise(function(resolve, reject) {
          try {
          db.query("SELECT cur_balance_amount from ott_user_wallet WHERE num_user_id ='"+user_id+"'").then(function(data) {
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

exports.findUserWalletBalanceById=findUserWalletBalanceById;

exports.signin = signin;
exports.addUser = addUser;
exports.findUser = findUser;
exports.updateProfile=updateProfile;
exports.editUserPassword=editUserPassword;
exports.updateProfilePic=updateProfilePic;
exports.findUserByJoiningCode=findUserByJoiningCode;
exports.addReferUser=addReferUser;
exports.findChildReferByMasterId=findChildReferByMasterId;
exports.addUserWallet=addUserWallet;
exports.updateUserWallet=updateUserWallet;
exports.findUserAllWalletBalanceById=findUserAllWalletBalanceById;

exports.updateEmailVerifyById = updateEmailVerifyById;
exports.findUserById=findUserById;
exports.usertype = usertype;

exports.getRefer = getRefer;
exports.insertReferTran = insertReferTran;
exports.updatePhoneVerifyById = updatePhoneVerifyById;

