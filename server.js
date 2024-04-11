const { Client } = require("pg");
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

//Anslut till databas med kod hämtad från .env
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
  });
   
client.connect((err) => {
    if(err) {
        console.log("Fel")
    }

    else {
        console.log("Ansluten till databas....")
    }
  });

  //route

  //Hämta cv
app.get("/cv", (req, rest) => {


});

//Posta cv
app.post("/cv", (req, rest) => {

    
});