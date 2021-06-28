<template lang="pug">
.cart-header
  .cart-header-left
    .cart-header-title {{title}}
    .cart-header-count(v-if="count") 共{{count}}件商品
  .cart-header-right(v-if="isShowBtn")
    c-button(:type="buttonType" @click="click") {{btnValue}}
  .cart-header-right(v-if="isDeleteOrder")
    c-button(:type="buttonType" @click="click") 删除订单
</template>

<script>
export default {
  name: 'shoppingCardHeader',
  props: {
    title: String,
    btnValue: {
      type: String,
      default: ''
    },
    count: {
      type: [String, Number],
      default: ''
    },
    isDeleteOrder: {
      type: Boolean,
      default: false
    },
    buttonType: {
      validator: function (value) {
      	return ['primary', 'info', 'danger'].indexOf(value) !== -1 || !value
      }
    },
    isShowBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.cart-header {
  position: fixed;
  display: flex;
  width: 100%;
  height: 140px;
  padding: 30px 80px;
  align-items: center;
  z-index: 999;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: 0 5px 20px 0 rgba(30,32,32,0.10);
  top: 0;
  left: 0;
}
.cart-header-left {
  display: flex;
  align-items: flex-end;
}
.cart-header-title {
  font-size: 48px;
  color: #333333;
}
.cart-header-count {
  margin-left: 20px;
  font-size: 28px;
  color: #999999;
}
</style>
