<template lang="pug">
.confirm-order
  shopping-cart-header(:title="title" isDeleteOrder @click="deleteOrder")
  .order-container(v-if="order.goods.length")
    .order-list
      .order-item(
        v-for="item in order.goods"
      )
        shopping-goods(:item="item" isPrice isPurchase)
    .order-select
      .order-select-header
        .order-select-title 订单信息
        .order-detail
          .order-num 订单号：{{order.order_sn}}
          .order-create-time 创建时间：{{order.create_time}}
        .order-select-address
          .order-address-left
            .icon-address
            .order-address-text
              .order-address-info
                .order-address-consignee {{order.consignee}}
                .order-address-mobile {{order.mobile}}
              .order-address-area {{order.area}} {{order.address}}
          .icon-more
      .order-select-content
        .order-price
          .order-price-item
            .price-item-label 合计：
            .price-item-value &#165 {{order.order_amount}}
          .order-price-item
            .price-item-label 应付金额：
            .price-item-value &#165 {{order.pay_amount}}
        .order-button
          c-button(type="primary" @click="pay") 去支付
  .order-bg(v-else)
    img(src="../../static/images/search_img_shopping_dis.png")
    .order-bg-text 订单是空的
  delete-popover(@change="deleteSome")
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import shoppingGoods from '@/components/shoppingGoods'
import deletePopover from '@/components/modal/deletePopover'
import { getOrderDetail, delOrder } from 'api'
export default {
  name: 'orderDetail',
  data () {
    return {
      title: '待支付订单',
      order: {
        goods: []
      }
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
    deleteSome (data) {
      if (data) {
        this.$router.push({ name: 'unpaidOrder' })
      }
    },
    async getList () {
      try {
        const { data } = await this.$axios.get(getOrderDetail, { params: { order_id: this.$route.params.id } })
        data.area = data.province + ' ' + data.district + ' ' + data.city
        this.order = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    pay () {
      this.$router.push({ name: 'pay', query: { order_ids: this.order.id, amount: this.order.pay_amount } })
    },
    async deleteOrder () {
      try {
        this.$modal.show('deletePopover', { api: 'delOrder', query: { order_id: this.order.id } })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getList()
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
.order-detail {
  margin-top: 20px;
  font-size: 24px;
  color: #333333;
}
</style>
