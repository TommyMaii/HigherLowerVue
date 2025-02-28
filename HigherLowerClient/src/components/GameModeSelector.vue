<template>
  <div class="header">
    <h1>Select Game Mode</h1>
    <div class="button-group">
      <button @click="setGameMode('price')" :class="{ active: gameMode === 'price' }">Guess by Price</button>
      <button @click="setGameMode('reviews')" :class="{ active: gameMode === 'reviews' }">Guess by Reviews</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gameMode: String,
  },
  methods: {
    setGameMode(mode) {
      this.$emit("update:gameMode", mode);
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
}

button {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  background-color: #222;
  color: white;
  outline: none;
}

button.active {
  background-color: #00ff99;
  color: black;
}

button:hover {
  background-color: #00cc77;
  transform: scale(1.05);
}
</style>
