
<template>
  <h1 style="align-content: center; justify-content: center;position:fixed; top: 20%">Guess what game is more expensive! The current highscore is: {{highscore}}</h1>
</template>
<script>
export default {
  props: {
    highscore: Number
  }
}
</script>
