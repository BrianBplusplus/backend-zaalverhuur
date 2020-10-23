const { Router, response } = require("express");
const nodemailer = require("nodemailer")
const router = new Router();

const transponder = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
    auth: {
      user: "youremail@gmail.com",
      pass: "password"
    },
  secure: true,
})

// ----- Routes ------ //

router.post('/mail/location', (request, response) => {
  const {to, subject, text} = request.body

  const mailData = {
    from: "youremail@gmail.com", //sender address
    to: to,
    subject: subject,
    text: text,
    html: "<b> Test </b> <br> <b> Message sent with nodemailer </b>"
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if(error) {
      return console.log(error)
    }
     response.status(200).send({ message: "Mail sent", message_id: info.messageId})
  });
})

module.exports = router;