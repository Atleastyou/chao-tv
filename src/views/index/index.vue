<template lang="pug">
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'index',
  computed: {
    ...mapState({
      showNewTheme: state => state.user.showNewTheme
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.showNewTheme) next({name: 'index_B'})
      else next({name: 'index_A'})
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
