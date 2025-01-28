<template>
  <h1>AppIds</h1>
  <div v-for="id in appIds" >
    <h2>{{id['appids']}}</h2>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data () {
    return {
      appIds: []
    }
  },
  mounted() {
    fetch('http://localhost:3000/GetGames')
      .then(res => res.json())
      .then(data => this.appIds = data)
      .catch(err => console.log(err));
  }
}


const loading = ref(false)
import {ref, watch} from 'vue'
const post = ref()

async function fetchData(){
  loading.value = true
  try{
    axios.get('http://localhost:3000/GetGames')
      .then(response => response)
      .then(data => console.log(data))
  } catch(error){
    console.log(error)
  }finally {
    loading.value = false
  }
}

</script>

