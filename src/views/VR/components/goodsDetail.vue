<template lang="pug">
  //- 商品详情
  transition(name="scale")
    infinite-scroll.good-detail(v-show="show" :loadMore="loadMore" ref="goods")
      .back-top(v-if="showBackTop" @click="scrollToTop")
        i.icon-up-1
      .good-detail-close
        i.icon-close(@click="close")
      .good-detail-box.center
        //- .good-detail-btns
        //-   .good-detail-btn(@click.stop="collectionGood", :class="{ 'good-detail-btn_active' : goods.is_collection }") {{goods.is_collection ? '已收藏' : '收藏' }}
        .good-imgs-select
          .good-img-item(
            v-for="item in goods.all_img"
            :class="{ 'img-select' : item === viewImg }"
            :style="{'background-image': `url(${item}?imageslim)`}"
            @click="changeViewImage(item)"
          )
        .good-detail-img(:style="{'background-image': `url(${viewImg}?imageslim)`}")
      .good-detail-box
        p.good-detail-name {{goods.goods_name}}
        p.good-detail-price {{goods.shop_price}}
        section.good-detail-section
          .cell(v-for="item in goods.attr")
            span.cell-name {{item.attr_name}}：
            span.cell-value {{item.attr_value}}
      .goods-recommend
        p.goods-title 同款推荐
        .goods-list
          .goods-body(v-for="item in recommend")
            .good-item(@click="open(item)")
              .good-img(:style="{'background-image': `url(${item.original_img})`}")
              .good-cell
                .good-money-vip
                  em ¥{{item.shop_price}}
                //- i.icon-collection_active(v-if="item.is_collection" @click.stop="collectionGood(item)")
                //- i.icon-collection(v-else @click.stop="collectionGood(item)")
              p.good-name {{item.goods_name}}
</template>

