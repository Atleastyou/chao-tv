<template lang="pug">
  .sketch-handles
    //- 用于初始化uploader，按钮是隐藏的无法手动触发
    .upload(ref="upload")
    .sketch-handles-bar(v-show="matrixShow")
      .sketch-handles-bar-option.sketch-cancel(@click="cancelHandle")
        i.icon-cancel
        span 取消
      .sketch-handles-bar-option.sketch-confirm(@click="confirmHandle")
        i.icon-confirm
        span 确定
    .sketch-handles-wrapper(v-show="!matrixShow")
      .handle-item.handle-tier(@click.stop="selectTier")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-pre
          .handle-name 层级
        transition(name="tier")
          .handle-tier-body(v-show="showTier")
            .handle-tier-item(v-for="tier in tiers", :title="tier.title" @click.stop="tier.handle")
              .handle-tier-icon(:class="tier.icon")
      //- .handle-item(@click="upLayer")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-up
          .handle-name 上一层
      //- .handle-item(@click="downLayer")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-down
          .handle-name 下一层
      .handle-item(@click="turnHorizontal" v-show="!isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-mirror
          .handle-name 镜像
      .handle-item(@click="copy")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-copy
          .handle-name 复制
      .handle-item(@click="deleteTarget")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-delete
          .handle-name 删除
      .handle-item(@click="lock")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i(:class="lockState ? 'icon-lock' : 'icon-unlock'")
          .handle-name(v-show="lockState") 解锁
          .handle-name(v-show="!lockState") 锁定
      .handle-item(@click="openMatrix3d" v-show="!isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-transform
          .handle-name 变形
      .handle-item(@click="random" v-show="!isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-random
          .handle-name 换一换
      .handle-item(@click="showDetail" v-show="!isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-detail
          .handle-name 详情
      .handle-item(@click.stop="selectColors($event)" v-show="isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-colors(:style="{'color': colors}")
          .handle-item-value 颜色
        .color-picker(v-show="showColorPicker" @click.stop="() => {}")
          chrome-picker(v-model="colors")
      .handle-item(@click="textBold" v-show="isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-bold
          .handle-item-value 加粗
      .handle-item(@click="textItalic" v-show="isText")
        touch-ripple(:speed="3", :opacity=".3" color="#000")
          i.icon-italic
          .handle-item-value 倾斜
</template>

<script>
import uuid from 'uuid/v4'
import { Chrome } from 'vue-color'
import { mapState, mapActions } from 'vuex'
import fabric from '@/utils/fabric'
import Uploader from '@/utils/uploader'
import { randomGood } from 'api'
let timer = null
export default {
  name: 'sketchHandles',
  data () {
    return {
      uploadTimeout: 60 * 1000,
      imgData: {},
      loading: null,
      lockState: false,
      showTier: false,
      tiers: [
        {
          title: '上一层',
          icon: 'icon-pre',
          handle: this.upLayer
        }, {
          title: '下一层',
          icon: 'icon-next',
          handle: this.downLayer
        }, {
          title: '置顶',
          icon: 'icon-stick',
          handle: this.stick
        }, {
          title: '置底',
          icon: 'icon-orlop',
          handle: this.orlop
        }
      ],
      showColorPicker: false
    }
  },
  watch: {
    requestStatus (val) {
      if (!val) {
        this.$toast.error('网络异常，请检查您的网络状态！')
        this.loading && this.loading.close()
      }
    },
    isText (val) {
      if (!val) this.showColorPicker = false
    }
  },
  components: {
    'chrome-picker': Chrome
  },
  mounted () {
    window.addEventListener('click', (e) => {
      this.showTier = false
      this.showColorPicker = false
    })
    this.initUploader()
    this.$nextTick(() => {
      canvas.on('selection:created', ({ target }) => {
        this.lockState = target.lockMovementX && target.lockMovementY && target.lockScalingX && target.lockScalingY && target.lockRotation
      })
      canvas.on('selection:updated', ({ target }) => {
        this.lockState = target.lockMovementX && target.lockMovementY && target.lockScalingX && target.lockScalingY && target.lockRotation
      })
    })
  },
  methods: {
    ...mapActions([
      'changeSkuDetail',
      'changeSketchGoods',
      'updateHistory',
      'changeVueColor',
      'changeMatrix',
      'changeRandomCate'
    ]),
    // 锁定
    lock () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        obj.lockMovementX = !obj.lockMovementX
        obj.lockMovementY = !obj.lockMovementY
        obj.lockScalingX = !obj.lockScalingX
        obj.lockScalingY = !obj.lockScalingY
        obj.lockRotation = !obj.lockRotation
        this.lockState = obj.lockMovementX && obj.lockMovementY && obj.lockScalingX && obj.lockScalingY && obj.lockRotation
      }
      this.updateHistory()
    },
    // 上一层
    upLayer () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        canvas.bringForward(obj)
        canvas.renderAll()
        this.updateHistory()
      }
    },
    // 下一层
    downLayer () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        canvas.sendBackwards(obj)
        canvas.renderAll()
        this.updateHistory()
      }
    },
    // 置顶
    stick () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        canvas.bringToFront(obj)
        canvas.renderAll()
        this.updateHistory()
      }
    },
    // 置底
    orlop () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        canvas.sendToBack(obj)
        canvas.renderAll()
        this.updateHistory()
      }
    },
    selectTier () {
      if (this.showColorPicker) this.showColorPicker = false
      this.showTier = !this.showTier
    },
    // 颜色
    selectColors (ev) {
      if (this.showTier) this.showTier = false
      this.showColorPicker = !this.showColorPicker
    },
    // 文字加粗
    textBold () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj || !obj.text) {
        this.$toast.message('请选择一个目标')
      } else {
        if (obj.fontWeight === 600 || obj.fontWeight === '600' || obj.fontWeight === 'bold') obj.set('fontWeight', 100)
        else obj.set('fontWeight', 'bold')
        canvas.renderAll()
      }
    },
    // 文字倾斜
    textItalic () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj || !obj.text) {
        this.$toast.message('请选择一个目标')
      } else {
        if (obj.fontStyle === 'normal') obj.set('fontStyle', 'italic')
        else obj.set('fontStyle', 'normal')
        canvas.renderAll()
      }
    },
    // 镜像
    turnHorizontal () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        Object.assign(obj, { flipX: !obj.flipX })
        canvas.renderAll()
        this.updateHistory()
      }
    },
    // 复制
    copy () {
      let canvas = window['canvas']
      if (!canvas.getActiveObject()) {
        this.$toast.message('请选择复制目标')
        return
      }
      canvas.getActiveObject().clone((obj) => {
        const uid = uuid()
        const objs = canvas.getActiveObject()
        canvas.discardActiveObject()
        obj.set('left', obj.left + 40)
        obj.set('top', obj.top + 40)
        if (obj.type === 'activeSelection') { // 多选
          obj.canvas = canvas
          obj.forEachObject((obj, index) => {
            if (obj.goods_id) {
              obj.set('goods_id', obj.goods_id)
              this.changeSketchGoods({ type: 'clone', goods_id: obj.goods_id, uid })
            }
            obj.set('uid', uid)
            canvas.add(obj)
          })
          obj.setCoords()
        } else { // 单选
          if (obj.goods_id) {
            obj.set('goods_id', obj.goods_id)
            this.changeSketchGoods({ type: 'clone', goods_id: obj.goods_id, uid })
          }
          obj.set('uid', uid)
          canvas.add(obj)
        }
        canvas.setActiveObject(obj)
        canvas.requestRenderAll()
        this.updateHistory()
      }, ['goods_id', 'goods_key'])
    },
    // 删除
    deleteTarget () {
      let canvas = window['canvas']
      if (canvas.getActiveObjects().length) {
        canvas.getActiveObjects().forEach(o => {
          // 清楚实例的上下文后成功
          if (o.goods_id) this.changeSketchGoods({ type: 'remove', uid: o.uid })
          canvas.remove(o)
        })
        canvas.discardActiveObject().renderAll()
      } else {
        this.$toast.message('请选择删除目标')
      }
      this.updateHistory()
    },
    openMatrix3d () {
      let canvas = window['canvas']
      let obj = canvas.getActiveObject()
      if (!obj) {
        this.$toast.message('请选择一个目标')
      } else {
        let points = JSON.parse(JSON.stringify(obj.aCoords))
        this.changeMatrix({points, img: obj.getSrc(), show: true})
      }
    },
    cancelHandle () {
      this.changeMatrix({points: {}, img: '', show: false})
    },
    confirmHandle () {
      if (!this.requestStatus) {
        this.$toast.error('网络异常，请检查您的网络状态！')
        return
      }
      this.$parent.$refs.matrix3d.toDataUrl(({url, width, left, top, loading}) => {
        this.loading = loading
        let canvas = window['canvas']
        let obj = canvas.getActiveObject()
        obj.setControlVisible('mtr', true)
        this.imgData = { width, left, top }
        const blob = this.dataURLtoBlob(url)
        this.up.addFile(blob)
        this.up.start()
      })
    },
    async random () {
      try {
        const objs = canvas.getActiveObjects()
        if (!objs.length) {
          this.$toast.message('请先选中被替换的单品')
          return
        }
        if (objs.length > 1) {
          this.$toast.message('只能替换单个商品')
          return
        }
        if (!objs[0].goods_id) {
          this.$toast.message('只能换商品哦')
          return
        }
        let randomLoading = this.$loading()
        const { data } = await this.$axios.get(randomGood, { params: {goods_id: objs[0].goods_id} })
        this.changeSketchGoods({ type: 'remove', uid: objs[0].uid })
        this.$emit('changeRandom')
        const uid = uuid()
        let obj = canvas.getActiveObject()
        canvas.remove(obj)
        fabric.Image.fromURL(data.original_img + '?imageslim&imageView2/0/w/1000', (img) => {
          this.changeRandomCate(data.cat_name) // 随机商品后，侧边栏-商品栏需要展示同品类的商品，slider->goods内部会监听这个值进行更新
          img.set({
            goods_id: data.goods_id,
            goods_key: data.key,
            left: obj.left,
            top: obj.top,
            uid: uid
          })
          img.scaleToWidth(300)
          canvas.add(img)
          canvas.setActiveObject(img)
          this.changeSketchGoods({ type: 'set', good: { ...data, uid } })
          this.updateHistory()
          randomLoading.close()
        }, {
          crossOrigin: 'anonymous'
        })
      } catch ({msg}) {
        this.$toast.message(msg)
      }
    },
    // 详情
    showDetail () {
      const current = canvas.getActiveObject()
      if (current) {
        if (!current.goods_id) {
          this.$toast.message('选中项不属于商品')
        } else {
          this.changeSkuDetail({ show: false })
          setTimeout(() => {
            this.changeSkuDetail({ show: true, id: current.goods_id, key: current.goods_key })
          }, 300)
        }
      } else {
        this.$toast.message('请选择一个商品')
      }
    },
    initUploader () {
      if (this.up) return false
      const opts = {
        browse_button: this.$refs.upload,
        multi_selection: false,
        max_file_size: '20mb'
      }
      this.up = new Uploader(opts)
      this.up.bind('FileUploaded', (up, file, info) => {
        clearInterval(timer)
        // 上传成功后替换已变形的图片
        let canvas = window['canvas']
        let obj = canvas.getActiveObject()
        canvas.remove(obj)
        fabric.Image.fromURL(`${up.domain}${JSON.parse(info.response || info).key}` + '?imageslim&imageView2/0/w/1000', (img) => {
          img.set({
            goods_id: obj.goods_id,
            goods_key: obj.key,
            left: this.imgData.left,
            top: this.imgData.top,
            uid: obj.uid
          })
          img.scaleToWidth(this.imgData.width)
          this.changeMatrix({points: {}, img: '', show: false})
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.renderAll()
          this.updateHistory()
          this.loading.close()
        }, {
          crossOrigin: 'anonymous'
        })
      })
      let timer = null
      this.up.bind('BeforeUpload', () => {
        timer = setTimeout(() => {
          this.$toast.error('上传超时，请检查网络后重试')
          this.up.stop()
          this.up.clearFiles()
          this.loading.close()
        }, this.uploadTimeout)
      })
      this.up.bind('Error', (up, err, errTip) => {
        this.$toast.error(errTip)
        this.loading && this.loading.close()
      })
      this.up.init()
    },
    dataURLtoBlob (dataUrl) {
      let arr = dataUrl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      return new Blob([u8arr], { type: mime })
    }
  },
  computed: {
    ...mapState({
      sketchGoods: state => state.sketch.sketchGoods,
      matrixShow: state => state.sketch.matrix.show,
      requestStatus: state => state.modal.requestStatus.status,
      isText: state => state.sketch.materialText.isText
    }),
    colors: {
      get () {
        return this.$store.state.sketch.vueColor.color
      },
      set (val) {
        let canvas = window['canvas']
        let obj = canvas.getActiveObject()
        if (!obj || !obj.text) {
          this.$toast.message('请选择一个目标')
        } else {
          this.changeVueColor({ color: `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})` })
          obj.setColor(`rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          canvas.renderAll()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tier-enter-active, .tier-leave-active{
  transition-duration: .3s;
  transition-property: transform, opacity;
}
.tier-enter, .tier-leave-active {
  transform: scale(0.4);
  opacity: 0;
}
.sketch-handles {
  width: 100%;
  height: 80px;
  margin-top: -80px;
  padding: 0 30px;
  display: flex;
  justify-content: center;
  background: #fff;
  margin-top: -80px;
  .upload {
    position: absolute;
    z-index: -100;
  }
  .sketch-handles-wrapper {
    padding: 0 30px;
    display: flex;
    height: 100%;
  }
  .sketch-handles-bar {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    .sketch-handles-bar-option {
      padding: 0 50px;
      i {
        width: 26px;
        height: 26px;
        display: block;
        font-size: 26px;
        margin-bottom: 4px;
      }
      span {
        font-size: 14px;
        color: #7B7B7B;
      }
    }
    .sketch-cancel {
      color: #C2212A;
    }
    .sketch-confirm {
      color: rgb(101, 189, 89);
    }
  }
  .handle-item {
    height: 100%;
    font-size: 18px;
    font-size: 14px;
    color: #7B7B7B;
    &.handle-tier {
      position: relative;
    }
    .v-touch-ripple {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      padding: 0 22px;
    }
    i {
      font-size: 36px;
      font-size: 26px;
      color: #7b7b7b;
      margin-bottom: 4px;
    }
  }
}
.color-picker {
  position: absolute;
  top: 85px;
  z-index: 99;
}
.handle-tier-body {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 234px;
  height: 50px;
  top: 85px;
  left: -30px;
  z-index: 9999;
  background: #FFFFFF;
  box-shadow: 0 5px 9px 0 rgba(0,0,0,0.10);
  border-radius: 4px;
  .handle-tier-item {
    .handle-tier-icon {
      font-size: 26px;
      color: #7b7b7b;
    }
  }
}
</style>
