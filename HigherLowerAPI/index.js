const express = require('express');
const db = require('./db');
var cors = require('cors');
const app = express();
require("dotenv").config();

app.use(cors());

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is up`);
});

app.get("/GetGames", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM gameappids');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post("/AddGameIds", async (req, res) => {
    let data = await db.getAppIds();
    let customData = JSON.stringify(data).split(",");
    try {
        const result = await db.query(
            `INSERT into gameappids (appids) values ('${customData}')`
        );
        console.log("Pushed Data");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post("/AddGameData", async (req, res) => {
    const result = await db.query('SELECT * FROM gameappids');
    let data = await db.getGamesByAppIds(result.rows[0]['appids']);
    let customData = JSON.stringify(data).replaceAll("'", "");
    try {
        const result = await db.query(
            `INSERT into games (gamedata) values ('${customData}')`
        );
        console.log("Pushed Data");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})


