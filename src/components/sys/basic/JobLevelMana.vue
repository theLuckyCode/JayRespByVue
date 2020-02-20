<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" style="width: 300px" prefix-icon="el-icon-plus" placeholder="添加职称..."></el-input>
            <el-select v-model="jl.titleLevel" placeholder="请选择职称等级" size="small" style="margin-left: 10px">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" size="small" type="primary" style="margin-left: 5px" @click="addJl">添加</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="jls"
                    border
                    stripe
                    size="small"
                    style="width: 80%"
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
                        prop="titleLevel"
                        label="职位级别"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
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
                title="修改职称"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input size="small" style="width: 200px;margin-left: 8px" v-model="updateJl.name"></el-input>
            </div>
            <div style="margin-top: 5px">
                <el-tag>职位级别</el-tag>
                <el-select v-model="updateJl.titleLevel" placeholder="请选择职称等级" size="small" style="margin-left: 10px">
                    <el-option
                            v-for="item in titleLevels"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-top: 5px">
                <el-tag style="margin-right: 10px">是否启用</el-tag>
                <el-switch
                        v-model="updateJl.enabled"
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
    export default {
        name: "JobLevelMana",
        data(){
            return {
                jl:{
                    name:"",
                    titleLevel:"",
                    enabled:""
                },
                jls:[],
                dialogVisible:false,
                updateJl:{
                    id:'',
                    name:"",
                    titleLevel:"",
                    enabled:""
                },
                multipleSelection:[],
                titleLevels:['正高级','副高级','中级','初级','员级'] //这里数据较少及与数据库一样，所以直接在这里写死，不去数据库查了
            }
        },
        mounted() {
            this.initJl();
        },
        methods:{
            deletePositionsByIds(){
                this.$confirm('此操作将永久删除所选的职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = "?";
                    this.multipleSelection.forEach(item=>{
                        ids += "ids="+item.id+"&";
                    })
                    this.deleteRequest("/system/basic/joblevel/"+ids).then(resp=>{
                        //到后端会全部封装成数组，localhost:8080/system/basic/joblevel?ids=1&ids=2&ids=3
                        //因为参数的名字都相同
                        if (resp){
                            this.initJl();
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
                this.multipleSelection=val;
            },
            handleEdit(index,data){
                Object.assign(this.updateJl,data);
                this.dialogVisible=true;
            },
            doUpdate(){
                this.putRequest("/system/basic/joblevel/",this.updateJl).then(resp=>{
                    if (resp){
                        this.initJl();
                        this.updateJl={
                            name:"",
                            titleLevel:"",
                            enabled:""
                        };
                        this.dialogVisible=false;
                    }
                })
            },
            handleDelete(index,data){
                this.$confirm('此操作将永久删除【'+data.name+'】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/"+data.id).then(resp=>{
                        if (resp){
                            this.initJl();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addJl(){
                if (this.jl.name && this.jl.titleLevel){
                    this.postRequest("/system/basic/joblevel/",this.jl).then(resp=>{
                        this.jl={
                            name:"",
                            titleLevel:"",
                            enabled:""
                        };
                        this.initJl();
                    })
                }else{
                    this.$message.error("请按规定输入指定的字段");
                }
            },
            initJl(){
                this.getRequest("/system/basic/joblevel/").then(resp=>{
                    this.jls=resp;
                })
            }
        }
    }
</script>

<style scoped>

</style>