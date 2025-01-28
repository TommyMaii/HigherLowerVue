// const axios = require("axios");
//
// async function getAppIds(){
//     let AppIds = []
//     let count = 100;
//     let data;
//     await axios.get(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=92B954066451ACE299B8F956328A5085&format=json`).then(function (res) {
//         data = res.data['applist']['apps'];
//     })
//     for(let i = 0; i < count; i++){
//         if(data[i]['name'] == "" || data[i]['name'].includes("Soundtrack") || data[i]['name'].includes("test") || data[i]['name'].includes("Demo") || data[i]['name'].includes("Kickstarter")){
//             count++;
//             continue;
//         }
//         AppIds.push(data[i]['appid']);
//     }
//     return AppIds;
// }
