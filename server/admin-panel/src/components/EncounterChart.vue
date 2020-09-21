<template>
  <vue-plotly :data="chartData" :layout="chartLayout"/>
</template>

<script>
import VuePlotly from '@/util/vue-plotly'

export default {
  name: "EncounterChart",
  props: {
    dateStart: Date,
    dateEnd: Date,
    maxDistance: Number
  },
  components: {
    VuePlotly
  },
  data: () => ({
    counts: []
  }),
  mounted(){
    this.fetch()
  },

  watch: {
    dateStart: 'fetch',
    dateEnd: 'fetch',
    maxDistance: 'fetch'
  },
  computed: {
    dataBins(){
      return this.counts.map(d => d.count)
    },

    binTimes(){
      return this.counts.map(d => new Date(d._id))
    },

    chartData(){
      return [{
        x: this.binTimes,
        y: this.dataBins,
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
  },
  methods: {
    async fetch(){
      let dateStart = this.dateStart && this.dateStart.toISOString() || ''
      let dateEnd = this.dateStart && this.dateEnd.toISOString() || ''
      let maxD = this.maxDistance || ''
      this.counts = await fetch(`/api/encounters/debug/hourly?min_timestamp=${dateStart}&max_timestamp=${dateEnd}&max_distance=${maxD}`)
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw new Error('Failed to get data!')
          }
        })
        .then(json => {
          return json.data.perHour
        })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
