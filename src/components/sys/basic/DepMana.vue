<template>
    <div style="width: 500px">
        <el-input
                placeholder="请输入部门名称进行搜索..."
                v-model="filterText"
                prefix-icon="el-icon-search">
        </el-input>

        <el-tree
                :data="deps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                ref="tree">
           <span class="custom-tree-node" slot-scope="{ node, data }"
                 style="display: flex;justify-content: space-between;width:100%">
                  <!--node值的是当前元素，data就是该元素的数据-->
        <span>{{ node.label }}</span>  <!--{{ node.label }}与{{data.name}}是一样的-->
        <span>
          <el-button
                  type="primary"
                  size="mini"
                  style="padding: 2px"
                  @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button
                  type="danger"
                  size="mini"
                  style="padding: 2px"
                  @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
        </el-tree>
        <!--   增加部门时候的弹框     -->
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <div>
                <table>
                    <tr>
                        <td><el-tag>上级部门</el-tag></td>
                        <td><span>{{pname}}</span></td>
                    </tr>
                    <tr>
                        <td><el-tag>部门名称</el-tag></td>
                        <td><el-input v-model="dep.name" placeholder="请输入部门名称..." ></el-input></td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data(){
            return {
                filterText:'',
                deps:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogVisible:false,
                dep:{
                    name:'',
                    parentId:-1
                },
                pname:''  //父项的名字
            }
        },
        mounted() {
           this.initDeps();
        },
        watch:{ //watch是监控器
            filterText(val) {
            //该方法意思就是搜索框中有值变化时，就会触发这个方法，val就是搜索框里面的最新值
            //结合一起看的意思就是监控搜索框里面有没有值发生变化，有的话就触发该方法
                this.$refs.tree.filter(val);
            //这里的filter指的就是:filter-node-method="filterNode"这个方法，传的参数是val
            }
        },
        methods:{
            doAddDep(){
                this.postRequest("/system/basic/department/",this.dep).then(resp=>{
                    if (resp){
                        this.dep={
                            name:'',
                            parentId:-1
                        };
                        this.pname='' ;
                        this.initDeps();
                        this.dialogVisible=false;
                    }
                })
            },
            showAddDep(data){
              // alert(JSON.stringify(data));
              this.pname = data.name;
              this.dep.parentId = data.id;
              this.dialogVisible=true;
            },
            deleteDep(data){
                //alert(JSON.stringify(data));
                    this.$confirm('此操作将永久删除【'+data.name+'】角色, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/department/"+data.id).then(resp=>{
                            if (resp){
                                this.initDeps();
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            initDeps(){
             this.getRequest("/system/basic/department/").then(resp=>{
                 if (resp){
                     this.deps = resp ;
                 }
             })
            },
            filterNode(value, data) {
                //value就是上文所说的传过来的val，那么data就是他的子项
                //以这里为例，若value是股东会，那么data就是董事会，bbb；若value是董事会，那么data就是总办
                if (!value) return true;
                //当value为空的时候，返回true；当返回true时，那么data就留着，否则去除data
                return data.name.indexOf(value) !== -1; //这里的name就是上文中defaultProps中的label
                //indexOf(value)表示是否包含value；data.name.indexOf(value) !== -1意思就是data包含了value值，返回true
            }
        }
    }
</script>

<style>

</style>