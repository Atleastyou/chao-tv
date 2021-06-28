<template lang="pug">
transition(name="confirm")
  .confirm(v-if="confirm.show", @click="okCallback(-1)")
    .confirm-box
      .confirm-box-header
        .confirm-box-title {{confirm.title}}
        .confirm-box-close.icon-close
      .confirm-box-content {{confirm.paragraph}}
      .confirm-box-footer
        .footer-left(v-if="confirm.showCancel")
          c-button(@click.stop="okCallback(0)" v-if="confirm.isSaveBtn") 不存储
        .footer-right(v-if="confirm.showCancel")
          c-button.footer-right-cancel(@click.stop="okCallback(-1)") {{confirm.cancelButtonText}}
          c-button(type="primary" @click.stop="okCallback(1)") {{confirm.confirmButtonText}}
        c-button(v-if="!confirm.showCancel" @click.stop="okCallback(1)") {{confirm.confirmButtonText}}
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'confirm',
  methods: {
    ...mapActions([
      'changeConfirm'
    ]),
    okCallback (value) {
      this.changeConfirm({ show: false, confirmed: value })
    }
  },
  computed: {
    ...mapState({
      confirm: state => state.modal.confirm
    })
  }
}
</script>

<style lang="scss" scoped>
.confirm-enter-active,.confirm-leave-active {
  opacity: 0
}
.confirm-enter-active .confirm-box,
.confirm-leave-active .confirm-box {
  transform: scale(0);
}
.confirm {
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
.confirm-box {
  width: 760px;
  height: 420px;
  background: #FFFFFF;
  border-radius: 4px;
  transition: transform 0.3s ease
}
.confirm-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: #FFFFFF;
  box-shadow: 0 1px 0 0 #EFEFEF;
  .confirm-box-title {
    font-size: 32px;
    color: #333333;
  }
  .confirm-box-close {
    font-size: 20px;
    color: #999;
  }
}
.confirm-box-content {
  height: 271px;
  padding: 20px 30px;
  font-size: 28px;
  color: #333333;
}
.confirm-box-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 120px;
  padding: 0 30px;
  background: #F5F5F5;
  box-shadow: inset 0 1px 0 0 #EFEFEF;
  .footer-right {
    display: flex;
    align-items: center;
    .footer-right-cancel {
      margin-right: 20px;
    }
  }
}
</style>
