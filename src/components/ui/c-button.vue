<template lang="pug">
button.c-button(
  :class="[type ? `c-button--${type}` : 'c-button--default', size ? `c-button--${size}` : '', plain ? 'is-plain' : '', disabled ? 'is-disabled' : '']"
  :disabled="disabled || loading"
  @click="handleClick"
)
  touch-ripple(:speed="2", :opacity=".5")
    i.icon-loading(v-if="loading")
    span
      slot
</template>

<script>
export default {
  name: 'c-button',
  props: {
    loading: Boolean,
    type: {
      validator: function (value) {
        return ['primary', 'info', 'danger', 'darkred'].indexOf(value) !== -1 || !value
      }
    },
    size: {
      validator: function (value) {
        return ['medium', 'small', 'mini'].indexOf(value) !== -1 || !value
      }
    },
    plain: Boolean,
    disabled: Boolean
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/color.scss';
@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.c-button {
  width: 100%;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  outline: none;
  margin: 0;
  font-weight: 500;
  font-size: 28px;
  border-radius: 4px;
  position: relative;
  border: none;
  padding: 0;
  & span {
    line-height: 40px;
  }
  & .icon-loading {
    margin-right: 10px;
    animation: rotating 2s linear infinite;
  }
  & .v-touch-ripple {
    padding: 20px 30px;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
  &.is-disabled {
    background: #999;
    border-color: #999;
  }
}
// .c-button:disabled {
//   cursor: not-allowed;
//   border: none;
//   &:before {
//     content: '';
//     height: 100%;
//     width: 100%;
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(255,255,255,.3);
//     border-radius: 4px;
//   }
// }
.c-button--default {
  color: #333;
  background: $--color-default;
  &.is-plain {
    border: 2px solid #999999;
    border-radius: 4px;
    background: #fff;
    color: #999;
  }
}
.c-button--primary {
  color: #333;
  background-color: $--color-primary;
  border-color: $--color-primary;
  &.is-plain {
    border: 2px solid $--color-primary;
    border-radius: 4px;
    background: #fff;
    color: $--color-primary;
  }
}
.c-button--darkred {
  color: #fff;
  background-color: $--color-red;
  border-color: $--color-red;
  &.is-plain {
    border: 2px solid $--color-red;
    border-radius: 4px;
    background: #fff;
    color: $--color-red;
  }
}
.c-button--info {
  color: #fff;
  background-color: $--color-info;
  border-color: $--color-info;
  &.is-plain {}
}
.c-button--danger {
  color: #fff;
  background-color: $--color-danger;
  border-color: $--color-danger;
  &.is-plain {}
}

.c-button--medium {
  & .v-touch-ripple {
    padding: 14px 36px;
    font-size: 24px;
  }
}
// .c-button--small {
//
// }
// .c-button--mini {
//
// }

</style>
