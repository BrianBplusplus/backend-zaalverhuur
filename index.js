const express = require("express");
const app = express();

const port = 4000;

const dotenv = require("dotenv");
dotenv.config();

const helmet = require("helmet");
app.use(helmet());

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

const routes = require("./routes");
const { request } = require("express");
app.use(routes);

app.use(express.static(__dirname + "/build/"));

app.listen(process.env.PORT || port, () =>
  console.log(`
// ---- denieuwebibliotheek Express app ---- //
// ---- Listening on port ${process.env.PORT || port} ---- //`)
);
