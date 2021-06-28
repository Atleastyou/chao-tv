<template lang="pug">
.index
  shopping-cart-header(title="订单提交成功")
  .index-wrapper
    .cell-group
      .cell
        p.cell-title
          span 线下支付：
          span ¥{{$route.query.offline_amount}}
        .cell-value(style="color: #09BB07;")
          span 提单成功
          i.icon-success-1
      .cell
        p.cell-title
          span 在线支付：
          span ¥{{$route.query.amount}}
        .cell-value(style="color: #FF6C00")
          span 未支付
          i.icon-warning-1
    .tips
      p 到店支付商品，请联系商店客服支付！
      p 部分商品需要在线支付，请尽快支付！
    .pay
      c-button(type="primary" size="medium" @click="pay") 去支付 ¥{{$route.query.amount}}
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
export default {
  name: 'confirmOrderList',
  data () {
    return {}
  },
  methods: {
    pay () {
      this.$router.replace({ name: 'pay', query: this.$route.query })
    }
  },
  components: {
    shoppingCartHeader
  }
}
</script>

<style lang="scss" scoped>
.index {
  padding-top: 140px;
  text-align: center;
}
.index-wrapper {
  display: inline-block;
}
.cell-group {
  margin-top: 60px;
}
.cell {
  width: 1140px;
  height: 125px;
  background: #fff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  .cell-title {
    font-size: 32px;
    span:first-child {
      margin-right: 20px;
    }
  }
  .cell-value {
    font-size: 26px;
    i {
      font-size: 30px;
      margin-left: 20px;
    }
  }
}
.tips {
  margin-top: 40px;
  line-height: 40px;
  font-size: 28px;
  color: #000000;
  p:last-child {
    color: #FF6C00
  }
}
.pay {
  width: 520px;
  margin: 40px auto 0;
}
</style>
