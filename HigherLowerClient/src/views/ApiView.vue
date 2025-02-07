<template>
  <div v-if="games.length <= 0">
    <h2>Loading...</h2>
  </div>
  <div v-else>
      <h1 style="align-content: center; justify-content: center; margin-bottom:20%; position:fixed; top: 20%">Guess what game is more expensive!</h1>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px;">
      <div @click="showPriceAfterGuess" style="height:30%">
        <h2>{{games[0]['gamedata'][firstCounter]['name']}}</h2>
<!--        <h5>{{games[0]['gamedata'][firstCounter]['date']}}</h5>-->
        <img :src="games[0]['gamedata'][firstCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
        <h2>The price is: {{games[0]['gamedata'][firstCounter]['price']}}</h2>
      </div>
      <div @click="showPriceAfterGuess" style="height:30%">
        <h2>{{games[0]['gamedata'][secondCounter]['name']}}</h2>
<!--        <h5>{{games[0]['gamedata'][secondCounter]['date']}}</h5>-->
        <img :src="games[0]['gamedata'][secondCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
        <h2>{{ showPrice ? "The price is: " + games[0]['gamedata'][secondCounter]['price'] : ""}}</h2>
      </div>

        <h1>The most expensive game was: {{showPrice ?  games[0]['gamedata'][isFirstGameMoreExpensive ? firstCounter : secondCounter]['price'] : ""}}</h1>
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
    }
  },
  methods: {
  calculatePrice(){
    this.isFirstGameMoreExpensive = false;
    let data =  this.games[0]['gamedata'];
    this.isFirstGameMoreExpensive = parseFloat(data[this.firstCounter]['price'].split(",")[0]) > parseFloat(data[this.secondCounter]['price'].split(" ")[0]);
  },
    showPriceAfterGuess(){
      this.showPrice = true;
      this.calculatePrice();
      setTimeout(()=>{
        this.incrementCounters();
        this.showPrice = false;
        }, 1500);

    } ,
    incrementCounters(){
      this.firstCounter += 2;
      this.secondCounter += 2;
    }
  },
  // randomizeArray(inputArray){
  //   for(let i = 0; i < inputArray.length; i++){
  //     let randomIndex = Math.floor(Math.random() * inputArray.length);
  //     [inputArray[i], inputArray[randomIndex]] = [inputArray[randomIndex], inputArray[i]]
  //   }
  //   return inputArray;
  // },
  async beforeMount() {
    await fetch('http://localhost:3000/GetGamesInfo')
      .then(res => res.json())
      .then(data => this.games = data)
      .catch(err => console.log(err))
  },
  mounted() {
  }
}

</script>
