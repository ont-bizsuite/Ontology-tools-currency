import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ContentWrap',
    component: () => import('../views/ContentWrap.vue')
  },
  // {
  //   path: '/search',
  //   name: 'search',
  //   component: () => import('../views/Search.vue')
  // },
  // {
  //   path: '/layout',
  //   name: 'Layout',
  //   component: () => import('../views/Layout.vue')
  // },
  {
    path: '/history',
    name: 'HistoryWrap',
    component: () => import('../views/HistoryWrap.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
export default router
