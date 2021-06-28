<template lang="pug">
  //- 商品详情
  transition(name="scale")
    .case-detail(v-if="show")
      .case-detail-close
        i.icon-close(@click="closeCaseDetail")
      .case-detail-box
        .case-detail-priview(:style="{'background-image': `url(${caseDetail.preview})`}")
        p.case-detail-name {{caseDetail.title}}
        .case-detail-cell
          p.case-detail-tags
            span(v-if="caseDetail.tags") {{caseDetail.tags.split(' ').join('/')}}
          .case-detail-handles
            i.icon-edit(v-if="caseDetail.is_self" @click="editCase(caseDetail.id)")
            i.icon-delete(v-if="caseDetail.is_self" @click="deleteCase(caseDetail.id)")
            .case-detail-collection(@click="collectionCase")
              i.icon-collection_active(v-if="caseDetail.is_collection")
              i.icon-collection(v-else)
        .case-detail-btn(@click="againCreation(caseDetail.cont, caseDetail.id)")
          touch-ripple(:speed="2", :opacity=".5") 再创作
      .goods-recommend
        p.goods-title 使用到的单品
        .goods-body(v-for="item in caseDetail.goods")
          .good-item(@click="openGoodDetail(item)" :class="{'good-item--disabled': !item.is_buy}")
            .good-img(
              :style="{'background-image': `url(${item.original_img}?imageslim&imageView2/0/w/560)`}"
              :id="item.goods_id"
              source="brandGoods"
              type="good"
            )
              .good-img--disabled(v-if="!item.is_buy")
                span 失效
              .good-btns
                .good-btn(@click.stop="replaceImage(item.original_img, item)") 替换
                .good-btn(@click.stop="addImage(item.original_img, item)") 添加
            .good-cell
              .good-money-vip
                em ¥{{item.shop_price}}
                span 会员
              i.icon-collection_active(v-if="item.is_collection" @click.stop="collectionGood(item)")
              i.icon-collection(v-else @click.stop="collectionGood(item)")
            .good-money
              span 零售价
              em ¥{{item.market_price}}
            p.good-name {{item.goods_name}}
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getSceneCaseDetail, unCollectionCase, collectionCase, sceneMaterials, setCollection, unCollection } from 'api'
import uuid from 'uuid/v4'
export default {
  name: 'caseDetail',
  data () {
    return {
      caseDetail: {
        goods: []
      } // 商品详情
    }
  },
  watch: {
    id (v) {
      if (v) this.getCaseDetail()
      else this.caseDetail = { goods: [] }
    }
  },
  methods: {
    ...mapActions([
      'changeSkuDetail',
      'changeCaseDetail',
      'changeSketchGoods',
      'showReplaceModal',
      'showConfirmModal',
      'updateHistory'
    ]),
    async collectionGood (item) {
      try {
        const { is_collection, goods_id, is_buy } = item
        if (!is_buy) return
        if (is_collection) {
          await this.$axios.get(unCollection, {
            params: { goods_id }
          })
        } else {
          await this.$axios.get(setCollection, {
            params: { goods_id }
          })
        }
        this.$set(item, 'is_collection', !is_collection)
      } catch ({msg}) {
        this.$toast.error(msg)
      }
    },
    async deleteCase (id) {
      try {
        if (Number(this.$route.params.id) === id && this.$route.query.type === 'edit') {
          this.$toast.error('操作无法完成，当前方案在编辑中')
          return
        }
        console.log(Number(this.$route.params.id) === id)
        const confirmed = await this.showConfirmModal({
          title: '删除确认',
          paragraph: Number(this.$route.params.id) === id ? '您确定要删除案例吗？删除后画板不会被清空' : '确认要删除案例？',
          confirmButtonText: '确定'
        })
        if (confirmed === 1) {
          if (Number(this.$route.params.id) === id) {
            if (this.$route.query.type === 'edit') { // 删除案例时，如果该案例处于编辑状态，那么同时清除画布以及商品清单
              canvas.clear().renderAll()
              this.changeSketchGoods({type: 'clear'})
            }
            let query = this.$route.query
            delete query['type']
            delete query['time_stamp']
            this.$router.replace({ name: this.$route.name, query })
          }
          await this.$axios.post(sceneMaterials, { id })
          this.$emit('delete') // 从案例详情删除案例后，通知父组件更新案例列表
          this.closeCaseDetail()
          this.$toast.success('删除成功！')
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async editCase (id) {
      if (!this.replace.remind && canvas.getActiveObject()) {
        const confirmed = await this.showReplaceModal({
          title: '替换确认',
          paragraph: '将替换当前画布的全部内容'
        })
        if (!confirmed) return
        this.$router.replace({ name: this.$route.name, params: { id }, query: { type: 'edit', time_stamp: new Date().getTime(), ...this.$route.query } })
      } else {
        this.$router.replace({ name: this.$route.name, params: { id }, query: { type: 'edit', time_stamp: new Date().getTime(), ...this.$route.query } })
      }
    },
    async collectionCase () {
      try {
        const { is_collection } = this.caseDetail
        if (is_collection) {
          await this.$axios.get(unCollectionCase, { params: { id: this.id } })
        } else {
          await this.$axios.get(collectionCase, { params: { id: this.id } })
        }
        this.caseDetail.is_collection = !is_collection
      } catch (err) {
        console.log(err)
        // this.$toast.error(msg)
      }
    },
    async getCaseDetail () { // 商品详情
      try {
        const { data } = await this.$axios.get(getSceneCaseDetail, { params: { id: this.id } })
        this.caseDetail = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    openGoodDetail ({goods_id, key, is_buy}) { // 打开商品详情页
      if (!is_buy) return
      this.changeSkuDetail({ show: true, id: goods_id, key, dataSource: 'caseGoods' })
    },
    closeCaseDetail () { // 关闭案例详情页
      this.changeCaseDetail({ show: false, id: '' })
    },
    async againCreation (data, id) {
      let query = this.$route.query
      delete query['type']
      if (!this.replace.remind && canvas.getActiveObject()) {
        const confirmed = await this.showReplaceModal({
          title: '替换确认',
          paragraph: '将替换当前画布的全部内容'
        })
        if (!confirmed) return
        this.$router.replace({ name: this.$route.name, params: { id }, query: { ...query, time_stamp: new Date().getTime() } })
      } else {
        this.$router.replace({ name: this.$route.name, params: { id }, query: { ...query, time_stamp: new Date().getTime() } })
      }
    },
    replaceImage (url, item) {
      if (this.matrix.show) {
        this.$toast.message('请先取消变形')
        return
      }
      const _img = canvas.getActiveObjects()
      if (_img.length === 0) {
        this.$toast.message('请先选中被替换的单品')
        return
      }
      if (_img.length > 1) {
        this.$toast.message('只能替换单个商品')
        return
      }
      if (_img[0].type === 'i-text') {
        this.$toast.message('文本不能被替换')
        return
      }
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      canvas.getActiveObjects().forEach(o => {
        // 清楚实例的上下文后成功
        if (o.goods_id) this.changeSketchGoods({ type: 'remove', uid: o.uid })
        canvas.remove(o)
      })
      canvas.discardActiveObject().renderAll()
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        let scale = _img[0].scaleX * _img[0].width / img.width
        let setImg = {
          ..._img[0],
          width: img.width,
          height: img.height,
          scaleX: scale,
          scaleY: scale,
          _element: img._element,
          _originalElement: img._originalElement,
          goods_id: item.goods_id,
          goods_key: item.key,
          uid
        }
        img.set({...setImg})
        canvas.add(img)
        canvas.setActiveObject(img)
        this.changeSketchGoods({ type: 'set', good: { ...item, uid } })
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    addImage (url, item) { // 向画布添加图片
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        img.set({
          goods_id: item.goods_id,
          goods_key: item.key,
          left: 100,
          top: 100,
          uid
        })
        img.scaleToWidth(300)
        canvas.add(img)
        canvas.setActiveObject(img)
        this.changeSketchGoods({ type: 'set', good: { ...item, uid } })
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    }
  },
  computed: {
    ...mapState({
      show: state => state.sketch.caseDetail.show,
      id: state => state.sketch.caseDetail.id,
      matrix: state => state.sketch.matrix,
      replace: state => state.modal.replace
    })
  }
}
</script>

<style lang="scss" scoped>
.scale-enter-active, .scale-leave-active{
  transition: transform 0.3s ease
}
.scale-enter, .scale-leave-active {
  transform: scale(0);
  opacity: 0.3;
}

.case-detail {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #38363D;
}
.case-detail-close {
  font-size: 20px;
  color: #999;
  margin-bottom: 30px;
}
.case-detail-box {
  width: 100%;
  background: #FFFFFF;
  border-radius: 4px;
  position: relative;
  padding: 20px 30px;
}
.case-detail-priview {
  width: 100%;
  height: 370px;
  background-position: 0, 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.case-detail-name {
  margin-top: 20px;
  font-size: 28px;
  line-height: 40px;
}
.case-detail-cell {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.case-detail-tags {
  font-size: 24px;
  color: #999999;
}
.case-detail-handles {
  display: flex;
  align-items: center;
  i {
    font-size: 34px;
    color: #999;
    margin-right: 40px
  }
}
.case-detail-collection {
  font-size: 34px;
  i {
    margin-right: 0;
  }
  .icon-collection {
    color: #999;
  }
  .icon-collection_active {
    color: #FF4F00
  }
}
.case-detail-btn {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #FFBE28;
  border-radius: 4px;
  font-size: 24px;
  margin-top: 40px;
  & .v-touch-ripple {
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
}



.goods-recommend {
  margin-top: 40px;
}
.goods-title {
  padding: 0 5px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #7B7B7B;
}
.goods-body {
  display: inline-block;
  width: 50%;
  padding: 0 5px 10px;
  box-sizing: border-box;
  vertical-align: middle;
}
.good-item {
  background: #fff;
  width: 100%;
  border-radius: 2px;
  padding: 14px;
  vertical-align: top;
}
.good-item--disabled {
  .good-money-vip {
    em {
      color:#999;
    }
  }
  .good-money {
    color: #999;
  }
  .good-name {
    color: #999;
  }
}

.good-btns {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}
.good-btn {
  display: inline-block;
  width: 60px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #38363D;
  border-radius: 2px;
  font-size: 18px;
  color: #FFFFFF;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
}
.good-img {
  background-color: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 247px;
  position: relative;
  .good-img--disabled {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.40);
    z-index: 110;
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
}
.good-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  i {
    font-size: 26px;
  }
  .icon-collection {
    color: #999
  }
  .icon-collection_active {
    color: #FF4F00
  }
}
.good-money-vip {
  & em {
    font-size: 24px;
    color: #C2212A;
    vertical-align: middle;
  }
  & span {
    display: inline-block;
    background: #C2212A;
    border-radius: 2px;
    width: 34px;
    height: 20px;
    padding: 0 3px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin-left: 6px;
    vertical-align: middle;
  }
}
.good-money {
  font-size: 16px;
  color: #FF6C00;
  margin-top: 2px;
  & span {
    margin-right: 5px;
  }
}
.good-name {
  height: 48px;
  margin-top: 5px;
  font-size: 16px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
