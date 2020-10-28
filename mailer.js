const { Router } = require("express");
const nodemailer = require("nodemailer")

const axios = require("axios");
const router = new Router();

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secureConnection: false,
  secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      ciphers: "SSLv3"
    }
})

router.post("/action/sendemail", (request, response) => {

  const {to, subject, text} = request.body
 // console.log("request body", request.body)

  const mailData = {
    from: process.env.EMAIL_USERNAME,
    to: "brian@nieuwenhuijzen.net",
    subject: "subject",
    text: "test text",
    html: "<b> Test </b> <br> <b> Message sent with nodemailer </b>"
  }

  transporter.sendMail(mailData, function (error, info) {
    if(error) {
      return console.log(error)
    }
     response.status(200).send({ message: "Mail sent", message_id: info.messageId})
  });
})

module.exports = router;
