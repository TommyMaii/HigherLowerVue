<script>
import HighScore from "@/components/HighScore.vue";
import MessageComponent from "@/components/MessageComponent.vue";
import CurrentScore from "@/components/CurrentScore.vue";
import { ref, watch, computed } from "vue";
import GameLogic from "@/components/GameLogic.js";

export default {
  components: { HighScore, MessageComponent, CurrentScore },
  props: { games: Array, gameMode: String },

  setup(props) {
    const gameMode = ref(props.gameMode);
    let text = ref("Guess the most expensive game");

    let gameState = ref(GameLogic(props.games, gameMode.value));

    const message = ref(gameState.value.message);

    watch(
      () => gameState.value.message,
      (newMessage) => {
        console.log("Message updated:", newMessage);
        message.value = newMessage;
      }
    );

    // **Ensure game logic updates correctly when switching modes**
    watch(() => props.gameMode, (newMode) => {
      console.log(`Game mode changed to: ${newMode}`);
      gameMode.value = newMode;
      text.value =
        newMode === "price"
          ? "Guess the most expensive game"
          : "Guess which game has more reviews";

      let tempScore = gameState.value.score;
      let tempHighscore = gameState.value.highscore;
      let tempFirstCounter = gameState.value.firstCounter;
      let tempSecondCounter = gameState.value.secondCounter;

      gameState.value = GameLogic(props.games, newMode);
      gameState.value.score = tempScore;
      gameState.value.highscore = tempHighscore;
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

      setTimeout(() => {
        if (!gameState.value.message.includes("lost")) {
          gameState.value.firstCounter += 2;
          gameState.value.secondCounter += 2;

          updateComparisonLogic();
        }

        message.value = gameState.value.message;

        gameState.value = { ...gameState.value };
      }, 2000);
    };

    return {
      gameMode,
      gameState,
      text,
      handleGameGuess,
      message,
    };
  },
};
</script>

<template>
  <div class="games-container">
    <div class="game-card" @click="handleGameGuess(true, false)">
      <h2>{{ games[0]?.gamedata[gameState.firstCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[gameState.firstCounter]?.image" alt="Game Image" />
      <h2 >The price is: {{ games[0]?.gamedata[gameState.firstCounter]?.price }}</h2>
      <h2 >It has {{ games[0]?.gamedata[gameState.firstCounter]?.reviews }} reviews</h2>
    </div>

    <div class="game-card" @click="handleGameGuess(false, true)">
      <h2>{{ games[0]?.gamedata[gameState.secondCounter]?.name }}</h2>
      <img :src="games[0]?.gamedata[gameState.secondCounter]?.image" alt="Game Image" />
      <h2>The price is: {{ games[0]?.gamedata[gameState.secondCounter]?.price }}</h2>
      <h2>It has {{ games[0]?.gamedata[gameState.secondCounter]?.reviews }} reviews</h2>
    </div>

    <HighScore :highscore="gameState.highscore" />
    <MessageComponent :message="message" />
    <CurrentScore :score="gameState.score" />
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
