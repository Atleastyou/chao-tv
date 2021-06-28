<template lang="pug">
.good
  .good-inner
    img.good-hot(v-if="good.is_explosive && hotShow" src="../static/images/baokuan02.png")
    .good-warpper.swiper-vertical
      .swiper-wrapper
        .swiper-slide
          .good-imgs.swiper-horizontal
            .swiper-wrapper
              .swiper-slide(v-for="item in viewImgs")
                .good-img-box
                  .good-img(v-loadingImage="item")
            .prev(@click="changeSwiper")
              touch-ripple(:speed="2", :opacity=".5")
                .icon-left
            .next(@click="changeSwiper")
              touch-ripple(:speed="2", :opacity=".5")
                .icon-right
          .good-handle
            span 向上滑动查看产品详情
            i.icon-back
            .good-num
        .swiper-slide
          .good-scroller(ref="scroller")
            .join(v-if="good.combination.list.length")
              .good-header 组合购
              .join-tabs
                .join-tab(v-for="i,index in good.combination.list.length" :class="{'active': joinShopActive === index}" @click="switchJoin(index)") 组合{{i}}
              .join-swiper
                .swiper-wrapper
                  router-link.join-item.swiper-slide(tag="div" v-for="item in good.combination.list" :to="{name: 'joinShopDetail', params: { id: item.id }}")
                    .join-item-title {{item.name}}
                    .join-item-total 共有{{item.goods_num}}款商品
                    .join-item-preview
                      .join-item-cover(v-if="item.img_url" :style="{'background-image': `url(${item.img_url})`}")
                      .join-item-images
                        .join-item-image(v-for="url,index in item.goods_img")
                          img(:src="url")
                          i.icon-add(v-if="index + 1 !== item.goods_img.length")
                    .join-item-sub
                      .join-item-desc {{item.brief_introduction}}
                      .join-item-sub-wrapper
                        .join-item-price
                          em ¥{{item.hasDiscount ? item.shop_price : item.old_shop_price}}
                          span(v-if="item.hasDiscount") 进货价 ¥{{item.old_shop_price}}
                        .join-item-tag(v-if="item.hasDiscount")
                          span 组合立减
                          em {{item.preferential_amount}}元
                          .icon-more
                        .join-item-tag(v-else)
                          span 查看组合详情
                          .icon-more
            .good-detail
              .good-header 商品详情
              .good-container
                .good-brand 品牌：{{good.brand_info.name}}
                .good-attr
                  p.good-attr-title 产品参数
                  .good-attr-list
                    .good-attr-item(v-for="item in good.attr")
                      .good-attr-name {{item.attr_name}}：
                      .good-attr-value {{item.attr_value}}
                    .good-attr-item
                      .good-attr-name 风格：
                      .good-attr-value
                        span(v-for="item in good.style") {{item}}
                    .good-attr-item
                      .good-attr-name 空间：
                      .good-attr-value
                        span(v-for="item in good.space") {{item}}
                .good-explain
                  template(v-for="item in good.goods_content")
                    p(v-if="item.type === 'text'") {{item.content}}
                    img(v-if="item.type === 'image'", :src="item.content")
                    video(v-if="item.type === 'video'", :src="item.content" controls preload)
  .good-panel(ref="panel")
    .good-name {{good.goods_name}}
    .good-price
      .good-price-wrapper
        span 零售价  ¥{{price.marketPrice}}
        //- router-link(:to="{name: 'sketch', query: { add: good.goods_id }}") 搭配大师
        .good-price-item
          .good-price-collection(@click="collection(good.goods_id)")
            .good-price-item_icon(:class="good.is_collection == 0 ? 'icon-collection' : 'icon-collection_active'")
            .good-price-item_text 收藏
          .good-price-item_right(v-if="showSketch")
          router-link.good-price-collection(v-if="showSketch" :to="{name: 'edit', query: { add: good.goods_id, key: key }}")
            .good-price-item_icon.icon-dpds
            .good-price-item_text 搭配大师
      .good-price-vip(:style="{'margin-top': good.is_explosive ? '-10px' : '10px'}")
        .good-price-vip-item
          em ¥{{price.shopPrice}}
          .good-price-tag {{good.is_explosive ? '特价爆款' : '会员价'}}
      .good-stepper(v-if="good.is_explosive")
        .stepper
          .stepper-line(:style="{'width': good.progress + '%'}")
        span.good-stepper-text 已抢{{good.progress}}%
    .good-sku
      .good-sku-item
        .good-sku-title 品牌
        .good-sku-wrapper
          .good-brand
            span.good-brand-name {{good.brand_info.name}}
            router-link.good-brand-link(:to="{name: 'brandGoods', params: {id: good.brand_info.id}}")
              span 去逛逛
              i.icon-right
      .good-sku-item(v-for="sku, index in good.spec")
        .good-sku-title {{sku.name}}
        .good-sku-wrapper
          .sku-select(v-for="spec in sku.spec_item", :class="{'active': sku.activeId === spec.id}", @click="selectSpec(spec, index)")
            .sku-select-img(v-if="spec.src", :style="{'background-image': `url(${spec.src}?imageslim)`}")
            span {{spec.item}}
      .good-sku-item
        .good-sku-title 数量
        .good-sku-wrapper
          .input-number(:class="{'is-disabled': isDisabled}")
            .input-number__decrease(@click="decrease")
              i -
            .input-number__increase(@click="increase")
              i +
            input.input-number-main(v-model="goods_num" @blur="blurInput")
          span.good-sku-num 件 (库存{{price.storeCount}}件)
      .good-sku-item
        .good-sku-title 生产期
        .good-sku-wrapper
          .good-price-vip-type {{good.delivery_type}}
    .good-handles
      c-button(type="danger", :disabled="!price.storeCount" @click="buy") 立即购买
      c-button(type="darkred", :disabled="!price.storeCount" @click="addGoodByCart") 加入购物车
