<template lang="pug">
.login
  .login-test(@click="current++")
  .login-mask
    .login-box
      .login-scroller(:style="{transform: `translateX(${current * -600}px)`}")
        .login-inner
          .login-wrapper
            .login-index
              .login-header
                img.app-logo(:src="login_page_logo")
                p.login-title 软装优品直供商城_电视商城
              .form
                .cell
                  i.cell-icon.icon-man
                  input.cell-input(placeholder="请输入帐号", v-model="loginForm.login_account" autocomplete="off")
                .cell
                  i.cell-icon.icon-pswd
                  input.cell-input(placeholder="请输入密码", type="password", v-model="loginForm.login_password"  autocomplete='new-password', @keyup.enter="login")
                c-button.form-btn(type="primary", :loading="loading", @click="login") 登录
        .login-inner
          .login-wrapper
            .tv
              .tv-header
                i.icon-back(@click="current = 0")
                span 首次登录，请命名店铺名称
              .tv-form
                .tv-name
                  .tv-name-title 智能设备名称
                  input.tv-name-input(placeholder="请给你的智能设备命名", v-model="tvForm.tv_name")
                .tv-mark
                  .tv-mark-title 备注
                  textarea.tv-mark-input(placeholder="填写备注信息", v-model="tvForm.tv_note")
              c-button.form-btn(type="primary", :loading="tvLoading", @click="setTvName") 下一步
              p.tv-tip 点击[下一步]后，该智能设备将绑定到您的店铺“店铺名称”
        .login-inner
          .login-wrapper
            .success
              i.success-icon.icon-smiled
              .success-title 命名成功
              .success-content
                p 智能设备［智能设备名称］
                p 已成功绑定到您的店铺“店铺名称”
              c-button.success-start(type="primary", @click="$router.replace({name: 'index'})") 进入商城
</template>

<script>
import { login, bindtv } from 'api'
import { mapState } from 'vuex'
const warning = {
  login_account: '您还没有输入店铺账号',
  login_password: '您还没有输入店铺密码'
}
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        login_account: '',
        login_password: ''
      },
      tvForm: {
        tv_name: '',
        tv_note: ''
      },
      current: 0,
      loading: false,
      tvLoading: false
    }
  },
  computed: {
    ...mapState({
      login_page_logo: state => state.user.logo.login_page_logo
    })
  },
  methods: {
    async login () {
      try {
        const valid = Object.keys(this.loginForm).every(key => {
          if (!this.loginForm[key]) this.$toast.message(warning[key])
          return this.loginForm[key]
        })
        if (!valid) return
        this.loading = true
        const { tv_bind, data } = await this.$axios.post(login, this.loginForm)
        this.loading = false
        if (!tv_bind) this.current = 1
        else this.$router.replace({ name: 'index' })
      } catch ({ msg }) {
        this.loading = false
        this.$toast.error(msg)
      }
    },
    async setTvName () {
      try {
        this.tvLoading = true
        const { tv_bind } = await this.$axios.post(bindtv, this.tvForm)
        this.current = 2
        this.tvLoading = false
      } catch ({ msg }) {
        this.tvLoading = false
        this.$toast.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-image: url(../../static/images/bg.jpg);
  background-position: center;
  background-size: cover;
  & input {
    caret-color: #fff;
  }
}
.login-test {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100px;
  z-index: 999;
  color: #fff;
  font-size: 24px;
}
.login-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  width: 600px;
  white-space: nowrap;
  overflow: hidden;
}
.login-scroller {
  width: 1800px;
  transition: transform .3s;
}
.login-inner {
  width: 600px;
  min-width: 600px;
  height: 800px;
  display: inline-block;
  vertical-align: middle;
}
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-index {
  width: 400px;
  display: inline-block;
  text-align: center;
}
.app-logo {}
.login-title {
  font-size: 28px;
  color: #999999;
  line-height: 40px;
  margin-top: 10px;
}
.form {
  margin-top: 90px;
}
.cell {
  position: relative;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #7B7B7B;
  color: #7B7B7B;
}
.cell-icon {
  width: 60px;
  font-size: 40px;
  text-align: left;
}
.cell-input {
  flex: 1;
  height: 30px;
  font-size: 24px;
  background: transparent;
  color: #7B7B7B;
}
.cell-input:-webkit-autofill {
  -webkit-text-fill-color: #7B7B7B !important;
}
.cell-code {
  width: 93px;
  height: 40px;
  background: #fff;
  position: absolute;
  bottom: 10px;
  right: 0;
}
.form-handle {
  font-size: 14px;
  color: #FFFFFF;
  text-align: right;
  cursor: pointer;
}
.form-btn {
  margin-top: 40px;
  width: 100%;
  font-size: 28px;
}
.tv {
  width: 500px;
}
.tv-header {
  & .icon-back {
    color: #fff;
    font-size: 30px;
    margin-right: 20px;
  }
  & span {
    font-size: 36px;
    color: #DDDDDD;
  }
}
.tv-form {
  margin-top: 40px;
}
.tv-name {
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.30);
  border-radius: 4px;
}
.tv-name-title {
  color: #fff;
  font-size: 24px;
  padding: 0 20px;
  border-right: 2px solid #fff;
}
.tv-name-input {
  flex: 1;
  background: transparent;
  font-size: 24px;
  padding: 0 20px;
  color: #ddd;
}
.tv-mark {
  margin-top: 20px;
  position: relative;
}
.tv-mark-title {
  color: #fff;
  font-size: 24px;
  padding: 0 20px;
  border-right: 2px solid #fff;
  position: absolute;
  left: 20px;
  top: 24px;
}
.tv-mark-input{
  height: 250px;
  width: 100%;
  background: transparent;
  font-size: 24px;
  padding: 24px 20px;
  background: rgba(255,255,255,0.30);
  border-radius: 4px;
  border: none;
  text-indent: 110px;
  color: #ddd;
}
.tv-tip {
  font-size: 16px;
  color: #9B9B9B;
  text-align: center;
  margin-top: 40px;
}
.success {
  text-align: center;
}
.success-icon {
  color: #D16403;
  font-size: 108px;
}
.success-title {
  font-size: 36px;
  color: #FFFFFF;
  margin-top: 30px;
  line-height: 50px;
}
.success-content {
  margin-top: 40px;
  line-height: 33px;
  font-size: 24px;
  color: #9B9B9B;
}
.success-start {
  width: 300px;
  margin-top: 100px;
}
</style>
