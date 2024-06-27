const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://localhost:3000',
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
})
