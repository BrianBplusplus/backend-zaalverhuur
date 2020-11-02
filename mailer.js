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

  const {inputFormName, inputFormLastName, inputFormEmail, inputformCompany, additionalInformationDayPart, additionalInformationCatering, 
    additionalInformationTextField, additionalInformationAmountOfPersons, pickedDate } = request.body
  const roomName = request.body.apiData.name

  console.log("request body", request.body)

  const mailData = {
    from: process.env.EMAIL_USERNAME,
    to: inputFormEmail,
    subject: "Reservering zaal",
    text: "Bedankt voor het reserveren van de zaal, u ontvangt spoedig een op maat gemaakte offerte",
    html: "<b> Zaal verhuur </b> <br> <b> Bedankt voor het reserveren van de zaal, u ontvangt spoedig een op maat gemaakte offerte</b>"
  }

  const mailDataInternal = {
    from: process.env.EMAIL_USERNAME,
    to: "reserveringen@denieuwebibliotheek.nl",
    subject: "Reservering zaal",
    text: `Nieuwe zaalreservering
    Zaal: ${roomName}
    Datum: ${pickedDate}
    
    Naam: ${inputFormName} ${inputFormLastName}
    Mail: ${inputFormEmail}
    Bedrijf: ${inputformCompany}

    Aanvullende informatie
    Dagdeel: ${additionalInformationDayPart}
    Catering: ${additionalInformationCatering}
    Aantal personen: ${additionalInformationAmountOfPersons}
    Extra informatie: ${additionalInformationTextField}
    `
  }
  
  transporter.sendMail(mailData, function (error, info) {
    if(error) {
      return console.log(error)
    }
     response.status(200).send({ message: "Mail sent", message_id: info.messageId})
  });

  transporter.sendMail(mailDataInternal, function (error, info) {
    if(error) {
      return console.log(error)
    }
     response.status(200).send({ message: "Mail sent", message_id: info.messageId})
  });
})

module.exports = router;
