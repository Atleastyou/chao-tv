<template lang="pug">
label.checkbox(
  :class="{'checkbox--checked' : checked}"
  @touchstart.stop="() => {}"
  @touchend.stop="() => {}"
)
  .checkbox-inner(:class="[size ? `c-radio--${size}` : 'c-radio--default', size ? `c-radio--${size}` : '', disabled ? 'is-disabled' : '']")
  input.checkbox-original(type="checkbox", :checked="checked", :disabled="disabled" @change="$emit('change', $event.target.checked)")
</template>

<script>
export default {
  name: 'c-radio',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    disabled: {
      default: false,
      type: Boolean
    },
    size: {
      validator: function (value) {
        return ['mini'].indexOf(value) !== -1 || !value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
}
.c-radio--default {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-block;
  background-color: #fff;
  position: relative;
  z-index: 1;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  &.is-disabled {
    background: #F5F5F7;
  }
}
.c-radio--mini {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-block;
  background-color: #fff;
  position: relative;
  z-index: 1;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  &.is-disabled {
    background: #F5F5F7;
  }
}
.checkbox-original {
  opacity: 0;
  outline: none;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}
.c-radio--default:after {
  box-sizing: content-box;
  content: "";
  border: 3px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 21px;
  left: 19px;
  position: absolute;
  top: 10px;
  transform: rotate(45deg) scaleY(0) translate(50%);
  width: 10px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
}
.c-radio--mini:after {
  box-sizing: content-box;
  content: "";
  border: 3px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 14px;
  left: 9px;
  position: absolute;
  top: 4px;
  transform: rotate(45deg) scaleY(0) translate(50%);
  width: 7px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
}
.checkbox--checked {
  & .checkbox-inner {
    border-color: #C2212A;
    background-color: #C2212A;
    color: #FFF;
  }
  color: #C2212A;
}
.checkbox--checked .checkbox-inner:after {
  transform: rotate(45deg) scaleY(1);
}
.goods-content-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  & .goods-price {
    font-size: 32px;
    color: #C2212A;
  }
}
</style>
