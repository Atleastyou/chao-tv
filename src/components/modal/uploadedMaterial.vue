<template lang="pug">
transition(name="modal")
  .modal(@click.self="close")
    .modal-container
      p.modal-title 已上传素材
      .material-list
        .material-item(v-for="item,index in list")
          .material-item-wrapper
            .material-item-delete(@click="deleteImage(item.token, index)") 删除
            .material-item-img(:style="{'background-image': `url(${item.img})`}")
      .modal-btns
        c-button(size="medium", style="width: 120px; margin-right: 20px", @click="close(false)") 取消
        c-button(type="primary", size="medium", style="width: 120px", @click="close(true)") 确定
</template>

<script>
import { mapActions } from 'vuex'
import { uploadedImages, deleteUploadImg } from 'api'
let timer = null
export default {
  name: 'uploadedMaterial',
  data () {
    return {
      list: []
    }
  },
  methods: {
    ...mapActions([
      'changeUploadedMaterial'
    ]),
    async deleteImage (token, index) {
      try {
        await this.$axios.post(deleteUploadImg, { token })
        this.list.splice(index, 1)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    getUploadedImages () {
      timer = setInterval(async () => {
        try {
          const { data } = await this.$axios.get(uploadedImages)
          this.list = data
        } catch ({ msg }) {
          this.$toast.error(msg)
        }
      }, 5000)
    },
    close (bool) {
      clearInterval(timer)
      this.changeUploadedMaterial({ show: false, confirm: bool })
    }
  },
  created () {
    clearInterval(timer)
    this.getUploadedImages()
  }
}
</script>

<style lang="scss" scoped>
.modal-enter-active,.modal-leave-active {
  opacity: 0
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transform: scale(0);
}
.modal {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.70);
  transition: opacity .3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-container {
  background: #fff;
  width: 1320px;
  height: 760px;
  border-radius: 4px;
  padding: 40px 30px;;
}
.modal-title {
  font-size: 28px;
  line-height: 40px;
  color: #333333;
}
.modal-btns {
  margin-top: 30px;
  text-align: right;
}
.material-list {
  margin-top: 10px;
  height: 540px;
  overflow-y: auto;
}
.material-item {
  display: inline-block;
  width: 33.333%;
  height: 242px;
  padding: 10px;
  vertical-align: bottom;
}
.material-item-wrapper {
  position: relative;
  height: 100%;
}
.material-item-delete {
  width: 66px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #252429;
  border-radius: 2px;
  font-size: 18px;
  color: #FFFFFF;
  position: absolute;
  top: 10px;
  right: 10px;
}
.material-item-img {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #000;
}
</style>
