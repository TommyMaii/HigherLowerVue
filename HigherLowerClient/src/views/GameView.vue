<script>
import Games from '@/components/Games.vue';
import { ref, onBeforeMount } from "vue";
import GameModeSelector from "@/components/GameModeSelector.vue";

export default {
  components: {
    GameModeSelector,
    Games,
  },
  setup() {
    const games = ref([]);
    const gameMode = ref("price");

    onBeforeMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/getGames')
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        games.value = await response.json();
        randomizeArray(games.value);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    });

    return {games, gameMode};
  }
};

/**
 * Function takes an array
 * Randomizes and returns it.
 * @param inputArray Type Array
 * @returns {array}
 */
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
    <nav>
      <GameModeSelector v-model:game-mode="gameMode" />
    </nav>
    <div
      style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 200px; margin-top:10%">
      <Games :games="games" :game-mode="gameMode"/>
    </div>
  </div>
</template>

<style scoped>
nav {
  position:fixed;
  left:45%;
  top:1%;
  text-align: center;
  margin-top: 2rem;
  margin-left: -6rem;
  font-size: 2rem;
  padding: 1rem 0;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  background-color: transparent;
  color: var(--color-text);

}

nav a:first-of-type {
  border: 0;
}

nav {


}
</style>
