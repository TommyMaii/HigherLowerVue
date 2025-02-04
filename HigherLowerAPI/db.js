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
        console.log(data)
        const gameName = data[i]['name'];
        const shouldSkipGame = blockedTerms.some((term) =>
            gameName.toLowerCase().includes(term.toLowerCase()),
        );
        if(data[i]['name'] === "" || shouldSkipGame === true){
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
        for(let i = 0; i < 1; i++){
            let jsonObject = {};
            await axios.get(`https://store.steampowered.com/api/appdetails?appids=${inputArray[i]}`).then(function (res) {
                data.push(res);
            })
            let isfree = false;
            let hasRecommendations = true;
            let hasNotes = true;
            if(data[i].data[`${inputArray[i]}`]['success'] === false){ continue }
            console.log(data[i].data[`${inputArray[i]}`]['data'])
            if(data[i].data[`${inputArray[i]}`]['data']['content_descriptors']['notes'] === "null"){ hasNotes = false }
            if(hasNotes === true) {
                if(data[i].data[`${inputArray[i]}`]['data']['content_descriptors']['notes'].toLowerCase().includes("sex")){
                    continue;
                }
            }
            let type = data[i].data[`${inputArray[i]}`]['data']['type'];
            if(data[i].data[`${inputArray[i]}`]['data']['name'].includes("Playtest") || data[i].data[`${inputArray[i]}`]['data']['name'].includes("playtest")){ continue }
            if(data[i].data[`${inputArray[i]}`]['data']['release_date']['coming_soon']) { continue }
            if(type.includes('dlc') || type.includes('soundtrack') || type.includes('movie') || type.includes('episode')){ continue }
            if(data[i].data[`${inputArray[i]}`]['data']['is_free'] === true) { isfree = true }
            if(!data[i].data[`${inputArray[i]}`]['data']['recommendations']) { hasRecommendations = false}
            if(isfree === false && !data[i].data[`${inputArray[i]}`]['data']['price_overview']) { continue }
            console.log(data[i].data[`${inputArray[i]}`]['data'])
            jsonObject = {
                "AppId": data[i].data[`${inputArray[i]}`]['data']['steam_appid'],
                "Name": data[i].data[`${inputArray[i]}`]['data']['name'],
                "Image": data[i].data[`${inputArray[i]}`]['data']['header_image'],
                "Date": data[i].data[`${inputArray[i]}`]['data']['release_date']['date'],
                "Price": isfree ? "Free" : data[i].data[`${inputArray[i]}`]['data']['price_overview']['final_formatted'],
                "Reviews": hasRecommendations ? data[i].data[`${inputArray[i]}`]['data']['recommendations']['total'] : 0,
            }
                returnData.push(jsonObject)
        }
    }catch(error){
        console.log(error);
    }
    return returnData;
}

async function Get200FilteredAppIds(inputArray) {
    let AppIds = [];
    for(let i = 0; i < 200; i++){
    let randomNumber = Math.floor(Math.random()*100000);
        AppIds.push(inputArray[randomNumber]);
    }
    return AppIds;
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
module.exports.get200FilteredAppIds = Get200FilteredAppIds;


