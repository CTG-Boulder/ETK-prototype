<template>
  <EncounterChart :encounterData="encounterData"/>
</template>

<script>
import EncounterChart from '@/components/EncounterChart.vue'

export default {
  name: 'ChartPage',
  props: {
    encounterData: Array
  },
  components: {
    EncounterChart
  },
  data: () => ({
  }),
  watch: {
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
