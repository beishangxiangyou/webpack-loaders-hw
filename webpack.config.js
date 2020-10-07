const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "source-map",
  watch: true,
  devServer: {
    contentBase: './dist',
    port: 3000,
    progress: true
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    // alias: {
    //   'babel-loader': path.resolve(__dirname, 'loaders', 'babel-loader.js')
    // }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        // loader: 'file-loader'
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024 // 200k
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: "banner-loader",
          options: {
            text: '斗图王',
            filename: path.resolve(__dirname, 'banner.js')
            // filename: ''
          }
        }
      }
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: [
      //         '@babel/preset-env'
      //       ]
      //     }
      //   }
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html"
    })
  ]
}
