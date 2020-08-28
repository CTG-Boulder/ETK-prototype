<template>
  <div class="container">
    <!-- <pre class="content">{{ JSON.stringify(encounterData[0], null, 2) }}</pre> -->
    <b-table
      class="encounter-table"
      :data="encounterData"
      @sort="onSort"
      :loading="loading"
      default-sort="timestamp"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-table-column field="timestamp" label="Timestamp" sortable centered v-slot="props">
        {{ new Date(props.row.timestamp).toISOString().replace('T', ' ') }}
      </b-table-column>

      <b-table-column
        field="clientKey"
        label="key"
        sortable
        centered
        v-slot="props"
      >
        {{ props.row.clientKey }}
      </b-table-column>

      <b-table-column
        field="_meta.mac"
        label="Mac Address"
        sortable
        centered
        v-slot="props"
      >
        {{ props.row._meta.mac | hex }}
      </b-table-column>

      <b-table-column
        field="_meta.first_time"
        label="First Time"
        sortable
        centered
        v-slot="props"
      >
        {{ props.row._meta.first_time }}
      </b-table-column>

      <b-table-column
        field="_meta.last_time"
        label="Last Time"
        sortable
        centered
        v-slot="props"
      >
        {{ props.row._meta.last_time }}
      </b-table-column>

      <b-table-column field="createdAt" label="createdAt" sortable centered v-slot="props">
        {{ new Date(props.row.createdAt).toISOString().replace('T', ' ') }}
      </b-table-column>

      <b-table-column field="updatedAt" label="updatedAt" sortable centered v-slot="props">
        {{ new Date(props.row.updatedAt).toISOString().replace('T', ' ') }}
      </b-table-column>

    </b-table>
    <b-pagination
        v-model="currentPage"
        :total="totalPages * perPage"
        :range-before="3"
        :range-after="3"
        order="is-centered"
        :per-page="perPage"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page">
    </b-pagination>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => ({
    encounterData: [],
    paginationPosition: "bottom",
    defaultSortDirection: "asc",
    sortIcon: "arrow-up",
    sortIconSize: "is-small",
    currentPage: 1,
    perPage: 100,
    totalPages: 0,
    sortBy: 'timestamp',
    loading: false
  }),
  filters: {
    hex(v){
      return v.map(n => n.toString(16)).join('-')
    }
  },
  mounted(){
    this.fetch()
  },
  watch: {
    currentPage: 'fetch',
    sortBy: 'fetch'
  },
  methods: {
    fetch(){
      this.loading = true
      return fetch(`http://localhost:8000/api/encounters/debug?page=${this.currentPage}&sortBy=${this.sortBy}`)
        .then(res => {
          if (res.status === 200) {
            this.totalPages = res.headers.get('X-Pages')
            return res.json()
          } else {
            throw new Error('Failed to get data!')
          }
        })
        .then(json => {
          // console.debug(json)
          this.encounterData = json.data.encounters
        }).catch(error => {
          // eslint-disable-next-line
          console.error(error)
        }).finally(() => {
          this.loading = false
        })
    },

    onSort(field, dir){
      dir = dir === 'desc' ? '-' : ''
      this.sortBy = dir + field
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.encounter-table {
  max-height: 80vh;
  overflow: scroll;
  box-shadow: inset -1px 0 2px hsla(0, 0, 0, 0.3);
}
</style>
