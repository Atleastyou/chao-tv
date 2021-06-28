<template lang="pug">
  .matrix-wrapper
    .matrix-container(v-show="isInit" :style="{width: `${width}px`, height: `${height}px`}" ref="container")
      img.matrix-img(ref="img" :src="imgSrc")
      button.pt.tl(ref="tl" :style="{left: `${transform.topLeft.x}px`, top: `${transform.topLeft.y}px`}")
      button.pt.tr(ref="tr" :style="{left: `${transform.topRight.x}px`, top: `${transform.topRight.y}px`}")
      button.pt.bl(ref="bl" :style="{left: `${transform.bottomLeft.x}px`, top: `${transform.bottomLeft.y}px`}")
      button.pt.br(ref="br" :style="{left: `${transform.bottomRight.x}px`, top: `${transform.bottomRight.y}px`}")
    svg#dashed(v-if="isInit" :style="svgStyle")
      line(
        v-for="item in lines"
        stroke="#bbb"
        stroke-width="1"
        stroke-dasharray="10,10"
        :x1="item[0].x"
        :y1="item[0].y"
        :x2="item[1].x"
        :y2="item[1].y"
      )
</template>

<script>
import '@/utils/PerspectiveTransform.min.js'
import '@/utils/glfx.js'
export default {
  name: 'ImageTransform',
  props: {
    points: {
      type: Object,
      required: true
    },
    width: { // 画布宽度
      type: Number,
      required: true
    },
    height: { // 画布高度
      type: Number,
      required: true
    },
    imgSrc: { // 图片url
      type: String,
      required: true
    },
  },
  data() {
    return {
      backImg: null,
      isInit: false, // 是否初始化完成
      imageWidth: 0, // 图片宽度
      imageHeight: 0,
      transform: { // 4个角的位置
        topLeft: {},
        topRight: {},
        bottomLeft: {},
        bottomRight: {}
      },
      eventList: {
        TOUCH_START: this.isMobile() ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: this.isMobile() ? 'touchmove' : 'mousemove',
        TOUCH_END: this.isMobile() ? 'touchend' : 'mouseup'
      },
      hasTranspa: false
    }
  },
  created() {
    this.backImg = new Image()
    this.backImg.crossOrigin = ''
    this.backImg.src = this.imgSrc
    this.backImg.onload = () => {
      this.imageWidth = this.backImg.width
      this.imageHeight = this.backImg.height
      this.init()
    }
  },
  computed: {
    pointData () {
      const { topLeft, topRight, bottomLeft, bottomRight } = this.transform
      const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
      const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
      const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
      const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
      return { minX, maxX, minY, maxY }
    },
    svgStyle () { // 边框位置
      const { minX, maxX, minY, maxY } = this.pointData
      return {
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${maxX - minX}px`,
        height: `${maxY - minY}px`
      }
    },
    lines () { // 线条
      const { minX, maxX, minY, maxY } = this.pointData
      const { topLeft, topRight, bottomLeft, bottomRight } = this.transform
      return [ // top/right/bottom/left
        [
          {
            x: topLeft.x - minX,
            y: topLeft.y - minY
          },
          {
            x: topRight.x - minX,
            y: topRight.y - minY
          }
        ],
        [
          {
            x: topRight.x - minX,
            y: topRight.y - minY
          }, {
            x: bottomRight.x - minX,
            y: bottomRight.y - minY
          }
        ], 
        [
          {
            x: bottomRight.x - minX,
            y: bottomRight.y - minY
          },
          {
            x: bottomLeft.x - minX,
            y: bottomLeft.y - minY
          }
        ],
        [
          {
            x: bottomLeft.x - minX,
            y: bottomLeft.y - minY
          },
          {
            x: topLeft.x - minX,
            y: topLeft.y - minY
          }
        ]
      ]
    }
  },
  methods: {
    init () {
      /**
        初始化矩阵转换类，功能的核心，通过四个point的位置进行透视变换，matrix3d会自动绑定到传入的元素上
        不需要关心内部实现，只需要在恰当的时候更新四个point的位置
      **/
      this.transform = new PerspectiveTransform(this.$refs.img, this.imageWidth, this.imageHeight, true)

      // 更新四个point的位置
      this.updateAllPoint()

      // 避免初始化时闪烁，一开始画布是隐藏的，初始化完成后再显示
      this.isInit = true

      this.$refs.container.addEventListener(this.eventList.TOUCH_START, (e) => {
        let pointName = e.target.classList[1]
        let mousemove = this.updatePoint.bind(this, pointName)
        document.addEventListener(this.eventList.TOUCH_MOVE, mousemove)
        document.addEventListener(this.eventList.TOUCH_END, () => {
          document.removeEventListener(this.eventList.TOUCH_MOVE, mousemove)
        })
      })
    },
    // 更新四个point的位置
    updateAllPoint () {
      const { tl, tr, bl, br } = this.points
      this.transform.topLeft.x = tl.x
      this.transform.topLeft.y = tl.y
      this.transform.topRight.x = tr.x
      this.transform.topRight.y = tr.y
      this.transform.bottomLeft.x = bl.x
      this.transform.bottomLeft.y = bl.y
      this.transform.bottomRight.x = br.x
      this.transform.bottomRight.y = br.y
      this.transform.update()
    },

    isIntersect (e, t, a, i, s, o, n, r) { // 避免图形翻转
      const l = (e,t,a,i,s,o) => (o - t) * (a - e) > (i - t) * (s - e) ? 1 : (o - t) * (a - e) == (i - t) * (s - e) ? 0 : -1
      const c = l(e, t, a, i, n, r)
      const d = l(e, t, a, i, s, o)
      const h = l(e, t, s, o, n, r)
      const _ = l(a, i, s, o, n, r)
      return c !== d && h !== _
    },

    // 更新单个point的位置, 通过拖拽触发
    updatePoint(pointName, e) {
      let key = { tl: 'topLeft', tr: 'topRight', bl: 'bottomLeft', br: 'bottomRight' }[pointName]

      if (!key) return

      let _transform = JSON.parse(JSON.stringify(this.transform))

      // 计算拖拽后的位置
      let target = this.isMobile() ? e.changedTouches[0] : e
      let container = this.$refs.container.getBoundingClientRect()
      _transform[key] = { x: target.pageX - container.left, y: target.pageY - container.top }

      // 计算拖拽后的位置是否超过对角线
      const isIntersect = this.isIntersect(
        _transform.topLeft.x,
        _transform.topLeft.y,
        _transform.bottomRight.x,
        _transform.bottomRight.y,
        _transform.topRight.x,
        _transform.topRight.y,
        _transform.bottomLeft.x,
        _transform.bottomLeft.y
      )
      // 超过对角线，该次拖拽无效
      if (!isIntersect) return

      // 没超过，更新point，绘制新图片
      this.transform[key] = _transform[key]
      this.transform.update()
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
    toDataUrl(cb) {
      let createLoading = this.$loading()
      let backCanvas = null
      let texture = null
      const { topLeft, topRight, bottomLeft, bottomRight } = this.transform
      const { minX, maxX, minY, maxY } = this.pointData
      const width = maxX - minX
      const height = maxY - minY
      let wradio = this.imageWidth / width
      let hradio = (height / width * this.imageWidth) / height

      let points = [ [0, 0], [0, 0], [0, 0], [0, 0] ]
      backCanvas = window.fx.canvas()

      // 贴边
      // top/left
      points[0][0] = (topLeft.x - minX) * wradio
      points[0][1] = (topLeft.y - minY) * hradio
      // top/right
      points[1][0] = (topRight.x - minX) * wradio
      points[1][1] = (topRight.y - minY) * hradio
      // bottom/right
      points[2][0] = (bottomRight.x - minX) * wradio
      points[2][1] = (bottomRight.y - minY) * hradio
      // bottom/left
      points[3][0] = (bottomLeft.x - minX) * wradio
      points[3][1] = (bottomLeft.y - minY) * hradio

      this.backImg.setAttribute('width', width * wradio)
      this.backImg.setAttribute('height', height * hradio)
      setTimeout(() => {
        texture = backCanvas.texture(this.backImg)
        // tl/tr/br/bl
        backCanvas.draw(texture).perspective(
          [0, 0, width * wradio, 0, width * wradio, height * hradio, 0, height * hradio],
          [points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]]
        ).update()
        let url = backCanvas.toDataURL()
        texture.destroy()
        backCanvas = null
        cb({url, left: minX, top: minY, width, height, loading: createLoading})
      }, 300)
    }
  }
}
</script>

<style lang='scss' scoped>
.matrix-wrapper {
  .matrix-container {
    .matrix-img {
      user-select: none;
      touch-action: none;
      pointer-events: none;
      width: initial;
      height: initial;
      max-width: initial;
      max-height: initial;
    }
    .pt {
      position: absolute;
      width: 40px;
      height: 40px;
      background: #fff;
      border: 4px solid #333;
      border-radius: 1px;
      margin-left: -20px;
      margin-top: -20px;
      cursor: pointer;
    }
  }
}
#dashed {
  position: absolute;
  touch-action: none;
  user-select: none;
  pointer-events: none;
  z-index: 100;
}
</style>