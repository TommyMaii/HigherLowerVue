import { ref, watch, onBeforeMount } from 'vue';

export default function GameLogic(gamesProp) {
  const games = ref(gamesProp); // Make games reactive

  const highscore = ref(0);
  const databaseHighscore = ref(0);
  const firstCounter = ref(0);
  const secondCounter = ref(1);
  const showPrice = ref(false);
  const isFirstGameMoreExpensive = ref(false);
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
    if (clickedFirstGame.value && isFirstGameMoreExpensive.value) {
      score.value++;
    } else if (isDraw.value) {
      message.value = "Both games cost the same, you get a free pass!";
      return;
    } else if (clickedSecondGame.value && !isFirstGameMoreExpensive.value) {
      score.value++;
    } else {
      message.value = "You lost, better luck next time!";

      if (score.value > databaseHighscore.value) {
        highscore.value = score.value;
        message.value = "You lost, but you got a new high score!";
        pushHighscoreAfterLoss(highscore.value);
      }

      setTimeout(() => location.reload(), 3000);
      return;
    }

    if (score.value > highscore.value) {
      highscore.value = score.value;
    }

    message.value = "Correct! +1 Score!";
  };

  const calculatePriceAfterGameClick = (isFirstClicked, isSecondClicked) => {
    if (!games.value || games.value.length === 0 || !games.value[0]?.gamedata) {
      console.error("Error: Games data is not available yet!");
      return;
    }

    isFirstGameMoreExpensive.value = false;
    clickedFirstGame.value = isFirstClicked;
    clickedSecondGame.value = isSecondClicked;

    const data = games.value[0].gamedata;

    if (data[firstCounter.value] && data[secondCounter.value]) {
      isFirstGameMoreExpensive.value =
        parseFloat(data[firstCounter.value].price.replace('.', "").split(",")[0]) >
        parseFloat(data[secondCounter.value].price.replace('.', "").split(" ")[0]);

      isDraw.value =
        parseFloat(data[firstCounter.value].price.replace('.', "").split(" ")[0]) ===
        parseFloat(data[secondCounter.value].price.replace('.', "").split(" ")[0]);

      showPriceAfterGuess();
    } else {
      console.warn("Invalid index access: firstCounter or secondCounter is out of range.");
    }
  };

  const showPriceAfterGuess = () => {
    showPrice.value = true;
    calculateScore();
    setTimeout(() => {
      incrementCounters();
      showPrice.value = false;
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
      const result = await response.json();
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
    showPrice,
    message,
    calculatePriceAfterGameClick,
    calculateScore,
  };
}
