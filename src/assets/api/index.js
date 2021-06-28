
const directory = '/api'
// 获取七牛token
const qiniuToken = `${directory}/other/getQiniuToken`
// 登录
const login = `${directory}/author/login`
// 退出登录
const logout = `${directory}/author/logout`
// 获取购物车数据
const getCart = `${directory}/Cart/getCart`
// 购物车勾选状态
const cartSelected = `${directory}/Cart/selected`
// 修改购物车商品数量
const changeCartNum = `${directory}/Cart/changeNum`
// 获取商品列表
const getGoodsList = `${directory}/goods/getGoodsList`
// 删除单个商品
const deleteOneGoods = `${directory}/Cart/deleteOne`
// 批量删除
const deleteSome = `${directory}/Cart/deleteSome`
// 购物车全选
const selectedAll = `${directory}/Cart/selectedAll`
// 结算数据
const confirmOrder = `${directory}/Cart/confirmOrder`
// 获取省
const getProvince = `${directory}/area/getProvince`
// 获取市
const getCity = `${directory}/area/getCity`
// 获取区
const getDistrict = `${directory}/area/getDistrict`
// 支付接口
const payAddOrder = `${directory}/Order/addOrder`
// 获取二维码
const getPayQrcode = `${directory}/Order/pay`
// 获取支付状态 Order/getPayStatus
const getPayStatus = `${directory}/Order/getPayStatus`
// 获取待支付订单
const getWaitPayOrder = `${directory}/Order/waitPayOrder`
// 删除待支付订单
const delOrder = `${directory}/Order/delOrder`
// 获取待支付订单详情
const getOrderDetail = `${directory}/Order/getOrderDetail`
// 获取分类列表
const getCategoryList = `${directory}/Goods/getCategoryList`
// 获取风格列表
const getStyleList = `${directory}/Goods/getStyleList`
// 获取空间列表
const getSpaceList = `${directory}/Goods/getSpaceList`
// 搜索商品
const searchGoods = `${directory}/Goods/searchGoods`
// 绑定电视
const bindtv = `${directory}/index/bindtv`
// 商品列表
const goodList = `${directory}/goods/getGoodsList`
// 热销商品列表
const hotGoods = `${directory}/goods/getHotGoods`
// 商品详情
const goodInfo = `${directory}/goods/getGoodInfo`
// 立即购买
const buyNow = `${directory}/Cart/buyNow`
// 添加购物车
const cartAdd = `${directory}/Cart/add`
// 推荐品牌列表
const hotBrand = `${directory}/brand/getHotBrand`
// 某个品牌的商品列表
const brandGoods = `${directory}/brand/getBrandAndGoods`
// SKU列表
const searchSKU = `${directory}/Goods/searchSKU`
// SKU详情
const skuInfo = `${directory}/goods/getSKUInfo`
// 获取素材
const getSceneMaterials = `${directory}/Scene/getSceneMaterials`
// 删除案例
const sceneMaterials = `${directory}/Scene/deleteCase`
// 获取案例详情
const getSceneCaseDetail = `${directory}/Scene/getSceneCaseDetail`
// 案例列表
const sceneCaseList = `${directory}/Scene/getSceneCaseList`
// 添加或编辑案例
const updateCase = `${directory}/Scene/updateCase`
// 搭配大师添加购物车
const sketchAdd = `${directory}/Cart/addList`
// 搭配大师立即购买
const sketchBuy = `${directory}/Cart/buyList`
// getsketchBuyList
const getsketchBuyList = `${directory}/Cart/getBuyList`
// 微信扫码上传二维码
const uploadQrcode = `${directory}/Design/getUploadQrcode`
// 获取上传图片
const uploadedImages = `${directory}/Design/getUploadedImages`
// 获取导出图片二维码
const exportQrcode = `${directory}/Design/getExportQrcode`
// 删除上传图片
const deleteUploadImg = `${directory}/Design/deleteUploadImg`
// 获取品牌列表
const getBrandList = `${directory}/Brand/getBrandList`
// 获取分类二级三级分类
const getCategoryAndSon = `${directory}/Goods/getCategoryAndSon`
// 获取屏保
const getScreenSaver = `${directory}/Ad/getScreenSaver`
// 获取商品规格属性
const getGoodSpec = `${directory}/Goods/getGoodSpec`
// 修改购物车商品规格
const editCartGoodSpec = `${directory}/cart/editCartGood`
// 获取辅助效果选项
const getClassify = `${directory}/Scene/classify`
// 获取辅助效果素材
const classifyMaterial = `${directory}/Scene/classifyMaterial`
// 收藏商品
const setCollection = `${directory}/Goods/collection`
// 取消收藏
const unCollection = `${directory}/Goods/cancelCollection`
// 获取更新包
const getAppVersion = `${directory}/Other/getAppVersion`
// 获取小程序二维码
const getQrCode = `${directory}/Ad/getQrCode`
// 随机一个指定商品的同品类商品
const randomGood = `${directory}/Goods/getSimilarGood`
// 首页配置信息
const getTvIndex = `${directory}/Page/tvIndex`
// 收藏案例
const collectionCase = `${directory}/Scene/collection`
// 取消收藏案例
const unCollectionCase = `${directory}/Scene/cancelCollection`
// 收藏素材
const collectionMaterial = `${directory}/Material/collection`
// 取消收藏素材
const unCollectionMaterial = `${directory}/Material/cancelCollection`
// 我的收藏-商品
const collectionSKU = `${directory}/Goods/searchCollectionSKU`
// 保存上传的素材
const addMaterial = `${directory}/Material/add`
// 获取用户信息
const getUserInfo = `${directory}/Author/getUserInfo`
// 获取店铺信息
const getShopInfo = `${directory}/Shop/getShop`
// 组合购标签
const joinShopTagList = `${directory}/GoodsCombination/tagList`
// 组合购列表
const joinShopList = `${directory}/GoodsCombination/getList`
// 组合购详情
const joinShopDetail = `${directory}/GoodsCombination/getInfo`
// 批量立即购买
const buyList = `${directory}/GoodsCombination/buyList`
// 组合购确认订单详情
const joinShopConfirmOrderDetail = `${directory}/GoodsCombination/getBuyList`
// 获取分类下的品牌
const cateBrandList = `${directory}/Brand/getBrandList`
// 获取店铺主题
const getShopThemeInfo = `${directory}/Shop/getShopThemeInfo`
// 获取店员列表
const getShopClerk = `${directory}/shop/getShopClerk`
// VR列表
const VRList = `${directory}/Vr/getVrList`
// VR场景列表
const VRSceneList = `${directory}/Vr/getVrSceneList`
// VR基础信息
const VRInfo = `${directory}/Vr/getVrInfo`
// VR包含商品
const VRGoods = `${directory}/Vr/getGoods`
// logo配置
const logoConfig = `${directory}/Other/getConfig`

