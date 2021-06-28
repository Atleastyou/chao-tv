<template lang="pug">
.c-number
  span.c-number__decrease(
    @click.stop.prevent="decrease"
    @touchstart.stop="() => {}"
    @touchend.stop="() => {}"
    :class="[type ? `c-button--${type}` : 'c-button--default', minDisabled || disabled ? 'is-disabled' : '']"
  )
    i.icon-less
  span.c-number__increase(
    @click.stop.prevent="increase"
    @touchstart.stop="() => {}"
    @touchend.stop="() => {}"
    :class="[type ? `c-button--${type}` : 'c-button--default', maxDisabled || disabled ? 'is-disabled' : '']"
  )
    i.icon-plus
  .c-input
    input.c-input__inner(
      :value="value"
      :class="[type ? `c-input--${type}` : 'c-button--default', disabled ? 'is-disabled' : '']"
      :disabled="disabled"
      @blur="handleBlur"
    )
</template>

<script>
export default {
  name: 'c-number',
  props: {
    value: [String, Number],
    type: {
      validator: function (value) {
        return ['primary'].indexOf(value) !== -1 || !value
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: [String, Number],
      default: Infinity
    },
    min: {
      type: [String, Number],
      default: -Infinity
    }
  },
  data () {
    return {

    }
  },
  computed: {
  	minDisabled () {
  		return Number(this.value) <= Number(this.min)
  	},
    maxDisabled () {
      return Number(this.value) >= Number(this.max)
    }
  },
  methods: {
    decrease () {
      if (Number(this.value) <= Number(this.min) || this.disabled) {
        this.$emit('overlimit', this.value)
      } else {
        let num = this.value
        num--
        this.setValue(num)
      }
    },
    increase () {
      if (Number(this.value) >= Number(this.max) || this.disabled) {
        this.$emit('overlimit', this.value)
      } else {
        let num = this.value
        num++
        this.setValue(num)
      }
    },
    setValue (newVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
    },
    handleBlur (event) {
      if (isNaN(Number(event.target.value))) {
        this.$toast.error('请输入数字')
      } else {
        if (Number(event.target.value) != this.value) {
          if (Number(event.target.value) <= this.max && Number(event.target.value) >= this.min) {
            this.setValue(event.target.value)
          } else if (Number(event.target.value) > this.max) {
            event.target.value = this.max
            this.setValue(this.max)
          } else {
            event.target.value = this.min
            this.setValue(this.min)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-number {
  position: relative;
  display: inline-block;
  width: 153px;
  line-height: 40px;
}
.c-number__decrease,
.c-number__increase {
  position: absolute;
  z-index: 1;
  top: 1px;
  width: 40px;
  height: 38px;
  text-align: center;
  background: #f5f7fa;
  color: #606266;
  cursor: pointer;
  font-size: 13px;
}
.c-number__decrease {
  left: 1px;
  border-radius: 4px 0 0 4px;
  border-right: 1px solid #dcdfe6;
}

.c-number__decrease.is-disabled,
.c-number__increase.is-disabled{
  color: #c0c4cc;
  cursor: not-allowed;
}
.c-number__increase {
  right: 1px;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #dcdfe6;
}
.c-input {
  display: block;
  position: relative;
  font-size: 14px;
  width: 100%;
}
.c-number .c-input__inner {
  -webkit-appearance: none;
  padding-left: 50px;
  padding-right: 50px;
  text-align: center;
}
.c-input__inner {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
  &.is-disabled {
    border-color: #ddd;
    color: #999;
  }
}
.c-button--primary {
  background-color: #252429;
  border-color: #7B7B7B;
  color: #fff;
}
.c-input--primary {
  background-color: #252429;
  border-color: #7B7B7B;
  color: #fff;
}
</style>
