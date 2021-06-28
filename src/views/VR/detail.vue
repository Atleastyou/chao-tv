<template lang="pug">
  .index
    goods-list
    .header
      .header-exit.icon-exit(@click="$router.back()")
      .header-content
        p.header-title {{baseInfo.title}}
        p.header-price(@click="openGoodsList") 清单 ¥{{totalPrice}}
    .body
      .navbar
        touch-ripple.nav-item(
          v-for="item in navs"
          :speed="3"
          :opacity=".6"
          :class="{'active': currentNav === item.name}"
          @click.native="toggleNav(item.name)"
        )
          .nav-icon(:class="item.icon")
          .nav-name {{item.title}}
      .aside-container
        .aside-box(v-show="sideShow")
          .aside-inner
            vr-scenes(v-show="currentNav === 'scenes'" :scenes="scenes" @selectScene="updateCamera")
            vr-goods(v-show="currentNav === 'goods'" ref="vrGoods" :scenes="scenes")
        //- 隐藏/显示开关
        .aside-switch(@click="toggleSide")
          i.icon-left(:style="{'transform': sideShow ? '' : 'rotate(180deg)'}")
      .camera
        .camera-wrapper(ref="camera")
</template>
<script>
import { Viewer } from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import MarkersPlugin from 'photo-sphere-viewer/dist/plugins/markers.js'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import goodsList from './modal/goodsList'
import vrScenes from './components/scenes'
import vrGoods from './components/goodsList'
import { VRSceneList, VRInfo } from 'api'
export default {
  name: 'VRDetail',
  data () {
    return {
      navs: [
        { name: 'scenes', title: '场景选择', icon: 'icon-scene' },
        { name: 'goods', title: '场景商品', icon: 'icon-goods' }
      ],
      sideShow: true,
      currentNav: 'scenes',
      baseInfo: {},
      scenes: [],
      currentScene: {
        config: {
          markers: []
        }
      }
    }
  },
  computed: {
    totalPrice () {
      let goodsList = []
      if (this.currentScene.config.markers && this.currentScene.config.markers.length) goodsList = this.currentScene.config.markers.filter(item => item.data.type === 'goods').map(item => item.data.goods)
      return goodsList.reduce((total, next) => parseFloat(total) + parseFloat(next.shop_price), 0)
    }
  },
  components: {
    goodsList,
    vrScenes,
    vrGoods
  },
  methods: {
    toggleNav (name) {
      this.currentNav = name
      this.sideShow = true
    },
    toggleSide () {
      this.sideShow = !this.sideShow
      setTimeout(() => {
        window.PSV.autoSize()
      }, 0)
    },
    openGoodsList () {
      this.$modal.show('vrGoodsList', this.currentScene)
    },
    bindClickMarker () {
      PSV.plugins.markers.on('select-marker', (event, marker) => {
        if (marker.config.data.type === 'transition') {
          const scene = this.scenes.find(item => item.id === marker.data.scene.id)
          this.updateCamera(scene)
        } else if (marker.config.data.type === 'goods') {
          this.currentNav = 'goods'
          this.$refs.vrGoods.openDetail(marker.config.data.goods, marker.config.id)
          this.sideShow = true
          setTimeout(() => {
            window.PSV.autoSize()
          }, 0)
          // 如果当前点击标签已选中
          if (marker.config.selected) return


          // 移除选中标记的选中状态，以及绑定事件
          const selectedMarkId = Object.keys(PSV.plugins.markers.markers).find(key => PSV.plugins.markers.markers[key]['config']['selected'])
          if (selectedMarkId) this.unSelectMarker(selectedMarkId)

          // 选中当前点击标签，绑定事件
          this.selectMarker(marker.id)
        }
      })
    },
    unSelectMarker (id) {
      const selectedMark = PSV.plugins.markers.markers[id]
      let update = {}
      switch (selectedMark.data.type) {
        case 'goods' :
          update = { image: selectedMark.data.icon.normal }
          break
        case 'transition' :
          update = { html: `<img src="${selectedMark.data.icon.normal}" style="width: 50px; height: 50px;" /><p style="margin-top:10px;padding: 6px 10px;background: rgba(0,0,0,.4);border-radius: 4px;max-width: 80px;font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${selectedMark.data.title}</p>` }
          break
      }
      let image = new Image()
      image.src = selectedMark.data.icon.normal
      image.onload = () => {
        PSV.plugins.markers.updateMarker({ id, selected: false, ...update })
      }
    },
    selectMarker (id) {
      const marker = PSV.plugins.markers.markers[id]
      let update = {}
      switch (marker.data.type) {
        case 'goods' :
          update = { image: marker.data.icon.active }
          break
        case 'transition' :
          update = { html: `<img src="${marker.data.icon.active}" style="width: 50px; height: 50px;"/><p style="margin-top:10px;padding: 6px 10px;background: rgba(0,0,0,.4);border-radius: 4px;max-width: 80px;font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${marker.data.title}</p>` }
          break
      }
      let image = new Image()
      image.src = marker.data.icon.active
      image.onload = () => {
        PSV.plugins.markers.updateMarker({ id, selected: true, ...update })
      }
    },
    initCamera (item) {
      this.currentScene = item
      window.PSV = new Viewer({
        navbar: ['fullscreen'],
        container: this.$refs.camera,
        panorama: item.img,
        plugins: [
          [ MarkersPlugin, {
            markers: item.config.markers || []
          }]
        ],
      })
      PSV.on('click', () => {
        if (this.sideShow) {
          this.sideShow = false
          setTimeout(() => {
            window.PSV.autoSize()
          }, 0)
        }
      })
      PSV.on('position-updated', () => {
        if (this.sideShow) {
          this.sideShow = false
          setTimeout(() => {
            window.PSV.autoSize()
          }, 0)
        }
      })
      this.bindClickMarker()
    },
    updateCamera (item) {
      this.currentScene = item
      PSV.plugins.markers.clearMarkers()
      PSV.setPanorama(item.img, {
        longitude: 0,
        latitude: 0,
        zoom: 50
      }).then(() => {
        PSV.plugins.markers.setMarkers(item.config.markers || [])
      })
    },
    async getVRSceneList () {
      try {
        const { data } = await this.$axios.get(VRSceneList, { params: { vr_id: this.$route.params.id } })
        this.scenes = data
        this.initCamera(data[0])
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    },
    async getBaseInfo () {
      try {
        const { data } = await this.$axios.get(VRInfo, { params: { id: this.$route.params.id } })
        this.baseInfo = data
      } catch ({ msg }) {
        this.$toast.error(msg)
      }
    }
  },
  created () {
    this.getBaseInfo()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getVRSceneList()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (PSV) {
      PSV.destroy()
      window.PSV = null
    }
    next()
  }
}
</script>
<style>
.marker-transition-title {
  margin-top: 10px;
  padding: 6px 10px;
  background: rgba(0,0,0,.4);
  border-radius: 4px;
  max-width: 80px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style lang="scss" scoped>
.side-enter-active, .side-leave-active{
  transition-duration: .3s;
  transition-property: width, padding;
  overflow: hidden;
}
.side-enter, .side-leave-active {
  width: 0!important;
}
.index {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  flex: 0 0 100px;
  display: flex;
}
.header-exit {
  background: #FFBE28;
  flex: 0 0 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  color: #333;
}
.header-content {
  flex: 1;
  background: #252429;
  display: flex;
  align-items: center;
  position: relative;
}
.header-title {
  width: 100%;
  text-align: center;
  font-size: 40px;
  color: #FFFFFF;
}
.header-price {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  background: #000000;
  border-radius: 4px;
  font-size: 24px;
  padding: 15px 18px;
}
.body {
  flex: 1;
  display: flex;
  overflow-y: hidden;
}
.navbar {
  flex: 0 0 100px;
  height: 100%;
  background: #252429;
  padding: 10px 0;
}
.nav-item {
  padding: 30px;
  color: #7b7b7b;
  &.active {
    color: #fff;
  }
  .nav-icon {
    font-size: 34px;
  }
  .nav-name {
    margin-top: 5px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
  }
}
.aside-container {
  height: 100%;
  position: relative;
}
.aside-box {
  width: 568px;
  height: 100%;
}
.aside-inner {
  height: 100%;
  transition: all .3s;
  transform-origin: left center;
  transform: translate3d(0,0,0);
}
.aside-switch {
  width: 30px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  position: absolute;
  top: 50%;
  right: -30px;
  margin-top: -60px;
  background: #252429;
  font-size: 20px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  i {
    display: inline-block;
    transition: transform .5s;
  }
}
.camera {
  flex: 1;
  height: 100%;
  padding: 30px 40px;
  background: #333333;
  border-left: 1px solid #151516;
}
.camera-wrapper {
  width: 100%;
  height: 100%;
}
</style>



