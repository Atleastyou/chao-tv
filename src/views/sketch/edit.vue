<template lang="pug">
//- 搭配工具
.sketch
  //- 头部
  sketch-header(:initData="sketch" @changeStorage="changeStorage")
  //- 主体区域
  main.sketch-body
    //- 侧边栏
    sketch-slider(@toggleSlide="resizeCanvas", :parentCurrentNav="parentCurrentNav" ref="sidebar")
    //- 画布区域
    main.sketch-main
      //- 操作栏
      sketch-handles(v-show="requestStatus" @changeRandom="changeRandom")
      .sketch-main-container(v-show="requestStatus")
        .sketch-main-wrapper
          .sketch-canvas(ref="canvasWrap")
            canvas#canvas
          .sketch-matrix3d(v-if="matrix.show")
            image-transform(
              :width="canvasWidth"
              :height="canvasHeight"
              :imgSrc="matrix.img"
              :points="matrix.points"
              ref="matrix3d"
            )
          //- 移动设备上没有拖拽API实现，使用了一个Polyfill, 但是无法拖拽对象到画布上，借由此容器来接受拖拽事件
          .sketch-drop-container(v-show="dropContainerShow" ref="dropContainer")
      .sketch-error(v-show="!requestStatus")
        .icon-error-1
        .sketch-error-info 网络异常，请检查您当前的网络环境！
        .sketch-error-button(@click="againReload") 重新加载
</template>

