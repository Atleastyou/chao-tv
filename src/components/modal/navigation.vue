<template lang="pug">
transition(name="nav")
  .nav(v-if="show", @click="close")
    .nav-box
      .card-group
        router-link.card-item(:style="{ background: '#32A25C' }", :to="{name: 'index'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/shouye.png")
            .card-item-content(:style="{'top': '171px'}")
              p 首页
        router-link.card-item(:style="{ background: '#6A4DC9' }", :to="{name: 'brands'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/jingxuanpinpai.png")
            .card-item-content(:style="{'top': '171px'}")
              p 精选品牌
        router-link.card-item(:style="{ background: '#D87808' }", :to="{name: 'hotGoods', query: { good_type: 'explosive' }}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/tejiabaokuan.png")
            .card-item-content(:style="{'top': '171px'}")
              p 特价爆款
      .card-group
        router-link.card-item(:style="{ background: '#5080C6' }", :to="{name: 'category'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/fenlei.png")
            .card-item-content(:style="{'top': '171px'}")
              p 分类
        router-link.card-item(:style="{ background: '#C3533C' }", :to="{name: 'sketch'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/dapeidashi.png")
            .card-item-content(:style="{'top': '171px'}")
              p 搭配大师
        router-link.card-item(:style="{ background: '#5080C6' }", :to="{name: 'shopping'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/gouwuche.png")
            .card-item-content(:style="{'top': '171px'}")
              p 购物车
      .card-group
        router-link.card-item(:style="{ background: '#D87808' }", :to="{name: 'hotGoods', query: { brand_id: '', good_type: 'hot' }}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/rexiaoshangpin02.png")
            .card-item-content(:style="{'top': '171px'}")
              p 畅销好货
        router-link.card-item(:style="{ background: '#6A4DC9' }", :to="{name: 'search'}")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/sousuo.png")
            .card-item-content(:style="{'top': '171px'}")
              p 搜索
        router-link.card-item(:style="{ background: '#32A25C' }", :to="{ name: 'system' }")
          touch-ripple(:speed="3", :opacity=".6")
            img(src="../../static/images/xitongshezhi.png")
            .card-item-content(:style="{'top': '171px'}")
              p 系统设置
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'navigation',
  methods: {
    ...mapActions([
      'changeNavigation'
    ]),
    close () {
      this.changeNavigation({ show: false })
    }
  },
  computed: {
    ...mapState({
      show: state => state.modal.navigation.show
    })
  }
}
</script>

<style lang="scss" scoped>
.nav-enter-active,.nav-leave-active {
  opacity: 0
}
.nav-enter-active .nav-box,
.nav-leave-active .nav-box {
  transform: scale(0);
}
.nav {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.70);
  transition: opacity .3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.nav-box {
  background: none;
  white-space: nowrap;
  transition: transform 0.3s ease
}
.card-group {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  &:last-child {
    margin-right: 0;
  }
}
.card-box {
  display: flex;
  & .card-item {
    margin-bottom: 0;
    &:first-child {
      margin-right: 10px;
    }
  }
}
.card-item {
  position: relative;
  margin-bottom: 10px;
  display: block;
  & .v-touch-ripple {
    display: block;
  }
  &:last-child {
    margin-bottom: 0;
  }
  & img {
    display: block;
  }
}
.card-item-content {
  position: absolute;
  left: 0;
  text-align: center;
  width: 100%;
  & p {
    font-size: 26px;
    color: #FFFFFF;
    line-height: 45px;
  }
  & span {
    font-size: 20px;
    color: rgba(255,255,255,0.80);
    line-height: 28px;
    margin-top: 7px;
  }
}
</style>
