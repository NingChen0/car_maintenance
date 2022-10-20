<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入员工姓名" v-model="findName" clearable>
      </el-input>
      <el-button
        type="primary"
        style="margin: 0 0 0 15px"
        plain
        @click="findUser"
        >查询</el-button
      >
      <el-button type="primary" plain @click="dialogVisible = true"
        >新增员工</el-button
      >
      <el-button type="primary" plain @click="CurrentChange(1)" v-show="flag"
        >重置</el-button
      >
    </div>
    <div class="table_box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="#" type="index"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="accountNum" label="账号"> </el-table-column>
        <el-table-column prop="password" label="密码"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>

        <el-table-column prop="birthday" label="出生年月"> </el-table-column>
        <el-table-column prop="address" label="地址" width="200"> </el-table-column>
        <el-table-column
          prop="department"
          label="部门"
          :filters="[
            { text: '维修部', value: '维修部' },
            { text: '采购部', value: '采购部' },
            { text: '市场部', value: '市场部' },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.department === '维修部' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.department }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="Edate" label="入职日期"> </el-table-column>
        <el-table-column prop="task" label="已分配订单"> </el-table-column>
        <el-table-column prop="" label="操作" width="200">
          <el-row slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" plain @click="editUser(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-popconfirm
              title="确定取消吗？"
              @confirm="deleteuser(scope.row)"
            >
              <el-button
                slot="reference"
                plain
                type="danger"
                style="margin-left: 20px"
                >删除</el-button
              >
            </el-popconfirm>
            <!-- <el-button type="danger"  plain @click="deleteuser(scope.row)">删除</el-button> -->
          </el-row>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block1">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="prev, pager, next,total"
          @current-change="CurrentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 添加员工弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :model="dataForm"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            auto-complete="off"
            v-model="dataForm.name"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountNum">
          <el-input
            auto-complete="off"
            v-model="dataForm.accountNum"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            auto-complete="off"
            v-model="dataForm.password"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="dataForm.sex" label="男">男</el-radio>
          <el-radio v-model="dataForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item prop="birthday" label="出生日期">
          <el-date-picker
            v-model="dataForm.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="address" label="地址">
          <el-input auto-complete="off" v-model="dataForm.address"></el-input>
        </el-form-item>
        <el-form-item prop="Edate" label="入职日期">
          <div class="block">
            <el-date-picker
              v-model="dataForm.Edate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="department" label="所属部门">
          <template>
            <el-select v-model="dataForm.department" placeholder="请选择">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmployee">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑员工弹框 -->
    <el-dialog
      title="编辑弹框"
      width="30%"
      :visible.sync="dialogVisible_2"
      style="line-height: 0; padding: 0"
    >
      <el-form
        ref="editDate"
        label-position="right"
        label-width="100px"
        :model="editData"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            auto-complete="off"
            v-model="editData.name"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountNum">
          <el-input
            auto-complete="off"
            v-model="editData.accountNum"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            auto-complete="off"
            v-model="editData.password"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="editData.sex" label="男">男</el-radio>
          <el-radio v-model="editData.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item prop="birthday" label="出生日期">
          <el-date-picker
            v-model="editData.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="address" label="地址">
          <el-input auto-complete="off" v-model="editData.address"></el-input>
        </el-form-item>
        <el-form-item prop="Edate" label="入职日期">
          <div class="block">
            <el-date-picker
              v-model="editData.Edate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="department" label="所属部门">
          <template>
            <el-select v-model="editData.department" placeholder="请选择">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_2 = false" style="width: 20%"
          >取 消</el-button
        >
        <el-button type="primary" @click="editUserpost()" style="width: 20%"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { setTime } from "@/common/utils.js";
import axios from "axios";
export default {
  data() {
    return {
      flag: false,
      findName: "",
      tableData: [],
      tableData2: [],
      dialogVisible: false,
      dialogVisible_2: false,
      editData: {},
      dataForm: {
        name: "",
      },
      //部门数据
      option: [],
      // 分页数据
      currentPage: 1,
      pagesize: 8,
      total: 0,
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        adress: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  methods: {
    filterTag(value, row) {
      return row.department === value;
    },
    getData: function (val) {
      this.flag = false;
      let pageSize = this.pagesize;
      let pageNum = val ? val : 1;
      axios({
        url: "http://localhost:3000/employee",
        method: "post",
      }).then((data) => {
        console.log(data);
        //分页操作
        this.total = data.data.length;
        this.tableData2 = data.data;
        this.tableData = data.data.slice(
          pageSize * (pageNum - 1),
          pageSize * (pageNum - 1) + pageSize
        );
      });
    },
    // 获取部门
    getDepartment() {
      axios({
        url: "http://localhost:3000/department",
        method: "post",
      }).then((data) => {
        // console.log(data);
        for (let i = 0; i < data.data.length; i++) {
          let obj = {
            value: data.data[i].department,
            label: data.data[i].department,
          };
          this.option.push(obj);
        }
      });
    },
    //添加员工
    addEmployee() {
      if (
        this.dataForm.name == "" ||
        this.dataForm.sex == "" ||
        this.dataForm.Edate == "" ||
        this.dataForm.address == "" ||
        this.dataForm.accountNum == "" ||
        this.dataForm.password == ""
      ) {
        return this.$message.error("请填将表单写完整");
      }
      (this.dialogVisible = false), (this.dataForm.createTime = setTime());
      this.dataForm.accuntName = Cookies.get("userName");
      console.log(this.dataForm);
      axios({
        url: "http://localhost:3000/addEmployee",
        data: this.dataForm,
        method: "post",
      }).then((data) => {
        this.getData();
        this.$refs.dataForm.resetFields(); //清空表单

        // this.tableData = data.data;
      });
    },
    // 编辑员工
    editUser(userData) {
      this.editData = {
        empid: userData.empid,
        id: userData.id,
        accountNum: userData.accountNum,
        password: userData.password,
        name: userData.name,
        sex: userData.sex,
        birthday: userData.birthday,
        address: userData.address,
        department: userData.department,
        Edate: userData.Edate,
        createTime: setTime(),
        accuntName: Cookies.get("userName"),
      };

      this.dialogVisible_2 = true;
    },
    // 编辑请求
    editUserpost() {
      axios({
        data: this.editData,
        method: "post",
        url: "http://localhost:3000/employee/edit",
      }).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getData();
        } else {
          this.$message.error("失败");
        }
      });
      this.dialogVisible_2 = false;
    },
    //删除员工
    deleteuser(data) {
      let sendData = {
        empid: data.empid,
        id: data.id,
        createTime: setTime(),
        accuntName: Cookies.get("userName"),
      };
      axios({
        data: sendData,
        method: "post",
        url: "http://localhost:3000/employee/delete",
      }).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getData();
        } else {
          this.$message.error("失败");
        }
      });
    },

    //查找用户
    findUser: function () {
      this.flag = true;
      return (this.tableData = this.tableData2.filter((item) => {
        return item.name.includes(this.findName);
      }));
    },
    //分页
    CurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getData(val);
    },
    //分页结束
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  mounted() {
    this.getData();
    this.getDepartment();
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
