<template>
    <div>
        <!--v-loading是加载时的动画，可放在任意的地方-->
        <el-form
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :rules="rules"
                ref="loginForm"
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item prop="username">
                <!--el-form-item元素的prop属性绑定字段名name，表单验证时，就会验证el-input元素绑定的变量ruleForm.name的值是否符合验证规则-->
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" @keydown.enter.native="login"></el-input>
                <!--        @keydown按回车登录        -->
            </el-form-item>
            <el-checkbox v-model="check" class="loginRemember">记住密码</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data(){
            return {
                loginForm:{
                    username:"admin",
                    password:"123"
                },
                check: true,
                rules:{
                    username:[{required:true,message:"请输入用户名",trigger:"blur"}],
                    //element里面的trigger: 'blur'和trigger: 'change'有什么区别
                    //trigger代表触发方式，blur失去焦点，change数据改变
                    password:[{required:true,message:"请输入密码",trigger:"blur"}]
                },
                loading:false //当此值为true时，那么加载的动画就会出现
            }
        },
        methods: {
            login() {
                //该方法也是element ui上面的校验方法,验证输入框里面有没有输入内容
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        this.postKeyValueRequest("/doLogin",this.loginForm).then(resp =>{
                            if (resp){
                                this.loading=false;
                                //alert(JSON.stringify(resp))
                                //将登录的用户信息存到session里面去
                                window.sessionStorage.setItem("user",JSON.stringify(resp))
                                alert("登陆成功！");
                                //跳转回之前的目录
                                let path = this.$route.query.redirect;
                                this.$router.replace(path=="/" || path == undefined?'/home':path)
                            }
                        });
                    } else {
                        this.$message.error('请按规则填写所需信息');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer{
       border-radius: 15px;
       background-clip: padding-box;
       margin: 180px auto;
       width: 350px;
       padding: 15px 35px 15px 35px;
       background: white;
       border: 1px solid #eaeaea;
       box-shadow: 0 0 25px #cac6c6;
    }
    .loginTitle{
        margin: 15px auto 20px auto;
        text-align: center;
        color: black;
    }
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>