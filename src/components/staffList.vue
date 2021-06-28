<template lang="pug">
transition(name="staff")
  .staff-mask(v-if="show" @click.self="close")
    .staff
      .staff-content
        .staff-title 店员列表
        .staff-list
          .staff-item(v-for="item, index in list" :class="{ 'staff-item-active' : staffIndex === index }" @click="select(item, index)")
            .staff-item-photo
              img.staff-item-choose(src="https://static.chaodp.com/chao-tv/choose.png" v-if="staffIndex === index")
              .staff-item-photo-img(:style="{ 'background-image': `url(${item.header})` }")
            .staff-item-name {{item.name}}
            .staff-item-job {{item.job}}
</template>

<script>
import { getShopClerk } from 'api'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'staff',
  data () {
    return {
      staffIndex: '',
      list: []
    }
  },
  watch: {
    show (v) {
      if (v) this.init()
    }
  },
  computed: {
    ...mapState({
      staff: state => state.ui.staff,
      show: state => state.ui.staff.show
    })
  },
  methods: {
    ...mapActions([
      'changeStaff'
    ]),
    close () {
      this.changeStaff({ show: false })
    },
    select (item, index) {
      this.staffIndex = index
      this.changeStaff({ ...item, show: false, info: '竭诚为您服务' })
    },
    async init () {
      try {
        const { data } = await this.$axios.get(getShopClerk)
        this.list = data.list
      } catch (err) {
        this.$message.error(err.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.staff-leave-active {
  transition: opacity .3s ease;
}
.staff-enter-active,.staff-leave-active {
  opacity: 0
}
.staff-enter-active .staff,
.staff-leave-active .staff {
  transform: translateX(100%);
  opacity: 0;
}
.staff-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 8888;
  background: rgba(255,255,255,0.50);
}
.staff {
  transition: all .3s;
  position: fixed;
  width: 27.604rem;
  height: 100%;
  top: 0;
  right: 0;
  background-image: linear-gradient(-135deg, #28003C 0%, #000015 100%);
  z-index: 9999;
}
.staff-content {
  width: 100%;
  height: 100%;
  padding: 3.125rem 0.677rem;
  overflow-y: auto;
}
.staff-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.927rem;
}
.staff-title {
  padding: 0 0.78125rem;
  font-size: 1.6667rem;
  color: #FFFFFF;
  font-weight: 600;
  line-height: 2.34375rem;
}
.staff-item {
  margin: 0 0.78125rem 2.604rem;
}
.staff-item-photo {
  position: relative;
  width: 5rem;
  height: 5rem;
  padding: 0.15625rem;
  border-radius: 50%;
}
.staff-item-photo-img {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #fff;
  border-radius: 50%;
}
.staff-item-name {
  margin-top: 0.5208rem;
  font-size: 1.35416rem;
  color: #FFFFFF;
  line-height: 1.92708rem;
  text-align: center;
}
.staff-item-job {
  margin-top: 0.5208rem;
  font-size: 1.1458rem;
  color: #FFFFFF;
  line-height: 1.5625rem;
  text-align: center;
}
.staff-item-active {
  .staff-item-photo {
    background-image: linear-gradient(-180deg, #E578FF 0%, #7358FF 100%);
  }
  .staff-item-name {
    color: #7358FF;
  }
  .staff-item-job {
    color: #7358FF;
  }
}
.staff-item-choose {
  position: absolute;
  z-index: 99;
  right: 0;
}
</style>
