<template lang="pug">
  infinite-scroll.good-list(:loadMore="loadMore" ref="goods")
    .goods-body(v-for="item,index in goodsList")
      .good-item(@click="openGoodDetail(item.goods_id, item.key, 'goodsList')", :key="item.goods_id")
        .good-btns
          .good-btn(@click.stop="replaceImage(item.original_img, item)") 替换
          .good-btn(@click.stop="addImage(item.original_img, item)") 添加
        .good-img(
          :style="{'background-image': `url(${item.original_img}?imageslim&imageView2/0/w/560)`}"
          :id="item.goods_id"
          type="good"
          source="goodsList"
        )
        .good-cell
          .good-money-vip
            em ¥{{item.shop_price}}
            span 会员
          i.icon-collection_active(v-if="item.is_collection" @click.stop="collectionGood(index)")
          i.icon-collection(v-else @click.stop="collectionGood(index)")
        .good-money
          span 零售价
          em ¥{{item.market_price}}
        p.good-name {{item.goods_name}}
    .good-list-info(v-if="!goodsList.length") 暂无收藏的商品
</template>

<script>
import infiniteScroll from '@/components/infiniteScroll'
import { collectionSKU, setCollection, unCollection } from 'api'
import { mapState, mapActions } from 'vuex'
import uuid from 'uuid/v4'
let longtouchTimer
export default {
  name: 'collectionGoods',
  data () {
    return {
      eventList: {
        TOUCH_START: this.isMobile() ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: this.isMobile() ? 'touchmove' : 'mousemove',
        TOUCH_END: this.isMobile() ? 'touchend' : 'mouseup'
      },
      goodsList: [],
      pageCode: 0,
      collectionStatus: false,
      isLoading: false,
      isLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'changeSkuDetail',
      'changeSketchGoods',
      'updateHistory'
    ]),
    async getGoodsList () {
      try {
        const { data } = await this.$axios.get(collectionSKU)
        this.isLoading = false
        this.isLoaded = false
        this.pageCode = 0
        this.moreCates = data.c_list
        this.pageCode = data.page_code
        this.goodsList = data.ls
        this.collectionStatus = false
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(collectionSKU, { params: { page_code: this.pageCode } })
        this.pageCode = data.page_code
        this.goodsList.push(...data.ls)
        this.isLoaded = !data.ls.length
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
      }
    },
    async collectionGood (index) {
      try {
        if (this.collectionStatus) return
        this.collectionStatus = true
        let good = this.goodsList[index]
        if (good.is_collection) {
          await this.$axios.get(unCollection, {
            params: { goods_id: good.goods_id }
          })
        } else {
          await this.$axios.get(setCollection, {
            params: { goods_id: good.goods_id }
          })
        }
        this.$set(good, 'is_collection', !good.is_collection)
        this.getGoodsList()
      } catch ({msg}) {
        this.$toast.error(msg)
      }
    },
    openGoodDetail (id, key, dataSource) { // 显示详情页
      this.changeSkuDetail({ show: true, id, key, dataSource })
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
    },
    isMobile() {
      return !!(navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      )
    },
    initDrag () {
      // 注册一个自定义事件,事件在拖拽目标时手动触发
      const mydragstart = new CustomEvent('mydragstart')
      const mydragend = new CustomEvent('mydragend')
      this.$refs.goods.$el.addEventListener(this.eventList.TOUCH_START, (e) => {
        if (!e.cancelable) return // 滚动时无法长按拖拽
        if (e.target.className.indexOf('good-img') === -1) return

        clearInterval(longtouchTimer)

        let longtouchTime = 500
        let startTouchs = this.isMobile() ? e.changedTouches[0] : e
        let _target = null
        let image = e.target
        let rect = image.getBoundingClientRect()
        let isDropZone = false // 是否位于接收拖拽事件的容器中（绑定myDragover且阻止了默认事件）
        let include = null // 位于当前拖拽位置的元素

        longtouchTimer = setTimeout(() => {
          window.dispatchEvent(mydragstart) // 接收拖拽事件的容器会切换为显示状态

          _target = image.cloneNode(true)
          _target.style.width = image.offsetWidth + 'px'
          _target.style.height = image.offsetHeight + 'px'
          _target.style.position = 'fixed'
          _target.style.left = rect.left + 'px'
          _target.style.top = rect.top + 'px'
          _target.style.pointerEvents = 'none'
          _target.style.transition = 'transform .3s'

          document.body.appendChild(_target)

          setTimeout(() => {
            _target.style.transform = 'scale(1.2)'
          }, 50)

          const click = (e) => { // 阻止长按触发点击事件(pc)
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
            e.target.removeEventListener('click', click)
          }
          const touchmoving = (e) => { // 阻止拖拽图片时滚动容器
            e.preventDefault()
          }
          const touchend = (e) => {
            e.preventDefault()
            e.target.removeEventListener(this.eventList.TOUCH_MOVE, touchmoving)
            e.target.removeEventListener(this.eventList.TOUCH_END, touchend)
          }
          image.addEventListener('click', click)
          image.addEventListener(this.eventList.TOUCH_MOVE, touchmoving)
          image.addEventListener(this.eventList.TOUCH_END, touchend)
        }, longtouchTime)

        let mousemove = (e) => {
          let currentTouchs = this.isMobile() ? e.changedTouches[0] : e
          // 长按时如果有滑动行为，取消长按判定
          if (Math.abs(currentTouchs.clientX - startTouchs.clientX) > 30 || Math.abs(currentTouchs.clientY - startTouchs.clientY) > 30) {
            clearInterval(longtouchTimer)
          }
          // 副本存在时，跟随鼠标移动
          requestAnimationFrame(() => {
            if (_target) {
              e.preventDefault()
              let point = this.isMobile() ? e.changedTouches[0] : e
              let event = document.createEvent('Event')
              event.initEvent('myDragover', true, true)
              include = document.elementFromPoint(point.pageX, point.pageY)
              include && include.dispatchEvent(event)
              isDropZone = event.defaultPrevented
              _target.style.left = Math.round(point.pageX - (startTouchs.pageX - rect.left)) + 'px'
              _target.style.top = Math.round(point.pageY - (startTouchs.pageY - rect.top)) + 'px'
            }
          })
        }

        document.addEventListener(this.eventList.TOUCH_MOVE, mousemove)

        document.addEventListener(this.eventList.TOUCH_END, (e) => {
          clearInterval(longtouchTimer)
          document.removeEventListener(this.eventList.TOUCH_MOVE, mousemove)
          if (_target) {
            e.preventDefault()
            // 拖动结束时，移除副本
            if (isDropZone) {
              let event = document.createEvent('Event')
              event.initEvent('myDrop', true, true)
              let point = this.isMobile() ? e.changedTouches[0] : e
              let source = image.getAttribute('source')
              let currentInfo = {}
              currentInfo = this[source].find(item => parseInt(image.getAttribute('id')) === item.goods_id)
              event['pageX'] = point.pageX
              event['pageY'] = point.pageY
              event['data'] = {
                type: image.getAttribute('type'),
                url: currentInfo.original_img,
                ...currentInfo
              }
              // 派发事件
              include.dispatchEvent(event)
            }
            document.body.removeChild(_target)
            _target = null
            window.dispatchEvent(mydragend)
          }
        })
      })
    },
    handleTouchstart (e, good) {
      clearInterval(longtouchTimer)
      longtouchTimer = setTimeout(() => {
        e.preventDefault()
        this.$set(good, 'longtouch', true)
      }, 500)
    },
    handleTouchend (e, good) {
      clearInterval(longtouchTimer)
      if (good.longtouch) {
        e.preventDefault()
        this.$set(good, 'longtouch', false)
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  mounted () {
    this.initDrag()
  },
  computed: {
    ...mapState({
      matrix: state => state.sketch.matrix
    })
  },
  components: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
.good-list {
  background: #38363D;
  margin-top: 30px;
  padding-bottom: 30px;
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
  position: relative;
}

.good-btns {
  position: absolute;
  right: 0;
  top: 10px;
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
}
.good-img {
  background-color: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 247px;
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
.good-list-info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #7B7B7B;
}
</style>
