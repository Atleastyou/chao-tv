<template lang="pug">
.search
  .search-container
    img.search-logo.app-logo(:src="search_page_logo")
    .search-title 软装优品直供商城
    .search-input-content
      .search-input-body
        input.search-input(placeholder="请输入搜索内容" v-model="keyword")
        .icon-search
      .search-label(@click="searchGoods") 搜索
    .search-category-items
      .search-category-item(v-for="cate in category")
        .category-item-label {{cate.label}}
        .category-item
          .item-tag(v-for="item in cate.items", :speed="1", :opacity="0.3" color="#ddd" transition="ease" @click="search(cate, item)") {{item.name}}
</template>

<script>
import { getCategoryList, getStyleList, getSpaceList } from 'api'
import { mapState } from 'vuex'
export default {
  name: 'search',
  data () {
    return {
      category: [
        {
          label: '热搜商品：',
          items: []
        },
        {
        	label: '热搜风格：',
        	items: []
        },
        {
        	label: '热搜空间：',
        	items: []
        }
      ],
      keyword: ''
    }
  },
  computed: {
    ...mapState({
      search_page_logo: state => state.user.logo.search_page_logo
    })
  },
  methods: {
    async getCategoryList () {
      try {
        const { data } = await this.$axios.get(getCategoryList, { params: { parent_id: 0 } })
        this.setCategory(data, '热搜商品：')
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getStyleList () {
      try {
        const { data } = await this.$axios.get(getStyleList)
        this.setCategory(data, '热搜风格：')
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getSpaceList () {
      try {
        const { data } = await this.$axios.get(getSpaceList)
        this.setCategory(data, '热搜空间：')
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    setCategory (data, label) {
      this.category.forEach(item => {
        if (item.label === label) {
          item.items = data.ls
        }
      })
    },
    searchGoods () {
      this.$router.push({ name: 'searchGoods', query: { search_words: this.keyword, brand_id: '' } })
    },
    search (cate, item) {
      let data = {}
      if (cate.label === '热搜商品：') {
        data.first_id = item.id
        data.category_id = item.id
      } else if (cate.label === '热搜风格：') {
        data.style_words = item.name
      } else if (cate.label === '热搜空间：') {
        data.space_words = item.name
      }
      this.$router.push({ name: 'searchGoods', query: { ...data } })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getCategoryList()
      vm.getStyleList()
      vm.getSpaceList()
    })
  }
}
</script>

<style lang="scss" scoped>
.search {
  height: 100%;
  overflow-y: auto;
}
.search-container {
  padding: 100px 0 60px 0;
  text-align: center;
}
.search-title {
  margin: 20px 0 40px;
  font-size: 32px;
  color: #333333;
}
.search-input-content {
  display: flex;
  width: 1032px;
  height: 100px;
  margin: 0 auto;
  padding: 10px;
  align-items: center;
  line-height: 100px;
  background: #FFBE28;
  border-radius: 4px;
}
.search-input-body {
  position: relative;
  width: 830px;
  display: inherit;
  & .icon-search {
    position: absolute;
    top: 40px;
    left: 30px;
    font-size: 34px;
    color: #999999;
    transform: translateY(-50%);
  }
}
.search-input {
  width: 100%;
  height: 80px;
  padding: 20px;
  border-radius: 2px;
  font-size: 28px;
}
.search-input-body .search-input {
  padding-left: 84px;
}
.search-label {
  height: 80px;
  line-height: 80px;
  padding-left: 60px;
  padding-right: 50px;
  font-size: 36px;
  color: #333;
  cursor: pointer;
}
.search-category-items {
  width: 1032px;
  margin: 0 auto;
  text-align: left;
}
.search-category-item {
  display: flex;
  margin: 60px 0;
}
.category-item-label {
  min-width: 140px;
  font-size: 28px;
  color: #666666;
}
.category-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  & .item-tag {
    padding: 10px 40px;
    margin: 0 0 20px 20px;
    border: 1px solid #999999;
    border-radius: 2px;
    font-size: 24px;
    color: #999999;
    text-align: center;
    cursor: pointer;
  }
}
</style>
