<template>
  <div id="app">
    <div class="container-fluid">
      <div class="columns">
        <div class="column menu">
          <b-menu class="has-text-left">
            <b-menu-list>
              <b-menu-item icon="speedometer" label="Statistics"></b-menu-item>
              <b-menu-item icon="chart-bar" label="Chart"></b-menu-item>
              <b-menu-item icon="table-of-contents" label="Table"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <b-field grouped>
            <b-field label="Date Range">
              <b-datetimepicker
                v-model="dateStart"
                rounded
                placeholder="Start at..."
                icon="calendar-today"
                :timepicker="{ hourFormat: '24' }"
                horizontal-time-picker>
              </b-datetimepicker>
              <b-datetimepicker
                v-model="dateEnd"
                :min-datetime="dateStart"
                rounded
                placeholder="End at..."
                icon="calendar-today"
                :timepicker="{ hourFormat: '24' }"
                horizontal-time-picker>
              </b-datetimepicker>
            </b-field>

            <b-field>

            </b-field>

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
          </b-field>

          <EncounterChart :encounterData="filteredEncounters"/>
          <EncounterList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import EncounterList from './components/EncounterList.vue'
import EncounterChart from './components/EncounterChart.vue'

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
  name: 'app',
  components: {
    EncounterList,
    EncounterChart
  },
  data: () => ({
    loading: false,
    encounterData: [],
    dateStart: moment().subtract(7, 'days').toDate(),
    dateEnd: new Date(),
    filterNames: Object.keys(FILTERS),
    activeFilter: 'lessThan2m'
  }),

  mounted(){
    this.fetch()
  },

  computed: {
    filteredEncounters(){
      let filter = FILTERS[this.activeFilter]
      return this.encounterData.filter(filter)
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app .menu {
  max-width: 200px;
  padding: 1rem;
}
</style>
