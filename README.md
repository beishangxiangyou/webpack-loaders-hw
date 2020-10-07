# webpack-loaders-hw
手写webpack中常用的loaders

### 说明
* 项目中的loader仅仅用于日常学习，尚不完善
* webpack确实很难掌握，只要日常够用就行

#### babel-loader
```javascript
const babel = require('@babel/core')
const loaderUtils = require('loader-utils')

function loader (source) { // this loaderContext
  const options = loaderUtils.getOptions(this)
  const cb = this.async()
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop() // 文件名
  }, function (err, result) {
    cb(err, result.code, result.map)
  })
}

module.exports = loader
```

#### banner-loader
```javascript
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

```

#### file-loader
```javascript
const loaderUtils = require('loader-utils')

function loader (source) {
  const filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source})
  this.emitFile(filename, source) // 发射文件
  return `module.exports = "${filename}"`
}

loader.raw = true // 二进制文件

module.exports = loader

```

#### url-loader
```javascript
const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader (source) {
  const {limit} = loaderUtils.getOptions(this)
  if (limit && limit > source.length) {
    return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('./file-loader').call(this, source)
  }

}

loader.raw = true // 二进制文件

module.exports = loader

```

#### less-loader
```javascript
const less = require('less')

function loader (source) {
  let css

  less.render(source, function (err, r) {
    css = r.css
  })

  return css
}

module.exports = loader

```

#### css-loader
```javascript
/*****************
 *
 * 比较难理解
 *
 * **************/
function loader (source) {
  const reg = /url\((.+?)\)/g
  let pos = 0
  let current
  let arr = ['let list = []']
  while (current = reg.exec(source)) { // [matchUrl,g]
    let [matchUrl, g] = current

    console.log(matchUrl, g)

    let last = reg.lastIndex - matchUrl.length
    arr.push(`list.push(${JSON.stringify(source.slice(pos, last))})`)
    pos = reg.lastIndex
    // 把 g 替换成require的写法 => url(require('xxx'))
    arr.push(`list.push('url('+require(${g})+')')`)
  }

  arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
  arr.push(`module.exports = list.join('')`)

  console.log(arr.join('\r\n'))

  return arr.join('\r\n')
}

module.exports = loader

```

#### style-loader
```javascript
const loaderUtils = require('loader-utils')

function loader (source) {

  const style = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `

  return style
}

/*****************
 *
 * 比较难理解
 *
 * **************/
// 在style-loader上写了pitch
// style-loader     css-loader!less-loader/.index.less
loader.pitch = function (remainingRequest) { // 剩余的请求
// 让style-loader去处理css-loader!less-loader/.index.less

  const style = `
    let style = document.createElement('style')
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
    document.head.appendChild(style)
  `

  return style
}

module.exports = loader

```
