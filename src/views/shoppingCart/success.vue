<template lang="pug">
.index
  shopping-cart-header(title="订单提交成功")
  i.icon-success
  p.title 订单提交成功
  p.subtitle 店铺客服将会尽快联系你完成线下支付！
  .back-home
    c-button(type="primary" @click="backHome") 返回首页
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
export default {
  name: 'success',
  methods: {
    backHome () {
      this.$router.replace({name: 'index'})
    }
  },
  components: {
    shoppingCartHeader
  }
}
</script>

<style lang="scss" scoped>
.index {
  text-align: center;
  padding-top: 140px;
}
.icon-success {
  margin-top: 160px;
  font-size: 120px;
  color: #09BB07
}
.title {
  font-size: 36px;
  margin-top: 40px;
  line-height: 50px;
}
.subtitle {
  font-size: 28px;
  margin-top: 18px;
  line-height: 40px;
}
.back-home {
  width: 300px;
  margin: 122px auto 0;
}
</style>
