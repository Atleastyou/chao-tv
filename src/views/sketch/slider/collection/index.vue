<template lang="pug">
.index
  .tabs
    .tab(v-for="item,index in tabs"  :class="{'active': activeTab === index}" @click="selectTab(index)") {{item.name}}
  .index-container
    collection-goods(v-show="activeTab === 0")
    collection-cases(v-show="activeTab === 1")
    collection-materials(v-show="activeTab === 2")
</template>

<script>
import collectionGoods from './goods.vue'
import collectionCases from './cases.vue'
import collectionMaterials from './materials.vue'
export default {
  name: 'collection',
  data () {
    return {
      tabs: [
        {name: '商品'},
        {name: '案例'},
        {name: '素材'}
      ],
      activeTab: 0
    }
  },
  methods: {
    selectTab (index) {
      this.activeTab = index
    }
  },
  components: {
    collectionGoods,
    collectionCases,
    collectionMaterials
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  padding: 0 5px;
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
  height: 865px;
}
</style>
