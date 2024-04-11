const { Client} = require("pg");
require('dotenv').config();


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

  //Skapa tabell

  client.query(`
  DROP TABLE IF EXISTS cv;
  CREATE TABLE cv (
    id SERIAL PRIMARY KEY NOT NULL,
    companyname VARCHAR(40),
    jobtitle VARCHAR(50),
    location VARCHAR(100),
    description VARCHAR(100),
    startdate date,
    enddate date
  )
  `)