<template lang="pug">
transition(name="modal")
  .modal(@click.self="close")
    img.qrcode(:src="qrcode")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { exportQrcode } from 'api'
export default {
  name: 'uploadQrcode',
  data () {
    return {
      qrcode: ''
    }
  },
  methods: {
    ...mapActions([
      'changeExportQrcode'
    ]),
    async getExportQrcode () {
      try {
        let query = { img: this.img }
        if (this.id) query.id = this.id
        const { data } = await this.$axios.get(exportQrcode, {
          params: { ...query, show_good: this.show_good }
        })
        this.qrcode = data.img
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    close () {
      this.changeExportQrcode({ show: false })
    }
  },
  created () {
    this.getExportQrcode()
  },
  computed: {
    ...mapState({
      img: state => state.modal.exportQrcode.img,
      show_good: state => state.modal.exportQrcode.show_good,
      id: state => state.modal.exportQrcode.id
    })
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
