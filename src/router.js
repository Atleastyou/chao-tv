import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import _this from './main.js'

Vue.use(Router)

const _import = filePath => () => import('./views/' + filePath + '.vue')

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      component: _import('index/index')
    },
    // 首页
    {
      path: '/index-A',
      name: 'index_A',
      component: _import('index/index_A')
    },
    // 首页
    {
      path: '/index-B',
      name: 'index_B',
      component: _import('index/index_B')
    },
    // 登录
    {
    	path: '/login',
    	name: 'login',
    	component: _import('login/index')
    },
    // 热销商品
    {
      path: '/goods/hot',
      name: 'hotGoods',
      component: _import('goods/hot')
    },
    // 品牌下的商品
    {
      path: '/goods/brand/:id',
      name: 'brandGoods',
      component: _import('goods/brand')
    },
    // 商品详情
    {
      path: '/good/detail/:id',
      name: 'goodDetail',
      component: _import('goodDetail')
    },
    // 搜索页面
    {
      path: '/search',
      name: 'search',
      component: _import('search/index')
    },
    // 搜索结果页
    {
      path: '/searchGoods',
      name: 'searchGoods',
      component: _import('search/searchGoods')
    },
    // 系统设置
    {
    	path: '/system',
    	name: 'system',
    	component: _import('system/index')
    },
    // 精选品牌
    {
    	path: '/brands',
    	name: 'brands',
    	component: _import('brands/index')
    },
    {
      path: '/category',
      name: 'category',
      component: _import('category/index')
    },
    // 购物车
    {
      path: '/shopping',
      name: 'shopping',
      redirect: { name: 'shoppingCart' },
      component: _import('shoppingCart/index'),
      children: [
        {
        	path: 'shoppingCart',
        	name: 'shoppingCart',
        	component: _import('shoppingCart/shoppingCart')
        },
        {
          path: 'confirmOrder',
          name: 'confirmOrder',
          component: _import('shoppingCart/confirmOrder')
        },
        // 线下支付商品与线上支付共存的订单提交时，跳转到此页面
        {
          path: 'confirmOrderList',
          name: 'confirmOrderList',
          component: _import('shoppingCart/confirmOrderList')
        },
        // 全部为线下支付商品时，提交成功后跳转到此页面
        {
          path: 'success',
          name: 'submitOrderSuccess',
          component: _import('shoppingCart/success')
        },
        {
          path: 'address',
          name: 'address',
          component: _import('shoppingCart/newAddress')
        }
      ]
    },
    {
      path: '/pay',
      name: 'pay',
      component: _import('shoppingCart/pay')
    },
    // 待支付订单
    {
      path: '/unpaidOrder',
      name: 'unpaidOrder',
      component: _import('order/unpaidOrder')
    },
    {
      path: '/orderDetail/:id',
      name: 'orderDetail',
      component: _import('order/orderDetail')
    },
    {
      path: '/sketch/edit/:id?',
      name: 'edit',
      component: _import('sketch/edit')
    },
    {
      path: '/sketch',
      name: 'sketch',
      component: _import('sketch/index')
    },
    {
      path: '/sketch/detail/:id',
      name: 'sketchDetail',
      component: _import('sketch/detail')
    },
    {
      path: '/collection',
      name: 'collection',
      component: _import('collection/index')
    },
    {
      path: '/joinShop',
      name: 'joinShop',
      component: _import('joinShop/index')
    },
    {
      path: '/joinShop/detail/:id',
      name: 'joinShopDetail',
      component: _import('joinShop/detail')
    },
    {
      path: '/VR/list',
      name: 'VRList',
      component: _import('VR/list')
    },
    {
      path: '/VR/detail/:id',
      name: 'VRDetail',
      component: _import('VR/detail')
    },
    // 预约设计
    {
      path: '/security',
      name: 'security',
      component: _import('security')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.user.logo) store.dispatch('loadLogoConfig')
  if (!store.getters.logined && to.name !== 'login') store.dispatch('loadUserInfo', { next, to })
  else next()
})

export default router
