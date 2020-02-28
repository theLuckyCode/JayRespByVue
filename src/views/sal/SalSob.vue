<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <el-button icon="el-icon-plus" size="mini" type="primary" @click="showAddSalaryView">添加工资套账</el-button>
            <el-button icon="el-icon-refresh" size="mini" type="success" @click="this.initSalaries"></el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table :data="salaries" border stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
                <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
                <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
                <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
                <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
                <el-table-column width="100" prop="createDate" label="启用时间"></el-table-column>
                <el-table-column align="center" label="养老金">
                    <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="医疗保险">
                    <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="公积金">
                    <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
                    <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showUpdateSalaryView(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteSalary(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--增加套账的弹框-->
            <el-dialog
                    :title="dialogTitle"
                    :visible.sync="dialogVisible"
                    width="50%">
                <div style="display: flex;justify-content: space-around;align-items: center">
                    <el-steps direction="vertical" :active="activeItemIndex">
                        <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
                    </el-steps>
                    <el-input v-model="salary[key]" v-for="(value,key,index) in salary"
                              :key="index" v-show="activeItemIndex==index" style="width: 200px;" ></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="preStep" size="mini">{{activeItemIndex==10?"取消":"上一步"}}</el-button>
                     <el-button type="primary" @click="nextStep" size="mini">{{activeItemIndex==10?"完成":"下一步"}}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                salaries: [],
                dialogVisible:false,
                activeItemIndex:0,
                dialogTitle:'',
                salaryItemName:[
                    '基本工资',
                    '交通补助',
                    '午餐补助',
                    '奖金',
                    '养老金比率',
                    '养老金基数',
                    '医疗保险比率',
                    '医疗保险基数',
                    '公积金比率',
                    '公积金基数',
                    '账套名称'
                ],
                salary:{
                    basicSalary:0,
                    trafficSalary:0,
                    lunchSalary:0,
                    bonus:0,
                    pensionPer:0,
                    pensionBase:0,
                    medicalPer:0,
                    medicalBase:0,
                    accumulationFundPer:0,
                    accumulationFundBase:0,
                    name:""
                }
            }
        },
        mounted() {
            this.initSalaries();
        },
        methods: {
            showUpdateSalaryView(data){
                this.dialogTitle = "修改工资账套";
                this.dialogVisible = true;
                this.activeItemIndex = 0;
                this.salary = {
                        basicSalary:data.basicSalary,
                        trafficSalary:data.trafficSalary,
                        lunchSalary:data.lunchSalary,
                        bonus:data.bonus,
                        pensionPer:data.pensionPer,
                        pensionBase:data.pensionBase,
                        medicalPer:data.medicalPer,
                        medicalBase:data.medicalBase,
                        accumulationFundPer:data.accumulationFundPer,
                        accumulationFundBase:data.accumulationFundBase,
                        name:data.name,
                        id:data.id
                }
            },
            deleteSalary(data){
                this.$confirm('此操作将永久删除【'+data.name+'】套账, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/sob/"+data.id).then(resp=>{
                        if (resp){
                            this.initSalaries();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            preStep(){
                if (this.activeItemIndex==0){
                    alert("no")
                    return
                }else if (this.activeItemIndex==10){
                    this.dialogVisible = false;
                    this.activeItemIndex = 0;
                }
                this.activeItemIndex--;
            },
            nextStep(){
                if (this.activeItemIndex==10){
                    if (this.salary.id){
                        this.putRequest("/salary/sob/",this.salary).then(resp=>{
                            if (resp){
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        })
                    }else{
                        this.postRequest("/salary/sob/",this.salary).then(resp=>{
                            if (resp){
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        })
                        return
                    }
                }
                this.activeItemIndex++;
            },
            showAddSalaryView(){
                this.salary = {
                    basicSalary:0,
                        trafficSalary:0,
                        lunchSalary:0,
                        bonus:0,
                        pensionPer:0,
                        pensionBase:0,
                        medicalPer:0,
                        medicalBase:0,
                        accumulationFundPer:0,
                        accumulationFundBase:0,
                        name:""
                }
                this.activeItemIndex = 0;
                this.dialogTitle = "添加工资账套"
                this.dialogVisible = true;
            },
            initSalaries() {
                this.getRequest("/salary/sob/").then(resp => {
                    if (resp) {
                        this.salaries = resp;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>