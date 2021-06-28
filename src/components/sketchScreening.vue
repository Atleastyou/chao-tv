<template lang="pug">
transition(name="screening")
  .screening-mask(v-if="show" @click.self="close")
    .screening
      .screening-content(v-if="!loading")
        .screening-item(v-for="tag in tagList")
          .screening-label {{tag.label}}
          .screening-bd
            .screening-tag(@click="selectTagAll(tag)" :class="{'active': tag.selectedAll}") 全部
            .screening-tag(v-for="item in tag.tags", :class="{'active': item.isActive}" @click="selectTag(item, tag.label)") {{item.name}}
        .screening-item(v-for="cate in categoriesList" v-if="cate.categories.length")
          .screening-label {{cate.label}}
          .screening-bd
            .screening-tag(:class="{'active': cate.tagActive}" @click="selectCategoriesAll(cate)") 全部
            .screening-tag(v-for="item in cate.categories", :class="{'active': item.isActive && !cate.tagActive}" @click="selectCategories(item, cate)") {{item.name}}
      .screening-loading(v-else) 加载中...
      .screening-btns
        a.screening-btn.btn-cancel(@click="reset")
          touch-ripple(:speed="2", :opacity=".5")
            font 重置
        a.screening-btn.btn-confirm(@click="confirm")
          touch-ripple(:speed="2", :opacity=".5")
            font 确定
</template>

