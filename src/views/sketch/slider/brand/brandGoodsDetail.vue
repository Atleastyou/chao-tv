<template lang="pug">
  //- 商品详情
  transition(name="scale")
    infinite-scroll.good-detail(v-if="brandGoodsDetailShow", :loadMore="loadMore")
      .good-detail-close
        i.icon-close(@click="closeDetail")
      .good-detail-box.center
        .good-detail-btns
          .good-detail-btn(@click.stop="replaceImage(viewImg, good)") 替换
          .good-detail-btn(@click.stop="addImage(viewImg, good)") 添加
          .good-detail-btn(@click.stop="collectionGood(good)", :class="{ 'good-detail-btn_active' : good.is_collection }") {{good.is_collection ? '已收藏' : '收藏' }}
        .good-imgs-select
          .good-img-item(
            v-for="item in good.img"
            :class="{ 'img-select' : item === viewImg }"
            :style="{'background-image': `url(${item}?imageslim)`}"
            @click="changeImg(item)"
          )
        .good-detail-img(:id="good.goods_id" :style="{'background-image': `url(${viewImg}?imageslim)`}")
      .good-detail-box
        p.good-detail-name {{good.goods_name}}
        section.good-detail-section
          .cell.disabled
            span.cell-name 零售价
            span.cell-value
              span ￥
              span {{good.market_price}}
          .cell
            span.cell-name 会员价
            span.cell-value
              em
                span ￥
                span {{good.shop_price}}
        section.good-detail-section
          .cell
            span.cell-brand.cell-name 品牌
            span.cell-brand-value.cell-value {{good.brand}}
        section.good-detail-section
          .cell(v-for="item in good.attr")
            span.cell-name {{item.attr_name}}：
            span.cell-value {{item.attr_value}}
      .goods-recommend
        p.goods-title 品牌商品推荐
        .brand-cates(v-if="brandCates.length")
          .brand-cate(:class="{'active': !brandCate}" @click="selectBrandCate('')")
            touch-ripple(:speed="3", :opacity=".6")
              span 全部
          .brand-cate(v-for="item in brandCates" :class="{'active': brandCate === item.id}" @click="selectBrandCate(item.id)")
            touch-ripple(:speed="3", :opacity=".6")
              span {{item.name}}
        .goods-body(v-for="item in brandGoods" v-if="brandGoodsId !== item.goods_id")
          .good-item(@click="openGoodDetail(item.goods_id, item.key, 'brandGoods')", :key="item.goods_id")
            .good-btns
              .good-btn(@click.stop="replaceImage(item.original_img, item)") 替换
              .good-btn(@click.stop="addImage(item.original_img, item)") 添加
            .good-img(
              :style="{'background-image': `url(${item.original_img}?imageslim&imageView2/0/w/560)`}"
              :id="item.goods_id"
              source="brandGoods"
              type="good"
            )
            .good-cell
              .good-money-vip
                em ¥{{item.shop_price}}
                span 会员
              i.icon-collection_active(v-if="item.is_collection" @click.stop="collectionGood(item)")
              i.icon-collection(v-else @click.stop="collectionGood(item)")
            .good-money
              span 零售价
              em ¥{{item.market_price}}
            p.good-name {{item.goods_name}}
</template>

