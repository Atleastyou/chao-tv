<template lang="pug">
  .goods-list
    goods-detail(ref="goodsDetail")
    .scene(v-for="scene in scenesGoods" v-if="scene.list.length")
      p.scene-title {{scene.title}}
      .scene-goods
        .goods(v-for="item in scene.list")
          .goods-container(@click="openDetail(item, item.markerId)")
            .goods-cover(:style="{'background-image': `url(${item.original_img})`}")
            .goods-price {{item.shop_price}}
            .goods-title {{item.goods_name}}
</template>
<script>
import goodsDetail from './goodsDetail'
export default {
  name: 'goodsList',
  props: {
    scenes: Array
  },
  data () {
    return {
      scenesGoods: []
    }
  },
  components: {
    goodsDetail
  },
  watch: {
    scenes (val) {
      this.scenesGoods = val.map(item => {
        return {
          id: item.id,
          title: item.title,
          list: (item.config.markers || []).filter(item => item.data.type === 'goods').map(item => {
            return {
              markerId: item.id,
              ...item.data.goods
            }
          })
        }
      })
    }
  },
  methods: {
    filterGoods (markers) {
      return markers.filter(item => item.data.type === 'goods')
    },
    openDetail (goods, markerId) {
      this.$refs.goodsDetail.open(goods, markerId)
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-list {
  width: 568px;
  height: 100%;
  overflow-y: auto;
  background: #333;
  padding: 30px 0;
}
.scene {
  padding: 0 10px;
  margin-bottom: 30px;
}
.scene-title {
  font-size: 24px;
  color: #FFFFFF;
  line-height: 33px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}
.scene-goods {
  margin-top: 16px;
}
.goods {
  display: inline-block;
  vertical-align: top;
  width: 50%;
  padding: 10px;
}
.goods-container {
  background: #fff;
  padding: 10px;
}
.goods-cover {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
}
.goods-price {
  font-size: 20px;
  color: #B10000;
  margin-top: 20px;
  line-height: 28px;
}
.goods-title {
  font-size: 14px;
  color: #333333;
  margin-top: 10px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


