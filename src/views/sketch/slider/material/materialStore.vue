<template lang="pug">
.material(ref="materials")
  .filter
    .select
      .select-value(@click.stop="toggleSpaceSelect") {{selectedSpace || '选择空间'}}
      transition(name="expand")
        .select-dropdown(v-show="spaceSelect")
          .select-option(@click="selectSpace('')") 全部
          .select-option(v-for="item in spaceList" :class="{'active': selectedSpace === item.name}" @click="selectSpace(item.name)") {{item.name}}
    .select
      .select-value(@click.stop="toggleStyleSelect") {{selectedStyle || '选择风格'}}
      transition(name="expand")
        .select-dropdown(v-show="styleSelect")
          .select-option(@click="selectStyle('')") 全部
          .select-option(v-for="item in styleList" :class="{'active': selectedStyle === item.name}" @click="selectStyle(item.name)") {{item.name}}
  .material-container
    infiniteScroll.material-list(:loadMore="loadMore" v-if="list.length")
      .material-item(v-for="item in list")
        .material-item-img(
          :style="{'background-image': `url(${item.img}?imageslim&imageView2/0/w/765)`}"
          :id="item.id"
          type="material"
        )
        .material-item-cell
          .material-item-info 点击添加到画布…
          .material-item-collection(@click.stop="collectionMaterial(item)")
            i.icon-collection_active(v-if="item.is_collection")
            i.icon-collection(v-else)
        .material-item-btns
          .material-item-btn(@click="replaceImage(item.img)") 替换
          .material-item-btn(@click="addImage(item.img)") 添加
    .material-list(v-else)
      .material-list-info
        img(src="../../../../static/images/search_img_notf_dis.png")
        .material-list-info-txt 未找到相关案例
</template>

