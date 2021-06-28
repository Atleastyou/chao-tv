<template lang="pug">
transition(name="modal")
  .modal(@click.self="close")
    img.qrcode(:src="qrcode")
</template>

<script>
import { mapActions } from 'vuex'
import { uploadQrcode, uploadedImages } from 'api'
let timer = null
export default {
  name: 'uploadQrcode',
  data () {
    return {
      qrcode: ''
    }
  },
  methods: {
    ...mapActions([
      'changeUploadedMaterial',
      'changeUploadQrcode'
    ]),
    getUploadedImages () {
      timer = setInterval(async () => {
        try {
          const { step } = await this.$axios.get(uploadedImages)
          if (step) {
            this.close()
            this.changeUploadedMaterial({ show: true })
          }
        } catch ({ msg }) {
          this.$toast.error(msg)
        }
      }, 5000)
    },
    async getUploadQrcode () {
      try {
        const { data } = await this.$axios.get(uploadQrcode)
        this.qrcode = data.img
        this.getUploadedImages()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    close () {
      clearInterval(timer)
      this.changeUploadQrcode({ show: false })
    }
  },
  created () {
    clearInterval(timer)
    this.getUploadQrcode()
  }
}
</script>

<style lang="scss" scoped>
.modal-enter-active,.modal-leave-active {
  opacity: 0
}
.modal-enter-active .qrcode,
.modal-leave-active .qrcode {
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
</style>
