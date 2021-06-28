<template lang="pug">
transition(name="detail")
  .detail
    .detail-header(v-if="!showSearchInput")
      .detail-back(@click="close")
        .iconfont.icon-close
      .detail-info
        .detail-brand-info
          .detail-brand-logo(:style="{ 'background-image': `url(${brandDetail.logo})` }")
          .detail-brand-name {{brandDetail.name}}
        .detail-search(@click="changeSearch")
          .icon-search
          .detail-search-text 搜索
    .detail-header(v-else)
      .detail-back(@click="back")
        .iconfont.icon-back-1
        .detail-header-title 返回
      .detail-search-header
        .search
          .search-icon.icon-search
          input.search-input(placeholder="请输入搜索内容" v-model="keyword")
          .search-clear(v-if="keyword" @click="clearKeyword")
            .icon-close
        //- 打开筛选栏
        .filter(@click="showScreening")
          .icon-filter
          p 筛选
    infinite-scroll.goods-content(:loadMore="loadMore" ref="brandList" v-show="brandGoods.length")
      .goods-body(v-for="item in brandGoods")
        .good-item(@click="openGoodDetail(item.goods_id, item.key, 'brandGoods')", :key="item.goods_id")
          .good-btns
            .good-btn(@click.stop="replaceImage(item.original_img, item)") 替换
            .good-btn(@click.stop="addImage(item.original_img, item)") 添加
          .good-img(
            :style="{'background-image': `url(${item.original_img}?imageslim&imageView2/0/w/560)`}"
            :id="item.goods_id"
            type="good"
            source="brandGoods"
          )
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
    .goods-content-info(v-if="!brandGoods.length")
      img(src="../../../../static/images/search_img_notf_dis.png")
      .brand-list-info-text 未找到相关商品
    brand-goods-detail
</template>

