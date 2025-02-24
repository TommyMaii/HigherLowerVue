<script>
import Games from '@/components/Games.vue';
import { ref, onBeforeMount } from "vue";

export default {
  components: {
    Games,
  },
  setup() {
    const games = ref([]);

    onBeforeMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/GetGamesInfo');
        const data = await response.json();
        games.value = data;
        randomizeArray(games.value[0]['gamedata']);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    });

    return {games};
  }
};

function randomizeArray(inputArray) {
  for (let i = 0; i < inputArray.length; i++) {
    let randomIndex = Math.floor(Math.random() * inputArray.length);
    [inputArray[i], inputArray[randomIndex]] = [inputArray[randomIndex], inputArray[i]];
  }
  return inputArray;
}
</script>

<template>
  <div v-if="games.length === 0">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <div
      style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px; margin-top:10%">
      <Games :games="games"/>
    </div>
  </div>
</template>
