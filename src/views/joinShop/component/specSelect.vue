<template lang="pug">
.modify-pop-body
  .goods-detail-img
    .goods-photo
      img(:src="selectedSpec.spec_img || goods.original_img")
  .goods-detail-body
    .icon-close(@click="close")
    .goods-price ¥{{selectedSpec.hasDiscount ? selectedSpec.shop_price : selectedSpec.old_shop_price}}
    .goods-spec-items
      .spec-item(v-for="column, columnIndex in goods.spec")
        .spec-item-label {{column.name}}：
        .spec-item-content
          .spec-item-value(v-for="row,rowIndex in column.spec_item", :class="{'active' : specKeysMap[columnIndex] == row.id}"  @click="selectSpec(columnIndex, row.id)")
            img(v-if="row.src" :src="row.src")
            span {{row.item}}
    .goods-detail-handle(@click="confirm") 确认修改
</template>

<script>
export default {
  name: 'specSelect',
  props: {
    goods: { // goods内必须有一个selectedSpec对象，值为spec_value中选中的那一个
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedNumber: 1,
      specKeysMap: [], // 选中项在规格列表中的映射
      selectedSpec: {
        spec_img: '',
        min_count: 1,
        store_count: 1
      }
    }
  },
  watch: {
    goods () {
      this.init()
    }
  },
  methods: {
    getSpecKeysMap () {
      let specKeysMap = []
      let specKeys = this.goods.selectedSpec.spec_key.split('_')
      this.goods.spec.forEach((column, columnIndex) => {
        for (let rowIndex = 0; rowIndex < column.spec_item.length; rowIndex++) {
          let row = column.spec_item[rowIndex]
          if (specKeys.find(key => parseInt(row.id) === parseInt(key))) {
            /*
              columnIndex 规定 row.id 属于哪一个规格列表
              row.id 这个列表中选中的规格
            */
            specKeysMap[columnIndex] = row.id
            return false // 一个规格列表只能选择一项，找到后退出循环
          }
        }
      })
      this.specKeysMap = specKeysMap
    },
    selectSpec (columnIndex, id) {
      this.specKeysMap[columnIndex] = id
      let specKeysMap = [...this.specKeysMap]
      let specKey = specKeysMap.sort((a, b) => { return a - b }).join('_')
      this.selectedSpec = this.goods.spec_value.find(item => item.spec_key === specKey)
    },
    confirm () {
      this.selectedSpec.selectedNumber = this.selectedNumber
      this.$emit('confirm', this.selectedSpec)
      this.close()
    },
    close () {
      this.$emit('close')
    },
  },
  created () {
    this.selectedSpec = this.goods.selectedSpec
    this.getSpecKeysMap()
  },
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
