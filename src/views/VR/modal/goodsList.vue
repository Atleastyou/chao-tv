<template lang="pug">
modal(name="vrGoodsList", width="100%", height="100%" @before-open="beforeOpen")
  .list
    .list-header
      .table-header-item
        .icon-close(@click="close")
      .table-header-item.table-header-item_goods 商品名称
      .table-header-item.table-header-item_detail 详情描述
      .table-header-item.table-header-item_num 数量
      .table-header-item.table-header-item_stock 库存
      .table-header-item.table-header-item_price 价格
    .list-content
      .content-header 商品清单：
      .content-table(v-if="list.length")
        .table-item(v-for="item in list", :class="{'table-item--disable': item.is_buy == 0}")
          .table-item-cell(style="width: 450px;display: flex;align-items: center;")
            c-radio(v-model="item.checked", :disabled="item.is_buy === 0" size="mini" @change="selectItem")
            .table-item-img(:style="{ 'background-image': `url(${item.original_img})` }")
            .table-item-name {{item.goods_name}}
          .table-item-cell(style="width: 452px;text-align: center;")
            .table-item-spec {{item.key_name}}
          .table-item-cell(style="width: 280px;text-align: center;")
            .table-item-num
              c-number(v-model="item.goods_num", :disabled="item.is_buy === 0", :min="1", :max="item.store_count")
          .table-item-cell(style="width: 280px;text-align: center;")
            .table-item-stock {{item.store_count}}
          .table-item-cell(style="width: 248px;text-align: center;")
            .table-item-price(v-if="item.is_buy") ¥{{item.shop_price}}
      .content-info(v-else) 暂无商品清单
    .list-footer
      .footer-radio
        c-radio(v-model="checkAll" size='mini'  @change="selectAll")
        .radio-text 全选
      .footer-btn
        .total-money
          .total-money-text 合计：
          .total-money-num ¥{{totalPrice}}
        .add-shopping(@click="addShoppCart") 加入购物车
        .shopping(@click="buy") 立即购买
</template>

<script>
import { VRGoods, sketchAdd, sketchBuy } from 'api'
export default {
  name: 'vrGoodsList',
  data () {
    return {
      checkAll: true,
      list: []
    }
  },
  computed: {
    checkList () {
      return this.list.filter(item => item.checked)
    },
    totalPrice () {
      return this.checkList.reduce((total, next) => parseFloat(total) + parseFloat(next.shop_price), 0)
    }
  },
  methods: {
    async addShoppCart () {
      try {
        await this.$axios.post(sketchAdd, { goods: this.checkList.map(item => { 
          return {
            goods_id: item.goods_id,
            key: item.key ? item.key : '',
            goods_num: item.goods_num
          }
         }) })
        this.$toast.success('已加入购物车')
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async buy () {
      try {
        if (!this.checkList.length) {
          this.$toast.error('请至少先选择一个商品')
          return
        }
        const { data } = await this.$axios.post(sketchBuy, { goods: this.checkList.map(item => { 
          return {
            goods_id: item.goods_id,
            key: item.key ? item.key : '',
            goods_num: item.goods_num
          }
         }) })
        this.$router.push({ name: 'confirmOrder', query: { from: 'sketch', token: data.token} })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectItem () {
      this.checkAll = this.checkList.length === this.list.length
    },
    selectAll () {
      this.list.forEach(item => {
        item.checked = item.is_buy ? this.checkAll : false
      })
    },
    async getVRGoods (scene) {
      try {
        const markers = scene.config.markers
        if (!markers) return
        const goodsMakers = markers.filter(marker => marker.data.type === 'goods')
        if (!goodsMakers.length) return
        const query = goodsMakers.map(marker => {
          return {
            key: marker.data.goods.key,
            goods_id: marker.data.goods.goods_id
          }
        })
        const { data } = await this.$axios.get(VRGoods, {
          params: {
            goods: JSON.stringify(query)
          }
        })
        const map = {}
        data.forEach(item => {
          map[item.key] = item
        })
        const goodsList = goodsMakers.map(item => {
          const goods = item.data.goods
          return {
            checked: map[goods.key]['is_buy'] ? true : false,
            goods_num: 1,
            ...goods,
            ...map[goods.key]
          }
        })
        this.list = goodsList
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    close () {
      this.$modal.hide('vrGoodsList')
    },
    beforeOpen ({ params }) {
      this.getVRGoods(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  height: 100%;
  width: 100%;
}
.mu-menu {
  min-width: 70px;
}
.list-header {
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
.list-footer {
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
  text-align: center;
  & .icon-close {
    margin: 0 30px;
    font-size: 20px;
    color: #999;
  }
}
.table-header-item_goods {
  width: 480px;
  padding-left: 50px;
  text-align: left;
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
.list-content {
  // position: relative;
  padding: 180px 80px 140px;
  width: 100%;
  height: 100%;
  background: #f5f5f7;
  overflow-y: auto;
}
.content-header {
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
  width: 100%;
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
.table-item-stock {
  font-size: 18px;
}
.table-item-price {
  font-size: 18px;
  color: #C2212A;
}
.footer-radio {
  display: flex;
  align-items: center;
  & .radio-text {
    margin-left: 20px;
    font-size: 24px;
  }
}
.footer-btn {
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
.add-shopping,
.shopping{
  display: flex;
  width: 300px;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.add-shopping {
  margin-left: 60px;
  background: #C2212A;
}
.shopping {
  background: #FF6C00;
}
.content-info {
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
