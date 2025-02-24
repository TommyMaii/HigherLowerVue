<script>
import { defineProps } from 'vue';
import HighScore from "@/components/HighScore.vue";
import MessageComponent from "@/components/MessageComponent.vue";
import CurrentScore from "@/components/CurrentScore.vue";
import GameLogic from '@/components/GameLogic.js';

export default {
  components: { HighScore, MessageComponent, CurrentScore },
  props: { games: Array },
  setup(props) {
    const {
      highscore,
      score,
      firstCounter,
      secondCounter,
      showPrice,
      message,
      calculatePriceAfterGameClick
    } = GameLogic(props.games);

    return {
      highscore,
      score,
      firstCounter,
      secondCounter,
      showPrice,
      message,
      calculatePriceAfterGameClick
    };
  }
};
</script>

<template>
  <div class="games-container">
    <div class="game-card" @click="calculatePriceAfterGameClick(true, false)">
      <h2>{{ games[0]?.gamedata[firstCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[firstCounter]?.image" alt="Game Image"/>
      <h2>The price is: {{ games[0]?.gamedata[firstCounter]?.price }}</h2>
    </div>
    <div class="game-card" @click="calculatePriceAfterGameClick(false, true)">
      <h2>{{ games[0]?.gamedata[secondCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[secondCounter]?.image" alt="Game Image"/>
      <h2 v-if="showPrice">The price is: {{ games[0]?.gamedata[secondCounter]?.price }}</h2>
    </div>
    <HighScore :highscore="highscore"/>
    <MessageComponent :message="message"/>
    <CurrentScore :score="score"/>
  </div>
</template>

<style scoped>
.games-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 200px;
}

.game-card {
  width: 500px;
  height: 330px;
  background: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;
}

.game-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 255, 153, 0.5);
}

.game-card h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
