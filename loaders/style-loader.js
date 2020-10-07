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