</template>

<script>
import { goodInfo, buyNow, cartAdd, payAddOrder, setCollection, unCollection } from 'api'
let horizontalSwiper = null
let joinSwiper = null
export default {
  name: 'goodDetail',
  data () {
    return {
      hotShow: true,
      joinShopActive: 0,
      good: {
        combination: {
          list: []
        },
        brand_info: {}
      },
      viewImgs: [],
      isDisabled: false,
      goods_num: 1,
      specKeys: [],
      key: '',
      price: {
        marketPrice: '',
        shopPrice: '',
        sellingPrice: '',
        storeCount: 1
      },
      showSketch: false
    }
  },
  methods: {
    switchJoin (index) {
      joinSwiper.slideTo(index)
    },
    async addGoodByCart () {
      try {
        if (!this.key) {
          this.$toast.error('请先选择要购买的规格！')
          return
        }
        if (this.specKeys.length === this.good.spec.length) {
          const { msg } = await this.$axios.post(cartAdd, { goods_id: this.$route.params.id, goods_num: this.goods_num, key: this.key })
          this.$toast.success(msg)
        } else {
          this.$toast.error('请先选择商品品类！')
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async collection (id) {
      try {
        if (this.good.is_collection === 1) {
          await this.$axios.post(unCollection, { goods_id: id })
          this.good.is_collection = 0
          this.$toast.success('取消收藏成功')
        } else {
          await this.$axios.post(setCollection, { goods_id: id })
          this.good.is_collection = 1
          this.$toast.success('收藏成功')
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    buy () {
      if (!this.key) {
        this.$toast.error('请先选择要购买的规格！')
        return
      }
      this.$router.push({ name: 'confirmOrder', query: { from: 'buyNow', goods_id: this.$route.params.id, goods_num: this.goods_num, key: this.key } })
    },
    async getGoodsInfo () {
      try {
        const { data } = await this.$axios.get(goodInfo, {
          params: {
            goods_id: this.$route.params.id
          }
        })
        this.specKeys.length = data.spec.length
        this.price.marketPrice = data.market_price
        this.price.shopPrice = data.shop_price
        this.price.storeCount = data.store_count
        if (data.spec.length > 0) {
          data.spec.forEach(item => {
            item.activeId = ''
          })
        }
        this.viewImgs = data.img
        this.copyViewImgs = JSON.parse(JSON.stringify(data.img))
        // 兼容combination有内容与为空时，数据结构不一致的问题
        if (data.combination.length === undefined && typeof data.combination === 'object') {
          data.combination.list.forEach(item => {
            item.goods_img = item.img_url ? item.goods_img.splice(0, 2) : item.goods_img.splice(0, 3)
            item.hasDiscount = parseFloat(item.old_shop_price) > parseFloat(item.shop_price) // 是否有优惠
          })
        } else {
          data.combination = {
            total: 0,
            list: []
          }
        }
        this.good = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectSpec (row, index) {
      try {
        this.good.spec.map(item => item.spec_item.map(v => {
          if (row.id === v.id) {
            item.activeId = row.id
          }
        }))
        this.specKeys.splice(index, 1, row.id)
        if (this.specKeys.length === this.good.spec.length) {
          this.key = Array.from(new Set(this.specKeys)).sort((a, b) => { return a - b }).join('_')
          let newPrice = this.good.spec_value[this.key]
          if (newPrice) {
            this.price.marketPrice = newPrice.market_price
            this.price.shopPrice = newPrice.shop_price
            this.price.sellingPrice = newPrice.selling_price
            this.price.storeCount = newPrice.store_count
            if (newPrice.spec_img) {
              this.showSketch = true
              this.viewImgs.splice(0, 1, newPrice.spec_img)
              horizontalSwiper.slideTo(0)
              horizontalSwiper.update()
            } else {
              this.showSketch = false
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 查找选择后价格发生变化的数据
    changePrice (data) {
      if (this.specKeys.length === data.spec.length) {
        this.key = Array.from(new Set(this.specKeys)).sort((a, b) => { return a - b }).join('_')
        let newPrice = data.spec_value[this.key]
        if (newPrice) {
          this.price.marketPrice = newPrice.market_price
          this.price.shopPrice = newPrice.shop_price
          this.price.sellingPrice = newPrice.selling_price
          this.price.storeCount = newPrice.store_count
          if (newPrice.spec_img) this.showSketch = true
          else this.showSketch = false
        }
      }
    },
    decrease () {
      if (Number(this.goods_num) === 1) {
        this.isDisabled = true
        return
      }
      this.goods_num--
    },
    increase () {
      if (this.goods_num >= this.price.storeCount) {
        this.isDisabled = true
        return
      }
      this.goods_num++
    },
    blurInput () {
      if (this.goods_num > this.price.storeCount) {
        this.goods_num = this.price.storeCount
      } else if (this.goods_num <= 1) {
        this.goods_num = 1
      }
    },
    initSwiper () {
      let verticalSwiper = new Swiper('.swiper-vertical', {
        direction: 'vertical',
        loop: false,
        // allowTouchMove: true,
        onSetTransition: (swiper) => {
          if (verticalSwiper.activeIndex == 1) {
            this.hotShow = false
            swiper.params.onlyExternal = true
            swiper.disableMousewheelControl()
            if (!this.$refs.scroller.scrollTop) this.$refs.scroller.scrollTop = 1
          } else {
            this.hotShow = true
            swiper.params.onlyExternal = false
            swiper.enableMousewheelControl()
          }
        }
      })
      this.$refs.scroller.addEventListener('scroll', e => {
        const { scrollHeight, scrollTop, offsetHeight } = this.$refs.scroller
        if (scrollTop <= 0) {
          verticalSwiper.params.onlyExternal = false
          verticalSwiper.enableMousewheelControl()
        }
      })
    },
    changeSwiper () {
      this.viewImgs = this.copyViewImgs
      horizontalSwiper.update()
    },
    newInitSwiper () {
      horizontalSwiper = new Swiper('.swiper-horizontal', {
        loop: false,
        nextButton: '.next',
        prevButton: '.prev',
        pagination: '.good-num',
        paginationType: 'fraction',
        observer: true,
        updateOnImagesReady: true
      })
    },
    initJoinSwiper () {
      joinSwiper = new Swiper('.join-swiper', {
        paginationType: 'fraction',
        observer: true,
        updateOnImagesReady: true,
        onSlideChangeEnd: () => {
          this.joinShopActive = joinSwiper.activeIndex
        }
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.initSwiper()
      this.initJoinSwiper()
      this.newInitSwiper()
    }, 1000)
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      await vm.getGoodsInfo()
    })
  }
}
</script>

<style lang="scss" scoped>
.prev,
.next {
  width: 70px;
  height: 70px;
  line-height: 70px;
  border-radius: 50%;
  text-align: center;
  font-size: 26px;
  color: #fff;
  background: rgba(0,0,0,0.30);
  position: absolute;
  top: 50%;
  margin-top: -70px;
  z-index: 11;
}
.prev .v-touch-ripple,
.next .v-touch-ripple {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.good-img-box {
  width: 100%;
  height: 100%;
  padding: 100px;
}
.prev {
  left: 20px;
}
.next {
  right: 20px;
}
.good {
  background: rgb(37,36,41);
  height: 100%;
  display: flex;
}
.good-inner {
  margin-top: 80px;
  margin-left: 80px;
  width: 1000px;
  height: calc(100% - 80px);
  position: relative;
}
.good-warpper {
  background: #fff;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.swiper-wrapper {
  position: relative;
}
.good-hot {
  position: absolute;
  right: -16px;
  top: -16px;
  z-index: 99;
}
.good-imgs {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.good-img {
  width: 100%;
  height: 100%;
  background: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.good-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 15px;
  height: 100px;
  line-height: 100px;
  font-size: 22px;
  color: #FFFFFF;
  text-align: center;
  background-image: linear-gradient(0deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,0) 100%);
  z-index: 22;
  & i {
    font-size: 30px;
    margin-left: 20px;
    transform: rotate(90deg);
    vertical-align: middle;
  }
}
.good-detail {
  height: 100%;
}
.good-scroller {
  overflow-y: auto;
  height: 100%;
  -webkit-overflow-scrolling: touch
}
.join-tabs {
  display: flex;
  align-items: center;
  padding: 30px 30px 0;
}
.join-tab {
  font-size: 20px;
  padding-bottom: 4px;
  border-bottom: 4px solid transparent;
  color: #999999;
  margin-right: 60px;
  &.active {
    font-weight: 500;
    color: #333333;
    border-bottom: 4px solid #FFBE28;
  }
}
.join-swiper {
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
  background: #fff;
}
.join-item {
  padding: 40px 30px;
}
.join-item-title {
  width: 550px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24px;
  color: #333333;
  font-weight: 500;
  line-height: 33px;
}
.join-item-total {
  margin-top: 10px;
  font-size: 20px;
  color: #999999;
  line-height: 28px;
}
.join-item-preview {
  height: 180px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.join-item-cover {
  border: 1px solid #efefef;
  flex: 0 0 180px;
  height: 180px;
  margin-right: 40px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.join-item-images {
  height: 180px;
  flex: 1;
  display: flex;
  align-items: center;
}
.join-item-image {
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
.join-item-sub {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.join-item-sub-wrapper {
  position: relative;
}
.join-item-price {
  position: absolute;
  left: 0;
  top: -53px;
  em {
    font-size: 24px;
    line-height: 33px;
    color: #C2212A;
    vertical-align: middle;
  }
  span {
    margin-left: 10px;
    font-size: 18px;
    color: #999999;
    text-decoration: line-through;
    vertical-align: middle;
  }
}
.join-item-desc {
  width: 550px;
  margin-right: 60px;
  font-size: 20px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.join-item-tag {
  height: 48px;
  background: #333333;
  border-radius: 4px;
  padding: 0 20px;
  font-size: 20px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  em {
    color: #FFBE28;
    margin-left: 10px;
  }
  .icon-more {
    margin-top: 4px;
    margin-left: 20px;
    font-size: 17px;
  }
}

.good-header {
  height: 73px;
  line-height: 73px;
  background: #EFEFEF;
  box-shadow: 0 1px 0 0 #DDDDDD;
  font-size: 24px;
  color: #333333;
  padding: 0 30px;
}
.good-container {
  padding: 30px;
}
.good-brand {
  font-size: 18px;
  color: #333333;
}
.good-attr {
  margin-top: 20px;
}
.good-attr-title {
  font-size: 18px;
  color: #999999;
}
.good-attr-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.good-attr-item {
  line-height: 30px;
  display: flex;
  font-size: 18px;
  width: 50%;
  vertical-align: top;
}
.good-price-item_right {
  height: 40px;
  border-left: 1px solid #7b7b7b;
}
.good-attr-name {
  min-width: 90px;
  color: #999999;
  margin-right: 10px;
}
.good-attr-value {
  word-break: break-all;
  flex: 1;
}
.good-explain {
  padding: 60px 0;
  text-align: center;
  white-space: pre-wrap;
  & p,video {
    margin-bottom: 20px;
  }
  & img {
    display: block;
    margin: 0 auto;
  }
}
.good-panel {
  flex: 1;
  height: 100%;
  padding: 80px;
  position: relative;
}
.good-name {
  font-size: 28px;
  color: #FFFFFF;
  line-height: 40px;
}
.good-price {
  margin-top: 30px;
  padding: 20px;
  background: #38363D;
  box-shadow: 0 10px 20px 0 rgba(0,0,0,0.20);
  border-radius: 2px;
}
.good-price-wrapper {
  display: flex;
  justify-content: space-between;
  & span {
    font-size: 24px;
    color: #7B7B7B;
    text-decoration: line-through;
  }
  & a {
    color: #C2212A;
    font-size: 18px;
    & i {
      margin-left: 10px;
    }
  }
}
.good-price-vip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -15px;
  font-size: 42px;
  color: #FF6C00;
  height: 60px;
  line-height: 60px;
  & em {
    margin-right: 30px;
    vertical-align: middle;
  }
}
.good-price-vip-type {
  font-size: 18px;
  color: #7B7B7B;
}
.good-price-vip-item {
  height: 60px;
  overflow: hidden;
}
.good-price-tag {
  display: inline-block;
  width: 84px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  border-radius: 2px;
  background: #FF6C00;
  position: relative;
  vertical-align: middle;
  &:after {
    content: '';
    border: 10px solid #FF6C00;
    position: absolute;
    left: -10px;
    bottom: -10px;
    transform: rotate(45deg);
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
}
.good-stepper {
  margin-top: 25px;
  display: flex;
  align-items: center;
  .good-stepper-text {
    font-size: 18px;
    color: #FFFFFF;
    margin-left: 20px;
  }
}
.stepper {
  height: 16px;
  width: 260px;
  border: 1px solid #C2212A;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  .stepper-line {
    width: 0;
    height: 100%;
    background: #C2212A;
    transition: width .5s;
  }
}
.good-sku {
  margin-top: 30px;
  height: 570px;
  overflow-y: auto;
}
.good-sku-item {
  margin-bottom: 30px;
  display: flex;
}
.good-sku-title {
  line-height: 50px;
  font-size: 20px;
  color: #7B7B7B;
  min-width: 120px;
  text-align: left;
}
.good-sku-wrapper {
  flex: 1;
  line-height: 50px;
}
.good-brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  .good-brand-name {
    font-size: 20px;
  }
  .good-brand-link {
    font-size: 18px;
    color: #FFFFFF;
    .icon-right {
      font-size: 20px;
      margin-left: 10px;
    }
  }
}
.sku-select {
  font-size: 18px;
  color: #7B7B7B;
  border: 1px solid #7B7B7B;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  max-width: 600px;
  height: 50px;
  line-height: 50px;
  padding: 0 6px;
  display: inline-block;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
  &.active {
    border-color: #C2212a;
    color: #fff;
  }
}
.sku-select-img {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff;
}

.input-number {
  position: relative;
  display: inline-block;
  width: 153px;
  line-height: 40px;
}
.input-number__decrease, .input-number__increase {
  text-align: center;
  color: #fff;
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: 0px;
  width: 40px;
  height: 100%;
  font-size: 26px;
}
.input-number__decrease {
  left: 1px;
  border-radius: 4px 0 0 4px;
  border-right: 1px solid #7B7B7B;
  color: #7b7b7b;

}
.input-number__increase {
  right: 1px;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #7B7B7B;
  color: #ddd;
}
.input-number-main {
  background-color: transparent;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #7B7B7B;
  box-sizing: border-box;
  color: #fff;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  padding-left: 32px;
  padding-right: 32px;
  &:focus {
    border-color: #409eff;
  }
}
.good-price-item {
  display: flex;
  align-items: center;
  & .good-price-collection {
    padding: 0 20px;
    color: #DDDDDD;
    font-size: 18px;
    text-align: center;
    .good-price-item_icon {
      color: #fff;
      font-size: 26px;
      vertical-align: bottom;
      &.icon-collection_active {
        color: #FF4F00;
      }
    }
    .good-price-item_text {
      line-height: 25px;
      margin-top: 10px;
    }
  }
}
.input-number.is-disabled .input-number__decrease, .input-number.is-disabled .input-number__increase {
  border-color: #e4e7ed;
  color: #e4e7ed;
}
// .input-number.is-disabled .input-number-main {
//   background-color: #f5f7fa;
//   border-color: #e4e7ed;
//   color: #c0c4cc;
//   cursor: not-allowed;
// }
.good-sku-num {
  margin-left: 10px;
  font-size: 16px;
  color: #BBBBBB;
}
.good-handles {
  display: flex;
  position: absolute;
  left: 80px;
  right: 80px;
  bottom: 80px;
  & .c-button:first-child {
    margin-right: 20px;
  }
}
.good-num {
  position: absolute;
  text-align: right;
  padding-right: 20px;
  bottom: -15px;
  z-index: 33;
  font-size: 36px;
  color: #FFFFFF;
}
</style>
