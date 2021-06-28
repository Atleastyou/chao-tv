<template lang="pug">
#app
  .global-btns(v-if="$route.name !== 'index' && $route.name !== 'index_A' && $route.name !== 'index_B' && $route.name !== 'login' && $route.name !== 'edit' && $route.name !== 'list'")
    .global-btn(v-show="showBackTop" @click="scrollToTop")
      i.icon-up-1
      p 顶部
    .global-btn(v-if="$route.name !== 'pay' && $route.name !== 'confirmOrderList' && $route.name !== 'submitOrderSuccess'" @click="$router.back()")
      i.icon-return
      p 返回
    .global-btn(@click="showNav")
      i.icon-nav
      p 导航
  export-confirm
  screening
  sketch-screening
  brand-screening
  navigation
  confirm
  new-version
  replace
  screen-saver(:showScreen="showScreen", :bannerList="bannerList")
  upload-qrcode(v-if="uploadQrcodeShow")
  export-qrcode(v-if="exportQrcodeShow")
  v-qrcode(v-if="qrocdeShow")
  uploadedMaterial(v-if="uploadedMaterialShow")
  keep-alive(exclude="pay,goodDetail,confirmOrder,shoppingCart,category,edit,joinShopDetail")
    router-view
</template>
<script>
import screening from '@/components/screening'
import sketchScreening from '@/components/sketchScreening'
import brandScreening from '@/components/brandScreening'
import navigation from '@/components/modal/navigation'
import screenSaver from '@/components/screenSaver'
import confirm from '@/components/modal/confirm'
import exportConfirm from '@/components/modal/exportConfirm'
import newVersion from '@/components/modal/newVersion'
import replace from '@/components/modal/replace'
import uploadQrcode from '@/components/modal/uploadQrcode'
import exportQrcode from '@/components/modal/exportQrcode'
import vQrcode from '@/components/modal/qrcode'
import uploadedMaterial from '@/components/modal/uploadedMaterial'
import { mapState, mapActions } from 'vuex'
import { getScreenSaver } from 'api'
let timer = null
let screenTimer = null
export default {
  name: 'app',
  data () {
    return {
      showScreen: false,
      showBackTop: false,
      bannerList: []
    }
  },
  watch: {
    '$route' () {
      this.watchScroller()
    }
  },
  methods: {
    ...mapActions([
      'changeNavigation'
    ]),
    watchScroller () {
      let repeatNumber = 3 // 重新获取页面中scroller的次数
      const scroller = document.getElementById('scroller')
      if (scroller) {
        scroller.addEventListener('scroll', () => {
          const { scrollTop, offsetHeight } = scroller
          this.showBackTop = scrollTop >= offsetHeight * 2 // 滚动大于两屏时，显示返回顶部
        })
      } else if (repeatNumber) {
        setTimeout(() => {
          repeatNumber --
          this.watchScroller()
        }, 2000)
      }
    },
    scrollToTop () {
      const scroller = document.getElementById('scroller')
      scroller.scrollTop = 0
    },
    showNav () {
      this.changeNavigation({ show: true })
    },
    initScreenTimer () {
      screenTimer = setTimeout(() => {
        clearInterval(screenTimer)
        this.getBanner()
      }, 1000 * 180)
    },
    clearScreenTimer (e) {
      clearInterval(screenTimer)
      this.showScreen = false
      this.initScreenTimer()
    },
    async getBanner () {
      try {
        const { data } = await this.$axios.get(getScreenSaver)
        this.bannerList = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      } finally {
        this.showScreen = true
      }
    }
  },
  components: {
    navigation,
    confirm,
    exportConfirm,
    newVersion,
    replace,
    uploadQrcode,
    exportQrcode,
    vQrcode,
    uploadedMaterial,
    screenSaver,
    screening,
    sketchScreening,
    brandScreening
  },
  computed: {
    ...mapState({
      uploadQrcodeShow: state => state.modal.uploadQrcode.show,
      exportQrcodeShow: state => state.modal.exportQrcode.show,
      uploadedMaterialShow: state => state.modal.uploadedMaterial.show,
      qrocdeShow: state => state.modal.qrcode.show
    })
  },
  created () {
    document.addEventListener('touchstart', this.clearScreenTimer)
  },
  mounted () {
    this.watchScroller()
  }
}
</script>
<style lang="scss" scoped>
#app {
  height: 100%;
}
.global-btns {
  position: fixed;
  bottom: 140px;
  right: 40px;
  z-index: 888;
}
.global-btn {
  width: 118px;
  height: 118px;
  border-radius: 50%;
  text-align: center;
  background: rgba(255,255,255,0.80);
  box-shadow: 0 10px 20px 0 rgba(30,32,32,0.10);
  margin-top: 30px;
  overflow: hidden;
  transition: transform .3s;
  &:first-child {
    margin-top: 0;
  }
  &:active {
    transform: scale(1.2);
  }
  & i {
    font-size: 36px;
    margin-top: 22px;
  }
  & p {
    font-size: 20px;
    color: #333333;
    margin-top: 10px;
  }
}
</style>