<script>
import { getStyleList, getSpaceList, getCategoryList, getCategoryAndSon } from 'api'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'sketchScreening',
  data () {
    return {
      loading: false,
      tagList: [
        {
          label: '风格',
          selectedAll: false,
          tags: []
        }, {
          label: '空间',
          selectedAll: false,
          tags: []
        }
      ],
      categoriesList: [
        {
          label: '一级分类',
          tagActive: true,
          categories: []
        }, {
          label: '二级分类',
          tagActive: true,
          categories: []
        }, {
          label: '三级分类',
          tagActive: true,
          categories: []
        }
      ],
      form: {
        search_words: '',
        style_words: '',
        space_words: '',
        first_id: '',
        second_id: '',
        three_id: ''
      },
      styleList: [],
      spaceList: []
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.init()
      }
    }
  },
  computed: {
    ...mapState({
      show: state => state.sketch.screening.show,
    })
  },
  methods: {
    ...mapActions([
      'changeSketchScreening',
      'changeScreeningConfirm'
    ]),
    close () {
      this.changeSketchScreening({show: false})
    },
    async getStyleList () {
      try {
        const { data } = await this.$axios.get(getStyleList)
        data.ls.forEach(item => {
          item.isActive = false
        })
        this.tagList[0].tags = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getSpaceList () {
      try {
        const { data } = await this.$axios.get(getSpaceList)
        
        data.ls.forEach(item => {
          item.isActive = false
        })
        this.tagList[1].tags = data.ls
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    selectTag (item, label) {
      if (label === '风格') {
        this.tagList[0].tags.forEach(row => {
          row.isActive = false
          if (row.id === item.id) row.isActive = true
        })
        this.styleList = []
        if (item.isActive) this.styleList.push(item.name)
        this.tagList[0].selectedAll = !this.styleList.length
      } else {
        this.tagList[1].tags.forEach(row => {
          row.isActive = false
          if (row.id === item.id) row.isActive = true
        })
        this.spaceList = []
        if (item.isActive) this.spaceList.push(item.name)
        this.tagList[1].selectedAll = !this.spaceList.length
      }
    },
    selectTagAll (item) {
      item.selectedAll = true
      item.tags.forEach(tag => {
        tag.isActive = false
      })
      if (item.label === '风格') this.styleList = []
      else this.spaceList = []
    },
    selectCategoriesAll (cate) {
      cate.tagActive = true
      if (cate.label === '一级分类') {
        this.form.first_id = ''
        this.form.second_id = ''
        this.form.three_id = ''
        this.categoriesList[1].tagActive = true
        this.categoriesList[1].categories = []
        this.categoriesList[2].tagActive = true
        this.categoriesList[2].categories = []
      } else if (cate.label === '二级分类') {
        this.form.second_id = ''
        this.form.three_id = ''
        this.categoriesList[2].tagActive = true
        this.categoriesList[2].categories = []
      } else {
        this.form.three_id = ''
      }
    },
    selectCategories (item, obj) {
      obj.tagActive = false
      obj.categories.forEach(row => {
        if (row.id === item.id) {
          row.isActive = true
        } else {
          row.isActive = false
        }
      })
      if (obj.label === '一级分类') {
        this.form.first_id = item.id
        this.form.second_id = ''
        this.form.three_id = ''
        this.categoriesList[1].tagActive = true
        this.categoriesList[2].categories = []
      } else if (obj.label === '二级分类') {
        this.form.second_id = item.id
        this.categoriesList[2].tagActive = true
        this.form.three_id = ''
      } else {
        this.form.three_id = item.id
      }
      this.getChildrenCategories(item.id, obj.label)
    },
    async getCategories () {
      try {
        const { data } = await this.$axios.get(getCategoryList, { params: { parent_id: 0 } })
        data.ls.forEach(item => {
          item.isActive = false
        })
        this.categoriesList[0].categories = data.ls
      } catch (err) {
        console.log(err)
      }
    },
    async getChildrenCategories (id, value) {
      try {
        const { data } = await this.$axios.get(getCategoryList, { params: { parent_id: id } })
        data.ls.forEach(item => {
          item.isActive = false
        })
        if (value === '一级分类') {
          this.categoriesList[1].categories = data.ls
        } else if (value === '二级分类') {
          this.categoriesList[2].categories = data.ls
        }
      } catch (err) {
        console.log(err)
      }
    },
    confirm () {
      this.form.style_words = this.styleList.join(' ')
      this.form.space_words = this.spaceList.join(' ')
      let filter = ['style_words', 'space_words', 'first_id', 'second_id', 'three_id']
      let query = {}
      filter.forEach(key => {
        if (this.form[key]) query[key] = this.form[key]
      })
      if (this.form.first_id && !this.form.second_id && !this.form.three_id) query.category_id = this.form.first_id
      if (this.form.second_id && !this.form.three_id) query.category_id = this.form.second_id
      if (this.form.three_id) query.category_id = this.form.three_id
      if (this.$route.query.good_type) query.good_type = this.$route.query.good_type
      this.$router.replace({ name: this.$route.name, params: this.$route.params, query: { ...query, tm: new Date().getTime() } })
      this.changeScreeningConfirm({ confirmed: true })
      this.close()
    },
    reset () {
      this.form = {
        search_words: '',
        style_words: '',
        space_words: '',
        first_id: '',
        second_id: '',
        three_id: ''
      }
      this.styleList = []
      this.spaceList = []
      this.tagList[0].selectedAll = true
      this.tagList[1].selectedAll = true
      if (!this.form.first_id) {
        this.categoriesList[0].tagActive = true
        this.categoriesList[1].categories = []
        this.categoriesList[2].categories = []
      }
      if (!this.form.second_id) {
        this.categoriesList[1].tagActive = true
        this.categoriesList[2].categories = []
      }
      if (!this.form.three_id) this.categoriesList[2].tagActive = true
      this.tagList.forEach(item => {
        item.tags.forEach(row => {
          row.isActive = false
        })
      })
      let query = {}
      if (this.$route.query.good_type) query.good_type = this.$route.query.good_type
      this.$router.replace({ name: this.$route.name, params: this.$route.params, query })
      this.changeScreeningConfirm({ confirmed: true })
    },
    async setScreening () {
      await this.setTag()
      this.categoriesList.forEach(async item => {
        if (item.label === '一级分类') {
          if (this.form.first_id) {
            item.tagActive = false
            item.categories.forEach(cate => {
              if (cate.id === Number(this.form.first_id)) cate.isActive = true
              else cate.isActive = false
            })
          } else {
            item.tagActive = true
          }
        } else if (item.label === '二级分类') {
          if (this.form.first_id) await this.getChildrenCategories(this.form.first_id, '一级分类')
          if (this.form.second_id) {
            item.tagActive = false
            item.categories.forEach(cate => {
              if (cate.id === Number(this.form.second_id)) cate.isActive = true
              else cate.isActive = false
            })
          } else {
            item.tagActive = true
          }
        } else if (item.label === '三级分类') {
          if (this.form.second_id) await this.getChildrenCategories(this.form.second_id, '二级分类')
          if (this.form.three_id) {
            item.tagActive = false
            item.categories.forEach(cate => {
              if (cate.id === Number(this.form.three_id)) cate.isActive = true
              else cate.isActive = false
            })
          } else {
            item.tagActive = true
          }
        }
      })
    },
    async init () {
      this.loading = true
      const { style_words = '', space_words = '', first_id = '', second_id = '', three_id = '' } = this.$route.query
      this.form = { style_words, space_words, first_id, second_id, three_id }
      if (!style_words) this.tagList[0].selectedAll = true
      else this.tagList[0].selectedAll = false
      if (!space_words) this.tagList[1].selectedAll = true
      else this.tagList[1].selectedAll = false
      if (!first_id) {
        this.categoriesList[0].tagActive = true
        this.categoriesList[1].categories = []
        this.categoriesList[2].categories = []
      }
      if (!second_id) {
        this.categoriesList[1].tagActive = true
        this.categoriesList[2].categories = []
      }
      if (!three_id) this.categoriesList[2].tagActive = true
      this.getCategories()
      await this.getStyleList()
      await this.getSpaceList()
      await this.setScreening()
      this.loading = false
    },
    setTag () {
      try {
        if (this.form.style_words) this.styleList = this.form.style_words.split(' ')
        else this.styleList = []
        if (this.form.space_words) this.spaceList = this.form.space_words.split(' ')
        else this.spaceList = []
        this.tagList[0].tags.forEach(tag => {
          this.styleList.forEach(item => {
            if (tag.name === item) {
              tag.isActive = true
            }
          })
        })
        this.tagList[1].tags.forEach(tag => {
          this.spaceList.forEach(item => {
            if (tag.name === item) {
              tag.isActive = true
            }
          })
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.screening-leave-active {
  transition: opacity .3s ease;
}
.screening-enter-active,.screening-leave-active {
  opacity: 0
}
.screening-enter-active .screening,
.screening-leave-active .screening {
  transform: translateX(-100%);
  opacity: 0;
}
.screening-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 8888;
  background: rgba(0,0,0,.3)
}
.screening {
  transition: all .3s;
  position: fixed;
  width: 560px;
  height: 100%;
  top: 0;
  left: 0;
  background: #38363D;
  z-index: 9999;
}
.screening-content {
  width: 100%;
  height: 100%;
  padding: 45px 60px 160px 60px;
  overflow-y: auto;
}
.screening-label {
  padding: 40px 0 20px 0;
  font-size: 24px;
  color: #7B7B7B;
}
.screening-bd {
  display: flex;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  & input {
    width: 41.5%;
    padding: 10px 0;
    font-size: 18px;
    text-align: center;
    background: #F5F5F7;
    border-radius: 4px;
  }
  & span {
    display: inline-block;
    width: 20px;
    height: 1px;
    margin: 0 20px;
    border: 1px solid #F5F5F7;
  }
}
.screening-bd input[screening="select"] {
  padding: 10px 20px;
  width: 100%;
  background: #F5F5F7;
  border-radius: 4px;
  font-size: 20px;
  color: #333333;
  text-align: left;
}
.screening-tag {
  padding: 0 20px;
  height: 45px;
  line-height: 45px;
  margin-right: 10px;
  margin-bottom: 10px;
  background: #FFFFFF;
  border-radius: 4px;
  font-size: 18px;
  color: #666666;
}
.screening-tag.active {
  background: #FFBE28;
  color: #333333;
}
.screening-btns {
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  background: #38363D;
  box-shadow: 0 -10px 20px 0 rgba(0,0,0,0.20);
  font-size: 24px;
  & .btn-cancel {
   color: #7B7B7B;
  }
  & .btn-confirm {
    background: #FFBE28;
    color: #333;
  }
  & .screening-btn {
    display: flex;
    height: 100%;
    width: 50%;
    align-items: center;
    justify-content: center;
  }
  & .v-touch-ripple {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
}
.select-dropdown {
  position: absolute;
  width: 100%;
  top: 60px;
  border: solid 1px #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  z-index: 9999;
}
.screening-bd-input {
  position: relative;
  width: 100%;
  & .icon-bottom {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    transform: rotateZ(0);
    color: #333;
    transition: all .3s;
  }
}
.screening-bd-input .icon-bottom.screening-icon-top {
  transform: rotate(180deg);
}
.select-dropdown__list {
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  padding: 6px 0;
  margin: 0;
  box-sizing: border-box;
}
.select-dropdown__item {
  font-size: 18px;
  padding: 10px 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #f5f7fa;
  }
}
.screening-loading {
  color: #fff;
  font-size: 36px;
  text-align: center;
  margin-top: 150px;
}
</style>
