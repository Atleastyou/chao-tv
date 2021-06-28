<template lang="pug">
.pay
  shopping-cart-header(:title="title")
  .pay-container(v-show="!isSuccess")
    .pay-title
      .pay-title-label 支付金额：
      .pay-title-num {{infoData.parent_pay_amount}}元
      .pay-title-label   订单号：{{infoData.parent_order_sn}}
    .pay-time
      .pay-time-label 请在
      .pay-time-value {{time.hours}}小时{{time.minutes}}分{{time.seconds}}秒
      .pay-time-label 内完成支付，超时系统将自动取消订单！
    .qrcode-img(ref="qrcode")
      .qrcode-logo
        .icon-zhifu
    .pay-text 支付宝扫码支付
  .pay-container(v-show="isSuccess")
    .icon-success
    .pay-success-text 支付成功
    .pay-success-time
      .pay-success-time--label 将在
      .pay-success-time--value {{second}}秒
      .pay-success-time--label 后自动跳转回首页
    .pay-success-button
      c-button(type="primary" @click="backHome") 返回首页
</template>

<script>
import shoppingCartHeader from '@/components/shoppingCartHeader'
import QRCode from 'qrcodejs2'
import { getPayQrcode, getPayStatus } from 'api'
let timer = null
let finishTimer = null
export default {
  name: 'pay',
  data () {
    return {
      isSuccess: false,
      title: '扫码支付',
      infoData: {},
      time: {
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      second: 5,
      qrcode: null
    }
  },
  watch: {
    second (val) {
      if (val < 0) {
        clearInterval(finishTimer)
        this.backHome()
      }
    }
  },
  components: {
    shoppingCartHeader
  },
  methods: {
    async coutDown () {
      try {
        let time = new Date().getTime()
        let endTime = this.infoData.parent_create_time * 1000 + (2 * 60 * 60 * 1000) // 订单结束时间
        let mss = endTime - time
        if (mss <= 0) {
          clearInterval(timer)
          this.qrcode.clear()
        } else {
          let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
          let seconds = parseInt((mss % (1000 * 60)) / 1000)
          this.time.hours = hours
          this.time.minutes = minutes
          this.time.seconds = seconds
          const { data } = await this.$axios.get(getPayStatus, { params: { order_id: this.infoData.child_order_id } })
          if (data.pay_status === 1) {
            this.isSuccess = true
            clearInterval(timer)
            finishTimer = setInterval(() => {
              this.second--
            }, 1000)
          }
        }
      } catch (err) {
        console.log(err)
        // this.$message.error(msg)
      }
    },
    backHome () {
      this.$router.replace({ name: 'index' })
    },
    async getPayQrcode () {
      try {
        const { data } = await this.$axios.get(getPayQrcode, { params: { oids: this.$route.query.order_ids, amount: this.$route.query.amount } })
        this.infoData = data
        this.tradeOrder()
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    tradeOrder () {
      this.qrcode = new QRCode(this.$refs.qrcode, {
        text: this.infoData.qr_code,
        width: 300,
        height: 300,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    next()
    clearInterval(timer)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getPayQrcode()
      timer = setInterval(() => {
        vm.coutDown()
      }, 1000)
    })
  }
}
</script>

<style lang="scss" scoped>
.pay-container {
  padding: 220px 0;
  text-align: center;
  font-size: 28px;
  color: #333;
  & .icon-success {
    margin: 140px 0 40px;
    font-size: 120px;
    color: #57B74B;
  }
}
.pay-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  & .pay-title-num {
    color: #C2212A;
  }
}
.pay-time {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 60px;
  & .pay-time-value {
    color: #FF6C00;
  }
}
.pay-info {
  margin: 40px 0 60px;
}
.qrcode-img {
  position: relative;
  width: 360px;
  height: 360px;
  padding: 30px;
  margin: 0 auto;
  background: #FFFFFF;
  box-shadow: 0 0 60px 0 rgba(0,0,0,0.10);
  border-radius: 8px;
  & .qrcode-logo {
    position: absolute;
    width: 70px;
    height: 70px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    text-align: center;
    border-radius: 10px;
    background: #fff;
  }
  & .icon-zhifu {
    font-size: 60px;
    color: #00AAEE;
  }
}
.pay-text {
  margin: 20px 0;
  font-size: 28px;
  color: #333333;
}
.pay-success-text {
  font-size: 36px;
  color: #333333;
}
.pay-success-time {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #333333;
  & .pay-success-time--value {
    margin: 0 10px;
    font-size: 36px;
    color: #FF6C00;
  }
}
.pay-success-button {
  width: 300px;
  margin: 120px auto;
}
</style>
