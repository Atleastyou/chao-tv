<template lang="pug">
.index(style="background-image: url(https://static.chaodp.com/designerTv/TV_bg.png?imageslim&imageView2/0/w/1920);")
  staff-list
  header.header
    .header-left
      .shop
        img.shop-logo(:src="index_page_logo")
        .shop-wrapper
          .shop-title 您好，欢迎光临！
          .shop-number 智慧门店No.0136
    .header-right
      .menu
        .menu-item 首页
        router-link.menu-item(:to="{name: 'category'}") 分类
        router-link.menu-item(:to="{name: 'sketch'}") 搭配大师
      .search
        img.search-icon(src="https://static.chaodp.com/designerTv/search.png?imageslim")
        input.search-input(placeholder="品牌、产品、分类" v-model="search_words" @keyup.enter="search")
  .body
    .body-wrapper
      .card-row(v-for="row, rowIndex in config")
        router-link.card(
          v-for="item, itemIndex in row"
          :style="item.style"
          :key="itemIndex"
          :to="{ name: item.routeName, query: item.routeQuery }"
        )
          img(v-if="clientWidth >= 3840", :src="`https://static.chaodp.com/designerTv/4K${item.cover}?imageslim`") 
          img(v-else-if="clientWidth <= 1366", :src="`https://static.chaodp.com/designerTv/gq${item.cover}?imageslim`")
          img(v-else :src="`https://static.chaodp.com/designerTv/${item.cover}?imageslim`")
  footer.footer
    .footer-left(@click="showList")
      .waiter
        img.waiter-photo(:src="`${staff.header}?imageslim`")
        .waiter-wrapper
          .waiter-title
            .waiter-name {{staff.name}}
            .waiter-identity(v-if="staff.job") {{staff.job}}
          .waiter-subtitle {{staff.info}}
    .footer-right
      .menu
        router-link.menu-item(:to="{name: 'collection', query: { good_type: 'collection' }}")
          .menu-icon(style="background-image: linear-gradient(-180deg, #E578FF 0%, #7358FF 100%);")
            i.icon-sc
          span 收藏
        router-link.menu-item(:to="{name: 'shopping'}")
          .menu-icon
            i.icon-gwc
          span 购物车
        router-link.menu-item(:to="{name: 'unpaidOrder'}")
          .menu-icon
            i.icon-qd
          span 待支付
        router-link.menu-item(:to="{name: 'system'}")
          .menu-icon
            i.icon-sz
          span 设置
      .slot(v-if="show_shop_qrcode")
        span.app-name 查看线上商城
        i.icon-qrcode(@click="showQrcode")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import staffList from '@/components/staffList'
export default {
  name: 'index',
  data () {
    return {
      config: [
        [
          { cover: 'rm.png', routeName: 'hotGoods', routeQuery: {good_type: 'explosive'}, style: {width: '31.5625rem', marginLeft: '-1.875rem'} },
          { cover: 'VR.png', routeName: 'VRList', routeQuery: {}, style: {width: '29.6875rem'} },
          { cover: 'dpds.png', routeName: 'sketch', routeQuery: {}, style: {width: '29.6875rem'} }
        ],
        [
          { cover: 'ppzq.png', routeName: 'brands', routeQuery: {}, style: {width: '21.9rem'} },
          { cover: 'mdjx.png', routeName: 'hotGoods', routeQuery: {is_recommend: 1}, style: {width: '21.9rem'} },
          { cover: 'cztc.png', routeName: 'joinShop', routeQuery: {}, style: {width: '21.9rem'} },
          { cover: 'yysj.png', routeName: 'security', routeQuery: {}, style: {width: '21.9rem'} }
        ]
      ],
      clientWidth: 0,
      search_words: ''
    }
  },
  components: {
    staffList
  },
  computed: {
    ...mapState({
      showNewTheme: state => state.user.showNewTheme,
      staff: state => state.ui.staff,
      index_page_logo: state => state.user.logo.index_page_logo,
      show_shop_qrcode: state => state.user.logo.show_shop_qrcode,
    })
  },
  methods: {
    ...mapActions([
      'changeQrcode',
      'changeStaff'
    ]),
    showList () {
      this.changeStaff({ show: true })
    },
    showQrcode () {
      this.changeQrcode({ show: true })
    },
    search () {
      this.$router.push({ name: 'hotGoods', query: { search_words: this.search_words } })
    },
    setHtmlFontSize() {
      const scale = document.documentElement.clientWidth / 1920
      // document.documentElement.style.fontSize = `37.5px`
      document.documentElement.style.fontSize = `${19.2 * Math.min(scale, 2)}px`
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.setHtmlFontSize()
      vm.clientWidth = document.documentElement.clientWidth
    })
  }
}
</script>

