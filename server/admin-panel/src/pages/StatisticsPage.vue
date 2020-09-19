<template>
  <section class="content">
    <h2 class="heading">Statistics</h2>
    <p>Average encounters per hour: {{stats.hourly.mean.toFixed(2)}} (&pm;{{stats.hourly.stdDev.toFixed(2)}})</p>
    <p>Average encounters per day:  {{stats.daily.mean.toFixed(2)}} (&pm;{{stats.daily.stdDev.toFixed(2)}})</p>
  </section>
</template>

<script>

export default {
  name: 'StatisticsPage',
  props: {
    dateStart: Date,
    dateEnd: Date,
    maxDistance: Number
  },
  components: {
  },
  data: () => ({
    stats: {
      hourly: {
        mean: 0,
        stdDev: 0
      },
      daily: {
        mean: 0,
        stdDev: 0
      }
    }
  }),

  mounted(){
    this.fetch()
  },

  watch: {
    dateStart: 'fetch',
    dateEnd: 'fetch',
    maxDistance: 'fetch'
  },
  methods: {
    async fetch(){
      let dateStart = this.dateStart && this.dateStart.toISOString() || ''
      let dateEnd = this.dateStart && this.dateEnd.toISOString() || ''
      let maxD = this.maxDistance || ''
      this.stats = await fetch(`/api/encounters/debug/stats?min_timestamp=${dateStart}&max_timestamp=${dateEnd}&max_distance=${maxD}`)
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw new Error('Failed to get data!')
          }
        })
        .then(json => json.data.stats)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
