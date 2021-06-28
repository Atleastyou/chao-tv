<template lang="pug">
transition(name="confirm")
  .confirm(v-if="confirm.show", @click.self="cancel")
    .confirm-box
      .confirm-box-header
        .confirm-box-title 导出到手机
        .confirm-box-close.icon-close(@click.stop="cancel")
      .confirm-box-content
        label.checkbox(:class="{'checkbox--checked' : checked == 0}")
          .checkbox-inner
          span.checkbox-text 不含商品清单
          input.checkbox-original(type="radio", name="exportType" value=0 v-model="checked")
        label.checkbox(:class="{'checkbox--checked' : checked == 1}")
          .checkbox-inner
          span.checkbox-text 含商品清单
          input.checkbox-original(type="radio", name="exportType" value=1 v-model="checked")
      .confirm-box-footer
        .confirm-btn.confirm-btn--cancel(@click.stop="cancel") 取消
        .confirm-btn(type="primary" @click.stop="okCallback") 确定
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'confirm',
  data () {
    return {
      checked: 0
    }
  },
  methods: {
    ...mapActions([
      'changeExportConfirm'
    ]),
    cancel () {
      this.changeExportConfirm({ show: false, confirmed: false })
    },
    okCallback () {
      this.changeExportConfirm({ show: false, confirmed: true, value: parseInt(this.checked) })
      this.checked = 0
    }
  },
  computed: {
    ...mapState({
      confirm: state => state.modal.exportConfirm
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
.checkbox {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  &.checkbox--checked {
    .checkbox-inner {
      background: #009DAF;
      border-color: #009DAF;
      position: relative;
      &:before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
        background: #fff;
        border-radius: 50%;
      }
    }
  }
  .checkbox-text {
    font-size: 20px;
    color: #333333;
    margin-left: 10px;
  }
  .checkbox-inner {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-block;
    background-color: #fff;
    position: relative;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }
  .checkbox-original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
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
  justify-content: flex-end;
  width: 100%;
  height: 120px;
  padding: 0 30px;
  background: #F5F5F5;
  box-shadow: inset 0 1px 0 0 #EFEFEF;
  .confirm-btn {
    width: 120px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    border-radius: 4px;
    background: #FFBE28;
  }
  .confirm-btn--cancel {
    background: #F5F5F5;
    border: 1px solid #DDDDDD;
    margin-right: 20px;
  }
}
</style>
