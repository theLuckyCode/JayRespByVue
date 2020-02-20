import axios from 'axios'
import {Message} from 'element-ui';
import router from "../router";
//以下是拦截器，作用就是在请求或响应被 then 或 catch 处理前拦截它们，然后对他们进行自定义的处理
//      axios.interceptors.request.use(function (config) {
//          return config;    在发送请求之前做些什么
//      }, function (error) {
//          return Promise.reject(error);    对请求错误做些什么
//      });
//********************************************************************************
//      axios.interceptors.response.use(function (response) {
//          return response;    对响应数据做点什么
//      }, function (error) {
//          return Promise.reject(error);    对响应错误做点什么
//      });
axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.status == 500) {
        //这里的前端的status与后台请求的status不是同一个东西，这里后台的status指的是RespBean里面的那个status，而前端的status一般都是200
        Message.error({message: success.data.msg});
        return;
    }
    if (success.data.msg){
        Message.success({message:success.data.msg})
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器丢失了！'});
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员！'});
    } else if (error.response.status == 401) {
        Message.error({message: '尚未登录，请登录！'});
        //当时间过了30分钟或者后端重启了，那么session里面保存的用户信息就会过期，这时候就需要跳转到登录页，进行登录
        //401表示未登录，403表示未授权即权限不足
        router.replace("/");
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: '发生未知错误！'})
        }
    }
    return;
})

let base = '';

export const postKeyValueRequest = (url, param) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: param,
        //transformRequest在向服务器发送前，修改请求数据。在这里就是处理将传过来的参数转化为表单模式的KeyValue值进行提交
        //因为SpringSecurity原生只支持这种表单模式来提交，而前端提交到后端默认是以json模式的。
        //当然SpringSecurity也可以修改配置文件，从而支持json格式
        transformRequest: [function(data) {
                let ret = '';
                for (let i in data) {
                   ret += encodeURIComponent(i)+'='+encodeURIComponent(data[i])+'&'
                   //application/x-www-form-urlencoded,它是post的默认格式，使用js中URLencode转码方法,
                   //包括将name、value中的空格替换为加号；将非ascii字符做百分号编码；将input的name、value用‘=’连接，不同的input之间用‘&’连接。
                }
                console.log(ret);
                return ret ;
        }],
        headers:{
           "Content-Type":"application/x-www-form-urlencoded"
        }
    })
}

//json模式的post请求
export const postRequest = (url,param) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: param
    })
}

export const putRequest = (url,param) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: param
    })
}

export const getRequest = (url,param) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: param
    })
}

export const deleteRequest = (url,param) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: param
    })
}