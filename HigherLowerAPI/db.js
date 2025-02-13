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
        "Mother", "Gay", "Costume", "Succubus", "Suck", "Penis", "Hentai", "Erotic", "Adult Only","Nudity","Lewd",  "Explicit", "Visual Novel", "Dating Sim", "Yaoi", "Yuri", "BDSM", "Waifu"
        , "Eroge", "Uncensored"];

    await axios.get(allGameURL).then(function (res) {
        data = res.data['applist']['apps'];
    })
    for(let i = 0; i < data.length; i++){
        const gameName = data[i]['name'];
        const shouldSkipGame = blockedTerms.some((term) =>
            gameName.toLowerCase().includes(term.toLowerCase()),
        );
        if(gameName === "" || shouldSkipGame === true){
            count++;
            continue;
        }
        AppIds.push(data[i]['appid']);
    }
    return AppIds;
}

async function getGamesByAppIds(inputArray){
    let data = [];
    let returnData = [];
    try{
        for(let i = 0; i < inputArray.length; i++){
            let jsonObject = {};

            if(i % 50 === 0){
                setTimeout(()=>{}, 60000)
            }

            await axios.get(`https://store.steampowered.com/api/appdetails?appids=${inputArray[i]}`).then(function (res) {
                data.push(res);
            })

            let isfree = false;
            let hasRecommendations = true;

            if(data[i].data[`${inputArray[i]}`]['success'] === false){ continue }

            let gameData = data[i].data[`${inputArray[i]}`]['data'];
            let type = gameData['type'];

            if(!hasContentDescriptor(gameData['content_descriptors']['notes'])){
                let data = gameData['content_descriptors']['notes'];
                if(data.toLowerCase().includes("sex") ||
                    data.toLowerCase().includes("nudity") || data.toLowerCase().includes("naked")){ continue }
            }

            if(gameData['ratings'] && gameData['ratings']['dejus'] && gameData['ratings']['dejus']['descriptors']){
                if(gameData['ratings']['dejus']['descriptors'].toLowerCase().includes("sex")){ continue}
            }

            if(!hasSteamGermany(gameData['steam_germany'])){
                if(gameData['steam_germany']['descriptors'].toLowerCase().includes("sex")){ continue }
            }

            if(gameData['name'].toLowerCase().includes("playtest")){ continue }
            if(gameData['release_date']['coming_soon']) { continue }
            if(type !== 'game'){ continue }
            if(gameData['is_free'] === true) { isfree = true }
            if(!gameData['recommendations']) { hasRecommendations = false}
            if(isfree === false && !gameData['price_overview']) { continue }

            jsonObject = {
                "app_id": gameData['steam_appid'],
                "name": gameData['name'],
                "image": gameData['header_image'],
                "date": gameData['release_date']['date'],
                "price": isfree ? '0 kr' : gameData['price_overview']['final_formatted'],
                "reviews": hasRecommendations ? gameData['recommendations']['total'] : 0,
            }
                returnData.push(jsonObject)
        }
    }catch(error){
        console.log(error);
    }
    return returnData;
}

async function GetFilteredAppIds(inputArray) {
    let AppIds = [];
    for(let i = 0; i < 1000; i++){
    let randomNumber = Math.floor(Math.random()*100000);
        AppIds.push(inputArray[randomNumber]);
    }
    return AppIds;
}

function hasContentDescriptor(input){
    return input === null;
}

function hasSteamGermany(input){
    return input !== null;
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
//if(data[i].data[`${AppIds[i]}`]['data']['price_overview']){console.log();}

module.exports = {
    query: (text, params) => pool.query(text, params)
};
module.exports.getAppIds = getAppIds;
module.exports.getGamesByAppIds = getGamesByAppIds;
module.exports.GetFilteredAppIds = GetFilteredAppIds;


