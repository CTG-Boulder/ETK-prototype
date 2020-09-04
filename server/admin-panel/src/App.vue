<template>
  <div id="app">
    <EncounterChart/>
    <EncounterList/>
  </div>
</template>

<script>
import EncounterList from './components/EncounterList.vue'
import EncounterChart from './components/EncounterChart.vue'

export default {
  name: 'app',
  components: {
    EncounterList,
    EncounterChart
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
