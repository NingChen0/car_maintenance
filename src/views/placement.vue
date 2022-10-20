<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入内容" v-model="findName" clearable>
      </el-input>
      <el-button type="primary" style="margin: 0 0 0 15px" plain
        >查询</el-button
      >
      <el-button type="primary" plain>新增</el-button>
    </div>
    <div class="table_box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="#" width="100"  type="index">
        </el-table-column>
        <el-table-column prop="number" label="机位编号" >
        </el-table-column>
        <el-table-column prop="state" label="机床状态" >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state === '忙碌' ? 'success' :'primary' "
              disable-transitions
              >{{ scope.row.state}}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="type" label="修车类型" >
        </el-table-column>
        <el-table-column prop="buildTime" label="建造时间" >
        </el-table-column>
        <el-table-column prop="address" label="废弃时间">
        </el-table-column>
      
        <el-table-column prop="Edate" label="入职日期" >
        </el-table-column>
      <el-table-column prop="" label="操作" >
        <el-row slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="primary"  plain @click="editUser(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="danger"  plain @click="deleteuser(scope.row)">删除</el-button>
        </el-row>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      findName: "",
      tableData: [],
    };
  },
  methods: {
   filterTag(value, row) {
        return row.department === value;
      },
    getData: function () {
      axios({
        url: "http://localhost:3000/placement",
        method: "post",
       
      }).then((data) => {
        // console.log(data);
        this.tableData = data.data;
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.top_box .el-input {
  width: 320px;
  float: left;
}
.top_box .el-button {
  float: left;
}
</style>