<script>
import infiniteScroll from '@/components/infiniteScroll'
import { searchSKU, skuInfo, unCollection, setCollection, getCategoryList } from 'api'
import { mapState, mapActions } from 'vuex'
import uuid from 'uuid/v4'
export default {
  name: 'goodDetail',
  data () {
    return {
      good: {}, // 商品详情
      viewImg: '',
      pageCode: 0,
      isLoading: false,
      isLoaded: false,
      brandCate: '',
      brandCates: [],
      brandGoods: []
    }
  },
  watch: {
    brandGoodsId (v) {
      if (v) this.getGoodDetail()
    }
  },
  methods: {
    ...mapActions([
      'changeBrandGoodsDetail',
      'changeSketchGoods',
      'updateHistory'
    ]),
    changeImg (img) {
      this.viewImg = img
    },
    selectBrandCate (id) {
      this.brandCate = id
      this.getBrandGoods(this.brandId)
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
    async getBrandCates (id) {
      try {
        const { data } = await this.$axios.get(getCategoryList, { params: { brand_id: id } })
        this.brandCates = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    replaceImage (url, item) {
      if (this.matrix.show) {
        this.$toast.message('请先取消变形')
        return
      }
      const _img = canvas.getActiveObjects()
      if (_img.length === 0) {
        this.$toast.message('请先选中被替换的单品')
        return
      }
      if (_img.length > 1) {
        this.$toast.message('只能替换单个商品')
        return
      }
      if (_img[0].type === 'i-text') {
        this.$toast.message('文本不能被替换')
        return
      }
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      canvas.getActiveObjects().forEach(o => {
        // 清楚实例的上下文后成功
        if (o.goods_id) this.changeSketchGoods({ type: 'remove', uid: o.uid })
        canvas.remove(o)
      })
      canvas.discardActiveObject().renderAll()
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        let scale = _img[0].scaleX * _img[0].width / img.width
        let setImg = {
          ..._img[0],
          width: img.width,
          height: img.height,
          scaleX: scale,
          scaleY: scale,
          _element: img._element,
          _originalElement: img._originalElement,
          goods_id: item.goods_id,
          goods_key: item.key,
          uid
        }
        img.set({...setImg})
        canvas.add(img)
        canvas.setActiveObject(img)
        this.changeSketchGoods({ type: 'set', good: { ...item, uid } })
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    addImage (url, item) { // 向画布添加图片
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        img.set({
          goods_id: item.goods_id,
          goods_key: item.key,
          left: 100,
          top: 100,
          uid
        })
        img.scaleToWidth(300)
        canvas.add(img)
        canvas.setActiveObject(img)
        this.changeSketchGoods({ type: 'set', good: { ...item, uid } })
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    async loadMore () {
      try {
        if (this.loading || this.isLoaded) return
        this.loading = true
        const { data } = await this.$axios.get(searchSKU, {
          params: {
            brand_id: this.good.brand_id,
            page_code: this.pageCode,
            category_id: this.brandCate
          }
        })
        this.pageCode = data.page_code
        this.brandGoods.push(...data.ls)
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.loading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getGoodDetail () { // 商品详情
      try {
        const { data } = await this.$axios.get(skuInfo, {
          params: {
            goods_id: this.brandGoodsId,
            key: this.brandGoodsKey
          }
        })
        this.getBrandGoods(data.brand_id)
        this.getBrandCates(data.brand_id)
        this.viewImg = data.img[0]
        this.good = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getBrandGoods (id) {
      try {
        const { data } = await this.$axios.get(searchSKU, { params: { brand_id: id, category_id: this.brandCate } })
        this.brandGoods = data.ls
        this.pageCode = data.page_code
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    openGoodDetail (id, key, dataSource) { // 显示详情页
      this.changeBrandGoodsDetail({ show: true, id, key, dataSource })
    },
    closeDetail () {
      this.changeBrandGoodsDetail({ show: false, id: null })
    }
  },
  created () {
    if (this.brandGoodsId) this.getGoodDetail()
  },
  computed: {
    ...mapState({
      brandGoodsDetailShow: state => state.sketch.brandGoodsDetail.show,
      brandGoodsId: state => state.sketch.brandGoodsDetail.id,
      brandGoodsKey: state => state.sketch.brandGoodsDetail.key,
      matrix: state => state.sketch.matrix
    })
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
}
.good-detail-close {
  font-size: 20px;
  color: #999;
  margin-bottom: 30px;
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
.good-detail-section {
  margin-top: 10px;
}
.cell {
  display: flex;
  line-height: 30px;
  font-size: 16px;
  &.disabled {
    .cell-name {
      color: #999999;
      text-decoration: line-through;
    }
    .cell-value {
      color: #999999;
      text-decoration: line-through;
    }
  }
}
.cell-name {
  display: inline-block;
  margin-right: 20px;
  min-width: 50px;
  color: #999999;
}
.cell-brand {
  width: 52px;
  height: 26px;
  line-height: 26px;
  color: #fff;
  text-align: center;
  background: #FF6C00;
  border-radius: 2px;
  border-radius: 2px;
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
.cell-brand-value {
  font-weight: 600;
}

.more-cates {
  margin-bottom: 30px;
  .article-title {
    padding: 0 5px;
    margin-bottom: 20px;
  }
  .cate-body {
    width: 33.3333%;
    height: 120px;
    padding: 0 5px 10px;
  }
  .more-cate-item {
    width: 100%;
    height: 100%;
    padding: 20px 0 0 20px;
    position: relative;
    background: #FFFFFF;
    border-radius: 4px;
    .v-touch-ripple {
      display: block;
      width: 100%;
      height: 100%;
    }
    .cate-content {
      font-size: 18px;
      color: #333333;
    }
    img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 88px;
      height: 88px;
    }
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
