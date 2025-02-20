<script>
import {ref} from "vue";

export default {
  setup(){
  },
  data () {

    return {
      highscore : ref(0),
      databaseHighscore : ref(0),
      firstCounter : ref(0),
      secondCounter : ref(1),
      showPrice: ref(false),
      isFirstGameMoreExpensive : ref(false),
      isDraw : ref(false),
      score : ref(0),
      clickedFirstGame: ref(false),
      clickedSecondGame: ref(false),
      Message: ref(""),
      isHighscoreLowerThanCurrentScore: ref(false)
    }
  },
  props:{
    games : Array,
  },
  methods: {

    calculateScore() {
      if (this.isDraw) {
        this.Message = "Both games cost the same, you get a free pass";
        return;
      }

      const isCorrect =
        (this.clickedFirstGame && this.isFirstGameMoreExpensive) ||
        (this.clickedSecondGame && !this.isFirstGameMoreExpensive);

      if (isCorrect) {
        this.score++;
        this.highscore = Math.max(this.highscore, this.score);
        this.Message = "Correct +1 score!";
      } else {
        this.Message = "You lost, better luck next time!";
        if (this.highscore > this.databaseHighscore) {
          pushHighscoreAfterLoss(this.highscore);
          this.Message = "You lost, but you got a new high score!";
        }
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    },

    calculatePriceAfterGameClick(isFirstClicked, isSecondClicked){
      this.isFirstGameMoreExpensive = false;
      this.clickedFirstGame = isFirstClicked;
      this.clickedSecondGame = isSecondClicked
      let data = this.games[0]['gamedata'];
      this.isFirstGameMoreExpensive = parseFloat(data[this.firstCounter]['price'].replace('.', "").split(",")[0]) > parseFloat(data[this.secondCounter]['price'].replace('.', "").split(" ")[0]);
      this.isDraw = parseFloat(data[this.firstCounter]['price'].replace('.', "").split(" ")[0]) === parseFloat(data[this.secondCounter]['price'].replace('.', "").split(" ")[0]);
      this.showPriceAfterGuess()
    },

    showPriceAfterGuess(){
      this.showPrice = true;
      this.calculateScore();
      setTimeout(()=>{
        this.incrementCounters();
        this.resetVariables();
      }, 2000);

    } ,
    incrementCounters(){
      this.firstCounter += 2;
      this.secondCounter += 2;
    },

    resetVariables(){
      Object.assign(this, {
        showPrice: false,
        isDraw: false,
        clickedFirstGame: false,
        clickedSecondGame: false,
        Message: "",
      });
    },
  },

  async beforeMount() {
    await fetch('http://localhost:3000/GetHighScore')
      .then(res => res.json())
      .then(data => this.highscore= data[0]['highscore'])
      .then(data => this.databaseHighscore = data);
  },
  mounted() {
  }
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

</script>

<template>
  <div @click="calculatePriceAfterGameClick(true,false)">
    <h2>{{games[0]['gamedata'][firstCounter]['name']}}</h2>
    <img :src="games[0]['gamedata'][firstCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
    <h2>The price is: {{games[0]['gamedata'][firstCounter]['price']}}</h2>
  </div>
  <div @click="calculatePriceAfterGameClick(false,true)">
    <h2 style="overflow: hidden">{{games[0]['gamedata'][secondCounter]['name']}}</h2>
    <img :src="games[0]['gamedata'][secondCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
    <h2>{{ showPrice ? "The price is: " + games[0]['gamedata'][secondCounter]['price'] : ""}}</h2>
  </div>
</template>

<style scoped>

</style>