<script>
import infiniteScroll from '@/components/infiniteScroll'
import { searchGoods, skuInfo, unCollection, setCollection } from 'api'
export default {
  name: 'goodsDetail',
  data () {
    return {
      show: false,
      markerId: '',
      goods: {}, // 商品详情
      goodsId: '',
      goodsSKU: '',
      viewImg: '',
      recommend: [],
      pageCode: 0,
      isLoading: false,
      isLoaded: false,
      showBackTop: false
    }
  },
  methods: {
    changeViewImage (item) {
      this.viewImg = img
    },
    async collectionGood (item) {
      try {
        const { is_collection, goods_id } = item
        if (is_collection) {
          await this.$axios.get(unCollection, {
            params: { goods_id }
          })
        } else {
          await this.$axios.get(setCollection, {
            params: { goods_id }
          })
        }
        this.$set(item, 'is_collection', !is_collection)
      } catch ({msg}) {
        this.$toast.error(msg)
      }
    },
    async getRecommend () {
      try {
        const { data } = await this.$axios.get(searchGoods, {
          params: {
            shop_cid: this.goods.shop_cid,
            page_code: 0,
            page_size: 10
          }
        })
        this.recommend = data.ls
        this.pageCode = data.page_code
        this.isLoaded = !data.ls.length
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.loading || this.isLoaded) return
        this.loading = true
        const { data } = await this.$axios.get(searchGoods, {
          params: {
            shop_cid: this.goods.shop_cid,
            page_code: this.pageCode,
            page_size: 10
          }
        })
        this.pageCode = data.page_code
        this.recommend.push(...data.ls)
        this.isLoaded = !data.ls.length
        this.loading = false
      } catch ({ msg }) {
        this.$toast.error(msg)
        this.loading = false
      }
    },
    async getGoodDetail () { // 商品详情
      try {
        const { data } = await this.$axios.get(skuInfo, {
          params: {
            goods_id: this.goodsId,
            key: this.goodsSKU
          }
        })
        this.viewImg = data.all_img[0]
        this.goods = data
        this.getRecommend()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    unSelectMarker (id) {
      if (!id) return
      const selectedMark = PSV.plugins.markers.markers[id]
      if (!selectedMark) return
      let update = {}
      switch (selectedMark.data.type) {
        case 'goods' :
          update = { image: selectedMark.data.icon.normal }
          break
        case 'transition' :
          update = { html: `<img src="${selectedMark.data.icon.normal}" style="width: 50px; height: 50px;" /><p style="margin-top:10px">${selectedMark.data.title}</p>` }
          break
      }
      let image = new Image()
      image.src = selectedMark.data.icon.normal
      image.onload = () => {
        PSV.plugins.markers.updateMarker({ id, selected: false, ...update })
      }
    },
    open ({ key, goods_id }, markerId = '') { // 显示详情页
      if (this.markerId !== markerId) this.unSelectMarker(this.markerId)
      this.markerId = markerId
      this.goodsId = goods_id
      this.goodsSKU = key
      this.getGoodDetail()
      this.show = true
      this.scrollToTop()
    },
    close () {
      this.show = false
    },
    watchScroller () {
      const scroller = this.$refs.goods.$el
      scroller.addEventListener('scroll', () => {
        const { scrollTop, offsetHeight } = this.$refs.goods.$el
        this.showBackTop = scrollTop >= offsetHeight * 2 // 滚动大于两屏时，显示返回顶部
      })
    },
    scrollToTop () {
      const scroller = this.$refs.goods.$el
      scroller.scrollTop = 0
    }
  },
  mounted () {
    this.watchScroller()
  },
  components: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
.scale-enter-active, .scale-leave-active{
  transition: transform 0.3s ease
}
.scale-enter, .scale-leave-active {
  transform: scale(0);
  opacity: 0.3;
}

.good-detail {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #38363D;
  padding: 30px 20px;
}
.back-top {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.80);
  box-shadow: 0 6px 14px 0 rgba(30,32,32,0.14);
  transition: transform .3s;
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  &:active {
    transform: scale(1.2);
  }
  & i {
    font-size: 36px;
  }
}
.good-detail-close {
  font-size: 20px;
  color: #999;
  margin-bottom: 30px;
}
.good-detail-box {
  width: 100%;
  background: #FFFFFF;
  border-radius: 4px;
  position: relative;
  padding: 20px;
  margin-bottom: 10px;
}
.center {
  display: flex;
}
.good-detail-btns {
  position: absolute;
  right: 0;
  top: 20px;
}
.good-detail-btn {
  width: 70px;
  height: 35px;
  line-height: 35px;
  margin-right: 30px;
  margin-bottom: 20px;
  text-align: center;
  background: #38363D;
  border-radius: 2px;
  font-size: 18px;
  color: #FFFFFF;
  &.good-detail-btn_active {
    background: #ddd;
    font-size: 16px;
    color: #999;
  }
}
.good-detail-img {
  width: 320px;
  height: 320px;
  background: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  transition: all .3s;
  & img {
    max-width: 100%;
    max-height: 100%;
  }
}
.good-imgs-select {
  height: 320px;
  margin: 0 28px 0 13px;
  overflow-y: auto;
  .good-img-item {
    width: 64px;
    height: 64px;
    padding: 1px;
    margin-bottom: 10px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    &:last-child {
      margin-bottom: 0;
    }
    &.img-select {
      padding: 0;
      border: 2px solid #333333;
    }
  }
}
.good-detail-name {
  font-size: 20px;
  color: #333333;
  line-height: 37px;
}
.good-detail-price {
  font-size: 30px;
  color: #B10000;
  text-align: left;
  line-height: 42px;
  margin-top: 20px;
}
.good-detail-section {
  margin-top: 10px;
}

.cell {
  display: flex;
  line-height: 30px;
  font-size: 16px;
}
.cell-name {
  display: inline-block;
  margin-right: 20px;
  min-width: 50px;
  color: #999999;
}
.cell-value {
  display: inline-block;
  color: #151515;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  em {
    color: #C2212A;
  }
}

.goods-recommend {
  margin-top: 40px;
}
.goods-title {
  padding: 0 5px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #7B7B7B;
}
.brand-cates {
  margin-bottom: 30px;
  padding: 0 5px;
  .brand-cate {
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-block;
    vertical-align: top;
    &.active {
      span {
        background: #FFBE28;
      }
    }
    span {
      display: inline-block;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 0 20px;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      color: #666666;
    }
  }
}
.goods-body {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
  padding: 0 5px 10px;
  box-sizing: border-box;
}
.good-item {
  background: #fff;
  width: 100%;
  border-radius: 2px;
  padding: 14px;
  vertical-align: top;
  position: relative;
}

.good-btns {
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 100;
}
.good-btn {
  display: inline-block;
  width: 60px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #38363D;
  border-radius: 2px;
  font-size: 18px;
  color: #FFFFFF;
  margin-right: 10px;
}
.good-img {
  background-color: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 247px;
}
.good-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  i {
    font-size: 26px;
  }
  .icon-collection {
    color: #999
  }
  .icon-collection_active {
    color: #FF4F00
  }
}
.good-money-vip {
  & em {
    font-size: 24px;
    color: #C2212A;
    vertical-align: middle;
  }
  & span {
    display: inline-block;
    background: #C2212A;
    border-radius: 2px;
    width: 34px;
    height: 20px;
    padding: 0 3px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin-left: 6px;
    vertical-align: middle;
  }
}
.good-money {
  font-size: 16px;
  color: #FF6C00;
  margin-top: 2px;
  & span {
    margin-right: 5px;
  }
}
.good-name {
  height: 48px;
  margin-top: 5px;
  font-size: 16px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