<style lang="scss" scoped>
.index {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
  background-color: #28003C;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4.16667rem;
  position: fixed;
  left: 0;
  right: 0;
  top: 4.6875rem;
  z-index: 888;
}
.header-left, .header-right {
  display: flex;
  align-items: center;
}
.shop {
  display: flex;
  align-items: center;
}
.shop-wrapper {
  margin-left: 1.04167rem;
  padding-left: 1.04167rem;
  border-left: 0.15625rem dashed #fff;
}
.shop-title {
  font-size: 1.45833rem;
  color: #FFFFFF;
  line-height: 2.08333rem;
  font-weight: 500;
}
.shop-number {
  font-size: 1.14583rem;
  color: #FFFFFF;
  line-height: 1.5625rem;
}
.menu {
  display: flex;
}
.menu-item {
  font-size: 1.45833rem;
  color: #fff;
  margin-right: 2.60417rem;
  line-height: 2.08333rem;
  &:last-child {
    margin-right: 0;
  }
}
.search {
  margin-left: 2.60417rem;
  width: 22.13542rem;
  height: 4.16667rem;
  background: rgba(255,255,255,0.40);
  box-shadow: inset 0 0 0.15625rem 0 rgba(255,255,255,0.50);
  border-radius: 5.20833rem 0 0 5.20833rem;
  position: relative;
}
.search-icon {
  width: 2.55208rem;
  position: absolute;
  left: 1.35417rem;
  top: 50%;
  transform: translateY(-50%);
}
.search-input {
  width: 100%;
  height: 100%;
  padding: 0 1.35417rem;
  background: none;
  padding-left: 5.625rem;
  font-size: 1.25rem;
  color: #FFFFFF;
}
.body {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body-wrapper {
  padding: 0 4.16667rem;
  white-space: nowrap;
}
.card-row {
  margin-top: 1.30208rem;
  display: flex;
  justify-content: space-between;
  &:first-child {
    margin-top: 0;
  }
  .card {
    margin-right: 1.30208rem;
    &:last-child {
      margin-right: 0;
    }
    img {
      width: 100%;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4.16667rem;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 2.60417rem;
  z-index: 888;
}
.footer-left, .footer-right {
  display: flex;
  align-items: center;
}
.waiter {
  display: flex;
  align-items: center;
}
.waiter-photo {
  width: 4.94792rem;
  height: 4.94792rem;
  border-radius: 50%;
  margin-right: 1.04167rem;
}
.waiter-title {
  display: flex;
  align-items: center;
}
.waiter-name {
  font-size: 1.45833rem;
  color: #FFFFFF;
  font-weight: 500;
  margin-right: 1.04167rem;
}
.waiter-identity {
  height: 1.5625rem;
  line-height: 1.5625rem;
  padding: 0 0.72917rem;
  font-size: 1.04167rem;
  color: #FFFFFF;
  background-image: linear-gradient(-180deg, #E578FF 0%, #7358FF 100%);
  border-radius: 0.20833rem;
}
.waiter-subtitle {
  margin-top: 0.3125rem;
  font-size: 1.14583rem;
  color: #FFFFFF;
}
.waiter-placeholder {
  line-height: 40px;
  font-size: 28px;
  color: #FFFFFF;
  letter-spacing: 0;
}

.menu {
  display: flex;
}
.menu-item {
  margin-right: 2.60417rem;
  display: flex;
  align-items: center;
  &:last-child {
    margin-right: 0;
  }
  & span {
    font-size: 1.45833rem;
    color: #fff;
  }
}
.menu-icon {
  margin-right: 1.04167rem;
  color: #fff;
  font-size: 1.97917rem;
  border-radius: 50%;
  width: 4.42708rem;
  height: 4.42708rem;
  line-height: 4.42708rem;
  background: rgba(255,255,255,0.40);
  text-align: center;
}
.slot {
  display: flex;
  align-items: center;
  margin-left: 5.20833rem;
  & .icon-qrcode {
    margin-left: 1.04167rem;
    color: #fff;
    font-size: 2.60417rem;
  }
  & .app-name {
    font-size: 1.45833rem;
    color: #fff;
    padding-left: 0.52083rem;
  }
}
</style>
