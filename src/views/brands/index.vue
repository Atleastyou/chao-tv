<template lang="pug">
.brands
  header.header
    .header-menu
      router-link.header-menu-item(:to="{name: 'index'}") 首页
      router-link.header-menu-item(:to="{name: 'category'}") 分类
      router-link.header-menu-item(:to="{name: 'hotGoods', query: { brand_id: '', good_type: 'hot' }}") 热销商品
      router-link.header-menu-item.active(:to="{name: 'brands'}") 精选品牌
      router-link.header-menu-item(:to="{name: 'sketch'}") 搭配大师
    .header-slot
      img.app-logo(:src="brand_page_logo")
      span.app-name 软装优品直供商城
  .brands-content
    infinite-scroll.brands-list(:loadMore="loadMore" ref="scroll")
      .brands-item(v-for="item in brands" v-if="item.goods && item.goods.length")
        .brands-item-banner
          .brands-logo
            .brands-item-logo(v-if="item.brand.logo", :style="{'background-image': `url(${item.brand.logo}?imageslim&imageView2/0/w/268)`}")
            .brands-item-logo.brands-item-name(v-else) {{item.brand.name}}
          router-link.brands-item-link(:to="{name: 'brandGoods', params: {id: item.brand.id}}")
            span 进入品牌馆
        .brands-item-goods
          router-link.good-item(v-for="good in item.goods", :to="{name: 'goodDetail', params: {id: good.goods_id}}" :key="good.goods_id")
            .good-img(:style="{'background-image': `url(${good.original_img}?imageslim&imageView2/0/w/464)`}")
            .good-money-vip
              em ¥{{good.shop_price}}
              span 会员
            .good-money
              span 零售价
              em ¥{{good.market_price}}
            p.good-name {{good.goods_name}}
</template>

<script>
import { hotBrand } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import { mapState } from 'vuex'
export default {
  name: 'brands',
  data () {
    return {
      brands: [],
      currentPage: 1,
      isLoading: false,
      isLoaded: false
    }
  },
  computed: {
    ...mapState({
      brand_page_logo: state => state.user.logo.brand_page_logo
    })
  },
  methods: {
    async getHotBrand () {
      try {
        this.currentPage = 1
        this.isLoading = false
        this.isLoaded = false
        const { data } = await this.$axios.get(hotBrand)
        this.brands = data.list
        this.currentPage += 1
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(hotBrand, {
          params: {
            page: this.currentPage
          }
        })
        if (data.list.length) {
          window.requestAnimationFrame(() => {
            this.brands.push(...data.list)
          })
        }
        this.currentPage += 1
        if (!data.list.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.meta.scrollTop) {
        vm.$refs.scroll.$el.scrollTop = vm.$route.meta.scrollTop
      } else {
        vm.getHotBrand()
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$refs.scroll.$el.scrollTop = 0
    this.getHotBrand()
  },
  beforeRouteLeave (to, from, next) {
    this.$route.meta.scrollTop = this.$refs.scroll.$el.scrollTop
    next()
  },
  components: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
.brands {
  // background-image: url('../../static/images/rxspbj.jpg');
  height: 100%;
  padding: 0 80px;
  background: #252429;
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
  & .app-logo {
    margin-right: 20px;
  }
  & .app-name {
    font-size: 28px;
    color: #7B7B7B;
    padding-left: 20px;
    border-left: 3px solid #7B7B7B;
  }
}
.brands-content {
  height: 100%;
  padding-top: 204px;
}
.brands-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.brands-left .brands-text {
  margin-top: 20px;
  text-align: left;
}
.brands-banner {
  width: 136px;
  height: 174px;
  text-align: center;
  font-size: 48px;
  color: #FFFFFF;
  border: 1px solid #FFFFFF;
  border-radius: 1px;
  padding: 15px;
}
.brands-text {
  font-size: 24px;
  color: #FFFFFF;
  line-height: 33px;
}
.brands-logo {
  height: 134px;
  width: 134px;
  margin: 63px auto;
}
.brands-right .brands-text {
  text-align: right;
}
.brands-right-line {
  width: 30px;
  height: 6px;
  background: #fff;
  display: inline-block;
}
.brands-item {
  display: inline-block;
  vertical-align: top;
  width: 49.5%;
  margin-right: 1%;
  margin-bottom: 20px;
  position: relative;
  &:nth-child(2n + 2) {
    margin-right: 0;
  }
}
.brands-item-name {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #333333;
}
.brands-item-banner {
  width: 224px;
  height: 100%;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: #FFFFFF;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
}
.brands-item-logo {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.brands-item-link {
  display: inline-block;
  width: 120px;
  height: 36px;
  line-height: 34px;
  margin-top: 49px;
  text-align: center;
  border: 1px solid #C2212A;
  border-radius: 2.45px;
  font-size: 14px;
  color: #C2212A;
  & span:after {
    content: '';
    margin-left: 6px;
    border: 6px solid transparent;
    display: inline-block;
    vertical-align: middle;
    border-left-color: #C2212A;
  }
}
.brands-item-goods {
  width: 100%;
  height: 100%;
  padding: 10px;
  padding-left: 234px;
  background: #DDDDDD;
  border-radius: 4px;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.brands-item-goods::-webkit-scrollbar {/*滚动条整体样式*/
    height: 0px;
}
.good-item {
  margin-right: 10px;
  background: #fff;
  width: 260px;
  height: 394px;
  border-radius: 2px;
  display: inline-block;
  padding: 14px;
  vertical-align: top;
  &:last-child {
    margin-right: 0;
  }
}
.good-img {
  background-color: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 232px;
  height: 232px;
}
.good-money-vip {
  margin-top: 14px;
  & em {
    font-size: 24px;
    color: #C2212A;
    line-height: 20px;
    vertical-align: middle;
  }
  & span {
    display: inline-block;
    background: #c2212a;
    border-radius: 2px;
    width: 34px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin-left: 13px;
    vertical-align: middle;
  }
}
.good-money {
  font-size: 10px;
  color: #FF6C00;
  margin: 5px 0 10px;
  font-size: 16px;
  & span {
    margin-right: 5px;
  }
}
.good-name {
  margin-top: 5px;
  font-size: 16px;
  color: #333333;
  white-space: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
