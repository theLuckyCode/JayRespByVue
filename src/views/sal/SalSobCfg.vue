<template>
    <div>
        <div>
            <el-table :data="emps" border stripe size="mini">
                <el-table-column type="selection" align="left" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" align="left" width="120"></el-table-column>
                <el-table-column prop="workID" label="工号" align="left" width="120"></el-table-column>
                <el-table-column prop="email" label="电子邮件" align="left" width="200"></el-table-column>
                <el-table-column prop="phone" label="电话号码" align="left" width="120"></el-table-column>
                <el-table-column prop="department.name" label="所属部门" align="left" width="120"></el-table-column>
                <el-table-column label="工资账套" align="center">
                    <template slot-scope="scope">
                        <el-tooltip placement="right" v-if="scope.row.salary">
                          <div slot="content">
                            <table>
                                <tr>
                                    <td>基本工资</td>
                                    <td>{{scope.row.salary.basicSalary}}</td>
                                </tr>
                                <tr>
                                    <td>交通补助</td>
                                    <td>{{scope.row.salary.trafficSalary}}</td>
                                </tr>
                                <tr>
                                    <td>午餐补助</td>
                                    <td>{{scope.row.salary.lunchSalary}}</td>
                                </tr>
                                <tr>
                                    <td>奖金</td>
                                    <td>{{scope.row.salary.bonus}}</td>
                                </tr>
                                <tr>
                                    <td>养老金比率</td>
                                    <td>{{scope.row.salary.pensionPer}}</td>
                                </tr>
                                <tr>
                                    <td>养老金基数</td>
                                    <td>{{scope.row.salary.pensionBase}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险比率</td>
                                    <td>{{scope.row.salary.medicalPer}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险基数</td>
                                    <td>{{scope.row.salary.medicalBase}}</td>
                                </tr>
                                <tr>
                                    <td>公积金比率</td>
                                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                                </tr>
                                <tr>
                                    <td>公积金基数</td>
                                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                                </tr>
                                <tr>
                                    <td>启用时间</td>
                                    <td>{{scope.row.salary.createDate}}</td>
                                </tr>
                            </table>
                          </div>
                            <el-tag>{{scope.row.salary.name}}</el-tag>
                        </el-tooltip>
                        <el-tag v-else>暂未设置</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                title="修改工资账套"
                                width="200"
                                @show="showPop(scope.row.salary)"
                                @hide="hidePop(scope.row)"
                                trigger="click">
                            <div>
                                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in salaries"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button type="danger" size="mini" slot="reference">修改工资账套</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:10px;display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSobCfg",
        data(){
            return {
               emps:[],
               salaries:[],
               currentSalary:null,
               currentSize:10,
               currentPage:1,
               total:0
            }
        },
        mounted() {
            this.initEmps();
            this.initSalaries();
        },
        methods:{
          sizeChange(data){
              this.currentSize = data;
              this.initEmps()
          },
          currentChange(data){
              this.currentPage = data;
              this.initEmps()
          },
          hidePop(data){
              if (this.currentSalary){
                  this.putRequest("/salary/sobcfg/?eid="+data.id+"&sid="+this.currentSalary).then(resp=>{
                      if (resp){
                          this.initEmps()
                      }
                  })
              }
          },
          showPop(data){
              if (data){
                  this.currentSalary = data.id;
              }else{
                  this.currentSalary = null
              }
          },
          initSalaries(){
              this.getRequest("/salary/sobcfg/getAllSalaries").then(resp=>{
                  if (resp){
                      this.salaries = resp;
                  }
              })
          },
          initEmps(){
              this.getRequest("/salary/sobcfg/?page="+this.currentPage+"&size="+this.currentSize).then(resp=>{
                  if (resp){
                      this.emps = resp.data;
                      this.total = resp.total;
                  }
              })
          }
        }
    }
</script>

<style scoped>

</style>