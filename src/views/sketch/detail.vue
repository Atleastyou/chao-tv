<template lang="pug">
.detail
  .detail-header
    .detail-header-title(@click="routeBack")
      i.icon-back
      span 案例详情
    .detail-header-btns
      .detail-header-btn(@click="exportPhone")
        touch-ripple(:speed="2", :opacity=".5") 导出到手机
      router-link.detail-header-btn.btn-primary(:to="{ name: 'edit', params: { id: detail.id }, query: this.$route.query }")
        touch-ripple(:speed="2", :opacity=".5") 再创作
      router-link.detail-header-btn(:to="{name: 'edit'}")
        touch-ripple(:speed="2", :opacity=".5") 创建方案
  .detail-content
    .detail-body
      .detail-body-img(:style="{'background-image' : `url(${detail.preview})`}")
        i.icon-right(@click="toggle(detail.next_id)")
        i.icon-left(@click="toggle(detail.pre_id)")
    .detail-menu
      .detail-menu-header
        p.detail-title {{detail.title}}
        .detail-tags {{detail.tags}}
      .detail-goods
        p.detail-goods-title 单品列表
        .detail-goods-list
          .goods-item(v-for="item in detail.goods" @click="goodsDetail(item)" :class="{'goods-item--disabled': !item.is_buy}")
            .goods-item-img(:style="{'background-image': `url(${item.original_img}?imageslim&imageView2/0/w/255)`}")
              .goods-item-img--disabled(v-if="!item.is_buy")
                span 失效
            .goods-item-info
              p.goods-item-name {{item.goods_name}}
              p.goods-item-vip 会员价 ¥{{item.shop_price}}
              p.goods-item-price 零售价 ¥{{item.market_price}}
</template>

<script>
import { getSceneCaseDetail } from 'api'
import { mapActions } from 'vuex'
export default {
  name: 'sketchDetail',
  data () {
    return {
      detail: {}
    }
  },
  methods: {
    ...mapActions([
      'changeExportQrcode',
      'showExportConfirmModal'
    ]),
    toggle (id) {
      if (id) this.$router.replace({name: this.$route.name, params: { id }})
    },
    routeBack () {
      this.$router.back()
    },
    async getSceneCaseDetail () {
      try {
        const { data } = await this.$axios.get(getSceneCaseDetail, { params: { id: this.$route.params.id } })
        this.detail = data
      } catch ({msg}) {
        this.$toast.error(msg)
        this.detail = {}
      }
    },
    async exportPhone () {
      const { confirmed, value } = await this.showExportConfirmModal()
      if (!confirmed) return
      this.changeExportQrcode({ show: true, img: this.detail.preview, id: this.detail.id, show_good: value })
    },
    goodsDetail (item) {
      if (!item.is_buy) return
      this.$router.push({ name: 'goodDetail', params: { id: item.goods_id } })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getSceneCaseDetail()
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getSceneCaseDetail()
  }
}
</script>

<style scoped lang="scss">
.detail {
  height: calc(100% - 100px);
}
.detail-header {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 80px;
  width: 100%;
  height: 100px;
  background: #252429;
}
.detail-header-title {
  width: 170px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size: 28px;
  color: #FFFFFF;
  .icon-back {
    margin-right: 20px;
  }
}
.detail-header-btns {
  display: flex;
  align-items: center;
}
.detail-header-btn {
  margin-left: 40px;
  line-height: 24px;
  font-size: 24px;
  border-radius: 4px;
  background: #fff;
  color: #333333;
  & .v-touch-ripple {
    padding: 15px 20px;
    border-radius: 4px;
  }
  &.btn-primary {
    background: #FFBE28;
  }
}
.detail-content {
  height: 100%;
  margin-top: 100px;
  padding: 50px 80px;
  background: #38363D;
  display: flex;
}
.detail-body {
  padding: 40px;
  width: 1160px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  position: relative;
  .icon-right, .icon-left {
    background: rgba(0,0,0,0.30);
    width: 70px;
    height: 70px;
    line-height: 70px;
    border-radius: 50%;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 24px;
  }
  .icon-right {
    right: 20px;
  }
  .icon-left {
    left: 20px;
  }
}
.detail-body-img {
  width: 100%;
  height: 100%;
  background-position: 0, 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.detail-menu {
  flex: 1;
  height: 100%;
  margin-left: 40px;
  background: #fff;
  border-radius: 4px;
  padding: 40px;
  overflow-y: auto;
}
.detail-menu-header {
  height: 122px;
  border-bottom: 1px solid #DDDDDD;
  .detail-title {
    font-size: 28px;
    line-height: 40px;
  }
  .detail-tags {
    font-size: 24px;
    line-height: 33px;
    color: #999999;
    margin-top: 20px;
  }
}
.detail-goods {
  margin-top: 40px;
}
.detail-goods-title {
  font-size: 28px;
  color: #333333;
  line-height: 40px;
}
.detail-goods-list {
  margin-top: 30px;
}
.goods-item {
  display: flex;
  width: 100%;
  height: 180px;
  background: #FFFFFF;
  margin-bottom: 30px;
}
.goods-item-img {
  width: 180px;
  min-width: 180px;
  height: 180px;
  min-height: 180px;
  background-color: #f5f5f5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}
.goods-item-img--disabled {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.40);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    display: inline-block;
    border: 1px solid #FFFFFF;
    width: 52px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }
}
.goods-item-info {
  flex: 1;
  margin-left: 20px;
}
.goods-item-name {
  font-size: 20px;
  color: #333333;
  height: 56px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-item-vip {
  font-size: 24px;
  color: #C2212A;
  line-height: 33px;
  margin-top: 53px;
}
.goods-item-price {
  text-decoration: line-through;
  font-size: 20px;
  color: #999999;
  margin-top: 10px;
  line-height: 28px;
}
.goods-item--disabled {
  .goods-item-name,.goods-item-vip,.goods-item-price  {
    color: #999999;
  }
}

</style>
