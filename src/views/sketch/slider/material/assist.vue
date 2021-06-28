<template lang="pug">
.assist
  .assist-back(v-show="title" @click="back")
    i.icon-back-1
    span {{title}}
  .assist-options(v-show="!showBack")
    .assist-options-item(@click="addText")
      touch-ripple(:speed="3", :opacity=".6")
        .item-icon.icon-text
        .item-name 添加文本
    .assist-options-item(v-for="item in options" @click="selectOption(item)")
      touch-ripple(:speed="3", :opacity=".6")
        .item-icon(:class="item.icon")
        .item-name {{item.name}}
  .assist-contaienr
    transition(name="material")
      infinite-scroll.assist-list(:loadMore="loadMore", v-if="showBack")
        .assist-item(
          v-for="item in assists"
          :class="{'light-item' : item.border_color}"
          :style="{'background-color': item.background, 'border-color': item.border_color }"
          @click="addMaterial(item.img, item)"
        )
          .assist-item-img(:style="{'background-image': `url(${item.img}?imageslim&imageView2/0/w/268)`}")
</template>

<script>
import { getClassify, classifyMaterial } from 'api'
import uuid from 'uuid/v4'
import { mapState, mapActions } from 'vuex'
import infiniteScroll from '@/components/infiniteScroll'
export default {
  name: 'assist',
  data () {
    return {
      showBack: false,
      lightShow: false,
      title: '',
      selectId: null,
      assists: [],
      isLoading: false,
      isLoaded: false,
      pageCode: 0,
      options: []
    }
  },
  components: {
    infiniteScroll
  },
  methods: {
    ...mapActions([
      'updateHistory'
    ]),
    async init () {
      try {
        const { data } = await this.$axios.get(getClassify)
        this.options = data.lower
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectOption (item) {
      this.showBack = true
      this.assists = []
      this.selectId = item.id
      this.title = item.name
      this.getMaterial()
    },
    async getMaterial () {
      try {
        const { data } = await this.$axios.get(classifyMaterial, { params: { id: this.selectId, page_size: 28 } })
        this.pageCode = data.page_code
        this.assists = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    back () {
      this.title = ''
      this.showBack = false
    },
    addText () {
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      let text = new fabric.IText('双击修改文字', {
        left: 100,
        top: 100,
        cornerSize: 20,
        padding: 5,
        fill: 'rgba(0, 0, 0, 1)',
        uid
      })
      canvas.add(text)
      canvas.setActiveObject(text)
    },
    addMaterial (url, item) { // 向画布添加图片
      const uid = uuid() // 因为存在同一张图片添加多次的情况，所以需要生成一个唯一标识
      fabric.Image.fromURL(url + '?imageslim&imageView2/0/w/1000', (img) => {
        img.set({
          id: item.id,
          left: 100,
          top: 100,
          uid
        })
        img.scaleToWidth(300)
        canvas.add(img)
        canvas.setActiveObject(img)
        this.updateHistory()
      }, {
        crossOrigin: 'anonymous'
      })
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(classifyMaterial, { params: { id: this.selectId, page_code: this.pageCode, page_size: 28 } })
        this.pageCode = data.page_code
        this.assists.push(...data.ls)
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.material-enter-active, .material-leave-active{
  transition: transform 0.3s ease
}
.material-enter, .material-leave-active {
  transform: scale(0);
  opacity: 0.3;
}
.assist {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.assist-back {
  margin-top: 30px;
  color: #7B7B7B;
  i {
    font-size: 20px;
    margin-right: 20px;
  }
  span {
    font-size: 24px;
  }
}
.assist-options {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  .assist-options-item {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 132px;
    height: 132px;
    background: #FFFFFF;
    border-radius: 4px;
    font-size: 18px;
    color: #333333;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .v-touch-ripple {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      text-align: center;
    }
    .item-icon {
      font-size: 48px;
      color: #333;
    }
    .item-name {
      margin-top: 10px;
    }
  }
}
.assist-contaienr {
  height: 800px;
}
.assist-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  padding-bottom: 30px;
}
.assist-item {
  width: 132px;
  height: 132px;
  background: #FFFFFF;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .assist-item-img {
    height: 100%;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  &.light-item {
    border: 10px solid #000;
  }
}
</style>
