<template lang="pug">
.security
  .security-banner(:style="{'background-image': `url(${customizable_page_logo})`}")
  .security-step
    img(src="https://static.chaodp.com/saas-tv/02service.png")
  .security-about
    img(src="https://static.chaodp.com/saas-tv/03about.png")
  .security-honor
    img(src="https://static.chaodp.com/saas-tv/04honor.png")
  .security-product
    img(src="https://static.chaodp.com/saas-tv/05product.png")
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'security',
  computed: {
    ...mapState({
      customizable_page_logo: state => state.user.logo.customizable_page_logo
    })
  }
}
</script>

<style scoped lang="scss">
.security {
  height: 100%;
  overflow: auto;
}
.security-banner {
  width: 100%;
  height: 900px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.security-step {
  padding: 102px 0;
  text-align: center;
}
.security-product {
  padding: 100px 0;
  text-align: center;
}
</style>
