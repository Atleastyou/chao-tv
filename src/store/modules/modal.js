import _ from 'lodash'
import store from '../store'

const MODAL = {
  NAVIGATION: 'NAVIGATION',
  UPLOAD_QRCODE: 'UPLOAD_QRCODE',
  EXPORT_QRCODE: 'EXPORT_QRCODE',
  UPLOADED_MATERIAL: 'UPLOADED_MATERIAL',
  CONFIRM: 'CONFIRM',
  VERSION: 'VERSION',
  REQUEST_STATUS: 'REQUEST_STATUS',
  REPLACE: 'REPLACE',
  QRCODE: 'QRCODE',
  SCREENING: 'SCREENING',
  EXPORT_CONFIRM: 'EXPORT_CONFIRM'
}

const initialState = {
  exportConfirm: {
    show: false,
    value: 0,
    confirmed: false
  },
  screening: {
    show: false,
    hasBrand: false, // 是否显示品牌筛选
    tagType: 'even',
    brandId: '', // 是否在某个品牌下筛选
  },
  navigation: { // 全局导航
    show: false
  },
  uploadQrcode: {
    show: false
  },
  exportQrcode: {
    show: false,
    show_good: 0,
    img: '',
    id: ''
  },
  uploadedMaterial: {
    show: false,
    confirm: false
  },
  confirm: {
    show: false,
    title: '',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    isSaveBtn: false,
    paragraph: '',
    showCancel: true,
    confirmed: 0 // 0 取消，1 不存储，2 存储
  },
  qrcode: {
    show: false
  },
  requestStatus: {
    status: true
  },
  version: {
    show: false,
    paragraph: '',
    num: ''
  },
  replace: {
    show: false,
    title: '',
    paragraph: '',
    remind: false,
    confirmed: false
  }
}

const mutations = {
  [MODAL.SCREENING] (state, payload) {
    state.screening = {
      ...state.screening,
      ...payload
    }
  },
  [MODAL.NAVIGATION] (state, payload) {
    state.navigation = {
      ...state.navigation,
      ...payload
    }
  },
  [MODAL.UPLOAD_QRCODE] (state, payload) {
    state.uploadQrcode = {
      ...state.uploadQrcode,
      ...payload
    }
  },
  [MODAL.EXPORT_QRCODE] (state, payload) {
    state.exportQrcode = {
      ...state.exportQrcode,
      ...payload
    }
  },
  [MODAL.UPLOADED_MATERIAL] (state, payload) {
    state.uploadedMaterial = {
      ...state.uploadedMaterial,
      ...payload
    }
  },
  [MODAL.CONFIRM] (state, payload) {
    state.confirm = {
      ...state.confirm,
      ...payload
    }
  },
  [MODAL.EXPORT_CONFIRM] (state, payload) {
    state.exportConfirm = {
      ...state.exportConfirm,
      ...payload
    }
  },
  [MODAL.VERSION] (state, payload) {
    state.version = {
      ...state.version,
      ...payload
    }
  },
  [MODAL.REQUEST_STATUS] (state, payload) {
    state.requestStatus = {
      ...state.requestStatus,
      ...payload
    }
  },
  [MODAL.REPLACE] (state, payload) {
    state.replace = {
      ...state.replace,
      ...payload
    }
  },
  [MODAL.QRCODE] (state, payload) {
    state.qrcode = {
      ...state.qrcode,
      ...payload
    }
  }
}

const actions = {
  changeScreening ({ commit }, { show, hasBrand, tagType = 'even', brandId = '' }) {
    commit(MODAL.SCREENING, { show, hasBrand, tagType, brandId })
  },
  changeNavigation ({ commit }, payload) {
    commit(MODAL.NAVIGATION, payload)
  },
  changeUploadQrcode ({ commit }, payload) {
    commit(MODAL.UPLOAD_QRCODE, payload)
  },
  changeExportQrcode ({ commit }, payload) {
    commit(MODAL.EXPORT_QRCODE, payload)
  },
  changeUploadedMaterial ({ commit }, payload) {
    commit(MODAL.UPLOADED_MATERIAL, payload)
  },
  changeConfirm ({ commit }, payload) {
    commit(MODAL.CONFIRM, payload)
  },
  changeExportConfirm ({ commit }, payload) {
    commit(MODAL.EXPORT_CONFIRM, payload)
  },
  changeVersion ({ commit }, payload) {
    commit(MODAL.VERSION, payload)
  },
  changeRequestStatus ({ commit }, payload) {
    commit(MODAL.REQUEST_STATUS, payload)
  },
  changeReplace ({ commit }, payload) {
    commit(MODAL.REPLACE, payload)
  },
  changeQrcode ({ commit }, payload) {
    commit(MODAL.QRCODE, payload)
  },
  showConfirmModal({ commit, dispatch, state }, { title, confirmButtonText, isSaveBtn, paragraph, showCancel = true }) {
    return new Promise((resolve, reject) => {
      dispatch('changeConfirm', {
        show: true,
        title,
        confirmButtonText,
        isSaveBtn,
        paragraph,
        showCancel,
        confirmed: 0
      })
      const unwatch = store.watch(function (state, getters) {
        return state.modal.confirm.show
      }, function () {
        unwatch()
        resolve(state.confirm.confirmed)
      })
    })
  },
  showExportConfirmModal({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      dispatch('changeExportConfirm', {
        show: true,
        confirmed: false
      })
      const unwatch = store.watch(function (state, getters) {
        return state.modal.exportConfirm.show
      }, function () {
        unwatch()
        resolve({ confirmed: state.exportConfirm.confirmed, value: state.exportConfirm.value})
      })
    })
  },
  showReplaceModal ({ commit, dispatch, state }, { title, paragraph }) {
    return new Promise((resolve, reject) => {
      dispatch('changeReplace', {
        show: true,
        title,
        paragraph,
        confirmed: false
      })
      const unwatch = store.watch(function (state, getters) {
        return state.modal.replace.show
      }, function () {
        unwatch()
        resolve(state.replace.confirmed)
      })
    })
  }
}

const getters = {}

export default {
  state: _.cloneDeep(initialState),
  mutations,
  actions,
  getters
}
