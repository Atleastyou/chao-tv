<template lang="pug">
aside.sketch-aside
  //- 侧边栏导航
  nav.sketch-aside-nav
    .nav-item(@click="changeNavbar(0)", :class="{'active': currentNav === 0}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-search-1
        p 商品
    .nav-item(@click="changeNavbar(5)", :class="{'active': currentNav === 5}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-brand
        p 品牌
    .nav-item(@click="changeNavbar(1)", :class="{'active': currentNav === 1}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-case
        p 案例
    .nav-item(@click="changeNavbar(2)", :class="{'active': currentNav === 2}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-material
        p 素材
    .nav-item(@click="changeNavbar(3)", :class="{'active': currentNav === 3}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-collection
        p 收藏
    .nav-item(@click="changeNavbar(4)", :class="{'active': currentNav === 4}")
      touch-ripple(:speed="3", :opacity=".6")
        i.icon-upload
        p 上传素材
  //- 导航内容区域（案例、素材等）
  main.sketch-aside-container
    transition(name="side")
      .sketch-aside-box(v-show="sideShow")
        .sketch-aside-inner
          sketch-goods(v-show="currentNav === 0" @addGood="addGood")
          sketch-cases(v-show="currentNav === 1") 案例
          sketch-material(v-if="currentNav === 2") 素材
          sketch-collection(v-if="currentNav === 3") 收藏
          upload-material(v-show="currentNav === 4") 上传素材
          brand-list(v-if="currentNav === 5") 品牌
    //- 隐藏/显示开关
    .sketch-aside-switch(@click="toggleSide")
      i.icon-left(:style="{'transform': sideShow ? '' : 'rotate(180deg)'}")
</template>

<script>
import sketchGoods from './goods/index'
import sketchCases from './cases/index'
import sketchMaterial from './material/index'
import sketchCollection from './collection/index'
import brandList from './brand/index'
import uploadMaterial from './uploadMaterial'
import { mapState } from 'vuex'
export default {
  name: 'sketchSlider',
  props: {
    parentCurrentNav: Number
  },
  data () {
    return {
      sideShow: true,
      currentNav: 0
    }
  },
  watch: {
    skuDetailShow (v) { // 打开商品详情
      if (v) {
        this.currentNav = 0
        this.sideShow = true
      }
    },
    caseDetailShow (v) { // 打开案例详情
      if (v) {
        this.currentNav = 1
        this.sideShow = true
      }
    },
    parentCurrentNav (v) {
      this.currentNav = v
    }
  },
  methods: {
    changeNavbar (val) {
      this.sideShow = true
      this.currentNav = val
    },
    addGood (good) {
      this.$emit('addGood', good)
    },
    toggleSide () {
      // if (this.matrixShow) {
      //   this.$toast.message('请先退出变形编辑状态')
      // } else {
      //   this.sideShow = !this.sideShow
      //   this.$emit('toggleSlide', this.sideShow)
      // }
      this.sideShow = !this.sideShow
      this.$emit('toggleSlide', this.sideShow)
    }
  },
  computed: {
    ...mapState({
      // matrixShow: state => state.sketch.matrix.show,
      skuDetailShow: state => state.sketch.skuDetail.show,
      caseDetailShow: state => state.sketch.caseDetail.show
    })
  },
  components: {
    sketchGoods,
    sketchCases,
    sketchMaterial,
    sketchCollection,
    uploadMaterial,
    brandList
  }
}
</script>

<style lang="scss" scoped>
.side-enter-active, .side-leave-active{
  transition-duration: .3s;
  transition-property: width, padding;
  overflow: hidden;
}
.side-enter, .side-leave-active {
  width: 0!important;
  padding-left: 0!important;
  padding-right: 0!important;
}
.sketch-aside {
  height: 100%;
  display: flex;
  .sketch-aside-nav {
    width: 100px;
    min-width: 100px;
    height: 100%;
    background: #252429;
    padding: 80px 0;
    .nav-item {
      width: 100%;
      text-align: center;
      font-size: 20px;
      color: #7B7B7B;
      &.active {
        color: #fff;
      }
      i {
        font-size: 33px;
        margin-bottom: 10px;
      }
      p {
        width: 40px;
        margin: 0 auto;
      }
      .v-touch-ripple {
        width: 100%;
        height: 100%;
        padding: 20px 0;
      }
    }
  }
  .sketch-aside-container {
    height: 100%;
    position: relative;
  }
  .sketch-aside-box {
    width: 620px;
    height: 100%;
  }
  .sketch-aside-inner {
    width: 620px;
    height: 100%;
    background: #38363D;
    transition: all .3s;
    transform-origin: left center;
    transform: translate3d(0,0,0);
    padding: 26px;
  }
  .sketch-aside-switch {
    width: 30px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    position: absolute;
    top: 50%;
    right: -30px;
    margin-top: -60px;
    background: #38363D;
    font-size: 20px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    i {
      display: inline-block;
      transition: transform .5s;
    }
  }
}
</style>
