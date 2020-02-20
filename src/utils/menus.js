import {getRequest} from "./api";

export const initMenu = (router,store) => {
    if (store.state.routes.length > 0){
        return;
    }

    getRequest("/system/config/menu").then(data => {
        if (data){
            let fmtRoutes = formatRoutes(data);
            //router.addRoutes,动态添加更多的路由规则。参数必须是一个符合 routes 选项要求的数组。
            router.addRoutes(fmtRoutes);
            //同步操作，数据提交至 mutations ，可用于登录成功后读取用户信息写到缓存里
            store.commit('initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes = (routes) => {
    let fmRoutes = [];
    //遍历每一项
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,  //图标样式class
            children
        } = router ;
        if (children && children instanceof Array){
            children = formatRoutes(children);
        }
        let fmRouter = {
            path:path,
            name:name,
            iconCls:iconCls,
            meta:meta,
            children:children,
            component(resolve){
                if (component.startsWith("Home")){
                     require(['../views/'+component+'.vue'],resolve);
                }else if (component.startsWith("Emp")){
                    require(['../views/emp/'+component+'.vue'],resolve);
                    //  require: 运行时调用，理论上可以运用在代码的任何地方，
                    //  用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js
                }else if(component.startsWith("Per")){
                    require(['../views/per/'+component+'.vue'],resolve);
                    //  require: 运行时调用，理论上可以运用在代码的任何地方，
                    //  用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js
                }else if(component.startsWith("Sal")){
                    require(['../views/sal/'+component+'.vue'],resolve);
                    //  require: 运行时调用，理论上可以运用在代码的任何地方，
                    //  用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js
                }else if(component.startsWith("Sta")){
                    require(['../views/sta/'+component+'.vue'],resolve);
                    //  require: 运行时调用，理论上可以运用在代码的任何地方，
                    //  用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js
                }else if(component.startsWith("Sys")){
                    require(['../views/sys/'+component+'.vue'],resolve);
                    //  require: 运行时调用，理论上可以运用在代码的任何地方，
                    //  用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js
                }
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}