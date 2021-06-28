<template lang="pug">
.category
  .category-slider
    .search
      i.search-icon.icon-search
      input.search-input(placeholder="搜索" v-model="keyword")
      .search-focus-line
      .search-line
    .category-menu
      router-link.menu-item(v-for="item in parentCategory" :to="{name: $route.name, query: { id: `${item.id}` } }" replace @click="routerLink(item.id)" :key="item.id")
        touch-ripple(:speed="2", :opacity=".5", :class="{'active': `${activeId}` === `${item.id}`}")
          font {{item.name}}
  .category-body
    router-link.category-banner(:to="{ path: ad.url }" v-if="ad && ad.image && ad.url", :style="{'background-image': `url(${ad.image})`}")
    .category-banner(v-else-if="ad && ad.image", :style="{'background-image': `url(${ad.image})`}")
    .category-banner.category-banner-bg(v-else)
    .category-slide-item(v-for="item in category")
      router-link.category-slide-item_title(
        :to="{ name: 'hotGoods', query: { first_id: activeId, second_id: item.id, category_id: item.id } }"
      ) {{item.name}}
      .category-content
        router-link.category-item(v-for="son in item.son", :to="{ name: 'hotGoods', query: { first_id: activeId, second_id: item.id, three_id: son.id, category_id: son.id } }" :key="son.id")
          .category-item-bg(:style="{'background-image': `url(${son.image}?imageslim&imageView2/0/w/560)`}")
          .category-item-name {{son.name}}
</template>

<script>
import { getCategoryList, getCategoryAndSon } from 'api'
let timer
export default {
  name: 'category',
  data () {
    return {
      ad: {},
      keyword: '',
      activeId: '',
      parentCategory: [],
      banner: '../../static/images/banner@2x.png',
      category: []
    }
  },
  watch: {
    keyword (value) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$router.push({ name: 'hotGoods', query: { search_words: value, brand_id: '' } })
      }, 300)
    }
  },
  methods: {
  	async getCategoryList () {
  		try {
        const { data } = await this.$axios.get(getCategoryList, { params: { parent_id: 0 } })
        this.parentCategory = data.ls
        if (this.$route.query.id) this.activeId = this.$route.query.id
        else this.activeId = this.parentCategory[0].id
        this.getCategoryAndSon(this.activeId)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
  	},
    async getCategoryAndSon (id) {
    	try {
        const { data } = await this.$axios.get(getCategoryAndSon, { params: { parent_id: id } })
        this.ad = data.ad
        this.category = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    routerLink (parentId) {
      this.$router.replace({ name: this.$route.name, query: { id: parentId } })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getCategoryList()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.activeId = to.query.id
    this.getCategoryAndSon(to.query.id)
    next()
  }
}
</script>

<style lang="scss" scoped>
.category {
  background: rgb(37,36,41);
  height: 100%;
  display: flex;
  padding: 80px;
  padding-bottom: 0;
}
.category-slider {
  margin-right: 80px;
  width: 440px;
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;
}
.search {
  padding-bottom: 23px;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 30px;
  top: 5px;
  font-size: 33px;
  color: #7B7B7B;
}
.search-input {
  color: #7B7B7B;
  background: none;
  font-size: 28px;
  padding: 0 20px 0 85px;
  width: 100%;
  caret-color: #fff;
  &:focus + .search-focus-line {
    transform: scaleX(1);
  }
}
.search-line {
  height: 2px;
  background-color: #7B7B7B;
  left: 0;
  right: 0;
  bottom: -2px;
  position: absolute;
}
.search-focus-line {
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  transform: scaleX(0);
  transition: transform .45s cubic-bezier(.23,1,.32,1);
  background: #fff;
  z-index: 2;
}
.category-menu {
  margin-top: 80px;
  text-align: center;
  & .v-touch-ripple {
    width: 100%;
    height: 80px;
    padding: 0 30px;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    &.active {
      color: #fff;
      background: #38363D;
      box-shadow: 0 10px 20px 0 rgba(0,0,0,0.30);
    }
  }
}
.menu-item {
  color: #7B7B7B;
}
.category-body {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
.category-banner {
  display: inline-block;
  margin-bottom: 40px;
  width: 100%;
  height: 300px;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.category-banner-bg {
  background-image: url(../../static/images/banner@2x.png)
}
.category-content {
  display: flex;
  flex-wrap: wrap;
}
.category-slide-item_title {
  display: block;
  margin: 40px 0;
  color: #fff;
  font-size: 32px;
}
.category-item {
  width: 24.25%;
  margin-right: 1%;
  height: 359px;
  padding: 14px;
  margin-bottom: 20px;
  background: #FFFFFF;
  border-radius: 4px;
}
.category-item:nth-child(4n + 4) {
  margin-right: 0;
}
.category-item-bg {
  width: 100%;
  height: 272px;
  background: #F5F5F5;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.category-item-name {
  width: 100%;
  padding-top: 20px;
  font-size: 24px;
  color: #333333;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
