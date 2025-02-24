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
    let filteredGameArray;
    try {

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const responses = await Promise.allSettled(
            inputArray.map((appid, index) =>
                delay(index * 500)
                    .then(() => axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`))
            )
        );

         filteredGameArray = await responses
            .filter(result => result.status === "fulfilled")
            .map(result => result.value?.data ?? "")
            .flatMap(gameDataObj =>
                Object.entries(gameDataObj).map(([id, gameData]) => ({
                    "app_id": id,
                    "type": gameData['data']?.['type'],
                    "name": gameData['data']?.['name'] ?? "Unknown",
                    "image": gameData['data']?.['header_image'] ?? "No image",
                    "date": gameData['data']?.['release_date']?.['date'] ?? "Not Yet Released",
                    "comingSoon": gameData['data']?.['release_date']?.['coming_soon'] ?? "Not Yet Released",
                    "price": gameData['data']?.['price_overview']?.['final_formatted'] ?? "0 kr",
                    "reviews": gameData['data']?.['recommendations']?.['total'] ?? "No reviews",
                    "contentDescriptors": gameData['data']?.['content_descriptors']?.['notes'] ?? "",
                    "dejus": gameData['data']?.['ratings']?.['dejus']?.['descriptors'] ?? "",
                    "steamGermany": gameData['data']?.['steam_germany']?.['descriptors'] ?? "",
                    "supportedLanguages": gameData['data']?.['supported_languages'] ?? ""
                }))
                    .filter(({supportedLanguages ,name, type, comingSoon, price, reviews, contentDescriptors, dejus, steamGermany}) => {
                    const descriptors = `${contentDescriptors} ${dejus} ${steamGermany}`.toLowerCase();
                    const supportedLanguageString = `${supportedLanguages}`.toLowerCase()
                    const blockedTerms = ["sex", "nudity", "naked", "hentai", "nude"];
                    return (
                        supportedLanguageString.includes("english") &&
                        reviews !== "No reviews" &&
                        price !== "0 kr" &&
                        type === "game" &&
                        name !== "Unknown" &&
                        comingSoon === false  &&
                        !blockedTerms.some(word => descriptors.includes(word))
                    )
                })
            );
    } catch (error) {
        console.log(error);
    }
    return filteredGameArray;
}

async function GetFilteredAppIds(inputArray) {
    let AppIds = [];
    for(let i = 0; i < 10000; i++){
    let randomNumber = Math.floor(Math.random()*100000);
        AppIds.push(inputArray[randomNumber]);
    }
    return AppIds;
}

module.exports = {
    query: (text, params) => pool.query(text, params)
};
module.exports.getAppIds = getAppIds;
module.exports.getGamesByAppIds = getGamesByAppIds;
module.exports.GetFilteredAppIds = GetFilteredAppIds;


