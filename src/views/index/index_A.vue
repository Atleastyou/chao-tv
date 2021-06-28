<template lang="pug">
.index
  header.header
    .header-menu
      span.header-menu-item.active 首页
      router-link.header-menu-item(:to="{name: 'search'}") 搜索
      router-link.header-menu-item(:to="{name: 'category'}") 分类
      router-link.header-menu-item(:to="{name: 'sketch'}") 搭配大师
      router-link.header-menu-item(:to="{name: 'VRList'}") VR全景图
      router-link.header-menu-item(:to="{name: 'system'}") 系统设置
    .header-slot(v-if="!shopInfo.shop_name")
      i.icon-logo
      span.app-name 软装优品直供商城
      i.icon-qrcode(@click="showQrcode")
    .header-slot(v-else)
      span.app-name {{shopInfo.shop_name}}
      i.icon-qrcode(@click="showQrcode")
  .body
    .body-wrapper
      .card-group(v-for="group, groupIndex in config")
         .card-row(v-for="row, rowIndex in group")
          router-link.card-column(
            v-for="column, columnIndex in row"
            :style="column.style"
            :to="{ name: column.routeName, query: column.routeQuery }"
          )
            .card-column-content(:style="column.contentStyle")
              p {{column.title}}
              span(v-if="column.subtitle") {{column.subtitle}}
  footer.footer
    .footer-menu
      router-link.footer-menu-item(:to="{name: 'collection', query: { good_type: 'collection' }}")
        .footer-menu-icon
          i.icon-collection
        span 收藏
      router-link.footer-menu-item(:to="{name: 'shopping'}")
        .footer-menu-icon
          i.icon-shopping
        span 购物车
      router-link.footer-menu-item(:to="{name: 'unpaidOrder'}")
        .footer-menu-icon
          i.icon-pay-list
        span 待支付列表
</template>

<script>
import { mapActions } from 'vuex'
import { getShopInfo, getShopThemeInfo } from 'api'
export default {
  name: 'index',
  data () {
    return {
      checked: true,
      defaultMenu:[
        [
          { name: 'light', title: '灯饰' },
          { name: 'furniture', title: '家具' },
          { name: 'sketch', title: '搭配工具' },
          { name: 'ornaments', title: '饰品' },
          { name: 'daily_necessities', title: '日用品' }
        ], [
          { name: 'hot_goods', title: '特价爆款' },
          { name: 'adornment_paiting', title: '装饰画' },
          { name: 'cloth_art_home_textile', title: '布艺家纺' },
          { name: 'new', title: '本周上新' }
        ]
      ],
      config: [],
      shopInfo: {}
    }
  },
  methods: {
    ...mapActions([
      'changeQrcode'
    ]),
    showQrcode () {
      this.changeQrcode({ show: true })
    },
    async getShopInfo () {
      try {
        const { data } = await this.$axios.get(getShopInfo)
        this.shopInfo = data.shop
      } catch (err) {
        this.$message.error(err.msg)
      }
    },
    async getThemeInfo () {
      try {
        const { data } = await this.$axios.get(getShopThemeInfo, { params: { plat: 'tv' } })
        this.config = data.theme.config
      } catch (err) {
        this.$message.error(err.msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getThemeInfo()
      vm.getShopInfo()
    })
  }
}
</script>

<style lang="scss" scoped>
.index {
  background: rgb(37,36,41);
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  position: fixed;
  left: 0;
  right: 0;
  top: 8%;
  z-index: 888;
}
.header-menu {
  display: flex;
}
.header-menu-item {
  font-size: 36px;
  color: #7B7B7B;
  margin-right: 100px;
  line-height: 50px;
  &:last-child {
    margin-right: 0;
  }
  &.active {
    color: #fff;
    border-bottom: 4px solid #fff;
  }
}
.header-slot {
  display: flex;
  align-items: center;
  & .icon-logo {
    margin-right: 20px;
    color: #7B7B7B;
    font-size: 30px;
    padding-right: 20px;
    border-right: 3px solid #7B7B7B;
  }
  & .icon-qrcode {
    margin-left: 20px;
    color: #7B7B7B;
    font-size: 50px;
  }
  & .app-name {
    font-size: 28px;
    color: #7B7B7B;
    padding-left: 10px;
  }
}
.body {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
}
.body-wrapper {
  padding: 0 80px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 6%;
  z-index: 888;
}
.footer-menu {
  display: flex;
}
.footer-menu-item {
  margin-right: 100px;
  display: flex;
  align-items: center;
  &:last-child {
    margin-right: 0;
  }
  & span {
    font-size: 32px;
    color: #7B7B7B;
  }
}
.footer-menu-icon {
  margin-right: 20px;
  color: #fff;
  font-size: 34px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  background: rgba(255,255,255,0.20);
  text-align: center;
}
.card-group {
  margin-right: 10px;
}
.card-row {
  display: flex;
  &:last-child {
    margin-top: 10px;
  }
  &:first-child {
    margin-top: 0;
  }
}
.card-column {
  flex: 1;
  height: 320px;
  margin-right: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  &.selected:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    outline: 5px solid #d62034;
    z-index: 2;
  }
}
.card-column-content {
  position: absolute;
  text-align: center;
  user-select: none;
  p {
    font-size: 32px;
    color: #fff;
    line-height: 45px;
  }
  span {
    font-size: 20px;
    color: hsla(0,0%,100%,.8);
    line-height: 28px;
    margin-top: 7px;
  }
}
</style>
