<template lang="pug">
.shopping
  shopping-cart-header(:title="title", :count="goods.all_num", :btnValue="btnValue" isShowBtn @click="batchRemove")
  .shopping-container(v-if="goods.list.length")
    .shopping-list
      .shopping-item(
        v-for="item in goods.list"
        :key="item.id"
      )
        .shopping-goods(
          @touchstart="touchstart"
          @touchmove="touchmove($event, item)"
          @touchend="touchend($event, item)"
         :style="{ 'left': `-${item.moveX}px` }"
        )
          shopping-goods(:item="item" isRadio isPrice isNumber isModify @changeCart="changeCart")
        .item-delete(
          :class="{'item-delete--hide' : !item.moveX}"
          @click.stop="deleteItem(item)"
        ) 删除
    .shopping-select
      .shopping-select-header
        .shopping-select-title
          span 已选择
          label {{goods.total_num}}
          span 件商品
        .shopping-select-all
          c-radio(v-model="selectAll" @change="changeSelectedAll")
          .radio-text 全部
      .shopping-select-content
        .shopping-price
          .shopping-price-item
            .price-item-label 合计：
            .price-item-value &#165 {{goods.total_money}}
          .shopping-price-item
            .price-item-label 应付金额：
            .price-item-value &#165 {{goods.pay_amount}}
        .shopping-button
          c-button(type="primary" @click="pay") 去结算
          // c-button(@click="deleteGoods" type="primary" plain v-else) 删除
  .shopping-bg(v-else)
    img(src="../../static/images/search_img_shopping_dis.png")
    .shopping-bg-text 购物车是空的
  delete-popover(@change="deleteSome")
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import shoppingGoods from '@/components/shoppingGoods'
import deletePopover from '@/components/modal/deletePopover'
import { getCart, deleteOneGoods, selectedAll } from 'api'
export default {
  name: 'shoppingCart',
  data () {
    return {
      title: '购物车',
      btnValue: '批量删除',
      count: 4,
      startX: 0,
      startY: 0,
      goods: {
        list: []
      },
      selectAll: false
    }
  },
  components: {
    shoppingCartHeader,
    shoppingGoods,
    deletePopover
  },
  methods: {
    deleteSome (data) {
      if (data) this.getCartList()
    },
    changeCart (data) {
      this.getCartList()
    },
    async changeSelectedAll (select) {
      try {
        await this.$axios.post(selectedAll, { selected: select ? '1' : 0 }),
        this.getCartList()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getCartList () {
      try {
        const { data } = await this.$axios.get(getCart)
        data.list.forEach(item => {
          item.openPop = false
          item.moveX = 0
        })
        this.selectAll = data.selected
        this.goods = data
      } catch (err) {
        this.$toast.error(msg)
      }
    },
    batchRemove () {
      if (this.goods.total_num > 0) {
        this.$modal.show('deletePopover', { api: 'deleteSome' })
      } else {
        this.$toast.error('您未选中商品！')
      }
    },
  	touchstart ({ touches }) {
      if (touches.length > 0) {
        this.startX = touches[0].clientX
        this.startY = touches[0].clientY
      }
  	},
    touchmove ({ touches }, item) {
      if (touches.length > 0) {
        let moveX = touches[0].clientX
        let moveY = touches[0].clientY
        let x = moveX - this.startX
        let y = moveY - this.startY
        if ((Math.abs(x) > Math.abs(y) && x > 0) || (Math.abs(x) > Math.abs(y) && x < 0)) {
          let distance = this.startX - moveX
          this.goods.list.forEach(row => {
            row.moveX = 0
          })
          if (distance <= 0) item.moveX = 0
          else if (distance >= 120) item.moveX = 120
          else if (distance > 0) item.moveX = distance
        }
      }
    },
    touchend ({ changedTouches }, item) {
      if (changedTouches.length > 0) {
        let endX = changedTouches[0].clientX
        let distance = this.startX - endX
        if (distance === 0) item.moveX = item.moveX
        else item.moveX = distance > 120 / 2 ? 120 : 0
      }
    },
    deleteGoods () {
      this.$modal.show('deletePopover', { api: 'deleteSome' })
    },
    async deleteItem (item) {
      try {
        this.$modal.show('deletePopover', { api: 'deleteOneGoods', query: { id: item.id } })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    pay () {
      if (!this.goods.total_num) {
        this.$toast.error('没有可结算的商品！')
      }
      this.$router.push({ name: 'confirmOrder' })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getCartList()
    })
  }
}
</script>

<style lang="scss" scoped>
.shopping {
  height: 100%;
}
.shopping-container {
  display: flex;
  height: 100%;
  padding: 140px 80px 20px;
}
.shopping-item {
  position: relative;
  width: 1140px;
  height: 280px;
  margin-bottom: 20px;
  opacity: 1;
}
.shopping-list {
  height: 100%;
  width: 1140px;
  padding: 40px 0 40px 0;
  overflow-y: auto;
}
.item-delete {
  position: absolute;
  width: 120px;
  height: 280px;
  line-height: 280px;
  top: 0;
  right: 0;
  font-size: 28px;
  z-index: 4;
  color: #FFFFFF;
  text-align: center;
  background-color: #FF3B30;
  border: 1px solid #FF3B30;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
.item-delete.item-delete--hide {
  height: 278px;
  line-height: 278px;
  top: 1px;
  right: 1px;
}
.shopping-goods {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 5;
  transition: all .3s;
  transform: translate3d(0,0,0);
  overflow: hidden;
}
.shopping-select {
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
.shopping-select-title {
  font-size: 36px;
  color: #333333;
  & label {
    margin: 0 5px;
    font-size: 32px;
    color: #C2212A;
  }
}
.shopping-select-all{
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 410px;
  font-size: 28px;
  color: #333333;
  & .radio-text {
    margin-left: 20px;
  }
}
.shopping-price-item {
  font-size: 32px;
  color: #333333;
  display: flex;
  align-items: center;
  & .price-item-value {
    color: #C2212A;
  }
}
.shopping-button {
  margin-top: 60px;
}
.shopping-bg {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 140px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.shopping-bg-text {
  margin: 50px 0;
  font-size: 28px;
  color: #999999;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
