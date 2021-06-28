<template lang="pug">
.good-item(@click="toDetail(item.goods_id)")
  img.good-hot(v-if="item.is_explosive" src="../static/images/baokuan01.png")
  .good-item-btns
    .good-item-btn(v-if="collection" @click.stop="cancelCollection(item.goods_id)") 取消收藏
  .good-img(v-lazy:background-image="`${item.original_img}?imageslim&imageView2/0/w/560`")
  .good-money-vip
    em ¥{{item.shop_price}}
    span 会员
  .good-money
    span 零售价
    em ¥{{item.market_price}}
  p.good-name {{item.goods_name}}
</template>

<script>
export default {
  name: 'goodItem',
  props: {
    item: Object,
    collection: Boolean
  },
  methods: {
    toDetail (id) {
      this.$router.push({ name: 'goodDetail', params: { id: id } })
    },
    cancelCollection (id) {
      this.$emit('cancel', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.good-item {
  position: relative;
  margin-right: 1%;
  margin-bottom: 20px;
  background: #fff;
  width: 24.25%;
  height: 434px;
  border-radius: 4px;
  display: inline-block;
  padding: 14px;
  vertical-align: top;
  &:nth-child(4n + 4) {
    margin-right: 0;
  }
}
.good-img {
  background-color: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 272px;
}
.good-hot {
  position: absolute;
  right: -7px;
  top: -7px;
  z-index: 99;
}
.good-money-vip {
  margin-top: 14px;
  & em {
    font-size: 24px;
    color: #C2212A;
    line-height: 33px;
    vertical-align: middle;
  }
  & span {
    display: inline-block;
    background: #C2212A;
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
  font-size: 16px;
  color: #FF6C00;
  line-height: 22px;
  margin-top: 5px;
  & span {
    margin-right: 10px;
  }
}
.good-name {
  margin-top: 10px;
  line-height: 22px;
  font-size: 16px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.good-item-btns {
  position: absolute;
  top: 14px;
  right: 14px;
  & .good-item-btn {
      display: inline-block;
      padding: 5px 0;
      width: 92px;
      text-align: center;
      background: #ddd;
      border-radius: 2px;
      font-size: 18px;
      color: #666;
  }
}
</style>
