<template lang="pug">
transition(name="screen-saver")
  .screen-saver(v-if="showScreen")
    .swiper-container.screen-swiper
      .swiper-wrapper
        .swiper-slide(v-if="bannerList.length" v-for="item in bannerList" @click="toPath(item)")
          .swiper-slide_item
            img(:src="item.image")
        .swiper-slide(v-if="!bannerList.length")
          .swiper-slide_item(:style="{'background-image': `url(${defaultScreen})`}")
            .icon-logo
            .screen-saver-text — 软装优品直供商城 —
</template>

<script>
let screenSwiper = null
export default {
  name: 'screenSaver',
  props: {
    showScreen: Boolean,
    bannerList: Array
  },
  data () {
    return {
      defaultScreen: 'https://static.chaodp.com//Netease/screen_saver.png'
    }
  },
  watch: {
    showScreen (val) {
      if (val) {
        setTimeout(() => {
          this.newInitSwiper()
        }, 1000)
      }
    }
  },
  methods: {
    newInitSwiper () {
      let that = this
      screenSwiper = new Swiper('.screen-swiper', {
        loop: true,
        spaceBetween: 30,
        effect: 'fade',
        autoplay: 3000
      })
    },
    toPath (item) {
      if (item.url) this.$router.push({ path: item.url })
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-saver-enter-active,.screen-saver-leave-active {
  transition: opacity .5s;
}
.screen-saver-enter, .screen-saver-leave-to {
  opacity: 0;
}
.screen-saver {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFBE28;
  z-index: 999999999999;
  & .screen-swiper {
    width: 100%;
    height: 100%;
    & .swiper-slide {
      width: 100%;
      height: 100%;
      & .swiper-slide_item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        & .icon-logo {
          font-size: 63px;
        }
        & .screen-saver-text {
          margin-top: 30px;
          font-size: 28px;
          color: #333333;
        }
      }
      & img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
