<template lang="pug">
.modify-pop-body
  .goods-detail-img
    .goods-photo
      img(:src="viewImg")
  .goods-detail-body
    .icon-close(@click="close")
    .goods-price ¥{{price}}
    .goods-spec-items
      .spec-item(v-for="spec, index in detail.spec")
        .spec-item-label {{spec.name}}：
        .spec-item-content
          .spec-item-value(v-for="row in spec.spec_item", :class="{'active' : spec.activeId === row.id}"  @click="selectSpec(row, index)")
            img(:src="row.src" v-if="row.src")
            span {{row.item}}
    .goods-detail-handle(@click="confirm") 确认修改
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'popoverContent',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      detail: state => state.ui.modifyPop.detail,
      viewImg: state => state.ui.modifyPop.viewImg,
      specKeys: state => state.ui.modifyPop.specKeys,
      orderId: state => state.ui.modifyPop.orderId,
      price: state => state.ui.modifyPop.price
    })
  },
  methods: {
    ...mapActions([
      'changeModifyPop'
    ]),
    close () {
      this.$emit('closePop')
    },
    selectSpec (row, index) {
      let detail = JSON.parse(JSON.stringify(this.detail))
      let specKeys = JSON.parse(JSON.stringify(this.specKeys))
      let viewImg = ''
      let price = ''
      detail.spec.map(item => item.spec_item.map(v => {
        if (row.id === v.id) {
          item.activeId = row.id
        }
      }))
      specKeys.splice(index, 1, row.id)
      if (specKeys.length === detail.spec.length) {
        this.key = Array.from(new Set(specKeys)).sort((a, b) => { return a - b }).join('_')
        let newPrice = detail.spec_value[this.key]
        viewImg = newPrice.spec_img ? newPrice.spec_img : this.viewImg
        price = newPrice.shop_price ? newPrice.shop_price : this.price
      }
      this.changeModifyPop({ detail: detail, specKeys: specKeys, viewImg: viewImg, price: price })
    },
    async confirm () {
      try {
        let query = {}
        query.key = Array.from(new Set(this.specKeys)).sort((a, b) => { return a - b }).join('_')
        let keys = ['key_name', 'market_price', 'original_img', 'selling_price', 'shop_price', 'store_count']
        keys.forEach(key => {
          query[key] = this.detail.spec_value[query.key][key]
          if (key === 'original_img') query[key] = this.detail.spec_value[query.key].spec_img
        })
        if (!query.store_count) {
          this.$toast.error('该规格商品库存为0')
          return
        }
        this.$emit('confirmPop', query)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modify-pop-body {
  position: relative;
  display: flex;
}
.goods-photo {
  width: 140px;
  height: 140px;
  background: #F5F5F5;
}
.goods-detail-body {
  flex: 1;
  margin-left: 10px;
  .icon-close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    color: #bbb;
  }
  .goods-price {
    font-size: 18px;
    color: #333;
    font-weight: 600;
  }
  & .goods-spec-items {
    height: 236px;
    overflow-y: auto;
    .spec-item {
      display: flex;
      margin: 20px 0;
      font-size: 16px;
      color: #999999;
      & .spec-item-label {
        white-space: nowrap;
        margin-right: 10px;
        padding: 5px 0;
      }
      .spec-item-content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        & .spec-item-value {
          display: flex;
          align-items: center;
          padding: 5px;
          margin: 0 10px 10px 0;
          border: 1px solid #DDDDDD;
          cursor: pointer;
          & img {
            width: 30px;
            height: 30px;
          }
          &.active {
            position: relative;
            border: 2px solid #333333;
            color: #333333;
            padding: 4px;
            &:before {
              position: absolute;
              right: 0;
              bottom: 0;
              content: '';
              width: 0;
              height: 0;
              border-bottom: 10px solid #333;
              border-left: 10px solid transparent;
            }
          }
        }
      }
    }
  }
}
.goods-detail-handle {
  width: 100%;
  height: 52px;
  line-height: 52px;
  font-size: 17px;
  color: #333333;
  text-align: center;
  background: #FFBE28;
  font-weight: 600;
}
</style>
