<template lang="pug">
transition(name="newVersion")
  .version(v-if="version.show")
    .version-box
      .version-box-header
      .version-box-content
        .version-box-content--header
          .version-box-title 发现新版本
          .version-box-bg
        .version-box-info(v-html="version.paragraph")
        .version-box-content--footer
          .version-box-button
            c-button(type="primary" @click="update") 立即更新
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'newVersion',
  computed: {
    ...mapState({
      version: state => state.modal.version
    })
  },
  methods: {
    ...mapActions([
      'changeVersion'
    ]),
    update () {
      this.changeVersion({ show: false })
      window.location.href = `${window.location.origin}`
      // this.$router.replace({ name: 'index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.version-enter-active,.version-leave-active {
  opacity: 0
}
.version-enter-active .version-box,
.version-leave-active .version-box {
  transform: scale(0);
}
.version {
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
.version-box {
  width: 700px;
  height: 830px;
  border-radius: 4px;
  white-space: nowrap;
  transition: transform 0.3s ease;
}
.version-box-header {
  width: 100%;
  height: 345px;
  background: url(../../static/images/bb_tuxin.png) center no-repeat;
  background-size: cover;
}
.version-box-content {
  width: 100%;
  height: auto;
  margin-top: -1px;
  background: #fff;
}
.version-box-content--header {
  position: relative;
  text-align: center;
  padding: 15px 0 50px;
  font-size: 36px;
  color: #333333;
  .version-box-title {
    position: relative;
    z-index: 33;
  }
  .version-box-bg {
    position: absolute;
    width: 150px;
    height: 30px;
    background: #FED175;
    right: 230px;
    top: 52px;
    z-index: 22;
  }
}
.version-box-info {
  width: auto;
  max-height: 264px;
  min-height: 70px;
  overflow-y: auto;
  padding: 0 50px;
  font-size: 20px;
  color: #333333;
  white-space: pre-wrap;
  p {
    margin-bottom: 10px;
  }
}
.version-box-content--footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}
.version-box-button {
  width: 260px;
}
</style>
<style>
.version-box-info p {
  margin-bottom: 20px;
}
</style>
