import Vue from 'vue'
import Vuex from 'vuex'
import * as http from '@/api/role'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eventTypeList: [],
    netType: null
  },
  mutations: {
    CHANGE_EVENT_LIST(state, payload) {
      state.eventTypeList = [...payload]
    },
    CHANGE_NET_TYPE(state, payload) {
      state.netType = payload
    }
  },
  actions: {
    async getEventList({ commit }, payload) {
      let result = await http.getEventType(payload)
      commit('CHANGE_EVENT_LIST', [...result.Result])
    }
  },
  modules: {}
})
