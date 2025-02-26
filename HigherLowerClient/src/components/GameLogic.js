import { ref, watch, onBeforeMount } from 'vue';

export default function GameLogic(gamesProp, gameMode = 'price') {
  const games = ref(gamesProp);
  const highscore = ref(0);
  const databaseHighscore = ref(0);
  const firstCounter = ref(0);
  const secondCounter = ref(1);
  const showResult = ref(false);
  const isFirstGameBetter = ref(false);
  const isDraw = ref(false);
  const score = ref(0);
  const clickedFirstGame = ref(false);
  const clickedSecondGame = ref(false);
  const message = ref("");

  watch(gamesProp, (newGames) => {
    if (newGames && newGames.length > 0) {
      games.value = newGames;
    }
  }, { immediate: true });

  const calculateScore = () => {
    if (clickedFirstGame.value && isFirstGameBetter.value) {
      score.value++;
    } else if (isDraw.value) {
      message.value = "It's a tie! You get a free pass!";
      console.log(message.value)

      return;
    } else if (clickedSecondGame.value && !isFirstGameBetter.value) {
      score.value++;
    } else {
      message.value = "You lost! Better luck next time!";
      console.log(message.value)

      if (score.value > databaseHighscore.value) {
        highscore.value = score.value;
        message.value = "You lost, but you got a new high score!";
        pushHighscoreAfterLoss(highscore.value);
        console.log(message.value)
      }

      setTimeout(() => location.reload(), 2000);
      return;
    }

    if (score.value > highscore.value) {
      highscore.value = score.value;
    }

    message.value = "Correct! +1 Score!";
    console.log(message.value)

  };

  const calculateComparison = (game1, game2) => {
    if (!game1 || !game2) return;

    let value1, value2;

    if (gameMode === 'price') {
      value1 = parseFloat(game1.price.replace('.', "").split(",")[0]);
      value2 = parseFloat(game2.price.replace('.', "").split(" ")[0]);
    } else if (gameMode === 'reviews') {
      value1 = parseInt(game1.reviews, 10);
      value2 = parseInt(game2.reviews, 10);
    }

    isFirstGameBetter.value = value1 > value2;
    isDraw.value = value1 === value2;
  };

  const calculateGameAfterClick = (isFirstClicked, isSecondClicked) => {
    if (!games.value || games.value.length === 0 || !games.value[0]?.gamedata) {
      console.error("Error: Games data is not available yet!");
      return;
    }

    clickedFirstGame.value = isFirstClicked;
    clickedSecondGame.value = isSecondClicked;

    const data = games.value[0].gamedata;

    if (data[firstCounter.value] && data[secondCounter.value]) {
      calculateComparison(data[firstCounter.value], data[secondCounter.value]);
      showResultAfterGuess();
    } else {
      console.warn("Invalid index access: firstCounter or secondCounter is out of range.");
    }
  };

  const showResultAfterGuess = () => {
    showResult.value = true;
    calculateScore();
    setTimeout(() => {
      incrementCounters();
      showResult.value = false;
      isDraw.value = false;
      clickedFirstGame.value = false;
      clickedSecondGame.value = false;
      message.value = "";
    }, 2000);
  };

  const incrementCounters = () => {
    firstCounter.value += 2;
    secondCounter.value += 2;
  };

  const pushHighscoreAfterLoss = async (newHighscore) => {
    try {
      const response = await fetch('http://localhost:3000/UpdateHighscore', {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ highscore: newHighscore })
      });

      if (!response.ok) {
        console.error("Failed to update high score on server.");
      } else {
        console.log("High score updated successfully!");
      }
    } catch (error) {
      console.error("Error updating high score:", error);
    }
  };

  onBeforeMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/GetHighScore');
      const data = await response.json();

      if (data.length > 0 && data[0]?.highscore !== undefined) {
        highscore.value = data[0].highscore;
        databaseHighscore.value = data[0].highscore;
      } else {
        console.warn("No high score data found, initializing to 0.");
        highscore.value = 0;
        databaseHighscore.value = 0;
      }
    } catch (error) {
      console.error("Error fetching high score:", error);
    }
  });

  return {
    highscore,
    score,
    firstCounter,
    secondCounter,
    showResult,
    message,
    calculateComparison,
    calculateGameAfterClick,
    calculateScore,
  };
}
