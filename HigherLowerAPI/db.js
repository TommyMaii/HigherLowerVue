const { Pool } = require('pg');
const axios = require("axios");
let allGameURL = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${process.env.STEAM_API_KEY}&format=json`;
require('dotenv').config();


const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    host: 'localhost',
    port: 5432, // default Postgres port
    database: process.env.DB,
});

async function getAppIds(){
    let AppIds = []
    let count = 100;
    let data;
    const blockedTerms =
        ["test", "soundtrack", "demo","Kickstarter", "Sex", "18", "Porn", "NSFW", "DLC","Outfit", "Pack", "Dragon's Dogma 2", "Naughty", "Red-Light", "Red light", "Dick", "Pussy", "Beat Saber",
        "Mother", "Gay", "Costume"];


    await axios.get(allGameURL).then(function (res) {
        data = res.data['applist']['apps'];
    })
    for(let i = 0; i < count; i++){
        const gameName = data[i]['name'];
        const shouldSkipGame = blockedTerms.some((term) =>
            gameName.toLowerCase().includes(term.toLowerCase()),
        );
        if(data[i]['name'] === "" || shouldSkipGame === true){
            count++;
            continue;
        }
        console.log(data[i]);
        AppIds.push(data[i]['appid']);
    }
    return AppIds;
}

async function getGamesByAppIds(){
    let AppIds = await getAppIds();
    let data = [];
    let count = 100;
    for(let i = 0; i < 2; i++){
        await axios.get(`https://store.steampowered.com/api/appdetails?appids=${AppIds[i]}`).then(function (res) {
            data.push(res);
            console.log(data[i].data[`${AppIds[i]}`]);
        })
    }
}

//Data to save
// Reviews
// console.log(data[i].data[`${AppIds[i]}`]['data']['recommendations']['total'])
//steamappid
// console.log(data[i].data[`${AppIds[i]}`]['data']['steam_appid])
//Name
// console.log(data[i].data[`${AppIds[i]}`]['data']['name'])
//Image
// console.log(data[i].data[`${AppIds[i]}`]['data']['header_image'])
//Date
// console.log(data[i].data[`${AppIds[i]}`]['data']['release_date']['date'])
// Price
//if(data[i].data[`${AppIds[i]}`]['data']['price_overview']){console.log(data[i].data[`${AppIds[i]}`]['data']['price_overview']['final_formatted']);}
//GetImage
// console.log(data[i].data[`${AppIds[i]}`]['data']['header_image']);

module.exports = {
    query: (text, params) => pool.query(text, params)
};
module.exports.getAppIds = getAppIds;
module.exports.getGamesByAppIds = getGamesByAppIds;


