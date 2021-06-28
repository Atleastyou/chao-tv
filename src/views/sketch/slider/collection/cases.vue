<template lang="pug">
  infinite-scroll.cases-list(:loadMore="loadMore")
    .cases-item(v-for="item in caseData.ls" @click.stop="openCaseDetail(item)")
      .cases-item-img(:style="{'background-image': `url(${item.preview}?imageslim&imageView2/0/w/765)`}")
      p.cases-item-name {{item.title}}
      .cases-item-handles
        .cases-item-btn(@click.stop="againCreation(item.cont, item.id)") 再创作
        .cases-item-collection(@click.stop="collectionCase(item)")
          i.icon-collection_active(v-if="item.is_collection")
          i.icon-collection(v-else)
    .case-list-info(v-if="!caseData.ls.length") 暂无收藏的案例
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { sceneCaseList, unCollectionCase, collectionCase } from 'api'
import infiniteScroll from '@/components/infiniteScroll'
export default {
  name: 'selectedCases',
  components: {
    infiniteScroll
  },
  data () {
    return {
      caseData: {
        ls: []
      },
      isLoading: false,
      collectionStatus: false,
      isLoaded: false
    }
  },
  computed: {
    ...mapState({
      replace: state => state.modal.replace
    })
  },
  methods: {
    ...mapActions([
      'showReplaceModal',
      'changeCaseDetail',
      'updateHistory'
    ]),
    openCaseDetail ({id}) {
      this.changeCaseDetail({show: true, id})
    },
    async collectionCase (item) {
      try {
        if (this.collectionStatus) return
        this.collectionStatus = true
        const { is_collection, id } = item
        if (is_collection) {
          await this.$axios.get(unCollectionCase, { params: { id } })
        } else {
          await this.$axios.get(collectionCase, { params: { id } })
        }
        this.$set(item, 'is_collection', !is_collection)
        this.getSceneCaseList()
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
            is_collection: 1,
            page_code: this.caseData.page_code
          }
        })
        this.caseData.ls.push(...data.ls)
        this.caseData.page_code = data.page_code
        if (!data.ls.length) this.isLoaded = true
        this.$nextTick(() => {
          this.isLoading = false
        })
      } catch ({ msg }) {
        this.isLoading = false
        this.$toast.error(msg)
      }
    },
    async getSceneCaseList () {
      try {
        const { data } = await this.$axios.get(sceneCaseList, { params: { is_collection: 1 } })
        this.caseData = data
        this.isLoaded = false
        this.collectionStatus = false
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
    }
  },
  created () {
    this.getSceneCaseList()
  }
}
</script>

<style lang="scss" scoped>
.cases-list {
  background: #38363D;
  margin-top: 30px;
  padding-bottom: 30px;
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
.case-list-info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #7B7B7B;
}
</style>
