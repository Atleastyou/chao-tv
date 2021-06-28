<template lang="pug">
modal(name="selectAddress" width="760" height="640" @before-open="beforeOpen")
  .address-container
    .address-header
      .address-header-title 所在地区
      .icon-close(@click="closePopover")
    .address-tags
      .address-tag-item(:class="{'tag-active' : !address.province}" @click="getProvince") {{address.province ? address.province : '请选择'}}
        .tag-active-line(v-if="!address.province")
      .address-tag-item(:class="{'tag-active' : !address.city}" v-if="address.province" @click="getCity") {{address.city ? address.city : '请选择'}}
        .tag-active-line(v-if="!address.city")
      .address-tag-item(:class="{'tag-active' : !address.district}" v-if="address.province && address.city" @click="getDistrict") {{address.district ? address.district : '请选择'}}
        .tag-active-line(v-if="!address.district")
    .address-content
      .address-select-item(v-for="item in arrAddress" @click="select(item)")
        .select-item-label(:class="{'select-active' : item.id === selectId}") {{item.name}}
        .icon-selected(v-if="item.id === selectId")
</template>

<script>
import * as Api from 'api'
/*
{ getProvince, getCity, getDistrict }
*/
export default {
  name: 'selectAddress',
  data () {
    return {
      address: {
        province: '',
        province_id: '',
        city: '',
        city_id: '',
        district: '',
        district_id: ''
      },
      selectId: '',
      isSelect: false,
      arrAddress: []
    }
  },
  methods: {
    async beforeOpen ({ params }) {
      try {
        this.address = {
          ...this.address,
          ...params
        }
        if (params.district_id) {
          this.getDistrict()
        } else {
          this.getProvince()
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    // 获取省
    async getProvince () {
      try {
        const { data } = await this.$axios.get(Api['getProvince'])
        data.forEach(item => {
          item.key = 'province'
          item.api = 'getCity'
          if (this.address.province_id && this.address.province_id === item.id) this.selectId = item.id
        })
        this.address.city = ''
        this.address.city_id = ''
        this.address.district = ''
        this.address.district_id = ''
        this.arrAddress = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    // 获取市
    async getCity () {
      try {
        const { data } = await this.$axios.get(Api['getCity'], { params: { pid: this.address.province_id } })
        data.forEach(item => {
          item.key = 'city'
          item.api = 'getDistrict'
          if (this.address.city_id && this.address.city_id === item.id) this.selectId = item.id
        })
        this.address.district = ''
        this.address.district_id = ''
        this.arrAddress = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    // 获取区
    async getDistrict () {
      try {
        const { data } = await this.$axios.get(Api['getDistrict'], { params: { pid: this.address.city_id } })
        data.forEach(item => {
          item.key = 'district'
          if (this.address.district_id && this.address.district_id === item.id) this.selectId = item.id
        })
        this.arrAddress = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    closePopover () {
      this.$modal.hide('selectAddress')
    },
    async select (item) {
      try {
        this.selectId = item.id
        this.address[item.key] = item.name
        this.address[`${item.key}_id`] = item.id
        if (item.api) {
          const { data } = await this.$axios.get(Api[item.api], { params: { pid: item.id } })
          if (!data.length) {
            this.$emit('changeAddress', this.address)
            this.closePopover()
          } else {
            this.arrAddress = data
            if (item.key === 'province') {
              data.forEach(item => {
                item.key = 'city'
                item.api = 'getDistrict'
              })
            }
            if (item.key === 'city') {
              data.forEach(item => {
                item.key = 'district'
              })
            }
          }
        } else {
          this.$emit('changeAddress', this.address)
          this.closePopover()
        }
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.address-header {
  display: flex;
  padding: 20px 30px;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  color: #333333;
  & .icon-close {
    color: #999;
    font-size: 28px;
  }
}
.address-container {
  height: 100%;
}
.address-tags {
  display: flex;
  width: 100%;
  padding: 10px 40px;
  align-items: center;
  box-shadow: 0 1px 0 0 #EFEFEF;
  & .tag-active {
    font-size: 24px;
    color: #C2212A;
  }
}
.address-tag-item {
  position: relative;
  margin-right: 70px;
  font-size: 24px;
  color: #333333;
  & .tag-active-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #C2212A;
    bottom: -11px;
    left: 0;
  }
}
.address-content {
  padding: 10px 52px;
  height: 496px;
  overflow-y: auto;
}
.address-select-item {
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #333333;
  line-height: 53px;
  & .select-active {
    color: #C2212A;
  }
  & .icon-selected {
    margin-left: 10px;
    color: #C2212A;
    font-size: 20px;
  }
}
</style>
