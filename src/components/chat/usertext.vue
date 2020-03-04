<template>
        <div id="uesrtext">
            <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keydown="addMessage"></textarea>
        </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'uesrtext',
        data() {
            return {
                content: ''
            }
        },
        computed: mapState([
            'sessions',
            'currentSession'
        ]),
        methods: {
            addMessage(e) {
                if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                    //先举个例子
                    //let msgObjExp = new Object();
                    //msgObjExp.content = "hello!";
                    //msgObjExp.to = "libai";
                    //this.$store.state.stomp.send("/ws/chat",{},JSON.stringify(msgObjExp));
                    //通过send方法发送消息,第一个参数是发送的地址，第二个是优先级，第三个是消息的内容,给他反序列化成字符串

                    let msgObj = new Object();
                    msgObj.to = this.currentSession.username;
                    msgObj.content = this.content;
                    this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj));
                    this.$store.commit('addMessage', msgObj); //vuex中的commit，参数一是方法名，参数二是传过去的值
                    this.content = '';
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #uesrtext {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 30%;
        border-top: solid 1px #DDD;

        > textarea {
            padding: 10px;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
        }
    }
</style>
