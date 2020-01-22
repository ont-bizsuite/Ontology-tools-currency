import Vue from 'vue'
import Vuex from 'vuex'
import * as http from '@/api/role'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eventTypeList: []
  },
  mutations: {
    CHANGE_EVENT_LIST(state, payload) {
      state.eventTypeList = [...payload]
    }
  },
  actions: {
    async getEventList({ commit }) {
      let result = await http.getEventType()
      commit('CHANGE_EVENT_LIST', [...result.Result])
    }
  },
  modules: {}
})
