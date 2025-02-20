<script>
import Games from '@/components/Games.vue'
import HighScore from "@/components/HighScore.vue";
import CurrentScore from "@/components/CurrentScore.vue";
import MessageComponent from "@/components/MessageComponent.vue";

export default {
  components:{
    HighScore,
    Games,
    CurrentScore,
    MessageComponent,
  },
  data () {
    return {
      games: [],
    }
  },
  async beforeMount() {
    await fetch('http://localhost:3000/GetGamesInfo')
      .then(res => res.json())
      .then(data => this.games = data)
      .catch(err => console.log(err))
    randomizeArray(this.games[0]['gamedata']);
  },
}

async function pushHighscoreAfterLoss(highscore){
  await fetch('http://localhost:3000/UpdateHighscore', {
    headers: {
      "Content-Type": "application/json"
    },
    method: "PUT",
    body: JSON.stringify({highscore: highscore})
  })
}

function  randomizeArray(inputArray){
  for(let i = 0; i < inputArray.length; i++){
    let randomIndex = Math.floor(Math.random() * inputArray.length);
    [inputArray[i], inputArray[randomIndex]] = [inputArray[randomIndex], inputArray[i]]
  }
  return inputArray;
}


</script>


<template>

  <div v-if="games.length <= 0">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px; margin-top:10%">
      <Games :games="games"/>
      <HighScore/>
      <MessageComponent/>
      <CurrentScore/>
    </div>
  </div>

</template>

