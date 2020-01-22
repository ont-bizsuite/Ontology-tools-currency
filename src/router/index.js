import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue')
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  // },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
