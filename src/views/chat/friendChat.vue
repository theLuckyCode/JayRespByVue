<template>
    <div id="app">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
            <message></message>
            <usertext></usertext>
        </div>
    </div>
</template>

    <!--  这些组件是写好的聊天界面直接复制过来即可  -->
    <!--  切记还要去npm安装两个东西，sass-loader和node-sass  -->
    <!--  还要记得store复制那些方法  -->
    <!--  以及修改store的导出方式  -->
<script>
    import card from "../../components/chat/card";
    import list from "../../components/chat/list";
    import message from "../../components/chat/message";
    import usertext from "../../components/chat/usertext";

    export default {
        name: "friendChat",
        data(){
            return{

            }
        },
        mounted:function () {
          //调用了store里面的initData方法
          this.$store.dispatch('initData');
        },
        components:{
            card,
            list,
            message,
            usertext
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        margin: 20px auto;
        width: 800px;
        height: 600px;
        overflow: hidden;
        border-radius: 10px;
        .sidebar, .main {
            height: 100%;
        }
        .sidebar {
            float: left;
            color: #f4f4f4;
            background-color: #2e3238;
            width: 200px;
        }
        .main {
            position: relative;
            overflow: hidden;
            background-color: #eee;
        }
    }
</style>