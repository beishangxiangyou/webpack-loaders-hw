const fs = require('fs')
const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils').validate

function loader (source) {
  this.cacheable && this.cacheable() // 使用缓存
  const options = loaderUtils.getOptions(this)
  const cb = this.async()
  const schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  validateOptions(schema, options, 'banner-loader') // 校验选项
  if (options.filename) {
    this.addDependency(options.filename) // 自动添加文件依赖
    fs.readFile(options.filename, 'utf8', function (err, data) {
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`)
  }
}

module.exports = loader
