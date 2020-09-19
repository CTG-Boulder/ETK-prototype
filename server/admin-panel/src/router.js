import Vue from 'vue'
import Router from 'vue-router'
import StatisticsPage from '@/pages/StatisticsPage'
import ChartPage from '@/pages/ChartPage'
import TablePage from '@/pages/TablePage'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/statistics'
      , name: 'statistics'
      , component: StatisticsPage
    },
    {
      path: '/chart'
      , name: 'chart'
      , component: ChartPage
      , props: true
    },
    {
      path: '/table'
      , name: 'table'
      , component: TablePage
    }
    , {
      path: '*'
      , redirect: { name: 'statistics' }
    }
  ]
})

export default router
