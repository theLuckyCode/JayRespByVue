import Vue from "vue";
import Vuex from "vuex";
import { Notification } from 'element-ui';
import {getRequest} from "../utils/api";
import Stomp from '../utils/stomp'
import SockJS from '../utils/sockjs'


Vue.use(Vuex);

const now = new Date();

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        hrs: [],  //拿到除了当前登录者之外的所有员工
        currentSession: null,  //当前选中谁（即当前与谁正在聊天）
        currentHr: JSON.parse(window.sessionStorage.getItem("user")),  //当前的登录者
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        initRoutes(state,data){
            state.routes = data;
        },
        INIT_CURRENTHR(state, hr) {
            state.currentHr = hr;
        },
        changeCurrentSession(state, currentSession) {
            Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false);
            state.currentSession = currentSession;
        },
        addMessage(state, msg) {
            //sessions是一个key/value的形式，key是谁和谁聊天，value是聊天的内容
            let mss = state.sessions[state.currentHr.username + '#' + msg.to];
            if (!mss) {
                // state.sessions[state.currentHr.username+'#'+msg.to] = [];
                //当聊天发送消息时，会自动刷新聊天页
                Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, []);
            }
            state.sessions[state.currentHr.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA(state) {
            //浏览器本地的历史聊天记录可以在这里完成
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        //把除了登录者之外的其他成员拿到，放到hrs里面去
        INIT_HR(state, data) {
            state.hrs = data;
        }
    },
    actions: {
        //该方法用于登陆之后就马上连接上聊天
        connect(context) {
            //写上连接地址，也就是后台WebSocketConfig配置类那里配置的registerStompEndpoints
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            //发起连接，第一个参数是一些额外的选项，这里可以暂时不填；第二个参数就是连接成功的回调；第三个则是连接失败的回调
            context.state.stomp.connect({}, success => {
                //订阅消息，这里的路径前面一定要加前缀user，原理和SpringSecurity角色前面加ROLE一样；msg就是服务端发回来的消息
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    let receiveMsg = JSON.parse(msg.body);  //msg中的body才是消息内容
                    if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                        Notification.info({
                            title: '【' + receiveMsg.fromNickname + '】发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                            position: 'bottom-right'
                        })
                        Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true);
                    }
                    receiveMsg.notSelf = true;  //接收到的信息并不是接收人发送的，而是对方发信息过来的
                    receiveMsg.to = receiveMsg.from; //to要改成from，举个例子：我跟李白说话，我发出去的消息，李白接收了；若不做处理，那么就变成了李白跟李白在对话
                    context.commit('addMessage', receiveMsg);
                })
            }, error => {

            })
        },
        initData(context) {
            context.commit('INIT_DATA')
            getRequest("/chat/hrs").then(resp=>{
                if (resp){
                    context.commit('INIT_HR',resp)
                }
            })
        }
    }

})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val)); //监听，当state里面的sessions发生变化时，就给vue-chat-session赋值
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;