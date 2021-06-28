import _ from 'lodash'

const SKETCH = {
  RANDOM_CATE: 'RANDOM_CATE',
  MATRIX: 'MATRIX',
  CASE_DETAIL: 'CASE_DETAIL',
  SKU_DETAIL: 'SKU_DETAIL',
  SKETCH_GOODS: 'SKETCH_GOODS',
  HISTORY_CLEAR: 'HISTORY_CLEAR',
  HISTORY: 'HISTORY',
  STYLELIST: 'STYLELIST',
  SPACELIST: 'SPACELIST',
  MATERIAL_TEXT: 'MATERIAL_TEXT',
  VUE_COLOR: 'VUE_COLOR',
  SKETCH_SCREENING: 'SKETCH_SCREENING',
  SCREENING_CONFIRM: 'SCREENING_CONFIRM',
  BRAND_GOODS_DETAIL: 'BRAND_GOODS_DETAIL',
  BRAND_SCREENING: 'BRAND_SCREENING',
  BRAND_SCREENING_CONFIRM: 'BRAND_SCREENING_CONFIRM'
}

const initialState = {
  randomCate: '', // 随机商品
  matrix: { // 变形
    show: false,
    img: '',
    points: {}
  },
  screeningConfirm: {
    confirmed: false
  },
  screening: {
    show: false
  },
  brandScreeningConfirm: {
    confirmed: false
  },
  brandScreening: {
    show: false,
    search_words: '',
    brandId: '',
    first_id: '',
    second_id: '',
    three_id: '',
    category_id: ''
  },
  history: { // 历史记录
    state: null,
    undo: [],
    redo: []
  },
  caseDetail: { // 案例详情
    show: false,
    id: ''
  },
  skuDetail: { // 商品详情
    show: false,
    id: '',
    key: '',
    dataSource: ''
  },
  brandGoodsDetail: { // 品牌商品详情
    show: false,
    id: '',
    key: '',
    dataSource: ''
  },
  sketchGoods: [],
  styleList: [],
  spaceList: [],
  materialText: {
    isText: false
  },
  vueColor: {
    color: '#000000'
  }
}

const mutations = {
  [SKETCH.SKETCH_SCREENING] (state, payload) {
    state.screening = {
      ...state.screening,
      ...payload
    }
  },
  [SKETCH.SCREENING_CONFIRM] (state, payload) {
    state.screeningConfirm = {
      ...state.screeningConfirm,
      ...payload
    }
  },
  [SKETCH.BRAND_SCREENING] (state, payload) {
    state.brandScreening = {
      ...state.brandScreening,
      ...payload
    }
  },
  [SKETCH.BRAND_SCREENING_CONFIRM] (state, payload) {
    state.brandScreeningConfirm = {
      ...state.brandScreeningConfirm,
      ...payload
    }
  },
  [SKETCH.RANDOM_CATE](state, payload) {
    state.randomCate = payload
  },
  [SKETCH.MATRIX](state, payload) {
    state.matrix = {
      ...state.matrix,
      ...payload
    }
  },
  [SKETCH.HISTORY_CLEAR] (state) {
    state.sketchGoods = []
    state.history = {
      state: null,
      undo: [],
      redo: []
    }
  },
  [SKETCH.HISTORY] (state, payload) {
    state.history = payload
  },
  [SKETCH.SKU_DETAIL] (state, payload) {
    state.skuDetail = {
      ...state.skuDetail,
      ...payload
    }
  },
  [SKETCH.BRAND_GOODS_DETAIL] (state, payload) {
    state.brandGoodsDetail = {
      ...state.brandGoodsDetail,
      ...payload
    }
  },
  [SKETCH.CASE_DETAIL] (state, payload) {
    state.caseDetail = {
      ...state.caseDetail,
      ...payload
    }
  },
  [SKETCH.SKETCH_GOODS] (state, payload) {
    switch (payload.type) {
      case 'reload':
        state.sketchGoods = payload.list
        break
      case 'set':
        state.sketchGoods.push(payload.good)
        break
      case 'clone':
        let cloneGood = state.sketchGoods.find(item => parseInt(item.goods_id) === parseInt(payload.goods_id))
        state.sketchGoods.push({ ...cloneGood, uid: payload.uid })
        break
      case 'remove':
        let index = state.sketchGoods.findIndex(item => item.uid === payload.uid)
        state.sketchGoods.splice(index, 1)
        break
      case 'clear':
        state.sketchGoods = []
        break
      default:
        throw new error('type is required')
    }
  },
  [SKETCH.STYLELIST] (state, payload) {
    state.styleList = payload
  },
  [SKETCH.SPACELIST] (state, payload) {
    state.spaceList = payload
  },
  [SKETCH.MATERIAL_TEXT] (state, payload) {
    state.materialText = {
      ...state.materialText,
      ...payload
    }
  },
  [SKETCH.VUE_COLOR] (state, payload) {
    state.vueColor = {
      ...state.vueColor,
      ...payload
    }
  }
}

