<template>
  <h1>Games</h1>
  <div v-for="n in 1" >
    <h2 v-if="games === undefined">Loading...</h2>
    <h2 v-else>{{games[0]['gamedata']}}</h2>
    <!--    <img :src="games[0]['gamedata'][n-1]['Image']"/>-->
  </div>
</template>




<script>
import axios from "axios";

const loading = ref(false)
import {ref, watch} from 'vue'

export default {
  data () {
    return {
      games: []
    }
  },
  async beforeMount() {
    await fetch('http://localhost:3000/GetGamesInfo')
      .then(res => res.json())
      .then(data => this.games = data)
      .then(data => console.log(this.games))
      .catch(err => console.log(err))
  }
}
// const post = ref()

// async function fetchData(){
//   loading.value = true
//   try{
//     axios.get('http://localhost:3000/GetGamesInfo')
//       .then(response => response)
//       .then(data => console.log(data))
//   } catch(error){
//     console.log(error)
//   }finally {
//     loading.value = false
//   }
// }


</script>
