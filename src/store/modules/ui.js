import _ from 'lodash'

const UI = {
  LOWER_SIDEBAR: 'LOWER_SIDEBAR',
  MODIFY_POP: 'MODIFY_POP',
  STAFF: 'STAFF'
}

const initialState = {
  lowerSidebar: { // 二级侧边栏
    show: false
  },
  modifyPop: {
    detail: {},
    specKeys: [],
    viewImg: '',
    orderId: '',
    price: ''
  },
  staff: {
    show: false,
    header: 'https://static.chaodp.com/designerTv/photo.png?imageslim',
    name: '请选择',
    job: '',
    info: '接待店员'
  }
}

const mutations = {
  [UI.LOWER_SIDEBAR] (state, payload) {
    state.lowerSidebar = {
      ...state.lowerSidebar,
      ...payload
    }
  },
  [UI.MODIFY_POP] (state, payload) {
    state.modifyPop = {
      ...state.modifyPop,
      ...payload
    }
  },
  [UI.STAFF] (state, payload) {
    state.staff = {
      ...state.staff,
      ...payload
    }
  }
}

const actions = {
  changeLowerSidebar ({ commit }, payload) {
    commit(UI.LOWER_SIDEBAR, payload)
  },
  changeModifyPop ({ commit }, payload) {
    commit(UI.MODIFY_POP, payload)
  },
  changeStaff ({ commit }, payload) {
    commit(UI.STAFF, payload)
  }
}

const getters = {}

export default {
  state: _.cloneDeep(initialState),
  mutations,
  actions,
  getters
}
