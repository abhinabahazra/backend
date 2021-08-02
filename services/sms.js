var http = require("https");



const sendSMS91 = async (sendNumber, sendContent) => {
  var options = {
    "method": "POST",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/v5/flow/",
    "headers": {
      "authkey": "220681Ap3YnI61Qsx5b237012",
      "content-type": "application/JSON"
    }
  };
  
  var req = http.request(options, function (res,err) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      return body.toString();
    });
  });
  
  req.write("{\"flow_id\":\"919432803296\",\"sender\":\"Magnox Learning+\",\"mobiles\":\"919432803296\",\"VAR1\":\"OTP\",\"VAR2\":\"2233\"}");
  req.end();
  // return req;
};

exports.sendSMS91 = sendSMS91;