export {
  qiniuToken,
  login,
  getCart,
  cartSelected,
  changeCartNum,
  deleteOneGoods,
  deleteSome,
  selectedAll,
  confirmOrder,
  getProvince,
  getCity,
  getDistrict,
  payAddOrder,
  getPayQrcode,
  getPayStatus,
  getWaitPayOrder,
  delOrder,
  getOrderDetail,
  getCategoryList,
  getStyleList,
  getSpaceList,
  getGoodsList,
  searchGoods,
  logout,
  bindtv,
  goodList,
  hotGoods,
  goodInfo,
  buyNow,
  cartAdd,
  hotBrand,
  brandGoods,
  searchSKU,
  skuInfo,
  getSceneMaterials,
  sceneMaterials,
  getSceneCaseDetail,
  sceneCaseList,
  updateCase,
  sketchAdd,
  sketchBuy,
  getsketchBuyList,
  uploadQrcode,
  uploadedImages,
  exportQrcode,
  deleteUploadImg,
  getBrandList,
  getCategoryAndSon,
  getScreenSaver,
  getGoodSpec,
  editCartGoodSpec,
  getClassify,
  classifyMaterial,
  setCollection,
  unCollection,
  getAppVersion,
  getQrCode,
  randomGood,
  getTvIndex,
  collectionCase,
  unCollectionCase,
  collectionMaterial,
  unCollectionMaterial,
  collectionSKU,
  addMaterial,
  getUserInfo,
  getShopInfo,
  joinShopTagList,
  joinShopList,
  joinShopDetail,
  buyList,
  joinShopConfirmOrderDetail,
  cateBrandList,
  getShopThemeInfo,
  getShopClerk,
  VRList,
  VRSceneList,
  VRInfo,
  VRGoods,
  logoConfig
}
