<template lang="pug">
modal(name="sketchList", width="100%", height="100%" @before-open="beforeOpen")
  .sketch-list
    .sketch-list-header
      .table-header-item
        .icon-close(@click="close")
      .table-header-item.table-header-item_goods 商品名称
      .table-header-item.table-header-item_detail 详情描述
      .table-header-item.table-header-item_num 数量
      .table-header-item.table-header-item_stock 库存
      .table-header-item.table-header-item_price 价格
    .sketch-list-content
      .sketch-content-header 方案名称：{{detail.title}}
      .sketch-content-table(v-if="tableData.length")
        .table-item(v-for="item in tableData", :class="{'table-item--disable': item.is_buy == 0}")
          c-radio(v-model="item.isRadio", :disabled="item.is_buy === 0" size="mini")
          .table-item-img(:style="{ 'background-image': `url(${item.original_img})` }")
          .table-item-name {{item.goods_name}}
          .table-item-spec {{item.key_name}}
          mu-menu(
            popover-class="sketch-list-popover"
            placement="bottom-end"
            @open="popOpen(item)"
            :open.sync="item.openPop"
          )
            .table-item-change(v-show="item.key_name") {{item.is_buy == 0 ? '' : '修改'}}
            .mu-menu-content(slot="content")
              popover-content(@closePop="closePop" @confirmPop="confirmPop")
          .table-item-num
            c-number(v-model="item.goods_num", :disabled="item.is_buy === 0", :min="1", :max="item.store_count")
          .table-item-stock {{item.store_count}}
          .table-item-price(v-if="item.is_buy != 0") ¥{{item.shop_price}}
      .sketch-content-info(v-else) 该方案暂无商品清单
    .sketch-list-footer
      .sketch-footer-radio
        c-radio(v-model="radio" size='mini')
        .radio-text 全选
      .sketch-footer-btn
        .total-money
          .total-money-text 合计：
          .total-money-num ¥{{price}}
        .sketch-add-shopping(@click="addShoppCart") 加入购物车
        .sketch-shopping(@click="buy") 立即购买
</template>

