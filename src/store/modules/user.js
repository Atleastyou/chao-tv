import _ from 'lodash'
import axios from '@/utils/axios'
import { getUserInfo, logoConfig } from 'api'

const USER = {
  SET_USER: 'SET_USER',
  SHOW_NEW_THEME: 'SHOW_NEW_THEME',
  LOGO_CONFIG: 'LOGO_CONFIG'
}

const initialState = {
  user: {},
  logo: null,
  showNewTheme: 0
}

const mutations = {
  [USER.SET_USER] (state, user) {
    state.user = user
  },
  [USER.SHOW_NEW_THEME] (state, payload) {
    state.showNewTheme = payload
  },
  [USER.LOGO_CONFIG] (state, payload) {
    state.logo = payload
  }
}

const actions = {
  changeUserInfo ({ commit }, payload) {
    commit(USER.SET_USER, payload)
  },
  loadUserInfo({ commit, dispatch }, { next, to }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(getUserInfo)
        dispatch('changeUserInfo', data)
        dispatch('changeShowNewTheme', data.show_new_theme)
        resolve(data)
      } catch (err) {
        console.log(err)
      } finally {
        next()
      }
    })
  },
  changeLogoConfig({ commit }, payload) {
    commit(USER.LOGO_CONFIG, payload)
  },
  loadLogoConfig({ commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(logoConfig)
        dispatch('changeLogoConfig', data)
      } catch (err) {
        console.log(err)
      }
    })
  },
  changeShowNewTheme ({ commit }, payload) {
    commit(USER.SHOW_NEW_THEME, payload)
  }
}

const getters = {}

export default {
  state: _.cloneDeep(initialState),
  mutations,
  actions,
  getters
}
