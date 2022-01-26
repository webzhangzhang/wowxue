const path = require('path')
const webpack = require('webpack')
const configEnv = process.env.CONFIG_ENV
const Config = require("./src/feConfig/" + (configEnv || "development"))

const apiConfig = Config.apiConfig
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  publicPath: "./",
  outputDir: 'dist',
  assetsDir: 'report',
  lintOnSave: true, // 保存时候 是否启用eslint检测
  pages: {
    index: {
      entry: './src/main.js',
      template: `./public/index.ejs`
    }
  },
  devServer: {
    host: 'localhost',
    port: 9990,
    open: true,
    proxy: {
      '/api': {
        target: apiConfig.target,
        onError: function(err) {
          console.log('【Webpack Proxy 】Error：', err)
        },
        onProxyReq: function(proxyReq, req) {
          console.log('【Webpack Proxy 】Requesting：', apiConfig.target + req.url)
        }
      },
    }
  },

  css: {
    modules: true,
    extract: true,
  },
  
  productionSourceMap: false, // 如果需要生产环境的source map，可以将其设置为 true 但是会降低生产环境构建速度
  configureWebpack: config => {
    const plugins = []
    plugins.push(new webpack.ProvidePlugin({
      feConfig: path.resolve('.', "./src/feConfig/" + (configEnv || "development")),
      Enums: path.resolve('.', "./src/constants/enum"),
      moment: 'moment'
    }))

    config.plugins = [...config.plugins, ...plugins]
  },


  chainWebpack: config => {
    config.resolve.alias
      .set('@docs', resolve('/docs'))

    config.plugin('define').tap(args => {
      args[0].ENV = configEnv
      return args
    })
    config.module.rule('eslint')
    .use('eslint-loader')
    .loader('eslint-loader')
    .tap( options => {
      options.fix = true
      return options
    })
    config.plugin('copy')
      .use(require('copy-webpack-plugin'), [
        [{
          from: './public/favicon.png',
          to: './report',
        }]
      ])
 
  }
}
