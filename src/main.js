import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/store'
import '@/assets/css/index.css'
import axios from '@/utils/axios'
import VModal from 'vue-js-modal'
import VueTouchRipple from 'vue-touch-ripple'
import 'vue-touch-ripple/dist/vue-touch-ripple.css'
import Toast from 'muse-ui-toast'
import 'muse-ui/lib/styles/base.less'
import 'muse-ui/lib/styles/theme.less'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import Loading from 'muse-ui-loading'
import { Snackbar, Icon, Button, Progress, Helpers, Menu, Popover } from 'muse-ui'
import cButton from '@/components/ui/c-button'
import cRadio from '@/components/ui/c-radio'
import cNumber from '@/components/ui/c-number'
import VueLazyload from 'vue-lazyload'
// import '@/utils/setHtmlFontSize'

const components = [
  cButton,
  cRadio,
  cNumber
]
components.forEach(component => {
  Vue.component(component.name, component)
})
// Vue.filter('orderStatus', function (status) {
//     switch (status) {
//       case 0:
//         return '待付款'
//       case 1:
//         return '待确认'
//       case 2:
//         return '待发货'
//       case 3:
//         return '已发货'
//       case 4:
//         return '已完成'
//       case 5:
//         return '申请退款中'
//       case 6:
//         return '已退款'
//       case 7:
//         return '已关闭'
//       case 8:
//         return '已取消'
//       default:
//         return ''
//     }
// })

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(VModal)
Vue.use(VueTouchRipple)
Vue.use(Snackbar)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Popover)
Vue.use(VueLazyload)
Vue.use(Loading, {
  overlayColor: 'rgba(0, 0, 0, .6)',
  size: 58,
  color: '#fff',
  className: 'mu-sketch-loading',
  text: '图片渲染中...'
})
Vue.directive('loadingImage', {
  inserted: function (el, { value }) {
    let src = value + '?imageslim&imageView2/0/w/560'
    el.style.backgroundImage = 'url(' + src + ')'
    let img = new Image()
    img.src = value
    img.onload = () => {
      el.style.backgroundImage = 'url(' + value + ')'
    }
  },
  update: function (el, { value }) {
    let src = value + '?imageslim&imageView2/0/w/560'
    el.style.backgroundImage = 'url(' + src + ')'
    let img = new Image()
    img.src = value
    img.onload = () => {
      el.style.backgroundImage = 'url(' + value + ')'
    }
  }
})
Vue.use(Progress)
Vue.use(Helpers)
Vue.use(Toast, {
  position: 'top', // 弹出的位置
  time: 2000, // 显示的时长
  closeIcon: ':icon-close-2', // 关闭的图标
  close: true, // 是否显示关闭按钮
  successIcon: ':icon-success', // 成功信息图标
  infoIcon: ':icon-info', // 信息信息图标
  warningIcon: ':icon-warning', // 提醒信息图标
  errorIcon: ':icon-error' // 错误信息图标
})
// this.$toast.message('hello world')
// this.$toast.success('hello world')
// this.$toast.info('hello world')
// this.$toast.warning('hello world')
// this.$toast.error('hello world')

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
