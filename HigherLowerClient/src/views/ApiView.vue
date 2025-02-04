<template>
  <h1>Games</h1>
  <div v-if="games.length <= 0">
    <h2>Loading...</h2>
  </div>
  <div v-else v-for="n in 115" >
    <h2>{{games[0]['gamedata'][n-1]['Name']}}</h2>
    <h5>{{games[0]['gamedata'][n-1]['Date']}}</h5>
    <h5>{{games[0]['gamedata'][n-1]['AppId']}}</h5>
    <img :src="games[0]['gamedata'][n-1]['Image']"/>
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
















<!--<template>-->
<!--  <suspense>-->


<!--    <template v-slot:default>-->
<!--    <game-component></game-component>-->
<!--    </template>-->

<!--    <template v-slot:fallback>-->
<!--      <p>Loading...</p>-->
<!--    </template>-->

<!--  </suspense>-->
<!--</template>-->




<!--<script>-->
<!--  import GameComponent from "@/components/GameComponent.vue";-->

<!--  export default {-->
<!--    components: {-->
<!--      GameComponent,-->
<!--    }-->
<!--  }-->

<!--</script>-->
