<template>
  <EncounterChart v-bind="$props"/>
</template>

<script>
import EncounterChart from '@/components/EncounterChart.vue'

export default {
  name: 'ChartPage',
  props: {
    dateStart: Date,
    dateEnd: Date,
    maxDistance: Number
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
