<template lang="pug">
.system
  .system-header
    .system-header-title 系统设置
    .system-header-info System settings
  .system-content
    .system-account 登录账号：{{loginAccount}}
    c-button.system-content-button.button-help(type="info") 帮助中心
    c-button.system-content-button(type="primary" @click="logout") 退出登录
  a.system-footer(:href="appUrl") 版本{{version}}
</template>

<script>
import { mapState } from 'vuex'
import { logout, getAppVersion, getUserInfo } from 'api'
export default {
  name: 'system',
  data () {
    return {
      appUrl: '',
      loginAccount: ''
    }
  },
  computed: {
    ...mapState({
      version: state => state.modal.version.num
    })
  },
  methods: {
    async logout () {
      try {
        await this.$axios.get(logout)
        this.$router.push({ name: 'login' })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getUserInfo () {
      try {
        const { data } = await this.$axios.get(getUserInfo)
        this.loginAccount = data.user.login_account
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getAppVersion () {
      try {
        const { data } = await this.$axios.get(getAppVersion)
        this.appUrl = data.app_url
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getUserInfo()
      vm.getAppVersion()
    })
  }
}
</script>

<style lang="scss" scoped>
.system {
  height: 100%;
  padding: 80px;
  overflow: auto;
  background: url(../../static/images/xitong_beijing.jpg) center no-repeat;
  background-size: cover;
}
.system-header-title {
  font-size: 48px;
  color: #333333;
}
.system-content {
  width: 880px;
  height: 520px;
  margin: 83px auto 160px;
  padding: 80px 140px;
  background: #FFFFFF;
  box-shadow: 0 0 60px 0 rgba(0,0,0,0.10);
  border-radius: 8px;
  text-align: center;
  & .system-content-button {
    width: 600px;
    height: 80px;
  }
  & .button-help {
    margin-bottom: 60px;
  }
}
.system-header-info,
.system-footer{
  font-size: 28px;
  color: #7B7B7B;
}
.system-account {
  margin-bottom: 60px;
  text-align: left;
  font-size: 28px;
  line-height: 40px;
  color: #333333;
}
</style>
