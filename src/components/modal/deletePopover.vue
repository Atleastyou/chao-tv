<template lang="pug">
modal(name="deletePopover", :width="760", height="auto" @before-open="beforeOpen")
  .popover
    .popover-header
      .popover-header-title 删除确认
      .icon-close(@click="closePopover")
    .popover-content 您确定删除该商品吗？
    .popover-footer
      .footer-button
        c-button(@click="closePopover") 取消
      .footer-button
        c-button(type="primary" @click="confirm") 确定
</template>

<script>
import * as Api from 'api'
export default {
  name: 'deletePopover',
  data () {
    return {
      api: '',
      params: {}
    }
  },
  methods: {
    beforeOpen ({ params }) {
      this.api = params.api
      this.params = {
        ...this.params,
        ...params.query
      }
    },
    closePopover () {
      this.$modal.hide('deletePopover')
    },
    async confirm () {
      try {
        const { data } = await this.$axios.post(Api[this.api], { ...this.params })
        this.$emit('change', true)
        this.closePopover()
        this.$toast.success('删除成功')
      } catch ({ msg }) {
        this.closePopover()
        this.$toast.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-header {
  display: flex;
  width: 100%;
  height: 85px;
  padding: 20px 30px;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: 0 1px 0 0 #EFEFEF;
  border-bottom: 1px solid #EFEFEF;
  font-size: 32px;
  color: #333333;
  & .icon-close {
    font-size: 20px;
    color: #999;
  }
}
.popover-content {
  width: 100%;
  height: 215px;
  padding: 30px;
  background: #fff;
  font-size: 28px;
  color: #333333;
}
.popover-footer {
  display: flex;
  width: 100%;
  height: 120px;
  padding: 30px;
  align-items: center;
  justify-content: flex-end;
  background: #F8F8F8;
  box-shadow: inset 0 1px 0 0 #EFEFEF;
  border-radius: 0 0 8px 8px;
  & .footer-button {
    margin-left: 20px;
  }
}
</style>
