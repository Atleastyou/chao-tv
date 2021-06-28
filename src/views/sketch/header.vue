<template lang="pug">
header.sketch-header
  sketch-list(:exit="exit" ref="sketchList")
  //- 离开
  .sketch-exit(@click="exit")
    i.icon-exit
  //- 案例名
  .sketch-name
    p(@click.stop.prevent="toggleNamePopover")
      span {{form.title}}
      i.icon-bottom
    //- 命名弹出框
    transition(name="popover")
      .sketch-name-popover(v-show="namePopoverShow", @click.stop.prevent="() => {}")
        .sketch-name-input
          input(placeholder="未命名", v-model="form.title")
        .sketch-name-select
          select.sketch-name-select_first(v-model="form.style")
            option(value="", disabled) #风格
            option(v-for="item in styleList", :value="item.name") {{item.name}}
          select(v-model="form.space")
            option(value="", disabled) #场景
            option(v-for="item in spaceList", :value="item.name") {{item.name}}
        .sketch-name-textarea
          textarea(placeholder="更多描述…" v-model="form.note")
  //- 撤销&重做
  .sketch-header-handles
    .sketch-header-handle(@click="undoFun", :class="{'disabled': !_history.undo.length}")
      i.icon-revoke
      span 撤销
    .sketch-header-handle(@click="redoFun", :class="{'disabled': !_history.redo.length}")
      i.icon-reset
      span 恢复
    .sketch-header-handle
      div(@click.stop="showDropdown")
        i.icon-edit-1
        span 画布
      .dropdown(v-show="dropdownShow" @click.stop="() => {}")
        p(@click="resetSketch") 重置画布
        p(@click="clearSketch") 清空画布
    .sketch-header-handle(@click="temporarySave")
      i.icon-loading(v-if="saveing")
      i.icon-add-1(v-else)
      span 保存
  .sketch-header-box
    .sketch-export-phone(@click="showExportQrcode") 导出到手机
    //- 权限（公开/不公开）
    //- label.sketch-switch(:class="{'checked': form.is_public}")
    //-   input.sketch-switch-input(type="checkbox" v-model="form.is_public")
    //-   .sketch-switch-core {{form.is_public ? '公开' : '未公开'}}
    //- 清单价格
    .sketch-price(@click="showSketchList")
      span 清单
      em ¥{{parseFloat(totalPrice).toFixed(2)}}
  //- 用于初始化uploader，按钮是隐藏的无法手动触发
  .upload(ref="upload")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Uploader from '@/utils/uploader'
