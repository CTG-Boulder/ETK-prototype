<template>
  <section class="content">
    <h2 class="heading">Statistics</h2>
    <p>Average encounters per hour: {{encountersPerHour}}</p>
    <p>Average encounters per day: {{encountersPerDay}}</p>
  </section>
</template>

<script>
import _meanBy from 'lodash/meanBy'
import { getDataBins } from '@/util/data-helpers'

export default {
  name: 'StatisticsPage',
  props: {
    encounterData: Array
  },
  components: {
  },
  data: () => ({
  }),
  watch: {
  },
  computed: {
    encountersPerHour(){
      let perHour = getDataBins(this.encounterData, 1)
      return _meanBy(perHour, p => p.length)
    },

    encountersPerDay(){
      let perDay = getDataBins(this.encounterData, 24)
      return _meanBy(perDay, p => p.length)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
