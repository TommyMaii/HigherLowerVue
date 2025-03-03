import { ref, onBeforeMount } from 'vue';
let databaseHighscore = ref(0);

export default function GameLogic(gamesProp, gameMode = 'price') {
  const games = ref(gamesProp);
  const highscore = ref(0);
  const score = ref(0);
  const firstCounter = ref(0);
  const secondCounter = ref(1);
  const isFirstGameBetter = ref(false);
  const isDraw = ref(false);
  const clickedFirstGame = ref(false);
  const clickedSecondGame = ref(false);
  const message = ref("");

  /**
   * Gets the highscore before component mounts.
   * Checks if data is not empty and if the highscore is not undefined.
   * If data is valid the function assigns the highscore from database to the highscore
   * and to the databasehighscore.
   */
  onBeforeMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/GetHighScore');
      const data = await response.json();

      if (data.length > 0 && data[0]?.highscore !== undefined) {
        highscore.value = data[0].highscore;

        if (databaseHighscore.value === 0) {
          databaseHighscore.value = data[0].highscore;
        }
      }
    } catch (error) {
      console.error("Error fetching high score:", error);
    }
  });

  /**
   * This function calculates the score it has 3 outcomes you either
   * Guessed right and get a point, draw or you lost.
   * First it checks if you clicked on the first game and checks if IsFirstGameBetter (isFirstGameBetter means it's either more expensive or has more reviews) is true.
   * If this checks out then it means that you guessed correctly so you get a point.
   * The other outcome for a correct score is if you clicked on the second game and isFirstGameBetter is false. Then you also get a point.
   * When you get a new highscore we assign score to highscore so the higscore keeps updating.
   * It also checks if score is higher than the databasehighscore on loss, if that's the case it will push the new score to the database and write the message.
   * "You lost, but you got a new high score" rather than the standard message.
   * We have a timeout here so user can proccess what's happening.
   * It also increments the highscore if you guesssed correctly and score is higher
   * At the end it displays the Correct message.
   */
  const calculateScore = () => {
    if (clickedFirstGame.value && isFirstGameBetter.value) {
      score.value++;
    } else if (isDraw.value) {
      message.value = "It's a draw! You get a free pass!";
      return;
    } else if (clickedSecondGame.value && !isFirstGameBetter.value) {
      score.value++;
    } else {
      message.value = "You lost! Better luck next time!";

      if (score.value > highscore.value) {
        highscore.value = score.value;
      }

      if (score.value > databaseHighscore.value) {
        databaseHighscore.value = score.value;
        pushHighscoreAfterLoss(databaseHighscore.value);
        message.value = "You lost, but you got a new high score!";
      }

      setTimeout(() => location.reload(), 2000);
      return;
    }

    if (score.value > highscore.value) {
      highscore.value = score.value;
    }

    message.value = `Correct! Your score is now ${score.value}`;
  };

  /**
   * This function takes the price or review data from game 1 and game 2 parameters.
   * And then depending on the game mode either assigns the value1 and value2 variables.
   * With price data or reviews data.
   * It then also assigns the isFirstGameBetter and isDraw value depending on the data.
   * @param game1
   * @param game2
   */
  const calculateComparison = (game1, game2) => {
    if (!game1 || !game2) return;

    let value1, value2;

    if (gameMode === 'price') {
      value1 = parseFloat(game1.price.replace('.', "").split(",")[0]);
      value2 = parseFloat(game2.price.replace('.', "").split(" ")[0]);
    } else {
      value1 = parseInt(game1.reviews, 10);
      value2 = parseInt(game2.reviews, 10);
    }

    isFirstGameBetter.value = value1 > value2;
    isDraw.value = value1 === value2;
  };

  /**
   * This function has a fail check to check if the program has valid data or not.
   * It then assigns true or false to the clickedFirst/Secondgame vairables depending on which game you clicked.
   * If first and second game has valid data it will then run the calculateComparison function above with that data
   * and then after it will run the showResultAfterGuess.
   * @param isFirstClicked
   * @param isSecondClicked
   */
  const calculateGameAfterClick = (isFirstClicked, isSecondClicked) => {
    if (!games.value?.[0]?.gamedata) {
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

  /**
   * This function calls calculateScore
   * Then after 2 seconds will increment the counters in the games array to show 2 new games
   * and reset the isDraw and the variables that tracks which game you clicked back to false.
   */
  const showResultAfterGuess = () => {
    calculateScore();
    setTimeout(() => {
      firstCounter.value += 2;
      secondCounter.value += 2;
      isDraw.value = false;
      clickedFirstGame.value = false;
      clickedSecondGame.value = false;
    }, 2000);
  };

  /**
   * Pushes parameter value to the database
   * @param newHighscore
   */
  const pushHighscoreAfterLoss = async (newHighscore) => {
    try {
      const response = await fetch('http://localhost:3000/UpdateHighscore', {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ highscore: newHighscore }),
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



  return {
    highscore,
    databaseHighscore,
    score,
    firstCounter,
    secondCounter,
    message,
    calculateComparison,
    calculateGameAfterClick,
    calculateScore,
  };
}
