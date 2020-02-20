import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from "../views/Home";
import Test1 from "../views/Test1";
import Test2 from "../views/Test2";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        hidden:true
    }, {
        path: '/home',
        name: 'home',
        component: Home,
        hidden:true
    }, {
        path: '/home',
        name: '测试菜单',
        component: Home,
        children:[
            {
                path: '/test1',
                name: '选项一',
                component: Test1
            }, {
                path: '/test2',
                name: '选项二',
                component: Test2
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
