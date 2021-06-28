<template lang="pug">
.order
  shopping-cart-header(:title="title")
  .order-container(ref="orderScroll")
    .order-items(v-if="order.list.length")
      .order-item(v-for="item in order.list" @click="toOrderDetail(item)")
        .order-item-header
          .item-header-left
            .order-item-id 订单号：{{item.order_sn}}
            .order-item-time 创建时间：{{item.create_time}}
          .item-header-right(@click.stop="deleteOrder(item)") 删除订单
        .order-item-content(v-for="row in item.goods" v-if="item.goods.length === 1" name="11111")
          .order-item-img
            img(:src="row.original_img + '?imageslim&imageView2/0/w/400'")
          .order-item-info
            .order-item-name {{row.goods_name}}
            .order-item-spec {{row.spec_key_name}}
        .order-item-content(v-if="item.goods.length > 1")
          .order-item-img
            img(v-for="row in item.goods", :src="row.original_img + '?imageslim&imageView2/0/w/400'")
        .order-item-footer
          .order-item-num 共{{item.goods_num}}件商品
          .order-item-price
            .item-price-label 合计：
            .item-price-value ¥{{item.pay_amount}}
          .order-item-btn
            c-button(type="primary" @click.stop="pay(item)") 去支付
    .order-bg(v-else)
      img(src="../../static/images/search_img_pay_dis.png")
      .order-bg-text 暂无待支付订单
  delete-popover(@change="deleteSome")
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import deletePopover from '@/components/modal/deletePopover'
import { getWaitPayOrder } from 'api'
export default {
  name: 'unpaidOrder',
  data () {
    return {
      title: '待支付订单',
      page: 1,
      pageSize: 10,
      order: {
        list: []
      },
      isLoading: false,
      isLoaded: false
    }
  },
  components: {
    shoppingCartHeader,
    deletePopover
  },
  methods: {
    deleteSome (data) {
      if (data) {
        this.getWaitPayOrder()
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(getWaitPayOrder, {
          params: {
            page_size: this.pageSize,
            page: this.page
          }
        })
        window.requestAnimationFrame(() => {
          this.order.list.push(...data.list)
        })
        this.page += 1
        if (!data.list.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    toOrderDetail (item) {
      this.$router.push({ name: 'orderDetail', params: { id: item.order_id } })
    },
    pay (item) {
      this.$router.push({ name: 'pay', query: { order_ids: item.order_id, amount: item.pay_amount } })
    },
    async getWaitPayOrder () {
      try {
        this.page = 1
        this.isLoading = false
        this.isLoaded = false
        const { data } = await this.$axios.get(getWaitPayOrder, { params: { page: this.page, page_size: this.pageSize } })
        this.order = data
        this.page += 1
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    initScroller () {
      const sc = this.$refs.orderScroll
      sc.addEventListener('scroll', e => {
        const { scrollHeight, scrollTop, offsetHeight } = sc
        if (scrollHeight - scrollTop - offsetHeight < 100) this.loadMore()
      })
    },
    deleteOrder (item) {
      this.$modal.show('deletePopover', { api: 'delOrder', query: { order_id: item.order_id } })
    }
  },
  mounted () {
    this.initScroller()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getWaitPayOrder()
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$refs.orderScroll.scrollTop = 0
    this.getWaitPayOrder()
  }
}
</script>

<style lang="scss" scoped>
.order {
  height: 100%;
}
.order-container {
  height: calc(100% - 140px);
  padding-top: 140px;
  padding-bottom: 20px;
  overflow-y: auto;
}
.order-items {
  padding: 20px 80px;
}
.order-item {
  width: 100%;
  height: 450px;
  margin: 20px 0;
  padding: 40px;
  background: #FFFFFF;
  border-radius: 4px;
}
.order-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  color: #333333;
  & .item-header-right {
    color: #FF6C00;
  }
}
.order-item-id {
  margin-right: 60px;
}
.item-header-left {
  display: flex;
  align-items: center;
}
.order-item-content {
  padding: 20px 0;
  display: flex;
  align-items: center;
}
.order-item-img {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-width: 200px;
  height: 200px;
  & img {
    margin-right: 30px;
    width: 200px;
    height: 200px;
  }
}
.order-item-name {
  font-size: 28px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.order-item-spec {
  font-size: 24px;
  color: #999999;
}
.order-item-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 32px;
  color: #333333;
}
.order-item-price {
  margin: 0 40px;
  display: flex;
  align-items: center;
  & .item-price-value {
    color: #C2212A;
  }
}
.order-bg {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 140px;
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