import sketchList from '@/components/modal/sketchList'
import { updateCase, getStyleList, getSpaceList, getSceneCaseDetail } from 'api'
let timer = null
export default {
  name: 'sketchHeader',
  props: {
    initData: Object
  },
  data () {
    return {
      uploadTimeout: 60 * 1000 * 2,
      form: {
        title: '未命名',
        style: '',
        space: '',
        note: '',
        is_public: '',
        cont: null,
        preview: ''
      },
      saveing: false, // 是否正在保存
      reseting: false, // 是否正在重置画布
      loading: null,
      caseId: '',
      from: '',
      styleList: [],
      spaceList: [],
      namePopoverShow: false,
      saveType: '',
      exportShowGood: 0, // 导出到手机时，是否导出商品，0否，1是
      dropdownShow: false
    }
  },
  components: {
    sketchList
  },
  watch: {
    'initData' (v) {
      this.form = {
        title: this.initData.title,
        style: this.initData.style,
        space: this.initData.space,
        note: this.initData.note,
        is_public: this.initData.is_public,
        preview: this.initData.preview
      }
    },
    requestStatus (val) {
      if (!val) {
        this.$toast.error('网络异常，请检查您的网络状态！')
        this.loading && this.loading.close()
      }
    }
  },
  methods: {
    ...mapActions([
      'changeCaseDetail',
      'changeSkuDetail',
      'changeMatrix',
      'clearHistory',
      'rePlayHistory',
      'showConfirmModal',
      'changeStyleList',
      'changeSpaceList',
      'changeExportQrcode',
      'changeRandomCate',
      'updateHistory',
      'showExportConfirmModal',
      'changeSketchGoods'
    ]),
    async resetSketch () {
      try {
        const confirmed = await this.showConfirmModal({
          title: '重置画布',
          paragraph: '确定要重置该画布吗？',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        if (confirmed !== 1) return
        if (this.$route.params.id) {
          if (this.reseting) return
          this.reseting = true
          const { data } = await this.$axios.get(getSceneCaseDetail, { params: { id: this.$route.params.id } })
          window.canvas.loadFromJSON(JSON.parse(data.cont), this.updateHistory)
          this.changeSketchGoods({ type: 'reload', list: data.goods })
        } else {
          window.canvas.clear()
          this.changeSketchGoods({type: 'clear'})
        }
      } catch ({msg}) {
        this.$toast.error(msg)
      } finally {
        setTimeout(() => {
          this.reseting = false
        }, 2000)
      }
    },
    async clearSketch () {
      const confirmed = await this.showConfirmModal({
        title: '清空画布',
        paragraph: '确定要清空该画布吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (confirmed !== 1) return
      window.canvas.clear()
      this.updateHistory()
      this.changeSketchGoods({type: 'clear'})
    },
    showDropdown () {
      this.dropdownShow = !this.dropdownShow
    },
    temporarySave () {
      if (this.saveing || !canvas._objects.length) return
      this.saveing = true
      const blob = this.dataURLtoBlob(canvas.toDataURL({ format: 'jpg', width: 1440, height: 800 }))
      this.up.addFile(blob)
      this.up.start()
      this.saveType = 'temporarySave'
    },
    async showExportQrcode () {
      const { confirmed, value } = await this.showExportConfirmModal()
      if (!confirmed) return
      if (this.matrix.show) {
        this.$toast.message('请先取消变形')
        return
      }
      if (!this.requestStatus) {
        this.$toast.error('网络异常，请检查您的网络状态！')
        return
      }
      if (!canvas._objects.length) {
        this.$toast.error('没有可以导出的内容')
        return
      }
      this.loading = this.$loading({})
      const blob = this.dataURLtoBlob(canvas.toDataURL({ format: 'jpg', width: 1440, height: 800 }))
      this.up.addFile(blob)
      this.up.start()
      this.saveType = 'export_phone'
      this.exportShowGood = value // 导出到手机时，是否导出商品， 0无商品，1有
    },
    showSketchList () {
      if (this.matrix.show) {
        this.$toast.message('请先取消变形')
        return
      }
      this.changeMatrix({points: {}, img: '', show: false})
      this.$modal.show('sketchList', { id: this.$route.params.id ? this.$route.params.id : '-1' })
    },
    async save () {
      try {
        if (this.$route.params.id && this.$route.query.type === 'edit') this.form.id = this.$route.params.id // 如果属于编辑才提交ID
        this.form.cont = JSON.stringify(canvas.toJSON(['goods_id', 'uid', 'goods_key']))
        const { data } = await this.$axios.post(updateCase, { ...this.form, goods: this.sketchGoods })
        this.caseId = data.id
        if (this.from === 'sketchList') this.$refs.sketchList.routerPush()
      } catch ({ msg }) {
        this.$toast.error(msg)
      } finally {
        this.saveing = false
        this.loading && this.loading.close()
      }
    },
    async exit (name) {
      if (!this.requestStatus) {
        this.$toast.error('网络异常，请检查您的网络状态！')
        return
      }
      if (this.matrix.show) {
        this.$toast.error('操作失败，正在执行变形操作')
        return
      }
      this.from = name
      if (canvas._objects.length) {
        const confirmed = await this.showConfirmModal({
          title: '退出确认',
          paragraph: `要在退出之前存储对搭配方案“${this.form.title}”的更改吗？`,
          confirmButtonText: '存储并退出',
          isSaveBtn: true
        })
        this.loading = this.$loading({text: ''})
        this.changeCaseDetail({ show: false, id: '' })
        this.changeSkuDetail({ show: false, id: null })
        this.changeRandomCate()
        if (confirmed === 1) {
          const blob = this.dataURLtoBlob(canvas.toDataURL({ format: 'jpg', width: 1440, height: 800 }))
          this.up.addFile(blob)
          this.up.start()
          this.saveType = 'exit'
          this.$emit('changeStorage', true)
        } else if (confirmed === 0) {
          canvas.clear().renderAll()
          if (name === 'sketchList') {
            this.$refs.sketchList.routerPush()
          } else {
            this.$router.back()
            this.loading && this.loading.close()
          }
        } else {
          this.loading && this.loading.close()
        }
      } else {
        this.changeCaseDetail({ show: false, id: '' })
        this.changeSkuDetail({ show: false, id: null })
        canvas.clear().renderAll()
        if (name === 'sketchList') this.$refs.sketchList.routerPush()
        else this.$router.back()
      }
    },
    dataURLtoBlob (dataUrl) {
      let arr = dataUrl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      return new Blob([u8arr], { type: mime })
    },
    async getStyleList () { // 风格列表
      try {
        const { data } = await this.$axios.get(getStyleList)
        this.styleList = data.ls
        this.changeStyleList(data.ls)
      } catch (err) {
        this.$toast.error(err.msg)
      }
    },
    async getSpaceList () { // 空间列表
      try {
        const { data } = await this.$axios.get(getSpaceList)
        this.spaceList = data.ls
        this.changeSpaceList(data.ls)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    upload () {
      try {
        if (this.up) return false
        const opts = {
          browse_button: this.$refs.upload,
          // auto_start: true,
          multi_selection: false,
          max_file_size: '20mb'
        }
        this.up = new Uploader(opts)
        this.up.bind('FileUploaded', async (up, file, info) => {
          if (this.saveType === 'exit') {
            this.form.preview = `${up.domain}${JSON.parse(info.response || info).key}`
            await this.save() // 上传成功后提交保存
            this.$router.back()
            this.clearHistory()
          } else if (this.saveType === 'export_phone') {
            this.form.preview = `${up.domain}${JSON.parse(info.response || info).key}`
            await this.save()
            this.$router.replace({ name: this.$route.name, params: { id: this.caseId }, query: { type: 'edit', ...this.$route.query } })
            this.changeExportQrcode({
              show: true,
              img: `${up.domain}${JSON.parse(info.response || info).key}`,
              id: this.caseId,
              show_good: this.exportShowGood
            })
          } else if (this.saveType === 'temporarySave') {
            this.form.preview = `${up.domain}${JSON.parse(info.response || info).key}`
            await this.save()
            this.$router.replace({
              name: this.$route.name,
              params: { id: this.caseId },
              // 保存后，需要刷新我的案例列表，在我的案例内，会监听temporarySave值的变化，从而进行更新
              query: { type: 'edit', ...this.$route.query, temporarySave: new Date().getTime() }
            })
          }
        })
        this.up.bind('BeforeUpload', () => {
          timer = setTimeout(() => {
            this.$toast.error('上传超时，请检查网络后重试')
            this.up.stop()
            this.up.clearFiles()
            this.loading && this.loading.close()
            this.saveing = false
          }, this.uploadTimeout)
        })
        this.up.bind('UploadComplete', () => {
          clearInterval(timer)
          this.saveType = ''
          this.up.clearFiles()
        })
        this.up.bind('Error', (up, err, errTip) => {
          this.loading && this.loading.close()
        })
        this.up.init()
      } catch (err) {
        this.loading && this.loading.close()
      }
    },
    undoFun () { // 后退
      if (this.matrix.show) return
      if (this._history.undo.length) this.rePlayHistory({ playStack: 'undo', saveStack: 'redo' })
    },
    redoFun () { // 前进
      if (this.matrix.show) return
      if (this._history.redo.length) this.rePlayHistory({ playStack: 'redo', saveStack: 'undo' })
    },
    toggleNamePopover () {
      this.namePopoverShow = !this.namePopoverShow
    }
  },
  computed: {
    ...mapState({
      matrix: state => state.sketch.matrix,
      sketchGoods: state => state.sketch.sketchGoods,
      _history: state => state.sketch.history,
      requestStatus: state => state.modal.requestStatus.status
    }),
    totalPrice () {
      let totalPrice = this.sketchGoods.reduce((total, currentValue) => {
        return total + parseFloat(currentValue.shop_price)
      }, 0)
      return parseFloat(totalPrice).toFixed(2)
    }
  },
  created () {
    this.getStyleList()
    this.getSpaceList()
  },
  mounted () {
    this.upload()
    window.onbeforeunload = (e) => {
      if (canvas._objects.length) return ''
    }
    document.addEventListener('click', () => {
      this.namePopoverShow = false
      this.dropdownShow = false
    })
  }
}
</script>
<style>
.mu-sketch-loading .mu-loading-text {
  font-size: 38px;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.popover-enter-active, .popover-leave-active{
  transition-duration: .3s;
  transition-property: transform, opacity;
}
.popover-enter, .popover-leave-active {
  transform: scale(0.4);
  opacity: 0;
}
@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.sketch-header {
  height: 100px;
  margin-top: -100px;
  background: #252429;
  display: flex;
  align-items: center;
  position: relative;
  .sketch-exit {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #FFBE28;
    font-size: 34px;
    flex-shrink: 0;
  }
  .sketch-name {
    margin-left: 40px;
    position: relative;
    flex-shrink: 0;
    p {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 28px;
      span {
        display: inline-block;
        max-width: 168px;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
      }
      .icon-bottom {
        font-size: 10px;
        margin-left: 10px;
        vertical-align: middle;
      }
    }
    .sketch-name-popover {
      background: #FFFFFF;
      border: 1px solid #E4E7ED;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
      border-radius: 4px;
      position: absolute;
      width: 500px;
      height: 280px;
      top: 100%;
      left: 0;
      z-index: 99;
      padding: 0 20px;
      margin-top: 16px;
      transform-origin: left top;
      &:before {
        content: '';
        display: inline-block;
        position: relative;
        top: -9px;
        left: 30px;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        background: #fff;
      }
      .sketch-name-input {
        input {
          width: 100%;
          height: 48px;
          padding: 0 15px;
          font-size: 20px;
          border: 1px solid #DCDFE6;
          border-radius: 4px;
        }
      }
      .sketch-name-select {
        display: flex;
        align-items: center;
        padding: 20px 0;
        select {
          width: 220px;
          height: 48px;
          padding: 0 15px;
          background: #FFFFFF;
          border: 1px solid #D8DCE6;
          border-radius: 4px;
        }
        .sketch-name-select_first {
          margin-right: 20px;
        }
      }
      .sketch-name-textarea {
        textarea {
          width: 100%;
          height: 100px;
          resize:none;
          padding: 13px 15px;
          border: 1px solid #DCDFE6;
          border-radius: 4px;
        }
      }
    }
  }

  .sketch-header-handles {
    margin-left: 80px;
    flex-shrink: 0;
    display: flex;
    .sketch-header-handle {
      font-size: 22px;
      color: #fff;
      margin-right: 60px;
      position: relative;
      &.disabled {
        color: #7B7B7B;
      }
      span {
        vertical-align: middle;
      }
      i {
        font-size: 32px;
        margin-right: 12px;
        vertical-align: middle;
      }
      .icon-loading {
        animation: rotating 2s linear infinite;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .dropdown {
    position: absolute;
    top: 50px;
    transition: all .3s;
    font-size: 20px;
    color: #333333;
    width: 140px;
    padding: 20px 30px;
    z-index: 9;
    background: #FFFFFF;
    box-shadow: 0 5px 9px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    p {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .sketch-header-box {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding: 0 80px;
    .sketch-switch {
      flex-shrink: 0;
      margin-right: 60px;
      position: relative;
      .sketch-switch-input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
      }
      .sketch-switch-core {
        width: 110px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #7B7B7B;
        text-align: right;
        padding: 0 10px;
        background: #000000;
        border-radius: 20px;
        transition: all .3s;
        &:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate3d(0, -50%, 0);
          border-radius: 100%;
          transition: all .3s;
          width: 32px;
          height: 32px;
          background: #7B7B7B;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
          transition: all .3s;
        }
      }
      &.checked {
        .sketch-switch-core {
          background: #009DAF;
          color: #fff;
          text-align: left;
          &:after {
            left: 100%;
            margin-left: -32px;
            background: #FFFFFF;
          }
        }
      }
    }
    .sketch-export-phone {
      width: 160px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      background: #F5F5F7;
      border-radius: 4px;
      font-size: 24px;
      margin-right: 40px;
    }
    .sketch-price {
      flex-shrink: 0;
      min-width: 110px;
      padding: 0 20px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      color: #fff;
      font-size: 24px;
      background: #000000;
      border-radius: 4px;
      em {
        margin-left: 5px;
      }
    }
  }
  .upload {
    position: absolute;
    z-index: -100;
  }
}
.stech-export-loading {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0,0.70);
  transition: opacity .3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  & .stech-export-loading_text {
    font-size: 48px;
    color: #fff;
  }
}
</style>
