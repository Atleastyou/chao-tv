import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import ui from './modules/ui'
import modal from './modules/modal'
import sketch from './modules/sketch'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true, // 严格模式，禁止双向绑定（v-model）
  modules: {
    user,
    ui,
    modal,
    sketch
  }
})
