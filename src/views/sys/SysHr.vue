<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content:center">
        <!--display 属性规定元素应该生成的框的类型,flex 属性用于设置或检索弹性盒模型对象的子元素如何分配空间-->
        <!--justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式-->
            <el-input prefix-icon="el-icon-search" v-model="keywords" placeholder="通过用户名搜索用户..." style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button icon="el-icon-search" size="small" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div style="margin-top: 50px;display: flex;flex-wrap: wrap;justify-content: space-around">
            <el-card class="box-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
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
                                          <!-- show是这个对话框显示时候触发的事件  -->
                                          <!-- hide是这个对话框隐藏时候触发的事件  -->
                                          <el-popover
                                             placement="bottom"
                                             title="角色列表"
                                             width="200"
                                             @hide="hidePop(hr)"
                                             @show="showPop(hr)"
                                             trigger="click">
                                              <!--multiple代表该选择器支持多选，v-model的值就是选中的值-->
                                              <el-select v-model="selectedRoles" multiple  placeholder="请选择">
                                                  <!--label是显示出来个人看的文本信息,value才是值-->
                                                  <el-option
                                                          v-for="(role,index) in allRoles"
                                                          :key="index"
                                                          :label="role.nameZh"
                                                          :value="role.id">
                                                  </el-option>
                                              </el-select>
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
                hrs:[],
                allRoles:[],
                selectedRoles:[]
            }
        },
        mounted() {
            this.initHrs();
        },
        methods:{
            deleteHr(hr){
                this.$confirm('此操作将永久删除【'+hr.name+'】员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if (resp){
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doSearch(){
                this.initHrs();
            },
            hidePop(hr){
                //下面这一块的代码是为了验证关闭选择框后，有没有修改数据
                let roles = [];
                Object.assign(roles, hr.roles);
                let flag = false;
                if (roles.length != this.selectedRoles.length) {
                    flag = true;
                } else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let sr = this.selectedRoles[j];
                            if (role.id == sr) {
                                //数组里面移除元素，前面一个参数意思是从第几个元素开始删除，后面是删除几个元素
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true;
                    }
                }
                //**************************
                if (flag){
                    let url = "/system/hr/role?hrid="+hr.id;
                    this.selectedRoles.forEach(sr=>{
                        url+="&rids="+sr;
                    })
                    this.putRequest(url).then(resp=>{
                        if (resp){
                            this.initHrs();
                        }
                    })
                }
            },
            showPop(hr){
                this.initAllRoles();
                let roles = hr.roles;
                //清空数组
                this.selectedRoles = [];
                //把当前用户的角色赋值给selectedRoles
                roles.forEach(role=>{
                    this.selectedRoles.push(role.id);
                })
            },
            initAllRoles(){
                this.getRequest("/system/hr/roles").then(resp=>{
                    if (resp){
                        this.allRoles = resp;
                    }
                })
            },
            initHrs(){
                this.getRequest("/system/hr/?keywords="+this.keywords).then(resp=>{
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