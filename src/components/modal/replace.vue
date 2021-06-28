<template lang="pug">
transition(name="replace")
  .confirm(v-if="replace.show", @click.self="close")
    .confirm-box
      .confirm-box-header
        .confirm-box-title {{replace.title}}
        .confirm-box-close.icon-close(@click.stop="close")
      .confirm-box-content
        .confirm-box-text {{replace.paragraph}}
        .confirm-box-remind(@click.stop="changeRemind")
          label(:class="{'label-active': replace.remind}")
          span 不再出现当前弹窗
      .confirm-box-footer
        .footer-right
          c-button.footer-right-cancel(@click.stop="close") 取消
          c-button(type="primary" @click.stop="okCallback") 替换
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'replace',
  methods: {
    ...mapActions([
      'changeReplace'
    ]),
    close () {
      this.changeReplace({ show: false, confirmed: false, remind: false })
    },
    okCallback () {
      this.changeReplace({ show: false, confirmed: true, remind: this.replace.remind })
    },
    changeRemind () {
      this.changeReplace({ show: true, confirmed: false, remind: !this.replace.remind })
    }
  },
  computed: {
    ...mapState({
      replace: state => state.modal.replace
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
  white-space: nowrap;
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
  height: 215px;
  padding: 20px;
  font-size: 28px;
  color: #333333;
}
.confirm-box-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 120px;
  padding: 30px;
  background: #F8F8F8;
  box-shadow: inset 0 1px 0 0 #EFEFEF;
  .footer-right {
    display: flex;
    align-items: center;
    .footer-right-cancel {
      margin-right: 20px;
    }
  }
}
.confirm-box-remind {
  display: flex;
  align-items: center;
  margin-top: 30px;
  label {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #D5D8DE;
  }
  .label-active {
    background: #009DAF;
    border-color: #009DAF;
    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%,-50%);
    }
  }
  span {
    font-size: 20px;
    color: #999999;
  }
}
</style>
