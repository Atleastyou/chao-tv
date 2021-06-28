const path = require('path')
const QiniuWebpackPlugin = require('better-qiniu-webpack-plugin')
// const pxtorem = require('postcss-pxtorem')
// const postcss = pxtorem({
//   rootValue: 19.2,
//   unitPrecision: 5,
//   propList: ['*'],
//   selectorBlackList: [],
//   replace: true,
//   mediaQuery: false,
//   minPixelValue: 0,
//   exclude: function (file) {
//     const exclude = ['views\\index\\index_A']
//     return exclude.find(src => file.indexOf(src) !== -1)
//   }
// })

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? 'https://static.chaodp.com/supplierAdmin/' : '/',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    disableHostCheck: true,
    proxy: {
      '/api/*': {
        target: 'http://t.tv.shop.chaodp.com',
        changeOrigin: true,
        secure: false
      }
    }
  },

  configureWebpack: config => {
    let _config = {}
    _config.resolve = {
      alias: {
        utils: resolve('src/utils'),
        api: resolve('src/assets/api/index.js')
      }
    }
    if (process.env.NODE_ENV === 'production') {
      _config.plugins = [
        new QiniuWebpackPlugin({
          accessKey: 'rT22ybC7zPSsgcUX8taPAZlABhKjaJrashGfQU5V',
          secretKey: 'zzs-dAE3K38DgGnXe68ZVeJRcGGMbM_bA_qGmVjK',
          bucket: 'chao',
          bucketDomain: 'https://static.chaodp.com',
          uploadPath: '/supplierAdmin/'
        })
      ]
    }
    return _config
  },
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [postcss],
  //     }
  //   }
  // },

  outputDir: 'dist',
  assetsDir: 'static',
  runtimeCompiler: false,
  productionSourceMap: false,
  filenameHashing: true,
  integrity: false
}
