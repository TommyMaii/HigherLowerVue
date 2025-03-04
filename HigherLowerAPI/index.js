const express = require('express');
var cors = require('cors');
require("dotenv").config();
var bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const db = require("./db");
const {rows} = require("pg/lib/query");


const app = express();
app.use(express.json());
app.use(cors());

const fileGameDataPath = path.join(__dirname, 'gameData.json');
const fileHighScorePath = path.join(__dirname, 'highscore.json');


function readGameData() {
    try {
        const data = fs.readFileSync(fileGameDataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return [];
    }
}

function readHighScoreData() {
    try {
        const data = fs.readFileSync(fileHighScorePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return { highscore: 0 };
    }
}

function updateHighscore(newHighscore) {
    const db = readHighScoreData();

    db[0].highscore = newHighscore

    try {
        fs.writeFileSync(fileHighScorePath, JSON.stringify(db, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is up`);
});

app.get('/getGames', (req, res) => {
    const games = readGameData();
    res.json(games);
});

app.get('/getHighscore', (req, res) => {
    const highScore = readHighScoreData();
    res.json(highScore);
});

app.put("/UpdateHighscore", async (req, res) => {
    try {
        const highScore = await readHighScoreData();
        updateHighscore(req.body.highscore)
        console.log("Updated highscore");
        res.json(highScore);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

