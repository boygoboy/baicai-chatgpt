module.exports = {
    devServer: {
        port: process.env.VUE_APP_PORT,     // 端口号
        proxy: {
            '/api': {
              target: process.env.VUE_APP_API,
              ws: true,
              changeOrigin: true,
              pathRewrite: {
                '^/api': ''
              }
            }
          }
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json']
        }
    },
    lintOnSave: false
};
