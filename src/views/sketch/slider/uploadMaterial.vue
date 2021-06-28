<template lang="pug">
//- 搜索素材列表
.material
  c-button(type="primary", @click="showUploadQrcode") 微信扫码上传素材
  .material-list
    .material-body(v-for="item in list" v-if="item.uploaded")
      .material-item
        .material-item-img(:style="{'background-image': `url(${item.img})`}")
        .material-item-handle
          .material-item-info 点击添加到画布…
          .material-item-save(@click="save(item)" :class="{'disabled': item.isSave}") 保存
        .material-item-btns
          .material-item-btn(@click="replaceImage(item.src)") 替换
          .material-item-btn(@click="addImage(item.src)") 添加
  .material-upload(v-show="showUpload" ref="upload")
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { uploadedImages, addMaterial } from 'api'
import Uploader from '@/utils/uploader'
import uuid from 'uuid/v4'
import fabric from '@/utils/fabric'
export default {
  name: 'uploadMaterial',
  data () {
    return {
      keyword: '',
      list: [],
      showUpload: false,
      listIndex: 0,
      uploaded: false
    }
  },
  watch: {
    confirm (v) {
      if (v) this.getUploadedImages()
    }
  },
  methods: {
    ...mapActions([
      'changeUploadedMaterial',
      'changeUploadQrcode',
      'updateHistory'
    ]),
    async save (item) {
      try {
        const { src, isSave = false } = item
        if (isSave) return
        const { data } = await this.$axios.get(addMaterial, { params: { img: src } })
        this.$set(item, 'isSave', true)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getUploadedImages () {
      try {
        const { data } = await this.$axios.get(uploadedImages)
        this.changeUploadedMaterial({ show: false, confirm: false })
        this.uploaded = false
        data.forEach(item => {
          item.uploaded = false
          this.list.push(item)
        })
        this.nextUpload()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    nextUpload () {
      try {
        let code = window.android.getImageBase64Encode(this.list[this.listIndex].img)
        let blob = this.dataURLtoBlob(code)
        this.up.addFile(blob)
        this.up.start()
      } catch (err) {
        console.log('nextUpload' + err)
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
    upload () {
      let that = this
      if (this.up) return false
      const opts = {
        browse_button: this.$refs.upload,
        multi_selection: false,
        max_file_size: '20mb'
      }
      this.up = new Uploader(opts)
      this.up.bind('FileUploaded', (up, file, info) => {
        that.list[that.listIndex].src = `${up.domain}${JSON.parse(info.response || info).key}`
        that.list[that.listIndex].uploaded = true
        if (that.listIndex < that.list.length) {
          that.listIndex += 1
          that.nextUpload()
        }
      })
      this.up.init()
    },
    showUploadQrcode () {
      this.changeUploadQrcode({ show: true })
    },
    replaceImage (url) {
      const _img = canvas.getActiveObjects()
      if (_img.length === 0) {
        this.$toast.message('请先选中被替换的素材')
        return
      }
      if (_img.length > 1) {
        this.$toast.message('只能替换单个素材')
        return
      }
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      canvas.getActiveObjects().forEach(o => {
        // 清楚实例的上下文后成功
        canvas.remove(o)
      })
      canvas.discardActiveObject().renderAll()
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        let scale = _img[0].scaleX * _img[0].width / img.width
        img.set({
          ..._img[0],
          width: img.width,
          height: img.height,
          scaleX: scale,
          scaleY: scale,
          _element: img._element,
          _originalElement: img._originalElement,
          uid
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    addImage (img) { // 向画布添加图片
      console.log(img)
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      fabric.Image.fromURL(img + '?imageslim&imageView2/0/w/1000', (img) => {
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
  mounted () {
    this.upload()
  },
  computed: {
    ...mapState({
      confirm: state => state.modal.uploadedMaterial.confirm
    })
  }
}
</script>

<style lang="scss" scoped>
.material {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-top: 60px;
  // padding-bottom: 40px;
}
.material-list {
  width: 100%;
  height: 800px;
  background: #38363D;
  margin-top: 40px;
  padding-bottom: 50px;
  overflow-y: auto;
}
.material-body {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
  padding: 0 5px 10px;
  box-sizing: border-box;
}
.material-item {
  position: relative;
  width: 100%;
  padding: 14px;
  background: #FFFFFF;
  border-radius: 2px;
}
.material-item-img {
  width: 100%;
  height: 183px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #000
}
.material-item-handle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  .material-item-info {
    color: #999999;
    font-size: 12px;
  }
  .material-item-save {
    background: #FFBE28;
    border-radius: 2px;
    width: 78px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 18px;
    &.disabled {
      background: #DDDDDD;
      color: #999999;
    }
  }
}
.material-item-btns {
  position: absolute;
  top: 14px;
  right: 0;
}
.material-item-btn {
  margin-right: 14px;
  display: inline-block;
  width: 50px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background: #252429;
  border-radius: 2px;
  color: #fff;
}
</style>
