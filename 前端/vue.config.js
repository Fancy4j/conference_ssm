module.exports = {
  // 关闭eslint语法检测
  lintOnSave: false,
  devServer: {
    proxy: 'http://localhost:8082'
  }
}
