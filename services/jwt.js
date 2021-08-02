const jwt = require("jsonwebtoken"),
	secret = "DO_NOT_CHANGE_THIS"; //Do not change this in production

const auth = (req, res, next) => {
	let token = req.headers["authorization"];
	if (token) {
		jwt.verify(token, secret, (error, result) => {
			if (error) {
				req.loggedIn = false;
			} else {
				req.loggedIn = true;
				req.tokenData = { ...result };
			}
		});
		next();
	} else {
		req.loggedIn = false;
		next();
	}
};

function sign(data) {
	let token = jwt.sign(data, secret, {
		expiresIn: 604800, // 1 week
	});
	return token;
}

exports.sign = sign;
exports.auth = auth;