const actions = {
  changeSketchScreening ({ commit }, payload) {
    commit(SKETCH.SKETCH_SCREENING, payload)
  },
  changeBrandScreening ({ commit }, payload) {
    commit(SKETCH.BRAND_SCREENING, payload)
  },
  changeRandomCate({ commit }, payload) {
    commit(SKETCH.RANDOM_CATE, payload)
  },
  changeMatrix({ commit }, payload) {
    let canvas = window['canvas']
    let obj = canvas.getActiveObject()
    if (obj) {
      obj.set('visible', !payload.show)
      obj.set('hasBorders', !payload.show)
      obj.setControlVisible('mtr', !payload.show)
      canvas.renderAll()
    }
    commit(SKETCH.MATRIX, payload)
  },
  clearHistory ({ commit }) {
    commit(SKETCH.HISTORY_CLEAR)
  },
  updateHistory({ commit, state }) {
    if (state.matrix.show) return // 变形功能打开时，禁止向画布添加
    let _history = _.cloneDeep(state.history)
    if (_history.state) _history.undo.push(_history.state)
    if (_history.undo.length > 10) _history.undo = _history.undo.splice(1, 10)
    _history.redo = []
    _history.state = canvas.toJSON(['goods_id', 'uid', 'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation'])
    _history.state.goods = _.cloneDeep(state.sketchGoods)
    commit(SKETCH.HISTORY, _history)
  },
  rePlayHistory ({ commit, state }, { playStack, saveStack }) {
    let _history = _.cloneDeep(state.history)
    if (_history.state) _history[saveStack].push(_history.state)
    _history.state = _history[playStack].pop()
    if (_history.state) {
      canvas.loadFromJSON(_history.state, canvas.renderAll.bind(canvas))
    } else {
      alert('没有记录了')
    }
    commit(SKETCH.HISTORY, _history)
    commit(SKETCH.SKETCH_GOODS, { type: 'reload', list: _history.state.goods })
  },
  changeScreeningConfirm ({ commit }, payload) {
    commit(SKETCH.SCREENING_CONFIRM, payload)
  },
  changeBrandScreeningConfirm ({ commit }, payload) {
    commit(SKETCH.BRAND_SCREENING_CONFIRM, payload)
  },
  changeSkuDetail ({ commit }, payload) {
    commit(SKETCH.SKU_DETAIL, payload)
  },
  changeBrandGoodsDetail ({ commit }, payload) {
    commit(SKETCH.BRAND_GOODS_DETAIL, payload)
  },
  changeCaseDetail ({ commit }, payload) {
    commit(SKETCH.CASE_DETAIL, payload)
  },
  changeSketchGoods({ commit, state }, payload) {
    if (state.matrix.show) return // 变形功能打开时，禁止向画布添加
    commit(SKETCH.SKETCH_GOODS, payload)
  },
  changeStyleList ({ commit }, payload) {
    commit(SKETCH.STYLELIST, payload)
  },
  changeSpaceList ({ commit }, payload) {
    commit(SKETCH.SPACELIST, payload)
  },
  changeMaterialText ({ commit }, payload) {
    commit(SKETCH.MATERIAL_TEXT, payload)
  },
  changeVueColor ({ commit }, payload) {
    commit(SKETCH.VUE_COLOR, payload)
  }
}

const getters = {}

export default {
  state: _.cloneDeep(initialState),
  mutations,
  actions,
  getters
}
