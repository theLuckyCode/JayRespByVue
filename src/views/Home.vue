<template>
    <el-container>
        <!--头部-->
        <el-header class="homeHeader">
            <div class="title">微人事</div>
            <el-dropdown class="userInfo" @command="commandHandler">
             <span class="el-dropdown-link">
              {{user.username}}<img :src="user.userface" alt="">
             </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                    <el-dropdown-item command="setting">设置</el-dropdown-item>
                    <el-dropdown-item divided command="logout">注销登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <!--      侧栏      -->
            <el-aside width="200px">
                <el-menu router unique-opened>
                    <!--router unique-opened 是 elementui的方法跟据每一项的index进行跳转，当然也可以@select="menuClick"-->
                    <el-submenu index="1" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                        <template slot="title">
                            <i :class="item.iconCls" style="color: #2c90ff;margin-right: 5px"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="childForItem.path" v-for="(childForItem,indexj) in item.children" :key="indexj">{{childForItem.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--     右边的具体内容       -->
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">、
                <!--         如果是首页的话，面包屑消失           -->
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    <!--         获取当前路由的名字           -->
                </el-breadcrumb>
                <div style="text-align: center;font-size: 30px;font-family: 細明體-ExtB;color: #2c90ff;padding-top: 50px" v-if="this.$router.currentRoute.path=='/home'">欢迎来到微人事！</div>
                <router-view class="homeRouterView" style="margin-top: 10px"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed:{
            routes(){
                return this.$store.state.routes;
            }
        },
        methods: {
            menuClick(index) {
                this.$router.push(index)
            },
            commandHandler(cmd) {
                if (cmd == "logout") {
                    this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/logout");
                        window.sessionStorage.removeItem("user");
                        this.$router.replace("/");
                        this.$store.commit("initRoutes",[]);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消注销'
                        });
                    });
                }
            }
        }
    }
</script>

<style>
    .homeHeader {
        background: #2c90ff;
        display: flex; /*display:flex 是一种布局方式*/
        align-items: center; /*align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式*/
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .title {
        font-family: "Droid Sans Mono";
        font-size: 30px;
        color: antiquewhite;
    }

    .homeHeader .userInfo {
        cursor: pointer; /*让鼠标移到指定的地方变为一个手指*/
    }

    .el-dropdown-link img {
        /*头像*/
        width: 36px;
        height: 36px;
        border-radius: 24px;
        margin-left: 10px;
    }

    .el-dropdown-link {
        /*头像隔壁的字*/
        color: antiquewhite;
        display: flex;
        align-items: center;
    }
</style>