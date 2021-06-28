<template lang="pug">
.sketch-goods
  .sketch-goods-back(@click="back" v-show="$route.query.style_words || $route.query.space_words")
    .iconfont.icon-back-1
    .detail-header-title 返回
  .sketch-goods-header
    //- 搜索栏
    .search
      .search-icon.icon-search
      input.search-input(placeholder="请输入搜索内容" v-model="keyword")
      .search-clear(v-if="keyword" @click="clearKeyword")
        .icon-close
    //- 打开筛选栏
    //- .filter(@click="showScreening")
    //-   .icon-filter
    //-   p 筛选
  .sketch-container
    //- 标签筛选
    .entry-wrapper
      .article
        p.article-title 品类
        .article-container
          .cate(
            v-for="cate in cates"
            :style="{ background: cate.backgroundColor }"
            @click="selectCate(cate)"
          )
            touch-ripple(:speed="3", :opacity=".6")
              img(:src="cate.backgroundImage")
              .cate-content {{cate.name}}
      .article
        p.article-title 风格
        .article-container
          .tag(v-for="item in styleList" @click="setStyle(item.name)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item.name}}
      .article
        p.article-title 空间
        .article-container
          .tag(v-for="item in spaceList" @click="setSpace(item.name)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item.name}}
    //- 搜索到的商品列表
    transition(name="mask")
      good-list(v-if="goodListShow" :keyword="keyword" @setKeyword="setKeyword")
  //- 商品详情
  good-detail
</template>

<script>
import { mapState, mapActions } from 'vuex'
import goodList from './goodList.vue'
import goodDetail from './goodDetail.vue'
export default {
  name: 'sketchGoods',
  data () {
    return {
      cates: [
        { 
          name: '灯饰',
          backgroundColor: '#5080C6',
          query: { category_id: '1' },
          backgroundImage: require('../../../../static/images/dp_denghi.png')
        }, {
          name: '家具',
          backgroundColor: '#32A25C',
          query: { category_id: '2' },
          backgroundImage: require('../../../../static/images/dp_jiaji.png')
        }, {
          name: '装饰画',
          backgroundColor: '#5080C6',
          query: { category_id: '18' },
          backgroundImage: require('../../../../static/images/dp_huayi.png')
        }, {
          name: '布艺家纺',
          backgroundColor: '#6A4DC9',
          query: { category_id: '19' },
          backgroundImage: require('../../../../static/images/dp_buyijiafang.png')
        }, {
          name: '饰品',
          backgroundColor: '#D87808',
          query: { category_id: '23' },
          backgroundImage: require('../../../../static/images/dp_shipin.png')
        }, {
          name: '日用品',
          backgroundColor: '#6A4DC9',
          query: { category_id: '113' },
          backgroundImage: require('../../../../static/images/dp_riyongpin.png')
        }
      ],
      keyword: ''
    }
  },
  watch: {
    randomCate (v) {
      if (v) {
        this.keyword = v
        this.changeRandomCate('')
      }
    },
    screeningConfirmed (v) {
      if (v) {
        this.keyword = ''
        this.changeScreeningConfirm({ confirmed: false })
      }
    }
  },
  methods: {
    ...mapActions([
      'changeRandomCate',
      // 'changeSketchScreening',
      'changeScreeningConfirm'
    ]),
    back () {
      this.$router.replace({ name: this.$route.name })
    },
    selectCate (cate) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, ...cate.query } })
    },
    // showScreening () {
    //   this.changeSketchScreening({show: true})
    // },
    setStyle (name) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, style_words: name } })
    },
    setSpace (name) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, space_words: name } })
    },
    setKeyword (v) { // 赋值关键词以触发watch
      this.goodsList = []
      this.keyword = v
    },
    clearKeyword () {
      this.goodsList = []
      this.keyword = ''
    }
  },
  computed: {
    ...mapState({
      randomCate: state => state.sketch.randomCate,
      styleList: state => state.sketch.styleList,
      spaceList: state => state.sketch.spaceList,
      screeningConfirmed: state => state.sketch.screeningConfirm.confirmed
    }),
    goodListShow () {
      const { style_words = '', space_words = '', category_id = '' } = this.$route.query
      return !!(this.keyword || style_words || space_words || category_id)
    }
  },
  components: {
    goodList,
    goodDetail
  }
}
</script>

<style lang="scss" scoped>
.mask-enter-active, .mask-leave-active{
  transition-duration: .3s;
  transition-property: transform, opacity;
}
.mask-enter, .mask-leave-active {
  transform: translate3d(-100%, 0, 0)!important;
  opacity: 0.3!important;
}
.sketch-goods-back {
  display: flex;
  align-items: center;
  padding: 4px 4px 30px;
  .iconfont {
    font-size: 20px;
    color: #999;
  }
  .icon-back-1 {
    margin-right: 20px;
  }
  .detail-header-title {
    font-size: 24px;
    color: #999999;
  }
}
.sketch-goods {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .sketch-goods-header {
    display: flex;
    padding: 2px 5px;
  }
  .search {
    flex: 1;
    position: relative;
    height: 70px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    overflow: hidden;
    .search-icon {
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 33px;
      color: #999;
    }
    .search-input {
      width: 100%;
      height: 100%;
      padding-left: 84px;
      padding-right: 60px;
      font-size: 20px;
    }
    .search-clear {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 35px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background: #000;
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
    }
  }
  .filter {
    text-align: center;
    font-size: 20px;
    color: #fff;
    margin-left: 20px;
    .icon-filter {
      font-size: 30px;
      margin-bottom: 10px;
    }
  }
  .sketch-container {
    height: 810px;
    padding: 0 4px;
    margin-top: 40px;
    transition: opacity .3s;
    overflow-x: hidden;
    position: relative;
  }
  .article {
    margin-top: 40px;
    &:first-child {
      margin-top: 0;
    }
  }
  .article-title {
    font-size: 24px;
    color: #7B7B7B;
    line-height: 33px;
  }
  .article-container {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }
}
.cate {
  flex-shrink: 0;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  width: 32%;
  margin-right: 2%;
  margin-bottom: 2%;
  .v-touch-ripple {
    display: block;
    width: 100%;
    height: 100%;
  }
  &:nth-child(3n) {
    margin-right: 0;
  }
  & img {
    display: block;
    width: 100%;
  }
  .cate-content {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: 18px;
    color: #FFFFFF;
  }
}
.tag {
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
}
</style>