<script>
import { mapState, mapActions } from 'vuex'
import popoverContent from '@/components/popoverContent'
import { getSceneCaseDetail, sketchAdd, sketchBuy, getGoodSpec } from 'api'
export default {
  name: 'sketchList',
  props: {
    exit: {
      type: Function,
      required: true
    }
  },
  components: {
    popoverContent
  },
  data () {
    return {
      popGoods: {},
      num: 1,
      goodsId: null,
      detail: {},
      checkList: [],
      tableData: []
    }
  },
  computed: {
    ...mapState({
      sketchGoods: state => state.sketch.sketchGoods
    }),
    radio: {
      get () {
        let num = 0
        let isBuyNum = 0
        if (this.tableData.length) {
          this.tableData.forEach(item => {
            if (item.is_buy) isBuyNum++
            if (item.isRadio && item.is_buy) num++
          })
          if (isBuyNum === num) return true
          else return false
        } else {
          return false
        }
      },
      set (radio) {
        this.tableData.forEach(item => {
          if (radio && item.is_buy) item.isRadio = true
          else item.isRadio = false
        })
      }
    },
    price () {
      let priceCount = 0
      this.tableData.forEach(item => {
        if (item.isRadio && item.is_buy) priceCount += parseFloat(item.shop_price) * item.goods_num
      })
      return priceCount.toFixed(2)
    }
  },
  methods: {
    ...mapActions([
      'showConfirmModal',
      'changeModifyPop'
    ]),
    close () {
      this.$modal.hide('sketchList')
    },
    closePop () {
      this.tableData.forEach(item => {
        if (item.goods_id === this.popGoods.goods_id) item.openPop = false
      })
    },
    confirmPop (data) {
      this.popGoods = { ...this.popGoods, ...data }
      let index = this.tableData.findIndex(item => item.uid === this.popGoods.uid)
      this.tableData.splice(index, 1, this.popGoods)
      this.tableData[index].openPop = false
    },
    beforeOpen ({ params }) {
      this.goodsId = params.id
      this.setSketchGoods()
    },
    async popOpen (goods) {
      try {
        this.popGoods = goods
        let keys = goods.key.split('_')
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
        let viewImg = data.spec_value[goods.key].spec_img
        let price = data.spec_value[goods.key].shop_price
        this.changeModifyPop({ detail: data, specKeys: specKeys, viewImg: viewImg, orderId: goods.id, price: price })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async addShoppCart () {
      try {
        let arr = []
        this.tableData.forEach(item => {
          if (item.isRadio) {
            let obj = {
              goods_id: item.goods_id,
              key: item.key ? item.key : '',
              goods_num: item.goods_num
            }
            arr.push(obj)
          }
        })
        await this.$axios.post(sketchAdd, { goods: arr }),
        this.$toast.success('已加入购物车')
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async buy () {
      this.checkList = []
      this.tableData.forEach(item => {
        if (item.isRadio) {
          let obj = {
            goods_id: item.goods_id,
            key: item.key ? item.key : '',
            goods_num: item.goods_num
          }
          this.checkList.push(obj)
        }
      })
      if (!this.checkList.length) {
        this.$toast.error('请至少先选择一个商品')
        return
      }
      this.exit('sketchList')
    },
    async routerPush () {
      try {
        const { data } = await this.$axios.post(sketchBuy, { goods: this.checkList })
        this.close()
        await this.$router.push({ name: 'confirmOrder', query: { from: 'sketch', token: data.token, goods_id: this.$route.params.id } })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getSceneCaseDetail () {
      try {
        const { data } = await this.$axios.get(getSceneCaseDetail, { params: { id: this.goodsId } })
        if (data.goods) {
          this.detail = data
          data.goods.forEach(item => {
            if (item.is_buy) this.$set(item, 'isRadio', true)
            else this.$set(item, 'isRadio', false)
          })
          this.tableData = data.goods
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    setSketchGoods () {
      // let obj = {}
      // let sketchGoods = JSON.parse(JSON.stringify(this.sketchGoods))
      // let newArr = sketchGoods.reduce((item, next) => {
      //   next.goods_num = 1
      //   if (!obj[next.goods_id] && !obj[next.key]) {
      //     obj[next.goods_id] = 1
      //     item.push(next)
      //   } else {
      //     obj[next.goods_id]++
      //   }
      //   return item
      // }, [])
      let arr = JSON.parse(JSON.stringify(this.sketchGoods))
      arr.forEach(item => {
        if (!item.is_buy && item.is_buy !== 0) item.is_buy = 1
        if (item.is_buy) this.$set(item, 'isRadio', true)
        else this.$set(item, 'isRadio', false)
        this.$set(item, 'openPop', false)
        if (!item.goods_num) item.goods_num = 1
      })
      this.tableData = arr
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
.sketch-list {
  height: 100%;
  width: 100%;
}
.mu-menu {
  min-width: 70px;
}
.sketch-list-header {
  position: fixed;
  display: flex;
  align-items: center;
  left: 0;
  top: 0;
  right: 0;
  height: 140px;
  padding: 50px 0;
  background: #FFFFFF;
  z-index: 99;
  box-shadow: 0 5px 20px 0 rgba(30,32,32,0.10);
}
.sketch-list-footer {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100px;
  padding-left: 110px;
  z-index: 99;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: inset 0 1px 0 0 #DDDDDD;
}
.table-header-item {
  font-size: 28px;
  color: #333333;
  & .icon-close {
    margin: 0 110px 0 30px;
    font-size: 20px;
    color: #999;
  }
}
.table-header-item_goods {
  width: 500px;
  min-width: 500px;
}
.table-header-item_detail {
  width: 452px;
  min-width: 452px;
}
.mu-menu-content {
  padding: 20px;
  width: 600px;
  background: #fff;
}
.table-header-item_num {
  width: 280px;
  min-width: 280px;
}
.table-header-item_stock {
  min-width: 280px;
  width: 280px;
}
.table-header-item_price {
  width: 248px;
  min-width: 248px;
}
.sketch-list-content {
  // position: relative;
  padding: 180px 80px 140px;
  width: 100%;
  height: 100%;
  background: #f5f5f7;
  overflow-y: auto;
}
.sketch-content-header {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333333;
}
.table-item {
  display: flex;
  width: 100%;
  margin: 20px 0;
  padding: 30px;
  align-items: center;
  background: #FFFFFF;
  border-radius: 4px;
}
.table-item-img {
  width: 100px;
  min-width: 100px;
  height: 100px;
  margin: 0 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.table-item-name {
  width: 350px;
  min-width: 350px;
  font-size: 18px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.table-item-spec {
  width: 240px;
  min-width: 240px;
  margin: 0 30px;
  font-size: 18px;
  color: #333333;
}
.table-item-change {
  width: 70px;
  min-width: 70px;
  padding: 10px 0;
  font-size: 18px;
  color: #333333;
  text-decoration: underline;
}
.table-item-num {
  margin: 0 94px 0 64px;
}
.table-item-stock {
  width: 258px;
  min-width: 258px;
  margin-left: 93px;
  font-size: 18px;
}
.table-item-price {
  width: 248px;
  min-width: 248px;
  font-size: 18px;
  color: #C2212A;
}
.sketch-footer-radio {
  display: flex;
  align-items: center;
  & .radio-text {
    margin-left: 20px;
    font-size: 24px;
  }
}
.sketch-footer-btn {
  display: flex;
  align-items: center;
  font-size: 32px;
  height: 100%;
  & .total-money {
    display: flex;
    align-items: center;
    & .total-money-num {
      color: #C2212A;
    }
  }
}
.sketch-add-shopping,
.sketch-shopping{
  display: flex;
  width: 300px;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.sketch-add-shopping {
  margin-left: 60px;
  background: #C2212A;
}
.sketch-shopping {
  background: #FF6C00;
}
.sketch-content-info {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  font-size: 36px;
  color: #999;
}
.table-item--disable .table-item-name,
.table-item--disable .table-item-spec,
.table-item--disable .table-item-stock {
  color: #999999;
}
</style>
