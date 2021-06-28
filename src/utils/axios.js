import axios from 'axios'
import qs from 'qs'
import Router from '../router'
import store from '../store/store'

let _axios = axios.create({
  // baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
  transformRequest: [function (data) {
    return qs.stringify(data)
  }],

  paramsSerializer: function (params) {
    return qs.stringify(params)
  }
})
let tv_id = window.android ? JSON.parse(window.android.getDev()).ID : 123

// 请求拦截器
_axios.interceptors.request.use(config => {
  if (config.method === 'get') {
    if (config.params) {
      config.params.tv_sn = tv_id
    } else {
      config.params = {}
      config.params.tv_sn = tv_id
    }
  } else {
    config.data.tv_sn = tv_id
  }
  config.headers.Accept = 'application/json'
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
_axios.interceptors.response.use(res => {
  let version = document.getElementsByTagName('html')[0].getAttribute('version')
  store.dispatch('changeRequestStatus', { status: true })
  if (version != res.data.tv_version && res.data.force_update === 1) {
    store.dispatch('changeVersion', { show: true, paragraph: res.data.update_info, num: res.data.tv_version })
  } else {
    store.dispatch('changeVersion', { show: false, paragraph: res.data.update_info, num: res.data.tv_version })
  }
  if (res.data.msg === '尚未登录') Router.replace({ name: 'login' })
  if (parseInt(res.data.status) === 1) return res.data
  else return Promise.reject(res.data)
}, err => {
  store.dispatch('changeRequestStatus', { status: false })
  return Promise.reject(err.data)
})

export default _axios
