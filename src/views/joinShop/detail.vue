<template lang="pug">
.detail
  .detail-body
    .detail-scroller
      .preview
        .preview-cover(v-if="detail.img_url" :style="{'background-image': `url(${detail.img_url})`}")
        .preview-wrapper
          .preview-title {{detail.name}}
          .preview-subtitle {{detail.brief_introduction}}
          .preview-sub
            .preview-sub-name(v-if="hasDiscount") 优惠价
            .preview-sub-wrapper
              .preview-sub-price ¥{{hasDiscount ? price.totalPrice : price.oldTotalPrice}}
              .preview-sub-tag(v-if="hasDiscount")
                span 该组合可省
                em {{price.oldTotalPrice - price.totalPrice}}元
          .preview-price(v-if="hasDiscount") 会员价 ¥{{price.oldTotalPrice}}
      .goods-list-container
        .goods-list-header
          span.goods-list-title 单品列表
          span.goods-list-total 共{{totalGoodsNumber}}款商品
        .goods-list
          router-link.goods-item(v-for="item,index in detail.goods" :to="{name: 'goodDetail', params: { id: item.goods_id }}")
            .goods-item-cover(:style="{'background-image': `url(${item.original_img})`}")
            .goods-item-wrapper
              .goods-item-top
                .goods-item-header
                  .goods-item-title {{item.goods_name}}
                  .goods-item-menu(@click.prevent="() => {}")
                    mu-menu(
                      popover-class="sketch-list-popover"
                      placement="bottom-end"
                      :open.sync="item.specSelectShow"
                    )
                      .goods-item-handle 修改
                      .mu-menu-content(slot="content")
                        spec-select(:goods="item" @close="closeSpecSelect(index)" @confirm="confirmSpecSelect($event,index)")
                .goods-item-spec {{item.selectedSpec.key_name}}
              .goods-item-bottom
                .goods-item-price
                  .goods-item-default-price ¥{{item.selectedSpec.old_shop_price}}
                  .goods-item-offer-price(v-if="item.selectedSpec.hasDiscount") 优惠价¥{{item.selectedSpec.shop_price}}
                .goods-item-stepper
                  c-number(
                    v-if="item.selectedSpec.selectedNumber"
                    v-model="item.selectedSpec.selectedNumber"
                    :min="item.selectedSpec.min_count"
                    :max="item.selectedSpec.store_count"
                    @overlimit="stepperOverlimit(item.selectedSpec)"
                  )
  .detail-menu
    .detail-menu-wrapper
      .detail-menu-top
        p.goods-number
          span 共
          em {{totalGoodsNumber}}
          span 件商品
        p.goods-price(v-if="hasDiscount")
          span 原价¥{{price.oldTotalPrice}}
          em 共节省 ¥{{price.oldTotalPrice - price.totalPrice}}
      .detail-menu-bottom
        .goods-total-price
          span 合计：
          em ¥{{price.totalPrice}}
        .submit(@click="confirm") 立即购买
</template>

