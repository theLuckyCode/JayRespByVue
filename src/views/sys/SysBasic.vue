<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="部门管理" name="DepMana"><DepMana></DepMana></el-tab-pane>
        <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
        <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana></JobLevelMana></el-tab-pane>
        <el-tab-pane label="奖惩规则" name="EcMana"><EcMana></EcMana></el-tab-pane>
        <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
</template>

<script>
    import DepMana from "../../components/sys/basic/DepMana";
    import EcMana from "../../components/sys/basic/EcMana";
    import JobLevelMana from "../../components/sys/basic/JobLevelMana";
    import PosMana from "../../components/sys/basic/PosMana";
    import PermissMana from "../../components/sys/basic/PermissMana";

    export default {
        name: "SysBasic",
        components:{
            DepMana,
            EcMana,
            JobLevelMana,
            PosMana,
            PermissMana
        }
    }
</script>

<style scoped>

</style>