<template>
  <div id="app">
    <EncounterList/>
  </div>
</template>

<script>
import EncounterList from './components/EncounterList.vue'

export default {
  name: 'app',
  components: {
    EncounterList
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
