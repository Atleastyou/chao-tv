<template lang="pug">
.index
  header.header
    .header-name
      i.icon-dpds
      span 搭配大师
    router-link.header-btn(:to="{name: 'edit'}") 创建方案
  .container
    .sidebar
      p.sidebar-title 筛选条件：
      .filter
        p.filter-name 风格
        .filter-tags
          .filter-tag(:class="{'active': !$route.query.style}" @click="selectStyle('')")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span 全部
          .filter-tag(v-for="item in styleList" :class="{'active': $route.query.style === item.name}" @click="selectStyle(item.name)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item.name}}
      .filter
        p.filter-name 空间
        .filter-tags
          .filter-tag(:class="{'active': !$route.query.space}" @click="selectSpace('')")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span 全部
          .filter-tag(v-for="item in spaceList" :class="{'active': $route.query.space === item.name}" @click="selectSpace(item.name)")
            touch-ripple(:speed="3", :opacity=".4" color="#000")
              span {{item.name}}
    infiniteScroll(:loadMore="loadMore" ref="scroll")
      .cases-container
        p.cases-title 案例中心：
        .cases-list(v-if="cases.length")
          router-link.case(v-for="item in cases" :to="{name: 'sketchDetail', params: {id: item.id}}")
            .case-cover(:style="{'background-image': `url(${item.preview})`}")
            .case-name {{item.title}}
            .case-type {{item.tags.split(' ').join('/')}}
        .cases-list(v-else)
          .cases-list-info
            img(src="../../static/images/search_img_notf_dis.png")
            .cases-list-info-text 未找到相关案例
</template>

<script>
import { sceneCaseList, getStyleList, getSpaceList } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
export default {
  name: 'sketch',
  components: {
    infiniteScroll
  },
  data () {
    return {
      isLoading: false,
      cases: [],
      currentPage: 1,
      styleList: [],
      spaceList: []
    }
  },
  methods: {
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(sceneCaseList, { params: { page_code: this.currentPage, ...this.$route.query } })
        this.cases.push(...data.ls)
        this.currentPage = data.page_code
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectStyle (style) {
      if (this.$route.query.style === style || !style) this.$router.replace({ name: this.$route.name, query: { space: this.$route.query.space } })
      else this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, style } })
    },
    selectSpace (space) {
      if (this.$route.query.space === space || !space) this.$router.replace({ name: this.$route.name, query: { style: this.$route.query.style } })
      else this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, space } })
    },
  	async getCaseList () {
  		try {
        const { data } = await this.$axios.get(sceneCaseList, { params: this.$route.query })
        this.currentPage = data.page_code
        this.cases = data.ls
      } catch ({msg}) {
        this.$toast.error(msg)
      }
  	},
    async getStyleList () { // 风格列表
      try {
        const { data } = await this.$axios.get(getStyleList)
        this.styleList = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getSpaceList () { // 空间列表
      try {
        const { data } = await this.$axios.get(getSpaceList)
        this.spaceList = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.meta.scrollTop) {
        vm.$refs.scroll.$el.scrollTop = vm.$route.meta.scrollTop
      } else {
        vm.getCaseList()
        vm.getStyleList()
        vm.getSpaceList()
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$refs.scroll.$el.scrollTop = 0
    this.getCaseList()
  },
  beforeRouteLeave (to, from, next) {
    this.$route.meta.scrollTop = this.$refs.scroll.$el.scrollTop
    next()
  }
}
</script>

<style scoped lang="scss">
.index {
  padding-top: 100px;
  height: 100vh;
}
.header {
  width: 100%;
  height: 100px;
  position: fixed;
  left: 0;
  top: 0;
  background: #252429;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  .header-name {
    font-size: 28px;
    color: #FFFFFF;
    .icon-dpds {
      font-size: 40px;
      margin-right: 20px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle
    }
  }
  .header-btn {
    width: 160px;
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-size: 24px;
    color: #333333;
    background: #FFFFFF;
    border-radius: 4px;
  }
}
.container {
  padding-left: 600px;
  background: #38363D;
  height: 100%;
}
.sidebar {
  width: 600px;
  padding: 40px 80px;
  position: fixed;
  top: 100px;
  bottom: 0;
  left: 0;
  background: #38363D;
  .sidebar-title {
    line-height: 40px;
    font-size: 28px;
    color: #7B7B7B;
    letter-spacing: 0;
  }
}
.filter {
  margin-top: 40px;
  .filter-name {
    font-size: 24px;
    line-height: 33px;
    color: #7B7B7B;
  }
  .filter-tags {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-tag {
    min-width: 76px;
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    color: #666666;
    text-align: center;
    background: #fff;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    .v-touch-ripple {
      width: 100%;
      height: 100%;
      padding: 0 20px;
    }
    &.active {
      background: #FFBE28;
      color: #333333;
    }
  }
}
.cases-container {
  padding: 40px 0;
}
.cases-title {
  font-size: 28px;
  color: #7B7B7B;
  line-height: 40px;
}
.cases-list {
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
}

.case {
  width: 400px;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  &:nth-child(3n) {
    margin-right: 0;
    // margin-bottom: 0;
  }
  .case-cover {
    width: 100%;
    height: 267px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0, 0;
  }
  .case-name {
    color: #333;
    margin-top: 20px;
    font-size: 24px;
    line-height: 33px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .case-type {
    margin-top: 20px;
    font-size: 20px;
    color: #999999;
  }
}
.cases-list-info {
  display: inline-block;
  margin: 146px auto 0;
  text-align: center;
  font-size: 28px;
  color: #7b7b7b;
  .cases-list-info-text {
    margin-top: 50px;
  }
}
</style>
