const { Router } = require("express");
const nodemailer = require("nodemailer");

const axios = require("axios");
const router = new Router();

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secureConnection: false,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

router.post("/action/sendemail", (request, response) => {
  const {
    inputFormName,
    inputFormLastName,
    inputFormEmail,
    inputformCompany,
    additionalInformationDayPart,
    additionalInformationCatering,
    additionalInformationTextField,
    additionalInformationAmountOfPersons,
    pickedDate,
  } = request.body;
  const roomName = request.body.apiData.name;

  console.log("request body", request.body);

  const mailData = {
    from: process.env.EMAIL_USERNAME,
    to: inputFormEmail,
    subject: "Reservering zaal",
    text: `
    Beste ${inputFormName}, 
    Bedankt voor je aanvraag. 
    Je hoort zo spoedig mogelijk of de gewenste ruimte beschikbaar is en ontvangt dan een offerte op maat. 
    Met vriendelijke groet,
    Toos van Olsen 
    Medewerker zalenverhuur - rondleidingen DeNieuweBibliotheek`,
    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1f497d">
    Beste ${inputFormName},
    <br><br>
    Bedankt voor je aanvraag. 
    Je hoort zo spoedig mogelijk of de gewenste ruimte beschikbaar is en ontvangt dan een offerte op maat.
    <br><br>
    Met vriendelijke groet,
    <br><br>
    Toos van Olsen 
    <br>
    Medewerker zalenverhuur - rondleidingen
    <br>
    DeNieuweBibliotheek 
    <div>`,
  };

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
    `,
  };

  transporter.sendMail(mailData, function (error, info) {
    if (error) {
      return console.log(error);
    }
    response
      .status(200)
      .send({ message: "Mail sent", message_id: info.messageId });
  });

  transporter.sendMail(mailDataInternal, function (error, info) {
    if (error) {
      return console.log(error);
    }
    response
      .status(200)
      .send({ message: "Mail sent", message_id: info.messageId });
  });
});

module.exports = router;
