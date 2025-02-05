<template>
  <div v-if="games.length <= 0">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <h1 style="align-content: center; justify-content: center; margin-bottom:20%; position:fixed; top: 20%">Gjett hvilket spill som koster mest!</h1>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px;">
    <div @click="firstCounter+=2; secondCounter+=2" style="height:30%">
      <h2>{{games[0]['gamedata'][firstCounter]['name']}}</h2>
      <h5>{{games[0]['gamedata'][firstCounter]['date']}}</h5>
      <h5>{{games[0]['gamedata'][firstCounter]['price']}}</h5>
      <img :src="games[0]['gamedata'][firstCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
    </div>

    <div @click="firstCounter+=2; secondCounter+=2" style="height:30%">
      <h2>{{games[0]['gamedata'][secondCounter]['name']}}</h2>
      <h5>{{games[0]['gamedata'][secondCounter]['date']}}</h5>
      <img :src="games[0]['gamedata'][secondCounter]['image']" alt="Source is corrupt, pretend theres a fine picture here =)"/>
    </div>
    </div>
  </div>

</template>




<script>
import {ref} from 'vue'


export default {
setup(){
  let firstCounter = ref(0)
  let secondCounter = ref(1)
    return {firstCounter, secondCounter}
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
  },
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
