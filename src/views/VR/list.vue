<template lang="pug">
.index
  header.header
    .header-menu
      router-link.header-menu-item(:to="{name: 'index'}") 首页
      router-link.header-menu-item(:to="{name: 'search'}") 搜索
      //- router-link.header-menu-item(:to="{name: 'category'}") 分类
      router-link.header-menu-item(:to="{name: 'sketch'}") 搭配大师
      span.header-menu-item.active VR全景图
      router-link.header-menu-item(:to="{name: 'system'}") 系统设置
    .header-slot
      img.app-logo(:src="brand_page_logo")
      span.app-name 软装优品直供商城
  .list
    infinite-scroll(:loadMore="loadMore")
      .item(v-for="item in list")
        .item-cover(:style="{'background-image': `url(${item.cover})`}")
          router-link.item-play(:to="{name: 'VRDetail', params: { id: item.id }}")
        p.item-name {{item.title}}
  .list-empty(v-if="!list.length")
    img(src="../../static/images/search_img_notf_dis.png")
    p 未找到相关案例
</template>
<script>
import { mapState } from 'vuex'
import { getShopInfo, VRList } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
export default {
  name: 'VRList',
  data () {
    return {
      shopInfo: {},
      currentPage: 1,
      pageSize: 15,
      list: [],
      isLoading: false,
      isLoaded: false
    }
  },
  components: {
    infiniteScroll
  },
  computed: {
    ...mapState({
      showConfig: state => state.user.user.show_config,
      brand_page_logo: state => state.user.logo.brand_page_logo
    })
  },
  methods: {
    async getVRList () {
      try {
        const { data } = await this.$axios.get(VRList, { params: { page_size: this.pageSize, page: 1 } })
        this.currentPage = 2
        this.list = data.ls
        this.isLoaded = data.ls.length === data.total
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(VrList, { params: { page_size: this.pageSize, page: this.currentPage } })
        this.currentPage ++
        this.list.push(...data.ls)
        this.isLoaded = this.list.length === data.total
      } catch ({ msg }) {
        this.$toast.error(msg)
      } finally {
        this.isLoading = false
      }
    },
    async getShopInfo () {
      try {
        const { data } = await this.$axios.get(getShopInfo)
        this.shopInfo = data.shop
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getShopInfo()
      vm.getVRList()
    })
  }
}
</script>
<style lang="scss" scoped>
.index {
  background: rgb(37,36,41);
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  position: fixed;
  left: 0;
  right: 0;
  top: 8%;
  z-index: 888;
}
.header-menu {
  display: flex;
}
.header-menu-item {
  font-size: 36px;
  color: #7B7B7B;
  margin-right: 100px;
  line-height: 50px;
  &:last-child {
    margin-right: 0;
  }
  &.active {
    color: #fff;
    border-bottom: 4px solid #fff;
  }
}
.header-slot {
  display: flex;
  align-items: center;
  & .app-logo {
    margin-right: 20px;
  }
  & .app-name {
    font-size: 28px;
    color: #7B7B7B;
    padding-left: 10px;
    border-left: 3px solid #7B7B7B;
  }
}

.list {
  padding: 220px 60px 20px;
  height: 100%;
}
.item {
  width: 33.3333%;
  padding: 20px;
  display: inline-block;
  vertical-align: top;
}
.item-cover {
  height: 372px;
  position: relative;
  background-size: cover;
  background-position: center;
}
.item-play {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: 108px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(../../static/images/play.png)
}
.item-name {
  font-size: 34px;
  color: #FFFFFF;
  line-height: 48px;
  margin-top: 28px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.list-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  & p {
    font-size: 28px;
    color: #7B7B7B;
    margin-top: 50px;
    text-align: center;
  }
}
</style>


