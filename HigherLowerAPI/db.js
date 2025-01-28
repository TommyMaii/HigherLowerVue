const { Pool } = require('pg');
const axios = require("axios");
let allGameURL = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${process.env.STEAM_API_KEY}&format=json`;

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
    await axios.get(allGameURL).then(function (res) {
        data = res.data['applist']['apps'];
    })
    for(let i = 0; i < 2; i++){
        if(data[i]['name'] == "" || data[i]['name'].includes("Soundtrack") || data[i]['name'].includes("test") || data[i]['name'].includes("Demo") || data[i]['name'].includes("Kickstarter")){
            count++;
            continue;
        }
        AppIds.push(data[i]['appid']);
    }
    return AppIds;
}

async function getGamesByAppIds(){
    let AppIds = await getAppIds();
    let data = [];
    for(let i = 0; i < 2; i++){
        await axios.get(`https://store.steampowered.com/api/appdetails?appids=${AppIds[i]}`).then(function (res) {
            data.push(res);
        })
    }
    console.log(data);
}

module.exports = {
    query: (text, params) => pool.query(text, params)
};
module.exports.getAppIds = getAppIds;
module.exports.getGamesByAppIds = getGamesByAppIds;


