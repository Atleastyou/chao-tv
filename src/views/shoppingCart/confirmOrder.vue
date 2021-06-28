<template lang="pug">
.confirm-order
  shopping-cart-header(:title="title")
  .order-container(v-if="goods.list.length")
    .order-list
      .order-item(
        v-for="item in goods.list"
      )
        shopping-goods(:item="item" isPrice isPurchase)
    .order-select
      .order-select-header
        .order-select-title 订单信息
        .order-select-address(@click="toNewAddress")
          .order-address-left
            .icon-address
            .order-address-text(v-if="!address.consignee") 新建地址
            .order-address-text(v-else)
              .order-address-info
                .order-address-consignee {{address.consignee}}
                .order-address-mobile {{address.mobile}}
              .order-address-area {{address.area}} {{address.address}}
          .icon-more
      .order-select-content
        .order-price
          .order-price-item
            .price-item-label 合计：
            .price-item-value &#165 {{goods.total_money}}
          .order-price-item
            .price-item-label 应付金额：
            .price-item-value &#165 {{goods.pay_amount}}
        .order-button
          c-button(type="primary" @click="submit") 提交订单
  .order-bg(v-else)
    img(src="../../static/images/search_img_shopping_dis.png")
    .order-bg-text 订单是空的
  delete-popover
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import shoppingGoods from '@/components/shoppingGoods'
import deletePopover from '@/components/modal/deletePopover'
import { confirmOrder, payAddOrder, getPayQrcode, buyNow, getsketchBuyList, joinShopConfirmOrderDetail } from 'api'
export default {
  name: 'confirmOrder',
  data () {
    return {
      title: '确认订单',
      goods: {
        list: []
      },
      address: {}
    }
  },
  computed: {
    allChecked () {
      let num = 0
      this.goods.forEach(item => {
        if (item.isChecked) num++
      })
      if (num === this.goods.length) return true
      else return false
    }
  },
  components: {
    shoppingCartHeader,
    shoppingGoods,
    deletePopover
  },
  methods: {
    async getJoinShopConfirmOrderDetail () {
      try {
        const { data } = await this.$axios.get(joinShopConfirmOrderDetail, { params: this.$route.query })
        this.goods = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getBuyNowList () {
      try {
        const { data } = await this.$axios.get(buyNow, { params: { ...this.$route.query } })
        this.goods = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getList () {
      try {
        const { data } = await this.$axios.get(confirmOrder)
        this.goods = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getSketchBuyList () {
      try {
        const { data } = await this.$axios.get(getsketchBuyList, { params: { token: this.$route.query.token } })
        this.goods = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async submit () {
      let orderType = 1
      if (this.$route.query.from === 'buyNow') {
        orderType = 2
      } else if (this.$route.query.from === 'sketch') {
        orderType = 4
      } else if (this.$route.query.from === 'joinShop') {
        orderType = 7
      } else {
        orderType = 1
      }
      try {
        if (!this.address.consignee || !this.address.mobile || !this.address.area || !this.address.address) {
          this.$toast.error('请先填写收货地址！')
          return
        }
        let querData = { ...this.address }
        if (this.$route.query.from === 'joinShop') querData['order_token'] = this.$route.query.token
        if (this.$route.query.from === 'sketch') {
          querData.goods = this.goods.list
        }
        const { data } = await this.$axios.post(payAddOrder, { order_type: orderType, ...querData })
        this.$router.push({ name: 'confirmOrderList', query: data })
        const hasOffline = data.amount && data.offline_amount // 包含线下
        const allOffline = !data.amount && data.offline_amount // 全部线下
        const allOnline = data.amount && !data.offline_amount // 全部线上
        if (allOnline) {
          this.$router.replace({ name: 'pay', query: data })
        } else if (allOffline) {
          this.$router.replace({ name: 'submitOrderSuccess'})
        } else if (hasOffline) {
          this.$router.replace({ name: 'confirmOrderList', query: data })
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
        let routeName = 'shoppingCart'
        if (orderType === 2) {
          routeName = 'goodDetail'
        } else if (orderType === 4) {
          routeName = 'edit'
        }
        this.$router.push({ name: routeName, params: { id: this.$route.query.goods_id } })
      }
    },
    toNewAddress () {
      this.$router.push({ name: 'address', query: { ...this.address, ...this.$route.query } })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.address = {}
      if (to.query.from === 'buyNow') {
        vm.getBuyNowList()
      } else if (to.query.from === 'sketch') {
        vm.getSketchBuyList()
      } else if (to.query.from === 'joinShop') {
        vm.getJoinShopConfirmOrderDetail()
      } else {
        vm.getList()
      }
      if (to.query.consignee) {
        vm.address = to.query
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.confirm-order {
  height: 100%;
}
.order {
  height: 100%;
}
.order-container {
  display: flex;
  height: 100%;
  padding: 140px 80px 20px;
}
.order-item {
  position: relative;
  width: 1140px;
  height: 280px;
  margin-bottom: 20px;
}
.order-list {
  height: 100%;
  width: 1140px;
  padding: 40px 0 140px;
  overflow-y: auto;
}
.order-goods {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 5;
  transition: all .3s;
  transform: translate3d(0,0,0);
  overflow: hidden;
}
.order-select {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
  margin-left: 20px;
  padding: 40px;
  width: 600px;
  height: 860px;
  background: #fff;
  border-radius: 4px;
}
.order-select-title {
  padding-bottom: 20px;
  font-size: 36px;
  color: #333333;
  border-bottom: 1px solid #EFEFEF;
}
.order-select-address {
  display: flex;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  & .icon-more {
    color: #999;
  }
}
.order-address-left {
  display: flex;
  width: 100%;
  align-items: center;
}
.order-price-item {
  font-size: 32px;
  color: #333333;
  display: flex;
  align-items: center;
  & .price-item-value {
    color: #C2212A;
  }
}
.order-address-text {
  width: 100%;
  padding: 0 20px;
  line-height: 48px;
}
.order-address-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  & .order-address-consignee {
    font-size: 24px;
  }
  & .order-address-mobile {
    font-size: 24px;
    color: #999999;
  }
}
.order-address-area {
    font-size: 24px;
  }
.order-button {
  margin-top: 60px;
}
.order-bg {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 140px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.order-bg-text {
  margin: 50px 0;
  font-size: 28px;
  color: #999999;
}
</style>
