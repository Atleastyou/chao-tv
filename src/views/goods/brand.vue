<template lang="pug">
.hot-goods
  .slidebar
    .brand
      img(:src="brand.logo" v-if="brand.logo")
      .brand-name(v-else) {{brand.name}}
    .search
      i.search-icon.icon-search
      input.search-input(placeholder="搜索" v-model="keyword" @input="search")
      .search-focus-line
      .search-line
    .menu
      router-link.menu-item(:to="{name: $route.name, query: {} }" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': !$route.query.sort}")
          font 默认
          i.menu-icon.icon-sort
      router-link.menu-item(:to="{name: $route.name, query: { sort: 'shop_price', sort_type: 'asc' }}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort_type === 'asc'}")
          font 价格从低到高
          i.menu-icon.icon-max-sort
      router-link.menu-item(:to="{name: $route.name, query: { sort: 'shop_price', sort_type: 'desc' }}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort_type === 'desc'}")
          font 价格从高到低
          i.menu-icon.icon-min-sort
      router-link.menu-item(:to="{name: $route.name, query: { sort: 'sales_sum'}}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort === 'sales_sum'}")
          font 销量
          i.menu-icon.icon-sales
      .menu-item(@click="showScreening")
        touch-ripple(:speed="2", :opacity=".5")
          font 筛选
          i.menu-icon.icon-filter
  infinite-scroll.goods(:loadMore="loadMore" ref="scroll")
    transition-group(tag="div" name="list")
      good-item(v-for="item in goods", :key="item.goods_id", :item="item")
    .goods-empty(v-if="!goods.length")
      img(src="../../static/images/search_img_notf_dis.png")
      p 未找到相关商品
</template>

<script>
import { brandGoods } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import goodItem from '@/components/goodItem'
import { mapActions } from 'vuex'
let timer
export default {
  name: 'brandGoods',
  data () {
    return {
      goods: [],
      brand: {},
      keyword: '',
      currentPage: 1,
      isLoading: false,
      isLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'changeScreening'
    ]),
    showScreening () {
      this.changeScreening({show: true, tagType: 'odd', brandId: this.$route.params.id})
    },
    async getGoodsList () {
      try {
        this.currentPage = 1
        this.isLoading = false
        this.isLoaded = false
        const { data } = await this.$axios.get(brandGoods, {
          params: {
            ...this.$route.query,
            brand_id: this.$route.params.id,
            page: this.currentPage,
            page_size: 12,
            keyword: this.keyword
          }
        })
        this.goods = data.goods
        this.brand = data.brand
        this.currentPage += 1
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(brandGoods, {
          params: {
            ...this.$route.query,
            brand_id: this.$route.params.id,
            page: this.currentPage,
            page_size: 12,
            keyword: this.keyword
          }
        })
        if (data.goods.length) {
          window.requestAnimationFrame(() => {
            this.goods.push(...data.goods)
          })
        }
        this.currentPage += 1
        if (!data.goods.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    search () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.getGoodsList()
      }, 300)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'brands' && vm.$route.meta.scrollTop) {
        vm.$refs.scroll.$el.scrollTop = vm.$route.meta.scrollTop
      } else {
        vm.getGoodsList()
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$refs.scroll.$el.scrollTop = 0
    this.getGoodsList()
  },
  beforeRouteLeave (to, from, next) {
    this.$route.meta.scrollTop = this.$refs.scroll.$el.scrollTop
    next()
  },
  components: {
    infiniteScroll,
    goodItem
  }
}
</script>

<style lang="scss" scoped>
.list-move {
  transition: all .5s;
}
.list-enter-active, .list-leave-active {
  transition: all .4s;
}
.list-enter {
  opacity: 0;
  transform: scale(0);
}
.list-leave {
  opacity: 0;
}
.hot-goods {
  background: rgb(37,36,41);
  height: 100%;
  display: flex;
  padding: 80px;
  padding-bottom: 0;
}
.slidebar {
  margin-right: 100px;
  width: 400px;
}
.brand {
  width: 100%;
  height: 194px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 4px;
  & img {
    height: 138px;
    vertical-align: middle;
  }
}
.search {
  padding-bottom: 23px;
  position: relative;
  margin-top: 60px;
}
.search-icon {
  position: absolute;
  left: 30px;
  top: 5px;
  font-size: 33px;
  color: #7B7B7B;
}
.search-input {
  color: #7B7B7B;
  background: none;
  font-size: 28px;
  padding: 0 20px 0 85px;
  width: 100%;
  caret-color: #fff;
  &:focus + .search-focus-line {
    transform: scaleX(1);
  }
}
.brand-name {
  width: 134px;
  text-align: center;
  font-size: 32px;
  color: #333333;
}
.search-line {
  height: 2px;
  background-color: #7B7B7B;
  left: 0;
  right: 0;
  bottom: -2px;
  position: absolute;
}
.search-focus-line {
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  transform: scaleX(0);
  transition: transform .45s cubic-bezier(.23,1,.32,1);
  background: #fff;
  z-index: 2;
}
.menu {
  margin-top: 60px;
  & .v-touch-ripple {
    width: 100%;
    height: 80px;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.active {
      color: #fff;
      background: #38363D;
      box-shadow: 0 10px 20px 0 rgba(0,0,0,0.30);
    }
  }
}
.menu-item {
  width: 100%;
  color: #7B7B7B;
  border-radius: 4px;
  & font {
    font-size: 28px;
  }
  & i {
    font-size: 25px;
    font-weight: 600;
  }
}

.goods {
  flex: 1;
  position: relative;
  padding-top: 8px;
}
.goods-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  & img {
    width: 480px;
  }
  & p {
    font-size: 28px;
    color: #7B7B7B;
    margin-top: 50px;
    text-align: center;
  }
}
</style>
