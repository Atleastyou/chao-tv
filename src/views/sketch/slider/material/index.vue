<template lang="pug">
.index
  .tabs
    .tab(v-for="item,index in tabs"  :class="{'active': activeTab === index}" @click="selectTab(index)") {{item.name}}
  .index-container
    //- 辅助效果
    assist(v-show="activeTab === 0")
    //- 素材库
    material-store(v-show="activeTab === 1")
    //- 我的素材
    my-material(v-show="activeTab === 2")
</template>

<script>
import assist from './assist.vue'
import materialStore from './materialStore.vue'
import myMaterial from './myMaterial.vue'
export default {
  name: 'material',
  data () {
    return {
      tabs: [
        {name: '辅助效果'},
        {name: '素材库'},
        {name: '我的素材'}
      ],
      activeTab: 0
    }
  },
  methods: {
    selectTab (index) {
      this.activeTab = index
    },
  },
  components: {
    assist,
    materialStore,
    myMaterial
  }
}
</script>

<style lang="scss" scoped>
.index {
  padding: 5px;
}
.tabs {
  display: flex;
  .tab {
    padding: 10px 0;
    font-size: 24px;
    color: #7B7B7B;
    margin-right: 60px;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: #fff;
      border-bottom: 4px solid  #FFBE28;
    }
  }
}
.index-container {
  height: 890px;
}
</style>