<script>
import sketchHeader from './header'
import sketchHandles from './handles'
import sketchSlider from './slider/slider'
import fabric from '@/utils/fabric'
import uuid from 'uuid/v4'
import imageTransform from '@/components/ImageTransform'
import { mapActions, mapState } from 'vuex'
import { getSceneCaseDetail, skuInfo } from 'api'
export default {
  name: 'edit',
  data () {
    return {
      dropContainerShow: false,
      canvasBaseWidth: 1440,
      canvasBaseHeight: 800,
      canvasWidth: 1080,
      canvasHeight: 800,
      sketch: {},
      sideShow: true,
      parentCurrentNav: 0
    }
  },
  computed: {
    ...mapState({
      requestStatus: state => state.modal.requestStatus.status,
      matrix: state => state.sketch.matrix,
    })
  },
  methods: {
    ...mapActions([
      'changeMatrix',
      'updateHistory',
      'changeSketchGoods',
      'clearHistory',
      'changeMaterialText',
      'changeVueColor',
      'changeSkuDetail'
    ]),
    changeRandom () {
      this.$refs.sidebar.currentNav = 0
      this.changeSkuDetail({ show: false })
    },
    initDrop () {
      // 接收到该自定义事件后，切换接受拖拽的容器的显示
      window.addEventListener('mydragstart', (e) => {
        this.dropContainerShow = true
      })
      window.addEventListener('mydragend', (e) => {
        this.dropContainerShow = false
      })
      this.$refs.dropContainer.addEventListener('myDragover', (e) => {
        e.preventDefault()
      })
      this.$refs.dropContainer.addEventListener('myDrop', (e) => {
        e.preventDefault()

        // 容器的位置信息
        let containerRect = this.$refs.dropContainer.getBoundingClientRect()
        // 拖拽目标的数据
        let data = e.data || {}
        let uid = uuid()
        let type = data.type
        let url = data.url

        if (type === 'good') {
          fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
            img.set({
              goods_id: data.goods_id,
              goods_key: data.key,
              // 以鼠标位置为中心点
              left: e.pageX - 150 - containerRect.left,
              top: e.pageY - 150 - containerRect.top,
              uid
            })
            img.scaleToWidth(300)
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()
            this.changeSketchGoods({ type: 'set', good: { ...data, uid } })
            this.updateHistory()
          }, {
            crossOrigin: 'anonymous'
          })
        } else {
          fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
            img.set({
              uid,
              left: e.pageX - img.width / 2 - containerRect.left,
              top: e.pageY - img.height / 2 - containerRect.top
            })
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()
            this.updateHistory()
          }, {
            crossOrigin: 'anonymous'
          })
        }
      })
    },
    changeStorage (storage) {
      if (storage) {
        this.parentCurrentNav = 3
      }
    },
    againReload () {
      window.location.reload()
    },
    async initSketch (id) {
      try {
        const { data } = await this.$axios.get(getSceneCaseDetail, { params: { id } })
        this.sketch = data
        this.changeSketchGoods({ type: 'reload', list: data.goods })
        canvas.loadFromJSON(JSON.parse(data.cont), this.updateHistory)
      } catch (err) {
        this.$toast.error(err.msg)
      }
    },
    async addImage () { // 向画布添加图片
      try {
        const { data } = await this.$axios.get(skuInfo, {
          params: {
            goods_id: this.$route.query.add,
            key: this.$route.query.key
          }
        })
        const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
        fabric.Image.fromURL(data.original_img + '?imageslim&imageView2/0/w/1000', (img) => {
          img.set({
            goods_id: data.goods_id,
            goods_key: data.key,
            left: 100,
            top: 100,
            uid
          })
          img.scaleToWidth(300)
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.renderAll()
          this.changeSketchGoods({ type: 'set', good: { ...data, uid } })
          this.updateHistory()
        }, {
          crossOrigin: 'anonymous'
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    resizeCanvas (sideShow = true) { // 重设画布大小
      this.sideShow = sideShow
      // const scale = this.sideShow ? 0.75 : 1
      // this.canvasWidth = this.canvasBaseWidth * scale
      // this.canvasHeight = this.canvasBaseHeight * scale
      canvas.setWidth(this.canvasWidth)
      canvas.setHeight(this.canvasHeight)
    }
  },
  mounted () {
    this.initDrop()

    const scale = this.sideShow ? 0.75 : 1
    // 初始化canvas并把canvas注入到全局
    window.canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      uniScaleTransform: false,
      width: this.canvasWidth,
      height: this.canvasHeight,
      selectionColor: 'rgba(0,0,0,.2)',
      selectionBorderColor: '#000',
      selectionLineWidth: 1,
      selectionDashArray: [10, 10],
      backgroundColor: '#ffffff'
    })

    // 重写添加功能，实现变形时拦截添加行为
    let that = this
    window.canvas.add = function () {
      if (that.matrix.show) {
        that.$toast.message('请先取消变形')
        return
      }

      let obj = arguments[0] // obj->当前要添加的对象
      obj.set({
        minScaleLimit: 50 / obj.width // 限制对象最小缩放比例
      })

      this._objects.push.apply(this._objects, arguments)
      if (this._onObjectAdded) {
        for (var i = 0, length = arguments.length; i < length; i++) {
          this._onObjectAdded(arguments[i])
        }
      }
      this.renderOnAddRemove && this.requestRenderAll()
      return this
    }
    window.canvas.setActiveObject = function (object, e) {
      if (that.matrix.show) return
      var currentActives = this.getActiveObjects()
      this._setActiveObject(object, e)
      this._fireSelectionEvents(currentActives, e)
      return this
    }

    this.resizeCanvas()
    this.updateHistory()
    canvas.on('selection:created', (e) => {
      return false
    })
    canvas.on('object:modified', (e) => { // 修改
      this.updateHistory()
    })
    canvas.on('touch:gesture', (e) => {
      e.target.set({ lockRotation: true })
    })
    // canvas中的内容获取焦点
    canvas.on('selection:updated', (e) => {
      if (e.target.text) {
        this.changeMaterialText({ isText: true })
        this.changeVueColor({ color: e.target.fill })
      } else {
        this.changeMaterialText({ isText: false })
      }
    })
    // canvas中的内容失去焦点
    canvas.on('selection:cleared', (e) => {
      this.changeMaterialText({ isText: false })
    })
    // canvas中创建新内容
    canvas.on('selection:created', (e) => {
      if (e.target.text) {
        this.changeMaterialText({ isText: true })
        this.changeVueColor({ color: e.target.fill })
      } else {
        this.changeMaterialText({ isText: false })
      }
    })
    canvas.on('object:moving', (e) => {
      let img = e.target
      let maxTop = -(img.height * img.scaleY / 2)
      let maxBottom = canvas.height - (img.height * img.scaleY / 2)
      let maxLeft = -(img.width * img.scaleX / 2)
      let maxRight = canvas.width - (img.width * img.scaleX / 2)
      if (img.top < 0 && img.top <= maxTop) img.top = maxTop
      if (img.top > 0 && img.top >= maxBottom) img.top = maxBottom
      if (img.left < 0 && img.left <= maxLeft) img.left = maxLeft
      if (img.left > 0 && img.left >= maxRight) img.left = maxRight
    })
    canvas.wrapperEl.addEventListener('touchend', () => {
      let obj = canvas.getActiveObject()
      if (obj) obj.set({ lockRotation: obj.lockScalingX })
    })
    if (this.$route.query.add) this.addImage()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (to.params.id) vm.initSketch(to.params.id)
    })
  },
  beforeRouteLeave (to, from, next) {
    this.clearHistory()
    next()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    if (to.params.id && to.params.id !== from.params.id) {
      this.initSketch(to.params.id)
      // 再创作时，关闭变形模式
      this.changeMatrix({points: {}, img: '', show: false})
    }
  },
  components: {
    imageTransform,
    sketchHeader,
    sketchHandles,
    sketchSlider
  }
}
</script>

<style lang="scss" scoped>

.sketch {
  height: 100%;
  padding-top: 100px;
}
.sketch-body {
  height: 100%;
  display: flex;
}
.sketch-main {
  width: 100%;
  height: 100%;
  background: rgb(245,245,247);
  padding-top: 80px;
}
.sketch-main-container {
  flex: 1;
  height: 100%;
  background: rgb(245,245,247);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  max-width: 1560px;
  margin: 0 auto;
}
.sketch-main-wrapper {
  width: 1080px;
  height: 800px;
  padding-bottom: 55.556%;
  position: relative;
}
.sketch-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
  border-radius: 8px;
  background: #fff;
}
.sketch-matrix3d {
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
  border-radius: 8px;
}
.sketch-drop-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.sketch-error {
  text-align: center;
  & .icon-error {
    font-size: 500px;
    color: #ddd;
  }
  & .sketch-error-info {
    margin: 42px 0 80px;
    font-size: 28px;
    color: #999999;
  }
  & .sketch-error-button {
    width: 300px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 28px;
    background: #C2212A;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
