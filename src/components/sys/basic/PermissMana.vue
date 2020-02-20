<template>
    <div>
        <div class="permissManaTools">
            <el-input placeholder="请输入角色英文名" v-model="role.name" size="small">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input placeholder="请输入角色中文名" v-model="role.nameZh" size="small" @keydown.enter.native="addRole"></el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">添加角色</el-button>
        </div>
        <div style="margin-top: 5px;width:700px">
            <el-collapse accordion @change="change" v-model="activeName">
                <!--     @change是折叠面板独有的方法，指点到哪个，就加载哪个的数据，传入的参数，默认是他下面子控件的name           -->
                <el-collapse-item :title="r.nameZh" :key="index" v-for="(r,index) in roles" :name="r.id">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete" @click="deleteRole(r)"></el-button>
                        </div>
                        <div>
                            <el-tree :data="allMenus" :props="defaultProps"
                                     show-checkbox node-key="id" :default-checked-keys="selectedMenus"
                                     ref="tree"
                                     :key="index"></el-tree>
                            <!--  data属性是树形控件底下的数据，props往下找，说不清,show-checkbox显示多选框    -->
                            <!--  默认选中的表示为node-key，这里以数据里面的id为标识，default-checked-keys代表默认选中id为7,8,9的项 -->
                            <!--  ref属性就是给这些树形控件起了个名字，每个角色里面都有一个树形控件，也就是说总共有8个控件，那么这个ref就是一个长度为8的数组,故下面还要传入索引去获取当前的树形控件-->
                            <div style="display: flex;justify-content: flex-end">
                                <el-button size="small" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="small" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles:[],
                allMenus:[],
                selectedMenus:[],  //权限组打了勾组成的数组
                activeName:-1, //这个值是多少，风琴面板就打开哪个；打开风琴面板时，风琴面板里面的每一个name都会给他赋值
                defaultProps:{
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            deleteRole(r){
                this.$confirm('此操作将永久删除【'+r.nameZh+'】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/?id="+r.id).then(resp=>{
                        if (resp){
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addRole(){
                if (this.role.name && this.role.nameZh){
                    this.postRequest("/system/basic/permiss/role",this.role).then(resp=>{
                        if (resp){
                            this.role={
                                name : '',
                                nameZh : ''
                            }
                            this.initRoles();
                        }
                    })
                }else{
                   this.$message.error("请按规定输入所需要的字段!");
                }
            },
            cancelUpdate(){
              this.activeName=-1;
            },
            doUpdate(rid,index){
               let tree = this.$refs.tree[index];
               let selectedKeys = tree.getCheckedKeys(true); //getCheckedKeys方法用于获取当前树形控件选中的node-key,传入true的话，即代表只会获取叶子节点（即最低端的那些）
               let url = '/system/basic/permiss/?rid='+rid;
               selectedKeys.forEach(key=>{
                   url+='&mids='+key;
               });
               this.putRequest(url).then(resp=>{
                   if (resp){
                       this.activeName=-1;
                   }
               })
            },
            initSelectedMenus(rid){
                this.getRequest("/system/basic/permiss/mids/"+rid).then(resp=>{
                      if (resp){
                          this.selectedMenus = resp;
                      }
                })
            },
            initRoles(){
                this.getRequest("/system/basic/permiss/").then(resp=>{
                    if (resp){
                        this.roles = resp;
                    }
                })
            },
            change(rid){
               alert(rid);
               if (rid){
                  this.initAllMenus();
                  this.initSelectedMenus(rid);
               }
            },
            initAllMenus(){
                this.getRequest("/system/basic/permiss/menus").then(resp=>{
                    if (resp){
                        this.allMenus=resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .permissManaTools {
      display: flex;
    }

    .permissManaTools .el-input {
      width: 300px;
      margin-right: 5px;
    }
</style>