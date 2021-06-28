<template lang="pug">
  .goods-slider
    .back-top(v-if="showBackTop" @click="scrollToTop")
      i.icon-up-1
    .goods-menu(v-if="menu.length")
      span(@click="selectMenu(-1)") 品类
      span(v-for="item, index in menu" :class="{'active': index === menu.length - 1}" @click="selectMenu(index)") {{item.name}}
    .goods-menu(v-if="!menu.length && keyword")
      span(@click="selectMenu(-1, 'all')") 全部分类
      span.active 搜索结果
    infinite-scroll.goods-scroller(:loadMore="loadMore" ref="goods")
      .goods-cates(v-if="categoriesList.length")
        .goods-cate(v-for="item in categoriesList" @click="selectCate(item)")
          touch-ripple(:speed="3", :opacity=".6")
            span {{item.name}}
      .filter
        .select
          .select-value(@click.stop="toggleSpaceSelect") {{selectedSpace || '选择空间'}}
            .select-dropdown(v-show="spaceSelect")
              .select-option(@click="selectSpace('')") 全部
              .select-option(v-for="item in spaceList" :class="{'active': selectedSpace === item.name}" @click="selectSpace(item.name)") {{item.name}}
        .select
          .select-value(@click.stop="toggleStyleSelect") {{selectedStyle || '选择风格'}}
            .select-dropdown(v-show="styleSelect")
              .select-option(@click="selectStyle('')") 全部
              .select-option(v-for="item in styleList" :class="{'active': selectedStyle === item.name}" @click="selectStyle(item.name)") {{item.name}}
        .select
          .select-value(@click.stop="toggleSourceSelect") {{selectedSource.name || '所有商品来源'}}
            .select-dropdown(v-show="sourceSelect")
              .select-option(@click="selectSource('')") 所有商品来源
              .select-option(v-for="item in sourceList" :class="{'active': selectedStyle === item.name}" @click="selectSource(item)") {{item.name}}
      .goods-list
        .goods-body(v-for="item in goodsList")
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
              i.icon-collection_active(v-if="item.is_collection" @click.stop="collectionGood(item)")
              i.icon-collection(v-else @click.stop="collectionGood(item)")
            .good-money
              span 零售价
              em ¥{{item.market_price}}
            p.good-name {{item.goods_name}}
        .empty(v-if="isEmpty")
          img(src="../../../../static/images/search_img_notf_dis.png")
          p 未找到相关商品
</template>

<script>
import infiniteScroll from '@/components/infiniteScroll'
import { searchSKU, setCollection, unCollection, getCategoryList } from 'api'
import { mapState, mapActions } from 'vuex'
import uuid from 'uuid/v4'
let timer
let longtouchTimer
export default {
  name: 'goodList',
  props: {
    keyword: String
  },
  data () {
    return {
      eventList: {
        TOUCH_START: this.isMobile() ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: this.isMobile() ? 'touchmove' : 'mousemove',
        TOUCH_END: this.isMobile() ? 'touchend' : 'mouseup'
      },
      categoriesList: [],
      menu: [],
      goodsList: [],
      // moreCates: [],
      pageCode: 0,
      inited: false,
      isEmpty: false,
      isLoading: false,
      isLoaded: false,
      sourceList: [
        { name: '直供商品', value: 'plat' },
        { name: '本地馆商品', value: 'shop' },
      ],
      spaceSelect: false,
      styleSelect: false,
      sourceSelect: false,
      selectedStyle: '',
      selectedSpace: '',
      selectedSource: {},
      showBackTop: false
    }
  },
  watch: {
    '$route' () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.getGoodsList()
      }, 300)
    },
    keyword (v) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (v) {
          this.getGoodsList()
        } else {
          this.$router.replace({ name: this.$route.name, query: { tm: new Date().getTime() } })
        }
      }, 600)
    }
  },
  methods: {
    ...mapActions([
      'changeSkuDetail',
      'changeSketchGoods',
      'updateHistory'
    ]),
    selectMenu (index, type = '') {
      if (type === 'all') {
        this.setKeyword('')
        this.$router.replace({ name: this.$route.name, query: { tm: new Date().getTime() } })
      } else {
        // 如果选的是当前的导航，不做操作
        if (this.menu.length === index + 1) return
        if (index === -1) {
          this.setKeyword('')
          this.$router.replace({ name: this.$route.name, query: { tm: new Date().getTime() } })
        } else {
          this.menu.splice(index + 1, this.menu.length)
          this.$router.replace({name: this.$route.name, query: { ...this.$route.query, category_id: this.menu[index].id }})
        }
      }
    },
    selectCate (item) {
      this.menu.push(item)
      this.$router.replace({name: this.$route.name, query: { ...this.$route.query, category_id: item.id }})
    },
    selectSpace (space) {
      this.selectedSpace = space
      this.getGoodsList()
    },
    selectStyle (style) {
      this.selectedStyle = style
      this.getGoodsList()
    },
    selectSource (source) {
      this.selectedSource = source
      this.getGoodsList()
    },
    toggleSpaceSelect () {
      this.spaceSelect = !this.spaceSelect
    },
    toggleStyleSelect () {
      this.styleSelect = !this.styleSelect
    },
    toggleSourceSelect () {
      this.sourceSelect = !this.sourceSelect
    },
    setKeyword (cate) {
      this.$emit('setKeyword', cate)
    },
    async getGoodsList () {
      try {
        const { data } = await this.$axios.get(searchSKU, {
          params: {
            ...this.$route.query,
            goods_from: this.selectedSource.value,
            style_words: this.selectedStyle,
            space_words: this.selectedSpace,
            search_words: this.keyword
          }
        })
        this.isEmpty = !data.ls.length
        this.isLoading = false
        this.isLoaded = false
        this.pageCode = 0
        this.categoriesList = data.c_list
        if (!this.menu.length && data.c_path.cat_id) this.menu = [{ id: data.c_path.cat_id, name: data.c_path.cat_name }]
        this.pageCode = data.page_code
        this.goodsList = data.ls
        this.inited = true
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(searchSKU, {
          params: {
            ...this.$route.query,
            goods_from: this.selectedSource.value,
            style_words: this.selectedStyle,
            space_words: this.selectedSpace,
            search_words: this.keyword,
            page_code: this.pageCode
          }
        })
        this.pageCode = data.page_code
        this.goodsList.push(...data.ls)
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
      }
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
    },
    watchScroller () {
      const scroller = this.$refs.goods.$el
      scroller.addEventListener('scroll', () => {
        const { scrollTop, offsetHeight } = this.$refs.goods.$el
        this.showBackTop = scrollTop >= offsetHeight * 2 // 滚动大于两屏时，显示返回顶部
      })
    },
    scrollToTop () {
      const scroller = this.$refs.goods.$el
      scroller.scrollTop = 0
    }
  },
  created () {
    const { style_words = '', space_words = '', } = this.$route.query
    this.selectedStyle = style_words
    this.selectedSpace = space_words
    this.getGoodsList()
  },
  mounted () {
    this.initDrag()
    this.watchScroller()
    document.addEventListener('click', () => {
      this.spaceSelect = false
      this.styleSelect = false
      this.sourceSelect = false
    })
  },
  computed: {
    ...mapState({
      matrix: state => state.sketch.matrix,
      styleList: state => state.sketch.styleList,
      spaceList: state => state.sketch.spaceList
    })
  },
  components: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
