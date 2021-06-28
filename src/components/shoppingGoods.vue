<template lang="pug">
.goods(:class="{'goods-disabled' : item.is_buy === 0}")
  c-radio.goods-radio(v-model="item.selected", :disabled="item.is_buy === 0" v-if="isRadio" @change="changeRadio")
  .goods-img
    img(:src="item.goods_img + '?imageslim&imageView2/0/w/400'" @click="toDetail(item)")
  .goods-content(:style="{'height' : isPrice ? '100%' : ''}")
    .goods-content-info
      .goods-info-header
        .goods-title(@click="toDetail(item)") {{item.goods_name}}
        mu-menu(
          popover-class="sketch-list-popover"
          placement="bottom-end"
          @open="popOpen(item)"
          v-if="isModify"
          :open.sync="item.openPop"
        )
          .table-item-change {{item.is_buy == 0 ? '' : '修改'}}
          .mu-menu-content(slot="content")
            popover-content(@closePop="closePop" @confirmPop="confirmPop")
      .goods-spec 规格：{{item.spec_key_name}}
      .goods-info {{item.error_msg}}
    .goods-content-footer(v-if="isPrice")
      .goods-content-wrapper
        p.goods-price &#165{{item.shop_price}}
        .order-type(v-if="isPurchase && item.dt_local" @click="offlineToast")
          span 线下支付
          i.icon-question
      c-number(v-if="isNumber" v-model="item.goods_num", :min="1", :max="maxNum", :disabled="item.is_buy === 0" @change="changeNum")
      p.purchase-num(v-if="isPurchase") 采购数量：x{{item.goods_num}}
</template>

<script>
import cRadio from './ui/c-radio'
import { mapState, mapActions } from 'vuex'
import popoverContent from './popoverContent'
import { cartSelected, changeCartNum, getGoodSpec, editCartGoodSpec } from 'api'
export default {
  name: 'shoppingGoods',
  props: {
    item: Object,
    isRadio: {
      type: Boolean,
      default: false
    },
    isPurchase: {
      type: Boolean,
      default: false
    },
    isNumber: {
      type: Boolean,
      default: false
    },
    isModify: {
      type: Boolean,
      default: false
    },
    isPrice: {
      type: Boolean,
      default: false
    }
  },
  components: {
    cRadio,
    popoverContent
  },
  data () {
    return {
      maxNum: 1000000000000
    }
  },
  methods: {
    ...mapActions([
      'changeModifyPop',
      'showConfirmModal'
    ]),
    offlineToast () {
      this.showConfirmModal({
        title: '线下支付',
        paragraph: '该商品仅支持线下支付，订单提交后，客服会尽快联系你完成线下支付',
        confirmButtonText: '知道了',
        showCancel: false
      })
    },
    toDetail (item) {
      if (item.is_buy) this.$router.push({ name: 'goodDetail', params: { id: item.goods_id } })
      else this.$toast.error(item.error_msg)
    },
    async changeRadio (item) {
      try {
        const { data } = await this.$axios.post(cartSelected, { id: this.item.id, selected: this.item.selected ? '1' : '0' })
        this.$emit('changeCart', data)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    closePop () {
      this.item.openPop = false
    },
    async confirmPop (data) {
      try {
        await this.$axios.post(editCartGoodSpec, { id: this.item.id, key: data.key })
        this.item.openPop = false
        this.$emit('changeCart', data)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async popOpen (goods) {
      try {
        let keys = goods.spec_key.split('_')
        let specKeys = []
        this.goodsDetail = goods
        const { data } = await this.$axios.get(getGoodSpec, { params: { goods_id: goods.goods_id } })
        data.spec.map((item, index) => item.spec_item.map(row => {
          keys.map(key => {
            if (parseInt(key) === row.id) {
              item.activeId = row.id
              specKeys.splice(index, 1, row.id)
            }
          })
        }))
        let viewImg = data.spec_value[goods.spec_key].spec_img
        let price = data.spec_value[goods.spec_key].shop_price
        this.changeModifyPop({ detail: data, specKeys: specKeys, viewImg: viewImg, orderId: goods.id, price: price })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async changeNum (item) {
      try {
        const { data } = await this.$axios.post(changeCartNum, { id: this.item.id, goods_num: this.item.goods_num })
        this.$emit('changeCart', data)
      } catch (err) {
        this.item.goods_num = err.data.store_count
        this.maxNum = err.data.store_count
        this.$toast.error(err.msg)
        if (err.data.store_count >= 0) {
          if (err.data.store_count === 0) {
            this.item.is_buy = 0
            this.item.selected = false
          }
          this.item.goods_num = err.data.store_count
          this.$emit('changeCart', err.data)
        }
      }
    }
  }
}
</script>

<style>
.sketch-list-popover {
  border: 1px solid #DDDDDD;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
}
</style>

<style lang="scss" scoped>
.goods {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 30px;
  align-items: center;
  background: #fff;
  border-radius: 4px;
}
.goods-radio {
  margin-right: 30px;
}
.goods-img {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    max-width: 200px;
    max-height: 200px;
  }
}
.mu-menu-content {
  padding: 20px;
  width: 600px;
  background: #fff;
}
.goods-disabled {
  & .goods-title {
    color: #999;
  }
  & .purchase-num {
    color: #999;
  }
}
.goods-info-header {
  display: flex;
}
.goods-content {
  width: 100%;
  display: flex;
  margin-left: 30px;
  flex-direction: column;
  justify-content: space-between;
  font-size: 28px;
  color: #333333;
}
.table-item-change {
  text-decoration: underline;
}
.goods-title {
  width: 682px;
  max-width: 682px;
  margin-right: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-spec {
  width: 770px;
  font-size: 24px;
  color: #999999;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.goods-content-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  & .goods-price {
    font-size: 32px;
    color: #C2212A;
    margin-right: 40px;
  }
}
.goods-content-wrapper {
  display: flex;
  align-items: center;
}
.order-type {
  display: flex;
  align-items: center;
  font-size: 24px;
  .icon-question {
    font-size: 30px;
    margin-left: 10px;
    color: #FF6C00;
  }
}
.purchase-num {
  font-size: 24px;
  color: #999999;
}
.goods-info {
  width: 100%;
  color: #999;
  font-size: 24px;
  text-align: right;
}
</style>
