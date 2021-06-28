const menu = {
  light: {
    name: 'light',
    title: '灯饰',
    bgColor: '#5080C6',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '128px' },
    className: '',
    routeQuery: { good_type: '', first_id: '1', category_id: '1' },
    bgImg: require('../static/images/dengshi.png')
  },
  furniture: {
    name: 'furniture',
    title: '家具',
    bgColor: '#32A25C',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '128px' },
    className: '',
    routeQuery: { good_type: '', first_id: '2', category_id: '2' },
    bgImg: require('../static/images/jiaju.png')
  },
  sketch: {
    name: 'sketch',
    title: '搭配工具',
    bgColor: '#C3533C',
    routeName: 'sketch',
    contentStyle: { top: '200px', left: '80px' },
    className: 'card-group-col_widen',
    routeQuery: '',
    bgImg: require('../static/images/dapeids.png'),
    info: '轻松将设计带回家',
    imgStyle: { marginTop: '-20px' }
  },
  ornaments: {
    name: 'ornaments',
    title: '饰品',
    bgColor: '#D87808',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '128px' },
    className: '',
    routeQuery: { good_type: '', first_id: '23', category_id: '23' },
    bgImg: require('../static/images/shipin.png')
  },
  daily_necessities: {
    name: 'daily_necessities',
    title: '日用品',
    bgColor: '#6A4DC9',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '108px' },
    className: '',
    routeQuery: { good_type: '', first_id: '113', category_id: '113' },
    bgImg: require('../static/images/riyongpinlei.png')
  },
  hot_goods: {
    name: 'hot_goods',
    title: '特价爆款',
    bgColor: '#D87808',
    routeName: 'hotGoods',
    contentStyle: { top: '200px', left: '80px' },
    className: 'card-group-col_widen',
    routeQuery: { good_type: 'explosive' },
    bgImg: require('../static/images/rexiaosp.png'),
    info: '人人都买  不买才怪'
  },
  adornment_paiting: {
    name: 'adornment_paiting',
    title: '装饰画',
    bgColor: '#5080C6',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '108px' },
    className: '',
    routeQuery: { good_type: '', first_id: '18', category_id: '18' },
    bgImg: require('../static/images/huayi.png')
  },
  cloth_art_home_textile: {
    name: 'cloth_art_home_textile',
    title: '布艺家纺',
    bgColor: '#6A4DC9',
    routeName: 'hotGoods',
    contentStyle: { top: '220px', left: '97px' },
    className: '',
    routeQuery: { good_type: '', first_id: '19', category_id: '19' },
    bgImg: require('../static/images/fangzhilei.png')
  },
  new: {
    name: 'new',
    title: '本周上新',
    bgColor: '#5080C6',
    routeName: 'hotGoods',
    contentStyle: { top: '200px', left: '70px' },
    className: 'card-group-col_widen',
    routeQuery: { brand_id: '', good_type: 'new' },
    bgImg: require('../static/images/benzhousx.png'),
    info: '让你走在潮流的浪口'
  },
  shop: {
    name: 'shop',
    title: '本地馆',
    bgColor: '#5080C6',
    routeName: 'hotGoods',
    contentStyle: { top: '200px', left: '80px' },
    className: 'card-group-col_widen',
    routeQuery: { brand_id: '', goods_from: 'shop' },
    bgImg: require('../static/images/bendiguan.png'),
    info: '商家主推自营商品'
  }
}

export default menu
