<template>
  <vue-plotly :data="chartData" :layout="chartLayout"/>
</template>

<script>
import VuePlotly from '@/util/vue-plotly'
import { getDataBins, getBinTimes } from '@/util/data-helpers'

export default {
  name: "EncounterChart",
  props: {
    encounterData: Array,
    bucketSizeHours: {
      type: Number,
      default: 1
    }
  },
  components: {
    VuePlotly
  },
  data: () => ({
  }),
  watch: {
  },
  computed: {
    dataBins(){
      return getDataBins(this.encounterData, this.bucketSizeHours)
    },

    binTimes(){
      return getBinTimes(this.encounterData, this.bucketSizeHours)
    },

    chartData(){
      return [{
        x: this.binTimes,
        y: this.dataBins.map(b => b.length),
        type: 'bar'
      }]
    },

    chartLayout(){
      return {
        margin: {
          r: 70
        }
        , showlegend: false
        , xaxis: {
          title: 'Date'
          , showgrid: false
          , zeroline: false
          , ticklen: 10
          , ticks: 'inside'
          , rangemode: 'tozero'
        }
        , yaxis: {
          title: 'Number of Encounters'
          , showgrid: false
          , ticklen: 10
          , ticks: 'inside'
          , zeroline: false
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
