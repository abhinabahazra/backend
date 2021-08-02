const nodemailer = require("nodemailer");

const sendNewMail = async (formData) => {
  let obj;
  const transporter = nodemailer.createTransport({
    host: 'lotus.arvixe.com',
    port: 465,
    auth: {
        user: 'admin@digimovieplex.com',
        pass: '12345678'
    }
});

  var mailOptions = {
    from: "admin@digimovieplex.com",
    to: formData.to,
    subject: formData.subject,
    html: formData.content,
  };

  try {
    let emailResponse = await transporter.sendMail(mailOptions);
    obj = {
      status: "success",
      message: "email_sent",
      result: emailResponse,
    };
    return obj;
  } catch (error) {
    console.log(error);
    obj = {
      status: "fail",
      message: "email_not_send",
      result: error,
    };
    return obj;
  }
};

const sendNewMailCustom = async (formData) => {
  let obj;
  const transporter = nodemailer.createTransport({
    host: 'lotus.arvixe.com',
    port: 465,
    auth: {
        user: 'admin@digimovieplex.com',
        pass: '12345678'
    }
});

  var mailOptions = {
    from: formData.from,
    to: formData.to,
    subject: formData.subject,
    html: formData.content,
  };

  try {
    let emailResponse = await transporter.sendMail(mailOptions);
    obj = {
      status: "success",
      message: "email_sent",
      result: emailResponse,
    };
    return obj;
  } catch (error) {
    console.log(error);
    obj = {
      status: "fail",
      message: "email_not_send",
      result: error,
    };
    return obj;
  }
};


exports.sendNewMail = sendNewMail;
exports.sendNewMailCustom = sendNewMailCustom;