<script>
import { getSceneMaterials, collectionMaterial, unCollectionMaterial } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import { mapState, mapActions } from 'vuex'
import uuid from 'uuid/v4'
let longtouchTimer
export default {
  name: 'materialStore',
  data () {
    return {
      list: [],
      pageCode: 0,
      isLoading: false,
      isLoaded: false,
      spaceSelect: false,
      styleSelect: false,
      selectedStyle: '',
      selectedSpace: '',
      eventList: {
        TOUCH_START: this.isMobile() ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: this.isMobile() ? 'touchmove' : 'mousemove',
        TOUCH_END: this.isMobile() ? 'touchend' : 'mouseup'
      }
    }
  },
  components: {
    infiniteScroll
  },
  watch: {
    selectedStyle () {
      this.getSceneMaterials()
    },
    selectedSpace () {
      this.getSceneMaterials()
    },
  },
  methods: {
    ...mapActions([
      'changeSketchGoods',
      'updateHistory'
    ]),
    async collectionMaterial (item) {
      try {
        const { is_collection, id } = item
        if (is_collection) {
          await this.$axios.get(unCollectionMaterial, { params: { id } })
        } else {
          await this.$axios.get(collectionMaterial, { params: { id } })
        }
        this.$set(item, 'is_collection', !is_collection)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectSpace (space) {
      this.selectedSpace = space
    },
    selectStyle (style) {
      this.selectedStyle = style
    },
    toggleSpaceSelect () {
      this.spaceSelect = !this.spaceSelect
    },
    toggleStyleSelect () {
      this.styleSelect = !this.styleSelect
    },
    async getSceneMaterials () {
      try {
        const { data } = await this.$axios.get(getSceneMaterials, {
          params: { my: 0, style: this.selectedStyle, space: this.selectedSpace }
        })
        this.pageCode = data.page_code
        this.list = data.ls
        this.isLoaded = false
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(getSceneMaterials, {
          params: {
            my: 0,
            page_code: this.pageCode,
            style: this.selectedStyle,
            space: this.selectedSpace
          }
        })
        this.list.push(...data.ls)
        this.pageCode = data.page_code
        this.isLoaded = !data.ls.length
        this.isLoading = false
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
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

      this.$refs.materials.addEventListener(this.eventList.TOUCH_START, (e) => {
        if (!e.cancelable) return // 滚动时无法长按拖拽
        if (e.target.className.indexOf('material-item-img') === -1) return

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

        document.addEventListener(this.eventList.TOUCH_MOVE, mousemove, { passive: false })

        document.addEventListener(this.eventList.TOUCH_END, (e) => {
          clearInterval(longtouchTimer)
          document.removeEventListener(this.eventList.TOUCH_MOVE, mousemove)
          if (_target) {
            // 拖动结束时，移除副本
            if (isDropZone) {
              let event = document.createEvent('Event')
              event.initEvent('myDrop', true, true)
              let point = this.isMobile() ? e.changedTouches[0] : e
              let currentInfo = this.list.find(item => parseInt(image.getAttribute('id')) === item.id)
              event['pageX'] = point.pageX
              event['pageY'] = point.pageY
              event['data'] = {
                type: image.getAttribute('type'),
                url: currentInfo.img,
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
    handleDragEnd (e) {
      window.dispatchEvent(window.mydragend)
      window.dragTarget = null
    },
    handleDragStart (e, item) {
      e.dataTransfer.setData('type', 'material')
      e.dataTransfer.setData('url', item.img)
      window.dispatchEvent(window.mydragstart)
    },
    replaceImage (url) {
      const _img = canvas.getActiveObjects()
      if (this.matrixShow) {
        this.$toast.message('请先取消变形')
        return
      }
      if (_img.length === 0) {
        this.$toast.message('请先选中被替换的素材')
        return
      }
      if (_img.length > 1) {
        this.$toast.message('只能替换单个素材')
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
        let imgInfo = {
          ..._img[0],
          width: img.width,
          height: img.height,
          scaleX: scale,
          scaleY: scale,
          _element: img._element,
          _originalElement: img._originalElement,
          uid
        }
        if (imgInfo.goods_id) delete imgInfo.goods_id
        img.set({ ...imgInfo })
        canvas.add(img)
        canvas.setActiveObject(img)
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    addImage (url) { // 向画布添加图片
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        img.set({
          uid
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    }
  },
  computed: {
    ...mapState({
      styleList: state => state.sketch.styleList,
      spaceList: state => state.sketch.spaceList,
      matrixShow: state => state.sketch.matrix.show
    })
  },
  created () {
    this.getSceneMaterials()
  },
  mounted () {
    document.addEventListener('click', () => {
      this.spaceSelect = false
      this.styleSelect = false
    })
    this.initDrag()
  }
}
</script>

<style lang="scss" scoped>
.expand-enter, .expand-leave-to {
  height: 0!important;
  padding-top: 0!important;
  padding-bottom: 0!important;
  border-width: 0!important;
}

.material {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #38363D;
}

.filter {
  display: flex;
  margin-top: 30px;
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
    z-index: 99;
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

.material-container {
  height: 780px;
}
.material-list {
  margin-top: 30px;
  padding-bottom: 30px;
}
.material-item {
  display: inline-block;
  vertical-align: middle;
  padding: 10px;
  margin-right: 2%;
  margin-bottom: 2%;
  position: relative;
  width: 49%;
  background: #FFFFFF;
  border-radius: 2px;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.material-item-img {
  width: 100%;
  height: 142px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #fff;
}
.material-item-cell {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
  & .material-item-info {
    color: #999999;
    font-size: 14px;
  }
  .material-item-collection {
    font-size: 26px;
    .icon-collection {
      color:#999;
    }
    .icon-collection_active {
      color: #FF4F00
    }
  }
}
.material-item-btns {
  position: absolute;
  top: 10px;
  right: 0;
}
.material-item-btn {
  margin-right: 10px;
  display: inline-block;
  width: 60px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #252429;
  border-radius: 2px;
  font-size: 18px;
  color: #fff;
}
.material-list-info {
  text-align: center;
  margin-top: 211px;
  img {
    width: 200px;
  }
  .material-list-info-txt {
    margin-top: 30px;
    font-size: 22px;
    color: #7B7B7B;
  }
}
</style>
