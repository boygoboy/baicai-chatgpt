
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
//将vue根目录下.env 文件加载到 process.env 中
require('dotenv').config({ path: '../.env' });
const app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   // res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.VUE_APP_API,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // rewrite path
    },
  })
  
);
app.listen(process.env.VUE_APP_SERVER_PORT); //这个端口号就是proxy运行的端口号