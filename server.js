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

        if (results.rows.length === 0) {
            res.status(200).json({error: `No cvs found`});
        }

        else {
            res.json(results.rows);
        }
    })

});

//Posta cv
app.post("/cv", (req, res) => {


    let companyname = req.body.companyname 
    let jobtitle = req.body.jobtitle
    let location = req.body.location
    let description = req.body.description
    let startdate = req.body.startdate
    let enddate = req.body.enddate

    
    client.query(`INSERT INTO cv (companyname, jobtitle, location, description) VALUES($1, $2, $3, $4);`, [companyname,jobtitle,location,description, startdate, enddate], (err, results) => {
        if(err) {
            res.status(500).json({error:`Something went wrong: ${err}`});
            return;
        }

        let cv = {
            companyname : companyname,
            jobtitle : jobtitle,
            location : location,
            description : description,
            startdate : startdate,
            enddate : enddate
        }

        res.json({message: "Cv tillagd", cv})
    
});

});

// Uppdatera ett CV
app.put("/cv/:id", (req, res) => {
    const id = req.params.id;

    let companyname = req.body.companyname 
    let jobtitle = req.body.jobtitle
    let location = req.body.location
    let description = req.body.description
    let startdate = req.body.startdate
    let enddate = req.body.enddate

    client.query(`UPDATE cv SET companyname = $1, jobtitle = $2, location = $3, description = $4 WHERE id = $5;`, [companyname, jobtitle, location, description, startdate, enddate, id], (err, results) => {
        if(err) {
            console.log("fel vid uppdatering:", err);
            res.status(500).json({error: "Något gick fel"});
            return;
        }

        res.json({message: "CV uppdaterat"});
    });
});

// Ta bort ett CV
app.delete("/cv/:id", (req, res) => {
    const id = req.params.id;

    client.query(`DELETE FROM cv WHERE id = $1;`, [id], (err, results) => {
        if(err) {
            console.log("Fel vid radering:", err);
            res.status(500).json({error: "Något gick fel"});
            return;
        }

        res.json({message: "CV borttaget"});
    });
});

//Lyssna
app.listen(process.env.DB_PORT, () => {
    console.log("Servern startad på port: " + process.env.DB_PORT);
  });
  