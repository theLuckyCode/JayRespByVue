//写这个文件的原因是因为现在处于开发阶段那么前端跟后端跑起来就是两个端口，这样就形成了跨域的问题，但是真正上线的时候，前端会被
//打包到后端那里去，所以启动的时候就是同一个端口
//该文件就是为了在开发阶段测试而使用的
//前端请求到了nodejs，nodejs转发到后端；后端把响应结果传到nodejs，nodejs转发到前端，相当于nodejs充当一个消息中转站
//PS:这个文件名只能起这个名字，取其他名字是不生效的，请记住这次的踩坑！！！！！
let proxyObj = {};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
  devServer:{
      host:'localhost',
      port:8080,
      proxy:proxyObj
  }
}
