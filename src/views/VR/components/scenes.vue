<template lang="pug">
  .scenes
    .scene-item(
      v-for="item in scenes"
      :style="{'background-image': `url(${item.type === 'more' ? item.img.front : item.img})`}"
      @click="selectScene(item)"
    )
      .scene-item-title {{item.title}}
</template>
<script>
export default {
  name: 'scenes',
  props: {
    scenes: Array
  },
  methods: {
    selectScene (item) {
      this.$emit('selectScene', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.scenes {
  width: 568px;
  height: 100%;
  overflow-y: auto;
  padding: 30px 20px;
  background: #333;
}
.scene-item {
  width: 100%;
  height: 260px;
  position: relative;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}
.scene-item-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  background: rgba(0,0,0,0.60);
}
</style>


