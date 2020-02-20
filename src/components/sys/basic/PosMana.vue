<template>
    <div>
        <div style="margin-bottom: 10px">
            <el-input
                    size="small"
                    style="width: 300px;margin-right: 10px"
                    prefix-icon="el-icon-plus"
                    placeholder="添加职位..."
                    v-model="pos.name"
                    @keydown.enter.native="addPosition">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
        </div>
        <div>
            <el-table
                    :data="positions"
                    border
                    stripe
                    size="small"
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                    <!--      @selection-change="handleSelectionChange"表示点击多选框时触发的事件         -->
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否可用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!--scope.$index指的是当前操作的是第几行，scope.row就是这行的json（数据）-->
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deletePositionsByIds" type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0">批量删除</el-button>
        </div>
        <!--    编辑时弹出来的对话框    -->
        <el-dialog
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
               <el-tag>职位名称</el-tag>
               <el-input size="small" style="width: 200px;margin-left: 8px" v-model="updatePos.name"></el-input>
            </div>
            <div style="margin-top: 5px">
                <el-tag style="margin-right: 10px">是否启用</el-tag>
                <el-switch
                        v-model="updatePos.enabled"
                        active-text="启用"
                        inactive-text="禁用">
                </el-switch>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest} from "../../../utils/api";

    export default {
        name: "PosMana",
        data(){
            return {
                pos:{
                    name:"",
                    enabled:""
                },
                positions: [],
                dialogVisible:false,
                updatePos:{
                //updatePos是为了避免和增加框里面的内容冲突而创建的
                    id:'',
                    name:'',
                    enabled:''
                },
                //multipleSelection这个数组里面装的是多选框选中的项
                multipleSelection: []
            }
        },
        mounted() {
        //mounted是vue生命周期中的钩子函数其中之一
        //其作用是在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
            this.initPosition();
        },
        methods:{
            deletePositionsByIds(){
                this.$confirm('此操作将永久删除选中的职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&';
                    })
                    this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
                        if (resp){
                            this.initPosition();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            initPosition(){
                this.getRequest("/system/basic/pos/").then(resp=>{
                    if (resp){
                        this.positions = resp;
                    }
                })
            },
            addPosition(){
                if (this.pos.name){
                    this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
                        this.pos.name='';
                         this.initPosition();
                    })
                }else {
                    this.$message.error('请输入职位名称！');
                }
            },
            handleEdit(index,data){
               //this.updatePos=data;
               //Object.assign()是对象的静态方法，可以用来复制对象的可枚举属性到目标对象，利用这个特性可以实现对象属性的合并
               //Object.assign(目标对象,源对象)
               Object.assign(this.updatePos,data);
               // 当这个值为true时，修改框出现
               this.dialogVisible=true;
            },
            doUpdate(){
                this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
                     if (resp){
                         this.initPosition();
                         this.updatePos.name="";
                         this.dialogVisible=false;
                     }
                })
            },
            handleDelete(index,data){
                this.$confirm('此操作将永久删除【'+data.name+'】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
                        if (resp){
                            this.initPosition();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>