<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content:center">
        <!--display 属性规定元素应该生成的框的类型,flex 属性用于设置或检索弹性盒模型对象的子元素如何分配空间-->
        <!--justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式-->
            <el-input prefix-icon="el-icon-search" v-model="keywords" placeholder="通过用户名搜索用户..." style="width: 400px;margin-right: 10px"></el-input>
            <el-button icon="el-icon-search" size="small" type="primary">搜索</el-button>
        </div>
        <div style="margin-top: 50px;display: flex;flex-wrap: wrap;justify-content: space-around">
            <el-card class="box-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"></el-button>
                </div>
                <div>
                    <div style="display: flex;justify-content: center">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" style="width: 72px;height: 72px;border-radius: 72px;">
                    </div>
                    <div style="margin-top: 20px;font-size: 12px;color: #2c90ff">
                            <div>用户名：{{hr.name}}</div>
                            <div>手机号码：{{hr.phone}}</div>
                            <div>电话号码：{{hr.telephone}}</div>
                            <div>地址：{{hr.address}}</div>
                            <div>用户状态：<el-switch
                                    v-model="hr.enabled"
                                    active-text="启用"
                                    inactive-text="禁用"
                                    @change="enabledChange(hr)">
                            </el-switch></div>
                            <div>用户角色：<el-tag type="success" v-for="(role,indexj) in hr.roles" :key="indexj" style="margin-right: 4px">{{role.nameZh}}
                                          </el-tag>
                                          <el-popover
                                             placement="bottom"
                                             title="标题"
                                             width="200"
                                             trigger="click"
                                             content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                                             <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                                          </el-popover>
                            </div>
                            <div >备注：{{hr.remark}}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data(){
            return {
                keywords:'',
                hrs:[]
            }
        },
        mounted() {
            this.initHrs();
        },
        methods:{
            initHrs(){
                this.getRequest("/system/hr/").then(resp=>{
                    if (resp){
                        this.hrs = resp;
                    }
                })
            },
            enabledChange(hr){
                delete hr.roles;  //删除roles属性，不然后端报错
                this.putRequest("/system/hr/",hr).then(resp=>{
                    if (resp){
                         this.initHrs();
                    }
                })
            }
        }
    }
</script>

<style>

    .box-card{
       width: 350px;
       margin-bottom: 20px;
    }

</style>