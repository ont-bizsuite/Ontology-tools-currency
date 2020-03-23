import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/reset.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
// http api
import * as http from '@/api/role'


import enLang from './lang/en'
import zhLang from './lang/zh'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

Vue.prototype.$http = http

const i18n = new VueI18n({
  locale: localStorage.getItem('user_lang') || 'en',
  messages: {
    zh: zhLang,
    en: enLang
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
