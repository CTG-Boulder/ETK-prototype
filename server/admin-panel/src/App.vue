<template>
  <div id="app">
    <div class="container-fluid">
      <div class="columns">
        <div class="column menu">
          <b-menu class="has-text-left">
            <b-menu-list>
              <b-menu-item icon="speedometer" label="Statistics" tag="router-link" :to="{ name: 'statistics' }"></b-menu-item>
              <b-menu-item icon="chart-bar" label="Chart" tag="router-link" :to="{ name: 'chart' }"></b-menu-item>
              <b-menu-item icon="table-of-contents" label="Table" tag="router-link" :to="{ name: 'table' }"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <b-field grouped position="is-centered" v-if="$route.name !== 'table'">
            <b-field label="Date Range">
              <b-datetimepicker
                v-model="dateStart"
                :datetime-formatter="formatDatetime"
                rounded
                placeholder="Start at..."
                icon="calendar-today"
                :timepicker="{ hourFormat: '24' }"
                horizontal-time-picker>
              </b-datetimepicker>
              <b-datetimepicker
                v-model="dateEnd"
                :datetime-formatter="formatDatetime"
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

            <b-field label="Max Distance">
              <b-select placeholder="Select a filter" v-model="maxDistance">
                <option :value="100">None</option>
                <option :value="2">2 meters</option>
              </b-select>
            </b-field>
          </b-field>

          <router-view :dateStart="dateStart" :dateEnd="dateEnd" :maxDistance="maxDistance"></router-view>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'app',
  components: {
  },
  data: () => ({
    dateStart: moment().subtract(6, 'months').toDate(),
    dateEnd: new Date(),
    maxDistance: 2
  }),

  methods: {
    formatDatetime(d){
      return moment(d).format('lll')
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
