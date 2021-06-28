<template lang="pug">
  infinite-scroll.cases-list(:loadMore="loadMore")
    .cases-item(v-for="item,index in caseData.ls" @click.stop="openCaseDetail(item)")
      .cases-item-img(:style="{'background-image': `url(${item.preview}?imageslim&imageView2/0/w/765)`}")
      p.cases-item-name {{item.title}}
      .cases-item-handles
        .cases-item-btn(@click.stop="againCreation(item.cont, item.id)") 再创作
        .cases-item-collection(@click.stop="collectionCase(item)")
          i.icon-collection_active(v-if="item.is_collection")
          i.icon-collection(v-else)
    .cases-list-info(v-if="!caseData.ls.length")
      img(src="../../../../static/images/search_img_notf_dis.png")
      .cases-list-info-txt 未找到相关案例
</template>

<script>
import { sceneCaseList, unCollectionCase, collectionCase, sceneMaterials } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'myCases',
  props: {
    selectedStyle: String,
    selectedSpace: String,
  },
  data () {
    return {
      caseData: {
        ls: []
      },
      isLoading: false,
      isLoaded: false,
      casesList: []
    }
  },
  watch: {
    '$route' (newRoute, oldRoute) { // 点击header内的保存按钮时，需要刷新我的案例列表
      if (newRoute.query.temporarySave && newRoute.query.temporarySave !== oldRoute.query.temporarySave) {
        this.getSceneCaseList()
      }
    },
    selectedStyle () {
      this.getSceneCaseList()
    },
    selectedSpace () {
      this.getSceneCaseList()
    },
  },
  components: {
    infiniteScroll
  },
  computed: {
    ...mapState({
      replace: state => state.modal.replace
    })
  },
  methods: {
    ...mapActions([
      'showConfirmModal',
      'showReplaceModal',
      'changeCaseDetail',
      'updateHistory',
      'changeSketchGoods'
    ]),
    openCaseDetail ({id}) {
      this.changeCaseDetail({show: true, id})
    },
    async collectionCase (item) {
      try {
        const { is_collection, id } = item
        if (is_collection) {
          await this.$axios.get(unCollectionCase, { params: { id } })
        } else {
          await this.$axios.get(collectionCase, { params: { id } })
        }
        this.$set(item, 'is_collection', !is_collection)
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async loadMore () {
      try {
        if (this.isLoading || this.isLoaded) return
        this.isLoading = true
        const { data } = await this.$axios.get(sceneCaseList, {
          params: {
            page_code: this.caseData.page_code,
            my: 1,
            style: this.selectedStyle,
            space: this.selectedSpace
          }
        })
        this.caseData.ls.push(...data.ls)
        this.caseData.page_code = data.page_code
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.$toast.error(msg)
        this.isLoading = false
      }
    },
    async getSceneCaseList () {
      try {
        const { data } = await this.$axios.get(sceneCaseList, { params: { my: 1, style: this.selectedStyle, space: this.selectedSpace } })
        this.caseData = data
        this.isLoaded = false
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async deleteCase (id, index) {
      try {
        if (Number(this.$route.params.id) === id && this.$route.params.type === 'edit') {
          this.$toast.error('操作无法完成，当前方案在编辑中')
          return
        }
        const confirmed = await this.showConfirmModal({
          title: '删除确认',
          paragraph: '确认要删除案例？',
          confirmButtonText: '确定'
        })
        if (confirmed === 1) {
          if (Number(this.$route.params.id) === id) {
            if (this.$route.query.type === 'edit') { // 删除案例时，如果该案例处于编辑状态，那么同时清除画布以及商品清单
              canvas.clear().renderAll()
              this.changeSketchGoods({type: 'clear'})
            }
            let query = this.$route.query
            delete query['type']
            delete query['time_stamp']
            this.$router.replace({ name: this.$route.name, query })
          }
          await this.$axios.post(sceneMaterials, { id })
          this.$toast.success('删除成功！')
          this.caseData.ls.splice(index, 1)
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async againCreation (data, id) {
      let query = this.$route.query
      delete query['type']
      if (!this.replace.remind && canvas.getActiveObject()) {
        const confirmed = await this.showReplaceModal({
          title: '替换确认',
          paragraph: '将替换当前画布的全部内容'
        })
        if (!confirmed) return
        this.$router.replace({ name: this.$route.name, params: { id }, query: { ...query, time_stamp: new Date().getTime() } })
      } else {
        this.$router.replace({ name: this.$route.name, params: { id }, query: { ...query, time_stamp: new Date().getTime() } })
      }
    },
    async editCase (id) {
      if (!this.replace.remind && canvas.getActiveObject()) {
        const confirmed = await this.showReplaceModal({
          title: '替换确认',
          paragraph: '将替换当前画布的全部内容'
        })
        if (!confirmed) return
        this.$router.replace({ name: this.$route.name, params: { id }, query: { type: 'edit', time_stamp: new Date().getTime(), ...this.$route.query } })
      } else {
        this.$router.replace({ name: this.$route.name, params: { id }, query: { type: 'edit', time_stamp: new Date().getTime(), ...this.$route.query } })
      }
    }
  },
  created () {
    this.getSceneCaseList()
  }
}
</script>

<style lang="scss" scoped>
.cases-list {
  margin-top: 30px;
}
.cases-item {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 49.1%;
  margin-right: 1.8%;
  margin-bottom: 10px;
  padding: 14px;
  background: #FFFFFF;
  border-radius: 4px;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.cases-item-img {
  width: 100%;
  height: 183px;
  background-position: 0, 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #fff;
}
.cases-item-name {
  font-size: 18px;
  line-height: 25px;
  margin-top: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cases-item-handles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  .cases-item-btn {
    width: 78px;
    min-width: 78px;
    height: 35px;
    line-height: 35px;
    background: #FFBE28;
    border-radius: 2px;
    text-align: center;
    font-size: 18px;
    color: #333;
  }
  .cases-item-collection {
    font-size: 26px;
    .icon-collection {
      color:#999;
    }
    .icon-collection_active {
      color: #FF4F00
    }
  }
}
.cases-item-btns {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  top: 10px;
  right: 10px;
}
.cases-item-edit,
.cases-item-del{
  width: 60px;
  height: 35px;
  margin: 0 3px;
  line-height: 35px;
  text-align: center;
  background: #252429;
  border-radius: 2px;
  font-size: 18px;
  color: #fff;
}
.cases-list-info {
  text-align: center;
  margin-top: 211px;
  img {
    width: 200px;
  }
  .cases-list-info-txt {
    margin-top: 30px;
    font-size: 22px;
    color: #7B7B7B;
  }
}
</style>
