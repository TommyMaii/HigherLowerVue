<template>
  <div v-if="games.length <= 0">
    <h2>Loading...</h2>
  </div>
  <div v-else>
      <h1 style="align-content: center; justify-content: center; margin-bottom:20%; position:fixed; top: 20%">Guess what game is more expensive!</h1>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px;">
      <div @click="calculatePriceAfterGameClick(true,false)">
        <h2 style="overflow: hidden">{{games[0]['gamedata'][firstCounter]['name']}}</h2>
<!--        <h5>{{games[0]['gamedata'][firstCounter]['date']}}</h5>-->
        <img :src="games[0]['gamedata'][firstCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
        <h2>The price is: {{games[0]['gamedata'][firstCounter]['price']}}</h2>
      </div>
      <div @click="calculatePriceAfterGameClick(false,true)">
        <h2 style="overflow: hidden">{{games[0]['gamedata'][secondCounter]['name']}}</h2>
<!--        <h5>{{games[0]['gamedata'][secondCounter]['date']}}</h5>-->
        <img :src="games[0]['gamedata'][secondCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
        <h2>{{ showPrice ? "The price is: " + games[0]['gamedata'][secondCounter]['price'] : ""}}</h2>
      </div>

        <h1>The most expensive game was: {{showPrice ? games[0]['gamedata'][isFirstGameMoreExpensive ? firstCounter : secondCounter]['price'] : "" || isDraw ? "Both are the same price you get a free pass" : ""}}</h1>
        <h1>Score: {{score}}</h1>
    </div>
  </div>

</template>

<script>
import {ref} from 'vue'


export default {
setup(){
},
  data () {
    return {
      games: [],
      firstCounter : ref(0),
      secondCounter : ref(1),
      showPrice: ref(false),
      isFirstGameMoreExpensive : ref(false),
      isDraw : ref(false),
      score : ref(0),
      clickedFirstGame: ref(false),
      clickedSecondGame: ref(false),
    }
  },
  methods: {
  calculateScore(){
    if(this.clickedFirstGame && this.isFirstGameMoreExpensive){
      this.score++;
    }
    if(this.clickedSecondGame && !this.isFirstGameMoreExpensive){
      this.score++;
    }
  },
  calculatePriceAfterGameClick(isFirstClicked, isSecondClicked){
    this.isFirstGameMoreExpensive = false;
    this.clickedFirstGame = isFirstClicked;
    this.clickedSecondGame = isSecondClicked
    let data = this.games[0]['gamedata'];
    this.isFirstGameMoreExpensive = parseFloat(data[this.firstCounter]['price'].split(",")[0]) > parseFloat(data[this.secondCounter]['price'].split(" ")[0]);
    this.isDraw = parseFloat(data[this.firstCounter]['price'].split(",")[0]) === parseFloat(data[this.secondCounter]['price'].split(" ")[0]);

    this.showPriceAfterGuess()
  },
    showPriceAfterGuess(){
      this.showPrice = true;
      this.calculateScore();
      setTimeout(()=>{
        this.incrementCounters();
        this.showPrice = false;
        this.isDraw = false;
        this.clickedFirstGame = false;
        this.clickedSecondGame = false;

      }, 3000);

    } ,
    incrementCounters(){
      this.firstCounter += 2;
      this.secondCounter += 2;
    }
  },

  async beforeMount() {
    await fetch('http://localhost:3000/GetGamesInfo')
      .then(res => res.json())
      .then(data => this.games = data)
      .then(data => console.log(data))
      .catch(err => console.log(err))
    randomizeArray(this.games[0]['gamedata']);
  },
  mounted() {
  }
}

function  randomizeArray(inputArray){
  for(let i = 0; i < inputArray.length; i++){
    let randomIndex = Math.floor(Math.random() * inputArray.length);
    [inputArray[i], inputArray[randomIndex]] = [inputArray[randomIndex], inputArray[i]]
  }
  return inputArray;
}


</script>
