<template lang="pug">
.index
  header.header
    .header-name 组合购
  .container
    .sidebar
      p.sidebar-title 筛选条件：
      .filter
        p.filter-name 风格
        .filter-tags
          .filter-tag(:class="{'active': !$route.query.style}" @click="selectStyle('')")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span 全部
          .filter-tag(v-for="item in styles" :class="{'active': $route.query.style === item.name}" @click="selectStyle(item.name)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item.name}}
      .filter
        p.filter-name 标签
        .filter-tags
          .filter-tag(:class="{'active': !$route.query.tag}" @click="selectTag('')")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span 全部
          .filter-tag(v-for="item in tags" :class="{'active': $route.query.tag === item}" @click="selectTag(item)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item}}
    infiniteScroll(:loadMore="loadMore" ref="scroll")
      .join-shop
        p.join-shop-title 组合列表：
        .join-list
          router-link.card(v-for="item in list" :to="{name: 'joinShopDetail', params: { id: item.id }}")
            .card-title {{item.name}}
            .card-subtitle 共有{{item.goods_num}}款商品
            .card-preview
              .card-cover(v-if="item.img_url" :style="{'background-image': `url(${item.img_url})`}")
              .card-images
                .card-image(v-for="url,index in item.goods_img")
                  img(:src="url")
                  i.icon-add.iconfont(v-if="index + 1 !== item.goods_img.length")
            .card-desc {{item.brief_introduction}}
            .card-sub
              .card-price
                em ¥{{item.shop_price}}
                .disabled(v-if="item.hasDiscount") 进货价 ¥{{item.old_shop_price}}
              .card-btn(v-if="item.hasDiscount")
                span 组合立减
                em {{item.old_shop_price - item.shop_price}}元
                i.icon-right
              .card-btn(v-else)
                span 查看组合详情
        .empty(v-if="isEmpty")
          img(src="../../static/images/search_img_notf_dis.png")
          p 未找到相关案例
</template>

<script>
import { getStyleList, joinShopTagList, joinShopList } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
export default {
  name: 'joinShop',
  components: {
    infiniteScroll
  },
  data () {
    return {
      isEmpty: false,
      allLoaded: false,
      isLoading: false,
      list: [],
      currentPage: 1,
      styles: [],
      tags: []
    }
  },
  methods: {
    async loadMore () {
      try {
        if (this.isLoading || this.allLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(joinShopList, { params: { page: this.currentPage, ...this.$route.query } })
        data.list.forEach(item => {
          item.goods_img = item.img_url ? item.goods_img.splice(0, 2) : item.goods_img.splice(0, 3)
          item.hasDiscount = parseFloat(item.old_shop_price) > parseFloat(item.shop_price) // 是否有优惠
        })
        this.list.push(...data.list)
        if (this.list.length) this.currentPage += 1
        this.allLoaded = this.list.length >= data.total
        this.isEmpty = !this.list.length
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
  	async getJoinShopList () {
  		try {
        this.currentPage = 1
        const { data } = await this.$axios.get(joinShopList, { params: this.$route.query })
        data.list.forEach(item => {
          item.goods_img = item.img_url ? item.goods_img.splice(0, 2) : item.goods_img.splice(0, 3)
          item.hasDiscount = parseFloat(item.old_shop_price) > parseFloat(item.shop_price) // 是否有优惠
        })
        this.list = data.list
        if (this.list.length) this.currentPage += 1
        this.allLoaded = this.list.length >= data.total
      } catch ({msg}) {
        this.$toast.error(msg)
      }
    },
    selectStyle (style) {
      if (this.$route.query.style === style || !style) this.$router.replace({ name: this.$route.name, query: { tag: this.$route.query.tag } })
      else this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, style } })
    },
    selectTag (tag) {
      if (this.$route.query.tag === tag || !tag) this.$router.replace({ name: this.$route.name, query: { style: this.$route.query.style } })
      else this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, tag } })
    },
    getFilterQuery () {
      let query = {}
      if (this.activeStyle !== 0) query['style'] = this.styles[this.activeStyle].name
      if (this.activeTag !== -1) query['tag'] = this.tags[this.activeTag]
      return query
    },
    async getStyles () {
      try {
        const { data } = await this.$axios.get(getStyleList)
        this.styles = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getTagList() {
      try {
        const { data } = await this.$axios.get(joinShopTagList)
        this.tags = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getJoinShopList()
      vm.getStyles()
      vm.getTagList()
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$refs.scroll.$el.scrollTop = 0
    this.getJoinShopList()
  }
}
</script>

<style scoped lang="scss">
.index {
  padding-top: 100px;
  height: 100vh;
}
.header {
  width: 100%;
  height: 100px;
  position: fixed;
  left: 0;
  top: 0;
  background: #252429;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  .header-name {
    font-size: 28px;
    color: #FFFFFF;
    .icon-dpds {
      font-size: 40px;
      margin-right: 20px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle
    }
  }
  .header-btn {
    width: 160px;
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-size: 24px;
    color: #333333;
    background: #FFFFFF;
    border-radius: 4px;
  }
}
.container {
  padding-left: 600px;
  background: #38363D;
  height: 100%;
}
.sidebar {
  width: 600px;
  padding: 40px 80px;
  position: fixed;
  top: 100px;
  bottom: 0;
  left: 0;
  background: #38363D;
  .sidebar-title {
    line-height: 40px;
    font-size: 28px;
    color: #7B7B7B;
    letter-spacing: 0;
  }
}
.filter {
  margin-top: 40px;
  .filter-name {
    font-size: 24px;
    line-height: 33px;
    color: #7B7B7B;
  }
  .filter-tags {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-tag {
    min-width: 76px;
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    color: #666666;
    text-align: center;
    background: #fff;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    .v-touch-ripple {
      width: 100%;
      height: 100%;
      padding: 0 20px;
    }
    &.active {
      background: #FFBE28;
      color: #333333;
    }
  }
}
.join-shop {
  padding: 40px 0;
}
.join-shop-title {
  font-size: 28px;
  color: #7B7B7B;
  line-height: 40px;
}
.join-list {
  margin-top: 40px;
}
.card {
  color: #333;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 30px;
  margin-right: 20px;
  margin-bottom: 20px;
  width: 610px;
  display: inline-block;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.card-title {
  font-size: 24px;
  color: #333333;
  line-height: 33px;
  font-weight: 500;
}
.card-subtitle {
  font-size: 20px;
  color: #999999;
  margin-top: 10px;
  line-height: 28px;
}
.card-preview {
  height: 180px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.card-cover {
  border: 1px solid #efefef;
  flex: 0 0 180px;
  height: 180px;
  margin-right: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.card-images {
  min-height: 180px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-image {
  display: flex;
  align-items: center;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  img {
    max-height: 180px;
    max-width: 130px;
  }
  .icon-add {
    margin-left: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #999;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
  }
}
.card-desc {
  font-size: 20px;
  margin-top: 20px;
  line-height: 28px;
  color: #333;
}
.card-sub {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-price {
  height: 88px;
  display: flex;
  align-items: center;
  em {
    line-height: 33px;
    font-size: 24px;
    color: #C2212A;
    font-weight: 500;
  }
  .disabled {
    font-weight: 400;
    font-size: 18px;
    color: #999999;
    margin-left: 10px;
    text-decoration: line-through;
    line-height: 25px;
  }
}
.card-btn {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 48px;
  background: #333333;
  padding: 0 20px;
  font-size: 20px;
  color: #FFFFFF;
  em {
    font-size: 20px;
    color: #FFBE28;
    margin-left: 10px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .icon-right {
    margin-left: 20px;
    font-size: 16px;
  }
}

.empty {
  margin: 146px auto 0;
  text-align: center;
  font-size: 28px;
  color: #7b7b7b;
  p {
    margin-top: 50px;
  }
}
</style>
