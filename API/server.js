//server.js
// ‘use strict’.
//Importando as dependências
var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var morgan = require("morgan");
var mongoose = require("mongoose");
// var session = require("express-session");
// var MongoStore = require("connect-mongo")(session);
var jwt = require("jsonwebtoken");
//Configurações básicas de segredo + database
var config = require("./config");
//Criando instancias
var app = express();

//Seta a porta (ou deixa ela em 3001)
//var port = process.env.API_PORT || 3001;
var port = 3001;
app.set("superSecret", config.secret);

var database = "";
console.log("Inicializando database -------------------------------");
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  console.log("Inicializando database-dev");
  database = config.databaseDevelopment;
} else if (process.env.NODE_ENV === "production") {
  console.log("Inicializando database-prod");
  database = config.databaseProduction;
}
mongoose.connect(database);
const db = mongoose.connection;

app.use(express.static("../build"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:

// app.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
//   //and remove cacheing so we get the most recent comments
//   res.setHeader("Cache-Control", "no-cache");
//   next();
// });

app.use(expressValidator());

//now we can set the route path & initialize the API
var router = require("./router");

//Use our router configuration when we call /api
app.use("/api", router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`Rodando API na porta: ${port}`);
});
module.exports = app;
