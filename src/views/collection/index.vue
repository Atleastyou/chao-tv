<template lang="pug">
.hot-goods
  .slidebar
    .search
      i.search-icon.icon-search
      input.search-input(placeholder="搜索" v-model="search_words")
      .search-focus-line
      .search-line
    .menu
      router-link.menu-item(:to="{name: $route.name, query: { ...$route.query, sort: '', sort_type: '', brand_id: '' } }" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': !$route.query.sort}")
          font 默认
          i.menu-icon.icon-sort
      router-link.menu-item(:to="{name: $route.name, query: { ...$route.query, sort: 'shop_price', sort_type: 'asc', brand_id: '' }}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort_type === 'asc'}")
          font 价格从低到高
          i.menu-icon.icon-max-sort
      router-link.menu-item(:to="{name: $route.name, query: { ...$route.query, sort: 'shop_price', sort_type: 'desc', brand_id: '' }}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort_type === 'desc'}")
          font 价格从高到低
          i.menu-icon.icon-min-sort
      router-link.menu-item(:to="{name: $route.name, query: { ...$route.query, sort_type: '', sort: 'time', brand_id: '' }}" replace)
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': $route.query.sort === 'time'}")
          font 新品
          i.menu-icon.icon-sales
  infinite-scroll.goods(:loadMore="loadMore" ref="scroll")
    good-item(v-for="(item,index) in goods", :item="item", :key="item.goods_id" collection @cancel="cancel")
    .goods-empty(v-if="!goods.length")
      img(src="../../static/images/search_img_notf_dis.png")
      p 您还没有收藏商品哦!
</template>

<script>
import { hotGoods, getGoodsList, searchGoods, getStyleList, getSpaceList, getCategoryList, getCategoryAndSon, unCollection } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import goodItem from '@/components/goodItem'
let timer
export default {
  name: 'collection',
  data () {
    return {
      goods: [],
      search_words: '',
      pageSize: 20,
      pageCode: '',
      isLoading: false,
      isLoaded: false,
      parentCategory: [],
      secondCategory: [],
      second_id: '',
      threeCategory: [],
      three_id: '',
      tagList: [
        {
          label: '风格',
          tags: []
        }, {
          label: '空间',
          tags: []
        }
      ]
    }
  },
  watch: {
    search_words (value) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$refs.scroll.$el.scrollTop = 0
        this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, search_words: value } })
      }, 300)
    }
  },
  methods: {
    async getGoodsList () {
      try {
        this.currentPage = 1
        this.isLoading = false
        this.isLoaded = false
        const { data } = await this.$axios.get(searchGoods, {
          params: {
            ...this.$route.query,
            page_size: this.pageSize
          }
        })
        this.pageCode = data.page_code
        this.goods = data.ls
        this.currentPage += 1
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async cancel (id) {
      try {
        await this.$axios.post(unCollection, { goods_id: id })
        this.$toast.success('取消成功')
        this.getGoodsList()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(searchGoods, {
          params: {
            ...this.$route.query,
            page_size: this.pageSize,
            page_code: this.pageCode
          }
        })
        window.requestAnimationFrame(() => {
          this.goods.push(...data.ls)
        })
        this.pageCode = data.page_code
        if (!data.ls.length) this.isLoaded = true
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
      if (vm.$route.meta.scrollTop && from.name === 'goodDetail') {
        vm.$refs.scroll.$el.scrollTop = vm.$route.meta.scrollTop
      } else {
        vm.goods = []
        vm.search_words = to.query.search_words
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
.search {
  padding-bottom: 23px;
  position: relative;
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
    border-radius: 4px;
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
