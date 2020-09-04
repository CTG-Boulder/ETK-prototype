<template>
  <div class="container">
    <b-field label="Filter by">
        <b-select placeholder="Select a filter" v-model="activeFilter">
            <option
                v-for="name in filterNames"
                :value="name"
                :key="name">
                {{ name }}
            </option>
        </b-select>
    </b-field>
    <vue-plotly :data="chartData" :layout="chartLayout"/>
  </div>
</template>

<script>
import moment from 'moment'
import VuePlotly from '@statnett/vue-plotly'

const IQR_CUTOFF = 50

function getDistance(usoundData){
  if (usoundData.left_iqr >= IQR_CUTOFF && usoundData.right_iqr > IQR_CUTOFF){ return false }

  return (Math.min(usoundData.left, usoundData.right) - 50) / 300
}

const FILTERS = {
  none: () => true,
  lessThan2m: (e) => {
    let d = getDistance(e._meta.usound_data)
    return d && d < 2
  }
}

export default {
  name: "EncounterChart",
  props: {
  },
  components: {
    VuePlotly
  },
  data: () => ({
    loading: false,
    encounterData: [],
    bucketSizeHours: 1,
    filterNames: Object.keys(FILTERS),
    activeFilter: 'lessThan2m'
  }),
  mounted(){
    this.fetch()
  },
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
      let filter = FILTERS[this.activeFilter]
      return [{
        x: this.binTimes,
        y: this.dataBins.map(b => b.filter(filter).length),
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
      this.loading = true
      let totalPages = 1
      let encounters = []
      try {
        for (let currentPage = 0; currentPage < totalPages; currentPage++){
          let data = await fetch(`/api/encounters/dummy?page=${currentPage}&sortBy=timestamp`)
            .then(res => {
              if (res.status === 200) {
                totalPages = res.headers.get('X-Pages')
                return res.json()
              } else {
                throw new Error('Failed to get data!')
              }
            })
            .then(json => {
              // console.debug(json)
              return json.data.encounters
            })

          encounters = encounters.concat(data)
        }
        this.encounterData = encounters
      } catch (error){
        // eslint-disable-next-line
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
