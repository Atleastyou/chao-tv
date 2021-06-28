<template lang="pug">
.address
  shopping-cart-header(:title="title" isShowBtn, :btnValue="btnValue", :buttonType="'primary'" @click="save")
  .address-form
    .address-form-item
      .form-item-label 收货人：
      .form-item-input
        input(placeholder="请输入收货人" v-model="form.consignee")
    .address-form-item
      .form-item-label 手机号码：
      .form-item-input
        input(placeholder="请输入手机号码" v-model="form.mobile")
    .address-form-item.address-form-select(@click="showAddressModal")
      .form-item-bd
        .form-item-label 所在地区：
        .form-item-input
          input(placeholder="请选择地区" readonly="readonly" v-model="form.area")
      .form-item-ft.icon-more
    .address-form-item.address-form-textarea
      .form-item-label 详细地址：
      .form-item-input
        textarea(placeholder="如道路、门牌号、小区、楼栋号、单元室等" v-model="form.address")
  select-address(@changeAddress="changeAddress")
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import selectAddress from '@/components/modal/selectAddress'
export default {
  name: 'newAddress',
  data () {
    return {
      title: '新建地址',
      btnValue: '保存',
      form: {
        consignee: '',
        mobile: '',
        area: '',
        province_id: '',
        city_id: '',
        district_id: '',
        address: ''
      }
    }
  },
  components: {
    shoppingCartHeader,
    selectAddress
  },
  methods: {
    changeAddress (data) {
      this.form = {
        ...this.form,
        ...data
      }
      this.form.area = `${data.province} ${data.city} ${data.district}`
    },
    save () {
      if (!this.form.consignee) {
        this.$toast.error('请填写收货人！')
        return
      }
      if (!this.form.mobile) {
        this.$toast.error('请填写收货人电话号码！')
        return
      }
      if (!/^1[0-9]\d{9}$/.test(this.form.mobile)) {
        this.$toast.error('请输入正确的电话号码！')
        return
      }
      if (!this.form.area) {
        this.$toast.error('请填写所在地区！')
        return
      }
      if (!this.form.address) {
        this.$toast.error('请填写详细地址！')
        return
      }
      this.$router.replace({ name: 'confirmOrder', query: { ...this.form, ...this.$route.query } })
    },
    showAddressModal () {
      this.$modal.show('selectAddress', { ...this.form })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.form = {
        ...vm.form,
        ...to.query
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.address {
  height: 100%;
  padding-top: 140px;
}
.address-form {
  width: 1140px;
  padding: 40px 0;
  margin: 0 auto;
}
.address-form-item {
  display: flex;
  width: 100%;
  height: 125px;
  padding: 40px;
  margin: 20px 0;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  font-size: 32px;
  color: #333333;
  & .form-item-label {
    min-width: 160px;
    margin-right: 20px;
  }
  & .form-item-input {
    width: 100%;
    & input {
      width: 100%;
    }
  }
}
.form-item-bd {
  display: flex;
  align-items: center;
}
.address-form .address-form-textarea {
  height: 225px;
  align-items: flex-start;
  & .form-item-input {
    height: 100%;
    & textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: none;
      outline: none;
    }
  }
}
.address-form .address-form-select {
  justify-content: space-between;
}
</style>