<script>
import { brandGoods, unCollection, setCollection } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import brandGoodsDetail from './brandGoodsDetail'
import { mapState, mapActions } from 'vuex'
import uuid from 'uuid/v4'
let timer
let longtouchTimer
export default {
  name: 'brandDetail',
  props: {
    brandId: [String, Number]
  },
  components: {
    infiniteScroll,
    brandGoodsDetail
  },
  data () {
    return {
      eventList: {
        TOUCH_START: this.isMobile() ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: this.isMobile() ? 'touchmove' : 'mousemove',
        TOUCH_END: this.isMobile() ? 'touchend' : 'mouseup'
      },
      showSearchInput: false,
      page: 1,
      pageSize: 20,
      keyword: '',
      brandDetail: {},
      brandGoods: []
    }
  },
  computed: {
    ...mapState({
      matrix: state => state.sketch.matrix,
      brandScreening: state => state.sketch.brandScreening,
      screeningConfirm: state => state.sketch.brandScreeningConfirm.confirmed
    })
  },
  watch: {
    keyword (v) {
      this.page = 1
      this.getBrandGoods()
    },
    screeningConfirm (v) {
      if (v) {
        this.changeBrandScreeningConfirm({ confirmed: false })
        this.getBrandGoods()
      }
    }
  },
  methods: {
    ...mapActions([
      'changeBrandScreening',
      'changeBrandGoodsDetail',
      'changeBrandScreeningConfirm'
    ]),
    showScreening () {
      this.changeBrandScreening({ show: true, brandId: this.brandDetail.id })
    },
    changeSearch () {
      this.showSearchInput = true
    },
    close () {
      this.$emit('closeBrandDetail')
    },
    back () {
      this.keyword = ''
      this.changeBrandScreening({show: false, search_words: '', brandId: '', first_id: '', second_id: '', three_id: '', category_id: ''})
      this.getBrandGoods()
      this.showSearchInput = false
    },
    clearKeyword () {
      this.keyword = ''
    },
    openGoodDetail (id, key, dataSource) { // 显示详情页
      this.changeBrandGoodsDetail({ show: true, id, key, dataSource })
    },
    async collectionGood (item) {
      try {
        const { is_collection, goods_id } = item
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
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(brandGoods, {
          params: {
            is_sku: 1,
            keyword: this.keyword,
            brand_id: this.brandId,
            page: this.page,
            page_size: this.pageSize
          }
        })
        this.page += 1
        this.brandGoods.push(...data.goods)
        if (!data.goods.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
      }
    },
    async getBrandGoods () {
      try {
        this.page = 1
        const { data } = await this.$axios.get(brandGoods, { params: { brand_id: this.brandId, is_sku: 1, keyword: this.keyword, page: this.page, page_size: this.pageSize, category_id: this.brandScreening.category_id || '' } })
          this.brandDetail = data.brand
          this.brandGoods = data.goods
          this.isLoading = false
          this.isLoaded = false
          this.page += 1
      } catch (err) {
        this.$toast.error(err.msg)
      }
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
      this.$refs.brandList.$el.addEventListener(this.eventList.TOUCH_START, (e) => {
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
    }
  },
  created () {
    this.getBrandGoods()
  },
  mounted () {
    this.initDrag()
  }
}
</script>

<style scoped lang="scss">
.detail-enter-active, .detail-leave-active{
  transition: transform 0.3s ease
}
.detail-enter, .detail-leave-active {
  transform: scale(0);
  opacity: 0.3;
}
.detail {
  position: relative;
  height: 100%;
}
.detail-back {
  display: flex;
  align-items: center;
  padding: 4px 4px 30px;
  .iconfont {
    font-size: 20px;
    color: #999;
  }
  .icon-back-1 {
    margin-right: 20px;
  }
  .detail-header-title {
    font-size: 24px;
    color: #999999;
  }
}
.detail-search-header {
  display: flex;
  .filter {
    text-align: center;
    font-size: 22px;
    color: #fff;
    margin-left: 20px;
    .icon-filter {
      font-size: 34px;
      margin-bottom: 10px;
    }
  }
}
.search {
  flex: 1;
  position: relative;
  height: 70px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.10);
  border-radius: 4px;
  overflow: hidden;
  .search-icon {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 33px;
    color: #999;
  }
  .search-input {
    width: 100%;
    height: 100%;
    padding-left: 84px;
    padding-right: 60px;
    font-size: 20px;
  }
  .search-clear {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #000;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
  }
}
.detail-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  .detail-search {
    width: 162px;
    height: 70px;
    background: #7B7B7B;
    border-radius: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-search {
      font-size: 34px;
      color: #fff;
    }
    .detail-search-text {
      margin-left: 20px;
      font-size: 20px;
      color: #FFFFFF;
    }
  }
}
.detail-brand-info {
  display: flex;
  align-items: center;
  .detail-brand-logo {
    width: 104px;
    height: 104px;
    background: #FFFFFF;
    border-radius: 4px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .detail-brand-name {
    margin-left: 20px;
    font-size: 24px;
    color: #FFFFFF;
  }
}
.goods-content {
  margin-top: 40px;
  padding-bottom: 224px;
}
.goods-body {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
  padding: 0 5px 10px;
  box-sizing: border-box;
  .good-item {
    background: #fff;
    width: 100%;
    height: 409px;
    border-radius: 2px;
    padding: 14px;
    vertical-align: top;
    position: relative;
  }
  .good-img {
    background-color: #F5F5F5;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 247px;
  }
  .good-collection {
    position: absolute;
    top: 10px;
    left: 10px;
    i {
      font-size: 34px;
    }
    .icon-collection {
      color: #999
    }
    .icon-collection_active {
      color: #FF4F00
    }
  }
  .good-item-detail {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
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
}
.goods-content-info {
  padding-top: 100px;
  text-align: center;
  img {
    width: 180px;
  }
  .brand-list-info-text {
    margin-top: 30px;
    font-size: 24px;
    color: #7B7B7B;
  }
}
</style>
