import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store";
import "font-awesome/css/font-awesome.min.css";

//当导入的是方法或者函数时，就要加上花括号，这是es6写法
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menus";

//prototype是vue的插件用来全局导入东西，那么在其他页面要用到这些方法时，只需要写this.方法名即可调用该方法
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(ElementUI);
//没有Vue.config.productionTip = false这句代码，它会显示你生产模式的消息
//有了Vue.config.productionTip = false这句代码，它会阻止你显示生产模式的消息
Vue.config.productionTip = false

//路由守卫，防止用户按F5刷新页面，之后不加载菜单出来
router.beforeEach((to,from,next) => {
  if (to.path == '/'){
    next();
  }else {
    if (window.sessionStorage.getItem("user")){
      initMenu(router,store);
      next();
    }else {
      next("/?redirect="+to.path);
    }

  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
