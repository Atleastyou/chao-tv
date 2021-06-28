<template lang="pug">
#scroller(ref="scroller")
  slot
</template>

<script>
export default {
  name: 'infiniteScroll',
  props: {
    distance: {
      type: Number,
      default: 100
    },
    loadMore: {
      type: Function,
      required: true
    }
  },
  methods: {
    debounce (fn, delay) {
      let timer = null
      return function () {
        if (timer) {
          clearTimeout(timer)
          timer = setTimeout(fn, delay)
        } {
          timer = setTimeout(fn, delay)
        }
      }
    },
    throttle (fn, delay) {
      console.log(fn)
      let valid = true
      return function () {
        if (!valid) {
          return false
        } else {
          valid = false
          setTimeout(() => {
            fn.apply(this, arguments)
            valid = true
          }, delay)
        }
      }
    },
    initScroller () {
      const sc = this.$refs.scroller
      sc.addEventListener('scroll', e => {
        const { scrollHeight, scrollTop, offsetHeight } = sc
        this.throttle(this.loadMore(), 6000)
        // if (scrollHeight - scrollTop - offsetHeight < 100) this.loadMore()
      })
    }
  },
  mounted () {
    this.initScroller()
  }
}
</script>

<style lang="scss" scoped>
#scroller {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch
}
</style>
