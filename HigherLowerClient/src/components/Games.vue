<script>
import HighScore from "@/components/HighScore.vue";
import MessageComponent from "@/components/MessageComponent.vue";
import CurrentScore from "@/components/CurrentScore.vue";
import { ref, watch } from "vue";
import GameLogic from "@/components/GameLogic.js";

export default {
  components: { HighScore, MessageComponent, CurrentScore },
  props: { games: Array, gameMode: String },

  setup(props) {
    const gameState = ref(GameLogic(props.games, props.gameMode));
    const message = ref("");
    let ModeText = ref("Guess which game is more expensive")
    let isUnclickable = ref(false);
    watch(
      () => gameState.value.message,
      (newMessage) => {
        message.value = newMessage;
      },
      {deep: true, immediate: true}
    );
    watch(() => props.gameMode, (newMode) => {
      ModeText.value = newMode === "reviews"
        ? "Guess which game has more reviews"
        : "Guess which game is more expensive";

      const tempScore = gameState.value.score;
      const tempHighscore = gameState.value.highscore;
      const tempFirstCounter = gameState.value.firstCounter;
      const tempSecondCounter = gameState.value.secondCounter;
      const tempDatabaseHighscore = gameState.value.databaseHighscore

      gameState.value = GameLogic(props.games, newMode);

      gameState.value.highscore = Math.max(gameState.value.highscore, tempHighscore);
      gameState.value.databaseHighscore = tempDatabaseHighscore;
      gameState.value.score = tempScore;
      gameState.value.firstCounter = tempFirstCounter;
      gameState.value.secondCounter = tempSecondCounter;

      updateComparisonLogic();
    });

    const updateComparisonLogic = () => {
      const firstGame = props.games[0]?.gamedata[gameState.value.firstCounter];
      const secondGame = props.games[0]?.gamedata[gameState.value.secondCounter];

      if (firstGame && secondGame) {
        gameState.value.calculateComparison(firstGame, secondGame);
      }
    };

    const handleGameGuess = (isFirstClicked, isSecondClicked) => {
      gameState.value.calculateGameAfterClick(isFirstClicked, isSecondClicked);
      isUnclickable.value = true;

      setTimeout(() => {
        if (!gameState.value.message.includes("lost")) {
          updateComparisonLogic();
        }
        isUnclickable.value = false;
        message.value = "";
      }, 2000);
    };

    return {gameState, handleGameGuess, message, ModeText, isUnclickable};
  },
};
</script>

<template>

  <div class="games-container" >
    <div class="game-card" @click="handleGameGuess(true, false)" :style="{ pointerEvents: isUnclickable ? 'none' : 'auto' }">
      <h2>{{ games[0]?.gamedata[gameState.firstCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[gameState.firstCounter]?.image" alt="Game Image"/>
      <h2 v-if="gameMode === 'price'">The price is: {{ games[0]?.gamedata[gameState.firstCounter]?.price }}</h2>
      <h2 v-if="gameMode === 'reviews'">It has {{ games[0]?.gamedata[gameState.firstCounter]?.reviews }} reviews</h2>
    </div>
    <div class="game-card" @click="handleGameGuess(false, true)" :style="{ pointerEvents: isUnclickable ? 'none' : 'auto' }">
      <h2>{{ games[0]?.gamedata[gameState.secondCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[gameState.secondCounter]?.image" alt="Game Image"/>
      <h2 v-if="message !== '' && gameMode === 'price'">The price is: {{ games[0]?.gamedata[gameState.secondCounter]?.price }}</h2>
      <h2 v-if="message !== '' && gameMode === 'reviews'">It has {{ games[0]?.gamedata[gameState.secondCounter]?.reviews }} reviews</h2>
    </div>

    <HighScore :text="ModeText" :highscore="gameState.highscore"/>
    <MessageComponent :message="message"/>
    <CurrentScore :score="gameState.score"/>
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
  box-shadow: 0 4px 10px rgba(0, 255, 153, 0.5);
}

.game-card h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
