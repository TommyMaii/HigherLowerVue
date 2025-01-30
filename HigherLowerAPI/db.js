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
    for(let i = 0; i < count; i++){
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
        for(let i = 0; i < inputArray.length-2; i++){
            // let hasPrice = true;
            // let hasReviews = true;
            let jsonObject = {};

            await axios.get(`https://store.steampowered.com/api/appdetails?appids=${inputArray[i]}`).then(function (res) {
                // if(data[i].data[`${AppIds[i]}`]['data']['price_overview'] === undefined) {
                //     hasPrice = false;
                // }
                // if(!(data[i].data[`${AppIds[i]}`]['data']['recommendations'] === undefined) || data[i].data[`${AppIds[i]}`]['data']['recommendations'] === '0') {
                //     hasReviews = false;
                // }
                data.push(res);
                jsonObject = {
                    "AppId": data[i].data[`${inputArray[i]}`]['data']['steam_appid'],
                    "Name": data[i].data[`${inputArray[i]}`]['data']['name'],
                    "Image": data[i].data[`${inputArray[i]}`]['data']['header_image'],
                    "Date": data[i].data[`${inputArray[i]}`]['data']['release_date']['date'],
                    // "Price": hasPrice ? data[i].data[`${AppIds[i]}`]['data']['price_overview']['final_formatted'] : 0,
                    // "Reviews": hasReviews ?  data[i].data[`${AppIds[i]}`]['data']['recommendations']['total'] : 0,
                }
                returnData.push(jsonObject)
            })
        }
    }catch(error){
        console.log(error);
    }
    return returnData;
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


