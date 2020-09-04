<template>
  <vue-plotly :data="chartData" :layout="chartLayout"/>
</template>

<script>
import moment from 'moment'
import VuePlotly from '@statnett/vue-plotly'


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
      if (!this.encounterData.length){ return [] }
      let startDate = moment(this.encounterData[0].timestamp)
      return this.encounterData.reduce((bins, d) => {
        let date = moment(d.timestamp)
        let index = Math.floor(date.diff(startDate, 'hours') / this.bucketSizeHours)
        let bin = bins[index]
        bin.push(d)
        return bins
      }, Array(this.binTimes.length).fill(0).map(() => []))
    },

    binTimes(){
      if (!this.encounterData.length){ return [] }
      let x = []
      let start = moment(this.encounterData[0].timestamp)
      let end = moment(this.encounterData[this.encounterData.length - 1].timestamp).add(this.bucketSizeHours, 'hours')
      let count = end.diff(start, 'hours') / this.bucketSizeHours
      for (let i = 0; i < count; i++){
        let d = start.add(this.bucketSizeHours, 'hours').toISOString()
        x.push(d)
      }
      return x
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
