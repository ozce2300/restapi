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

  //Middlewear

  app.use(cors());
  app.use(express.json());

  //route

  //Hämta cv
app.get("/cv", (req, res) => {

    client.query(`SELECT * FROM cv;`, (err, results) => {
        if(err) {
            res.status(500).json({error:`Something went wrong: ${err}`});
            return;
        }

        if (results.length === 0) {
            res.status(200).json({error: `No cvs found`});
        }

        else {
            res.json(results);
        }
    })

});

//Posta cv
app.post("/cv", (req, res) => {


    let companyname = req.body.companyname 
    let jobtitle = req.body.jobtitle
    let location = req.body.location
    let description = req.body.description
    
    client.query(`INSERT INTO cv (companyname, jobtitle, location, description) VALUES($1, $2, $3, $4);`, [companyname,jobtitle,location,description], (err, results) => {
        if(err) {
            res.status(500).json({error:`Something went wrong: ${err}`});
            return;
        }

        let cv = {
            companyname : companyname,
            jobtitle : jobtitle,
            location : location,
            description : description
        }

        res.json({message: "Cv tillagd", cv})
    
});

});

//Lyssna
app.listen(process.env.DB_PORT, () => {
    console.log("Servern startad på port: " + process.env.DB_PORT);
  });
  