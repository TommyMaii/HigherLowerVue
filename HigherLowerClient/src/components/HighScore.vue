
<template>
  <h1 style="align-content: center; justify-content: center;position:fixed; top: 20%">{{text}}! The current highscore is: {{highscore}}</h1>
</template>
<script>
export default {
  props: {
    text: String,
    highscore: Number
  }
}
</script>