<script>
import { joinShopDetail, buyList } from 'api'
import specSelect from './component/specSelect'
export default {
  name: 'joinShopDetail',
  data () {
    return {
      detail: {
        goods: []
      }
    }
  },
  components: {
    specSelect
  },
  computed: {
    totalGoodsNumber () {
      return this.detail.goods.reduce(
        (total, item) => total + item.selectedSpec.selectedNumber
      , 0)
    },
    price () {
      return this.detail.goods.reduce(
        (obj, item) => {
          return {
            oldTotalPrice: obj.oldTotalPrice + parseFloat(item.selectedSpec.old_shop_price) * item.selectedSpec.selectedNumber,
            totalPrice: obj.totalPrice + parseFloat(item.selectedSpec.hasDiscount ? item.selectedSpec.shop_price : item.selectedSpec.old_shop_price) * item.selectedSpec.selectedNumber
          }
        }
      , { oldTotalPrice: 0, totalPrice: 0 })
    },
    hasDiscount () {
      return parseFloat(this.price.oldTotalPrice) > parseFloat(this.price.totalPrice)
    }
  },
  methods: {
    async confirm () {
      try {
        const goods = this.detail.goods.map(item => {
          const { selectedSpec } = item
          return {
            goods_id: item.goods_id,
            spec_key: selectedSpec.spec_key,
            goods_num: selectedSpec.selectedNumber
          }
        })
        const { data } = await this.$axios.post(buyList, { id: this.$route.params.id, goods: JSON.stringify(goods) })
        this.$router.push({ name: 'confirmOrder', query: { from: 'joinShop', token: data.token } })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    closeSpecSelect (index) {
      this.$set(this.detail.goods[index], 'specSelectShow', false)
    },
    confirmSpecSelect (selectedSpec, index) {
      let currentSelectSpec = this.detail.goods[index]['selectedSpec']
      this.detail.goods[index]['selectedSpec'] = { ...currentSelectSpec, ...selectedSpec, selectedNumber: currentSelectSpec.selectedNumber }
    },
    // 点击已禁用按钮触发
    stepperOverlimit ({ selectedNumber, min_count, store_count }) {
      if (selectedNumber === min_count) this.$toast.error('已达到该组合所需的最小数量')
      if (selectedNumber === store_count) this.$toast.error('已达到该组合所限的最大数量')
    },
  	async getJoinShopList () {
  		try {
        const { data } = await this.$axios.get(joinShopDetail, { params: { id: this.$route.params.id } })
        data.goods.forEach(item => {
          item.specSelectShow = false
          item.spec_value.forEach(spec => {
            spec.hasDiscount = parseFloat(spec.old_shop_price) > parseFloat(spec.shop_price) // 是否有优惠
            if (spec.is_default === 1) {
              item.selectedSpec = { ...spec }
              item.selectedSpec['selectedNumber'] = spec.min_count // 默认选中数量，数值为最小起订量
            }
          })
        })
        this.detail = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getJoinShopList()
    })
  }
}
</script>

<style scoped lang="scss">
.detail {
  height: 100%;
  padding: 0 80px;
  background: #38363D;
  display: flex;
}
.detail-body {
  padding-top: 80px;
  width: 1160px;
}
.detail-scroller {
  padding: 40px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.preview {
  display: flex;
}
.preview-cover {
  width: 400px;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 30px;
  border: 1px solid #efefef;
}
.preview-wrapper {
  flex: 1;
}
.preview-title {
  font-size: 28px;
  line-height: 40px;
  font-weight: 500;
}
.preview-subtitle {
  font-size: 20px;
  color: #999999;
  margin-top: 10px;
  line-height: 28px;
}
.preview-sub {
  margin-top: 40px;
}
.preview-sub-name {
  font-size: 20px;
  color: #C2212A;
  line-height: 28px;
}
.preview-sub-wrapper {
  margin-top: 8px;
  display: flex;
  align-items: center;
}
.preview-sub-price {
  font-size: 32px;
  color: #C2212A;
  letter-spacing: 0;
}
.preview-sub-tag {
  background: #333333;
  border-radius: 4px;
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
  font-size: 20px;
  color: #FFFFFF;
  margin-left: 20px;
  em {
    font-size: 20px;
    color: #FFBE28;
    margin-left: 10px;
  }
}
.preview-price {
  margin-top: 20px;
  padding: 0 20px;
  background: #F7F4EE;
  border-radius: 4px;
  height: 48px;
  line-height: 48px;
  display: inline-block;
}

.goods-list-container {
  margin-top: 60px;
}
.goods-list-header {
  padding-bottom: 30px;
  border-bottom: 4px solid #f2f2f2;
}
.goods-list-title {
  vertical-align: middle;
  font-size: 28px;
  color: #333333;
  line-height: 40px;
}
.goods-list-total {
  vertical-align: middle;
  font-size: 20px;
  color: #999999; 
  line-height: 28px;
  border-left: 1px solid #ddd;
  padding: 0 20px;
  margin-left: 20px;
}
.goods-item {
  display: flex;
  padding: 60px 0;
}
.goods-item-cover {
  width: 200px;
  height: 200px;
  background: #F5F5F5;
  margin-right: 30px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.goods-item-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.goods-item-title {
  font-size: 28px;
  color: #333333;
  line-height: 40px;
  width: 654px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-item-handle {
  font-size: 28px;
  color: #333333;
  text-decoration: underline;
}
.mu-menu-content {
  padding: 20px;
  width: 600px;
  background: #fff;
}
.goods-item-spec {
  margin-top: 10px;
  font-size: 24px;
  color: #999999;
}
.goods-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-item-price {
  display: flex;
  align-items: center;
}
.goods-item-default-price {
  font-size: 32px;
  color: #333333;
  margin-right: 30px;
}
.goods-item-offer-price {
  font-size: 32px;
  color: #C2212A;
}

.detail-menu {
  padding: 80px 0;
  flex: 1;
}
.detail-menu-wrapper {
  height: 100%;
  margin-left: 40px;
  background: #fff;
  border-radius: 4px;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-number {
  font-size: 36px;
  color: #333333;
  line-height: 50px;
  em {
    color: #000F00;
    margin: 0 10px;
  }
}
.goods-price {
  margin-top: 20px;
  font-size: 32px;
  color: #999999;
  line-height: 45px;
  em {
    color: #C2212A;
    margin-left: 30px;
  }
}
.goods-total-price {
  font-size: 32px;
  color: #333333;
  line-height: 45px;
  em {
    color: #C2212A;
  }
}
.submit {
  margin-top: 60px;
  background: #FFBE28;
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  border-radius: 4px;
  color: #333333;
}
</style>
