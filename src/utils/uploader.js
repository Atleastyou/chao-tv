/* global QiniuJsSDK, plupload */
import { qiniuToken } from 'api'
import axios from '@/utils/axios'

class uploader {
  static blobToUri (blob) {
    return new Promise((resolve, reject) => {
      var reader = new window.FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        const base64data = reader.result
        resolve(base64data)
      }
    })
  }
  static uriToB64 (uri) {
    return {
      b64: uri.split(';base64,')[1],
      contentType: uri.split(';base64,')[0].split(':')[1]
    }
  }
  static uriToBlob (uri, sliceSize = 512) {
    const { b64, contentType } = uploader.uriToB64(uri)
    const byteCharacters = window.atob(b64)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    const blob = new window.Blob(byteArrays, { type: contentType })
    return blob
  }
  static getOrientation (file) {
    return new Promise((resolve, reject) => {
      var reader = new window.FileReader()
      reader.onload = function (e) {
        var view = new DataView(e.target.result)
        if (view.getUint16(0, false) !== 0xFFD8) return resolve(-2)
        var length = view.byteLength
        var offset = 2
        while (offset < length) {
          var marker = view.getUint16(offset, false)
          offset += 2
          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) return resolve(-1)
            var little = view.getUint16(offset += 6, false) === 0x4949
            offset += view.getUint32(offset + 4, little)
            var tags = view.getUint16(offset, little)
            offset += 2
            for (var i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) return resolve(view.getUint16(offset + (i * 12) + 8, little))
            }
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break
          } else {
            offset += view.getUint16(offset, false)
          }
        }
        return resolve(-1)
      }
      reader.readAsArrayBuffer(file)
    })
  }
  static resetOrientation (uri, srcOrientation) {
    return new Promise((resolve, reject) => {
      var img = new window.Image()

      img.onload = function () {
        let width = img.width
        let height = img.height
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')

        // set proper canvas dimensions before transform & export
        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
          canvas.width = height
          canvas.height = width
        } else {
          canvas.width = width
          canvas.height = height
        }

        // transform context before drawing image
        switch (srcOrientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
          case 3: ctx.transform(-1, 0, 0, -1, width, height); break
          case 4: ctx.transform(1, 0, 0, -1, 0, height); break
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
          case 6: ctx.transform(0, 1, -1, 0, height, 0); break
          case 7: ctx.transform(0, -1, -1, 0, height, width); break
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break
          default: ctx.transform(1, 0, 0, 1, 0, 0)
        }

        // draw image
        ctx.drawImage(img, 0, 0)

        // export base64
        resolve(canvas.toDataURL('image/jpeg'))
      }

      img.src = uri
    })
  }
  constructor (opts) {
    this.token = ''
    this.domain = ''
    this.localURL = ''
    this.files = {}
    this.fileAdditionError = ''
    this.listeners = {}
    this.opts = opts
    if (opts.auto_start) this.fetchToken()
    plupload.addFileFilter('filename_filters', function (filenameFilters, file, cb) {
      const name1 = file.name
      const name2 = file.getNative().name
      if (/\?|&/.test(name1) || /\?|&/.test(name2)) {
        cb(false)
        this.trigger('Error', {
          code: plupload.FILE_EXTENSION_ERROR,
          message: plupload.translate(`抱歉，文件名中不能包含 ？，& 等字符`),
          file: file
        })
      } else {
        cb(true)
      }
    })
    plupload.addFileFilter('type_filters', function (typeFilters, file, cb) {
      // console.log('每次filter: ', this.files, file)
      if (/^image%3a/.test(file.name.toLowerCase())) {
        cb(false)
        this.trigger('Error', {
          code: plupload.FILE_EXTENSION_ERROR,
          message: plupload.translate('抱歉，仅支持从相册中选择图片'),
          file: file
        })
        return false
      }
      const ext = file.name.split('.').splice(-1)[0].toLowerCase()
      // window.alert('一个' + ext + '文件')
      // console.log('----> 在过滤器中，得到的参数对象：', file.getSource(), file, file.getNative())
      if (typeFilters.length > 0) {
        for (let i = 0, n = typeFilters.length; i < n; i++) {
          if (typeFilters[i].extensions.split(',').indexOf(ext) >= 0) {
            cb(true)
            return true
          }
        }
        cb(false)
        this.trigger('Error', {
          code: plupload.FILE_EXTENSION_ERROR,
          message: plupload.translate(`抱歉，您所选择的文件格式 ${ext} 暂不支持`),
          file: file
        })
      } else {
        cb(true)
      }
    })
    plupload.addFileFilter('type_max_file_size', function (typeSize, file, cb) {
      // console.log('每次filter: ', this.files, file)
      if (file.size !== undefined && typeSize) {
        const ext = file.name.split('.').splice(-1)[0]
        let passed = true
        Object.keys(typeSize).forEach(exts => {
          // console.log('filters: ', exts, file.size, typeSize[exts], file.size > typeSize[exts])
          if (exts.includes(ext) && file.size > typeSize[exts]) {
            this.trigger('Error', {
              code: plupload.FILE_SIZE_ERROR,
              message: plupload.translate('抱歉，您上传的文件过大'),
              file: file
            })
            passed = false
          }
        })
        cb(passed)
      } else {
        cb(true)
      }
    })
  }
  fetchToken () {
    return new Promise((resolve, reject) => {
      axios.get(qiniuToken)
        .then(({ data }) => {
          this.token = data.token
          this.domain = data.url
          resolve(this.token)
        })
        .catch(error => {
          console.log('-----> uploader get token error: ', error)
        })
    })
  }
  getToken () {
    return this.token
  }
  asyncStart () {
    const that = this
    return new Promise((resolve, reject) => {
      if (this._up.files.length === 0) resolve('')
      if (this._up.settings.multi_selection) {
        this._up.bind('UploadComplete', function (up, files) {
          resolve(that.files)
        })
      } else {
        this._up.bind('FileUploaded', function (up, file, info) {
          resolve({
            key: JSON.parse(info.response || info).key,
            domain: that.domain
          })
        })
      }
      this._up.bind('Error', function (up, error) {
        reject(error)
      })
      this.fetchToken()
        .then(() => this._up.start())
    })
  }
  start () {
    this.fetchToken()
      .then(() => this._up.start())
  }
  stop () {
    this._up.stop()
  }
  refresh () {
    this._up.refresh()
  }
  addFile (file) {
    this._up.addFile(file)
  }
  _removeFile (file) {
    this._up.removeFile(file)
  }
  removeFile (id) {
    delete this.files[id]
    const file = this._up.files.find(file => file.id === id)
    this._removeFile(file)
  }
  bind (e, func) {
    this.listeners[e] = func
  }
  unbind (e) {
    this._up.unbind(e)
  }
  clearFiles (start = 0, length) {
    this.files = {}
    this._up.splice(start, length)
  }
  clearEvents () {
    this.listeners = {}
  }
  destroy () {
    this._up.destroy()
  }
  disable () {
    this._up.disableBrowse(true)
  }
  enable () {
    this._up.disableBrowse(false)
  }
  _resetImageOri (id) {
    const file = this._up.getFile(id)
    const nativeFile = file.getNative()
    uploader.getOrientation(nativeFile)
      .then(ori => {
        const absOri = Math.abs(ori)
        if (absOri === 3 || absOri === 6 || absOri === 8) {
          uploader.blobToUri(nativeFile)
            .then(uri => {
              uploader.resetOrientation(uri, ori)
                .then(resetedUri => {
                  console.log('---> 处理一个')
                })
            })
        }
      })
  }
  _getThumbnail (file) {
    const ext = file.name.split('.').splice(-1)[0]
    switch (ext) {
      case 'xlsx':
      case 'xls':
        return '//static.chaodp.com/chao_build/icon_excel.svg'
      case 'doc':
      case 'docx':
        return '//static.chaodp.com/chao_build/icon_word.svg'
      case 'pdf':
        return '//static.chaodp.com/chao_build/icon_pdf.svg'
      default:
        const nativeFile = file.getNative()
        return nativeFile ? window.URL.createObjectURL(nativeFile) : ''
    }
  }
  _isImage (ext) {
    if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].indexOf(ext) >= 0) return true
    return false
  }
  _init () {
    const opts = this.opts
    const that = this
    this._up = new QiniuJsSDK().uploader({
      runtimes: 'html5,html4', // 上传模式,依次退化
      // resize: {
      //   preserve_headers: false,
      //   quality: 30
      // },
      multi_selection: !!opts.multi_selection, // 是否多文件上传
      browse_button: opts.browse_button, // 上传选择的点选按钮，**必需**

      // uptoken_url: '/admin/qiniu/token/',
      // Ajax请求upToken的URL，**强烈建议设置**（服务端提供）
      // uptoken: this.token,
      uptoken_func: that.getToken.bind(that),
      get_new_uptoken: true,
      // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
      unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
      save_key: false, // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
      domain: '//static.chaodp.com/',
      // bucket 域名，下载资源时用到，**必需**
      container: opts.container, // 上传区域DOM ID，默认是browser_button的父元素，
      filters: {
        /*
         * iOS 当指定了详细的文件扩展时，不能选取到网盘软件中的附件
         * Android 当指定的确切的文件扩展名时，不能选择 jpg 图片，必须为 '*'
         * 所以此处全部用 *，整的扩展名过滤放在下方的 type_filters 中
         */
        mime_types: [ { title: 'All files', extensions: '*' } ],
        prevent_duplicates: true, // 不允许选取重复文件
        max_file_size: opts.max_file_size || '4mb', // 最大文件体积限制
        type_max_file_size: opts.type_max_file_size || {}, // 自定义filter，根据文件类型限制文件大小
        type_filters: opts.mime_types,
        filename_filters: ''
      },
      type_max_file_count: opts.type_max_file_count || {}, // 自定义属性，每个种类的文件可以传几个
      flash_swf_url: (process.env.NODE_ENV === 'production' ? '//www.chaodp.com' : '') + '/portal/Moxie.swf', // 引入flash,相对路径
      max_retries: 3, // 上传失败最大重试次数
      dragdrop: false, // 开启可拖曳上传
      drop_element: opts.container, // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: 0, // 分块上传时，每片的体积
      auto_start: opts.auto_start, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
        'init': function (up) {
          // console.log('-----> uploader inited', up.uid)
          // that.applyListeners()
          if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1) {
            /*
             * 用以解决 iOS Chrome 上不能弹出文件选择框的 bug
             * plupload 会在 browse_button 后，放一个隐含的 input 标签，在某些浏览器上，
             * 会在 browse_button 上绑定 click 事件，再在这个事件内调用该 input 的 click 方法，
             * 激活文件选择框，经测试目前（2071.36.21）在 iOS 上的最新 Chrome 59.0 下，
             * 虽然 plupload 使用了这种委托 click 事件的方法，但此处并不能顺利激活选框，
             * 通过去掉 browse_button 和 shim 上的 zIndex，让 input 标签可以直接被点击到，
             * 来解决这个 bug
             */
            const browseButton = up.settings.browse_button[0]
            const shimInput = browseButton.nextSibling
            browseButton.style.zIndex = ''
            shimInput.style.zIndex = ''
          }
          if (that.listeners['init']) that.listeners['init'](that)
        },
        'Browse': function (up) {
          // console.log('--- File Browse Opened', up)
          if (that.listeners['Browse']) that.listeners['Browse'](that)
        },
        'FilesAdded': function (up, files) {
          files.forEach(file => that._resetImageOri(file.id))
          that.fileAdditionError = ''
          const extsMax = up.settings.type_max_file_count
          if (extsMax) {
            Object.keys(extsMax).forEach(exts => {
              const extsCount = up.files.reduce((acc, file) => {
                const ext = file.name.split('.').splice(-1)[0]
                return exts.includes(ext) ? acc + 1 : acc
              }, 0)
              if (extsCount > extsMax[exts]) {
                files.forEach(file => {
                  const ext = file.name.split('.').splice(-1)[0]
                  if (exts.includes(ext)) up.removeFile(file)
                })
                if (exts === 'pdf,doc,docx,xls,xlsx') {
                  that.fileAdditionError = `抱歉，您最多只能选择 ${extsMax[exts]} 个文档`
                } else if (exts === 'jpg,jpeg,png,bmp,gif') {
                  that.fileAdditionError = `抱歉，您最多只能选择 ${extsMax[exts]} 张图片`
                }
              }
            })
          }

          if (!up.settings.multi_selection) {
            that.localURL = that._getThumbnail(files[0])
          } else {
            up.files.forEach(file => {
              const ext = file.name.split('.').splice(-1)[0]
              that.files[file.id] = {
                id: file.id,
                ext,
                localURL: that._getThumbnail(file),
                uploaded: that.files[file.id] ? that.files[file.id].uploaded : false,
                uploading: false,
                filename: `${file.id}.${ext}`,
                originalName: file.getNative().name,
                percent: 0,
                isImage: that._isImage(ext)
              }
            })
          }
          if (that.listeners['FilesAdded']) that.listeners['FilesAdded'](that, files)
        },
        'BeforeUpload': function (up, file) {
          // console.log('--- beforeUpload', up, file)
          if (up.settings.multi_selection) that.files[file.id].uploading = true
          // 每个文件上传前,处理相关的事情
          if (that.listeners['BeforeUpload']) that.listeners['BeforeUpload'](that, file)
        },
        'OptionChanged': function (up, name, value, oldValue) {
          // console.log('-----> OptionChanged', up, name, value, oldValue)
        },
        'UploadProgress': function (up, file) {
          // console.log('--- uploadProgress', up, file, that.files)
          if (up.settings.multi_selection) that.files[file.id].percent = file.percent
          // 上传进度
          if (that.listeners['UploadProgress']) that.listeners['UploadProgress'](that, file)
        },
        'FileUploaded': function (up, file, info) {
          // console.log('--- uploaded', up, file, info)
          if (up.settings.multi_selection) {
            Object.assign(that.files[file.id], {
              uploaded: true,
              uploading: false,
              percent: 100,
              domain: that.domain
            })
          }
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          if (that.listeners['FileUploaded']) that.listeners['FileUploaded'](that, file, info)
        },
        'Error': function (up, err, errTip) {
          // console.log('-----> 上传文件遇到错误', up, err, errTip)
          if (that.listeners['Error']) that.listeners['Error'](up, err, errTip)
        },
        'UploadComplete': function (up, files) {
          // console.log('-----> all files uploaded', that.files)
          // 队列文件处理完毕后,处理相关的事情
          if (that.listeners['UploadComplete']) that.listeners['UploadComplete'](that)
        },
        'QueueChanged': function () {
          if (that.listeners['QueueChanged']) that.listeners['QueueChanged'](that)
        },
        'Key': function (up, file) {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效
          // 且这个函数是在开始上传，即 'beforeUpload' 事件前执行
          let key = file.id + /\.[^.]+$/.exec(file.name)[0]
          // do something with key here
          return key
        }
      }
    })
  }
  init () {
    this._init()
  }
}

export default uploader
