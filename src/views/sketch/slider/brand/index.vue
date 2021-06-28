<template lang="pug">
.brand(v-if="!showDetail")
  .sketch-brand-header
    //- 搜索栏
    .search
      .search-icon.icon-search
      input.search-input(placeholder="请输入搜索内容" v-model="keyword")
      .search-clear(v-if="keyword" @click="clearKeyword")
        .icon-close
  .brand-container
    .brand-screen
      .brand-screen-select(v-clickoutside="handleStyleClose" @click="showSelect('showStyle', 'showSpace', 'style', $event)") {{styleActive.name ? styleActive.name : '选择风格'}}
        .brand-screen-downdrop(v-show="showStyle" ref="style")
          .select-item(
            @click.stop="selectItem('styleActive', { name: '全部', id: ''}, 'showStyle')"
            :class="{ 'select-item-active' : !styleActive.id }"
          )
            span 全部
            i.iconfont.icon-selected(v-show="!styleActive.id")
          .select-item(
            v-for="item in styleList"
            @click.stop="selectItem('styleActive', item, 'showStyle')"
            :class="{ 'select-item-active' : styleActive.id === item.id }"
          ) 
            span {{item.name}}
            i.iconfont.icon-selected(v-show="styleActive.id === item.id")
      .brand-screen-select(v-clickoutside="handleSpaceClose" @click="showSelect('showSpace', 'showStyle', 'space', $event)") {{spaceActive.name ? spaceActive.name : '选择品类'}}
        .brand-screen-downdrop(v-show="showSpace" ref="space")
          .select-item(
            @click.stop="selectItem('spaceActive', { name: '全部', id: '' }, 'showSpace')"
            :class="{ 'select-item-active' : !spaceActive.id }"
          )
            span 全部
            i.iconfont.icon-selected(v-show="!spaceActive.id")
          .select-item(
            v-for="item in spaceList"
            @click.stop="selectItem('spaceActive', item, 'showSpace')"
            :class="{ 'select-item-active' : spaceActive.id === item.id }"
          ) 
            span {{item.name}}
            i.iconfont.icon-selected(v-show="spaceActive.id === item.id")
    infinite-scroll.brand-list(:loadMore="loadMore" ref="brandList" v-if="brandList.length")
      .brand-list-title 所有品牌
      .brand-list-content
        .brand-logo-item(
          v-for="item in brandList"
          :style="{'background-image': `url(${item.logo}?imageslim&imageView2/0/w/200)`}"
          @click="selectBrand(item)"
        )
    .brand-list-info(v-else)
      img(src="../../../../static/images/search_img_notf_dis.png")
      .brand-list-info-text 未找到相关商品
.brand-detail(v-else)
  brand-detail(:brandId="brandId" @closeBrandDetail="closeBrandDetail")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getBrandList, getCategoryList } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import brandDetail from './brandDetail'