.goods-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: #38363D;
}
.back-top {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.80);
  box-shadow: 0 6px 14px 0 rgba(30,32,32,0.14);
  transition: transform .3s;
  position: absolute;
  bottom: 100px;
  right: 20px;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  &:active {
    transform: scale(1.2);
  }
  & i {
    font-size: 36px;
  }
}
.goods-menu {
  display: flex;
  align-items: center;
  font-size: 24px;
  padding: 0 5px;
  margin-bottom: 20px;
  span {
    color: #fff;
    cursor: pointer;
    &:last-child:after {
      content: '';
    }
    &:after {
      content: '\e65c';
      font-family: iconfont;
      speak: none;
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
      margin: 0 10px;
      width: 10px;
      font-size: 20px;
      color: #7B7B7B;
    }
  }
  .active {
    color: #7B7B7B;
  }
}
.goods-cates {
  margin-bottom: 30px;
  padding: 0 5px;
  .goods-cate {
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-block;
    vertical-align: top;
    span {
      display: inline-block;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 0 20px;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      color: #666666;
    }
  }
}
.filter {
  display: flex;
  padding: 0 5px;
}
.select {
  width: 100%;
  position: relative;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
  .select-value {
    height: 50px;
    position: relative;
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    padding: 10px 15px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    &:after {
      content: '';
      border: 6px solid transparent;
      border-top-color: #333;
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      margin-top: 3px;
    }
  }
  .select-dropdown {
    position: absolute;
    left: 0;
    top: 55px;
    z-index: 999;
    width: 100%;
    max-height: 335px;
    overflow-y: auto;
    padding: 20px;
    background: #fff;
    border: 1px solid #DDDDDD;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.15);
    border-radius: 4px;
    transition: height .45s cubic-bezier(0.23, 1, 0.26, 1), padding .45s cubic-bezier(0.23, 1, 0.26, 1);
    .select-option {
      line-height: 25px;
      margin-bottom: 20px;
      font-size: 18px;
      position: relative;
      &.active {
        color: #FF6C00;
        &:after {
          content: "\e69c";
          font-family: "iconfont";
          float: right;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.goods-list {
  margin-top: 40px;
}
.goods-body {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
  padding: 0 5px 10px;
  box-sizing: border-box;
}
.good-item {
  background: #fff;
  width: 100%;
  height: 409px;
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

.empty {
  padding-top: 100px;
  text-align: center;
  img {
    width: 180px;
    margin: 0 auto;
  }
  p {
    font-size: 24px;
    color: #7B7B7B;
    margin-top: 30px;
  }
}
</style>
