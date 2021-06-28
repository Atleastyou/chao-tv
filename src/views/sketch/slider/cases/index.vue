<template lang="pug">
.cases
  .tabs
    .tab(v-for="item,index in tabs" :class="{'active': activeTab === index}" @click="selectTab(index)")
      span {{item.name}}
  .filter
    .select
      .select-value(@click.stop="toggleSpaceSelect") {{selectedSpace || '选择空间'}}
      transition(name="expand")
        .select-dropdown(v-show="spaceSelect")
          .select-option(@click="selectSpace('')") 全部
          .select-option(v-for="item in spaceList" :class="{'active': selectedSpace === item.name}" @click="selectSpace(item.name)") {{item.name}}
    .select
      .select-value(@click.stop="toggleStyleSelect") {{selectedStyle || '选择风格'}}
      transition(name="expand")
        .select-dropdown(v-show="styleSelect")
          .select-option(@click="selectStyle('')") 全部
          .select-option(v-for="item in styleList" :class="{'active': selectedStyle === item.name}" @click="selectStyle(item.name)") {{item.name}}
  .cases-container
    //- 精选案例
    selected-case(v-show="activeTab === 0" :selectedStyle="selectedStyle" :selectedSpace="selectedSpace")
    //- 我的案例
    my-cases(v-show="activeTab === 1" ref="myCase" :selectedStyle="selectedStyle" :selectedSpace="selectedSpace")
  //- 案例详情
  caseDetail(@delete="deleteMyCase")
</template>

<script>
import selectedCase from './selectedCases'
import myCases from './myCases'
import caseDetail from './caseDetail'
import { mapState } from 'vuex'
export default {
  name: 'cases',
  data () {
    return {
      tabs: [
        { name: '精选案例' },
        { name: '我的案例' },
      ],
      activeTab: 0,
      spaceSelect: false,
      styleSelect: false,
      selectedStyle: '',
      selectedSpace: ''
    }
  },
  components: {
    selectedCase,
    myCases,
    caseDetail
  },
  methods: {
    deleteMyCase () { // 在详情页删除案例后，同时要更新列表页的案例
      this.$refs.myCase.getSceneCaseList()
    },
    selectTab (index) {
      this.activeTab = index
    },
    selectSpace (space) {
      this.selectedSpace = space
    },
    selectStyle (style) {
      this.selectedStyle = style
    },
    toggleSpaceSelect () {
      this.spaceSelect = !this.spaceSelect
    },
    toggleStyleSelect () {
      this.styleSelect = !this.styleSelect
    },
  },
  mounted () {
    document.addEventListener('click', () => {
      this.spaceSelect = false
      this.styleSelect = false
    })
  },
  computed: {
    ...mapState({
      styleList: state => state.sketch.styleList,
      spaceList: state => state.sketch.spaceList
    })
  },
}
</script>

<style lang="scss" scoped>
.expand-enter, .expand-leave-to {
  height: 0!important;
  padding-top: 0!important;
  padding-bottom: 0!important;
  border-width: 0!important;
}

.cases {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5px;
}
.tabs {
  display: flex;
  .tab {
    flex: 1;
    position: relative;
    text-align: center;
    font-size: 24px;
    color: #7B7B7B;
    letter-spacing: 0;
    span {
      display: inline-block;
      padding: 10px 0;
      line-height: 33px;
    }
    &.active {
      color: #fff;
      span {
        border-bottom: 4px solid #FFBE28; 
      }
    }
  }
}
.filter {
  display: flex;
  margin-top: 30px;
}
.select {
  width: 100%;
  position: relative;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
  .select-value {
    height: 50px;
    position: relative;
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    padding: 10px 15px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    &:after {
      content: '';
      border: 6px solid transparent;
      border-top-color: #333;
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      margin-top: 3px;
    }
  }
  .select-dropdown {
    position: absolute;
    left: 0;
    top: 55px;
    z-index: 99;
    width: 100%;
    max-height: 335px;
    overflow-y: auto;
    padding: 20px;
    background: #fff;
    border: 1px solid #DDDDDD;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.15);
    border-radius: 4px;
    transition: height .45s cubic-bezier(0.23, 1, 0.26, 1), padding .45s cubic-bezier(0.23, 1, 0.26, 1);
    .select-option {
      line-height: 25px;
      margin-bottom: 20px;
      font-size: 18px;
      position: relative;
      &.active {
        color: #FF6C00;
        &:after {
          content: "\e69c";
          font-family: "iconfont";
          float: right;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.cases-container {
  height: 760px;
  position: relative;
}
</style>