let timer
export default {
  name: 'brand',
  data () {
    return {
      showDetail: false,
      brandId: '',
      form: {
        style: '',
        style: ''
      },
      styleActive: {
        id: -1,
        name: ''
      },
      spaceActive: {
        id: -1,
        name: ''
      },
      brandList: [],
      showStyle: false,
      showSpace: false,
      keyword: '',
      page: 1,
      spaceList: [],
      pageSize: 15,
      isLoading: false,
      isLoaded: false,
      styleKeyword: '',
      catId: ''
    }
  },
  watch: {
    keyword (v) {
      // if (!v) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        // this.$router.replace({ name: this.$route.name, query: { tm: new Date().getTime() } })
        this.page = 1
        this.getBrandList()
      }, 300)
    }
  },
  components: {
    infiniteScroll,
    brandDetail
  },
  computed: {
    ...mapState({
      styleList: state => state.sketch.styleList
    }),
    goodListShow () {
      const { style_words = '', space_words = '', first_id = '' } = this.$route.query
      return !!(this.keyword || style_words || space_words || first_id)
    }
  },
  directives: {
    clickoutside: {
      bind: function (el, binding, vnode) {
        function documentHandler (e) {
          if (el.contains(e.target)) {
            return false
          }
          if (binding.expression) {
            binding.value(e)
          }
        }
        el._vueClickOutside_ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      unbind: function (el, binding) {
        document.removeEventListener('click', el._vueClickOutside_)
        delete el._vueClickOutside_
      }
    }
  },
  methods: {
    ...mapActions([
      'changeBrandScreening'
    ]),
    closeBrandDetail () {
      this.showDetail = false
    },
    handleStyleClose () {
      this.showStyle = false
    },
    handleSpaceClose () {
      this.showSpace = false
    },
    showSelect (showKey, hideKey, ref, e) {
      if (e.target !== this.$refs[ref]) {
        this[showKey] = false
        this[hideKey] = false
      }
      this[showKey] = true
      this[hideKey] = false
    },
    selectBrand (item) {
      this.brandId = item.id
      this.changeBrandScreening({show: false, search_words: '', brandId: '', first_id: '', second_id: '', three_id: '', category_id: ''})
      this.showDetail = true
    },
    selectItem (key, { name = '', id = '' }, showKey) {
      this[key].id = id
      this[key].name = name
      this[showKey] = false
      if (key === 'styleActive') this.styleKeyword = this[key].name === '全部' ? '' : this[key].name
      else this.catId = this[key].id
      this.page = 1
      this.getBrandList()
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(getBrandList, {
          params: {
            page: this.page,
            page_size: this.pageSize,
            keyword: this.keyword,
            style: this.styleKeyword,
            cat_id: this.catId
          }
        })
        this.brandList.push(...data.list)
        this.page += 1
        if (!data.list.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
      }
    },
    async getBrandList () {
      try {
        const { data } = await this.$axios.get(getBrandList, {
          params: {
            page: this.page,
            page_size: this.pageSize,
            keyword: this.keyword,
            style: this.styleKeyword,
            cat_id: this.catId
          }
        })
        this.isLoading = false
        this.isLoaded = false
        this.page += 1
        this.brandList = data.list
      } catch (err) {
        console.log(err)
        this.$toast.error(msg)
      }
    },
    async getCategoryList () {
      try {
        const { data } = await this.$axios.get(getCategoryList, { params: { parent_id: 0 } })
        this.spaceList = data.ls
      } catch (err) {
        this.$toast.error(msg)
      }
    },
    clearKeyword () {
      this.keyword = ''
    }
  },
  created () {
    this.changeBrandScreening({show: false, search_words: '', brandId: '', first_id: '', second_id: '', three_id: '', category_id: ''})
    this.getCategoryList()
    this.getBrandList()
  }
}
</script>

<style scoped lang="scss">
.brand-detail {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.brand {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 60px 2px 0;
  overflow: hidden;
  .sketch-brand-header {
    display: flex;
  }
  .search {
    flex: 1;
    position: relative;
    height: 70px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    overflow: hidden;
    .search-icon {
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 33px;
      color: #999;
    }
    .search-input {
      width: 100%;
      height: 100%;
      padding-left: 84px;
      padding-right: 60px;
      font-size: 20px;
    }
    .search-clear {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 35px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background: #000;
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
    }
  }
  .filter {
    text-align: center;
    font-size: 22px;
    color: #fff;
    margin-left: 20px;
    .icon-filter {
      font-size: 34px;
      margin-bottom: 10px;
    }
  }
}
.brand-screen {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  .brand-screen-select {
    position: relative;
    display: flex;
    align-items: center;
    width: 275px;
    height: 45px;
    font-size: 18px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    padding: 0 15px;
    &:after {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-40%);
      content: '';
      width: 0;
      height: 0;
      border-width: 7px;
      border-style: solid;
      border-color:#333 transparent transparent transparent
    }
    .brand-screen-downdrop {
      position: absolute;
      left: -1px;
      top: 60px;
      width: 275px;
      max-height: 320px;
      overflow-y: scroll;
      padding: 10px 0;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DDDDDD;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.15);
      .select-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        &.select-item-active {
          color: #FF6C00;
        }
      }
    }
  }
}
.brand-container {
  height: 100%;
}
.brand-list {
  margin-top: 40px;
  padding-bottom: 200px;
  .brand-list-title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #7B7B7B;
  }
  .brand-list-content {
    display: flex;
    flex-wrap: wrap;
  }
  .brand-logo-item {
    width: 181.33px;
    height: 181.33px;
    background: #FFFFFF;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    &:nth-child(3n + 3) {
      margin-right: 0;
    }
  }
}
.brand-list-info {
  margin-top: 100px;
  text-align: center;
  img {
    width: 180px;
  }
  .brand-list-info-text {
    margin-top: 30px;
    font-size: 24px;
    color: #7B7B7B;
  }
}
</style>
