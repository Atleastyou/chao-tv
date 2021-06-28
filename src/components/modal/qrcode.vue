<template lang="pug">
transition(name="qrcode")
  .qrcode
    .qrcode-box
      .qrcode-content
        img(:src='src')
        .qrcode-info 微信扫一扫进入手机商城
      .qrcode-footer
        i.icon-close-3(@click="close")
</template>

<script>
import { mapActions } from 'vuex'
import { getQrCode } from 'api'
export default {
  name: 'qrcode',
  data () {
    return {
      src: ''
    }
  },
  methods: {
    ...mapActions([
      'changeQrcode'
    ]),
    close () {
      this.changeQrcode({ show: false })
    },
    async init () {
      try {
        const { data } = await this.$axios.get(getQrCode)
        this.src = data.qr_code
      } catch (err) {
        this.$toast.error(err.msg)
        if (err.error_code === 100004) this.$router.replace({ name: 'login' })
        this.close()
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.qrcode-enter-active,.qrcode-leave-active {
  opacity: 0
}
.qrcode-enter-active .qrcode-box,
.qrcode-leave-active .qrcode-box {
  transform: scale(0);
}
.qrcode {
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
.qrcode-content {
  position: relative;
  width: 100%;
  height: 523px;
  padding: 50px;
  border-radius: 4px;
  background: #fff;
  & img {
    width: 350px;
    height: 350px;
  }
  .qrcode-info {
    margin-top: 40px;
    text-align: center;
    font-size: 24px;
    color: #7B7B7B;
  }
}
.qrcode-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 38px;
  color: #ddd;
}
</style>
