<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入用户姓名" v-model="findName" clearable>
      </el-input>
      <el-button
        type="primary"
        style="margin: 0 0 0 15px"
        plain
        @click="findUser"
        >查询</el-button
      >
      <el-button type="primary" plain @click="dialogVisible = true"
        >新增订单</el-button
      >
      <el-button type="primary" plain @click="CurrentChange(1)" v-show="flag"
        >重置</el-button
      >
    </div>

    <div class="table_box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="#" width="50" type="index">
        </el-table-column>
        <el-table-column prop="mainNum" label="订单编号"> </el-table-column>

        <el-table-column prop="detail" label="维修详情"> </el-table-column>
        <el-table-column prop="sort" label="维修类别"> </el-table-column>

        <el-table-column prop="createTime" label="日期"> </el-table-column>
        <el-table-column prop="accuName" label="客户姓名" width="80">
        </el-table-column>
        <el-table-column prop="serviceman" label="维修人员" width="80">
        </el-table-column>
        <el-table-column prop="mainstate" label="维修状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.mainstate === '已完成' ? 'danger' : 'danger'"
              disable-transitions
              >{{ scope.row.mainstate }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="price" label="维修价格"> </el-table-column>
        <el-table-column prop="part" label="使用配件"> </el-table-column>
        <el-table-column
          prop="paystate"
          label="支付状态"
          width="100"
          :filters="[
            { text: '已支付', value: '已支付' },
            { text: '未支付', value: '未支付' },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.paystate === '已支付' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.paystate }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <el-row slot-scope="scope">
            <!-- 编辑 -->
            <el-dropdown
              trigger="hover"
              :hide-on-click="false"
              style="margin-right: 2px"
            >
              <!-- 操作 -->
              <span style="cursor: pointer; color: #409eff">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="EditOrder(scope.row)"
                  >编辑订单</el-dropdown-item
                >
                <el-dropdown-item @click.native="editorderpost(scope.row)"
                  >出库</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 删除 -->
            <el-popconfirm
              title="确定取消吗？"
              @confirm="deleteorder(scope.row)"
            >
              <el-button slot="reference" type="text">取消订单</el-button>
            </el-popconfirm>
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

    <!-- 添加订单弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="450px"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :model="dataForm"
        :rules="rules"
      >
        <el-form-item label="车辆号牌" prop="mainNum">
          <el-input
            auto-complete="off"
            v-model="dataForm.car_id"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="维修类别" prop="detail">
          <template>
            <el-select v-model="dataForm.sort" placeholder="请选择">
              <el-option
                v-for="item in options5"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="维修详情" prop="detail">
          <el-input
            auto-complete="off"
            v-model="dataForm.detail"
            required
          ></el-input>
        </el-form-item>
        <el-form-item prop="accuName" label="用户名">
          <el-input
            auto-complete="off"
            v-model="dataForm.accuName"
            required
          ></el-input>
        </el-form-item>

        <el-form-item prop="part" label="使用零件">
          <template>
            <div class="block">
              <el-cascader
                :options="options4"
                :props="props"
                clearable
                v-model="dataForm.part"
              ></el-cascader>
            </div>
          </template>
        </el-form-item>
        <el-form-item prop="price" label="价格">
          <el-input auto-complete="off" v-model="dataForm.price"></el-input>
        </el-form-item>
        <el-form-item prop="paystate" label="支付状态">
          <!-- <el-input auto-complete="off" v-model="dataForm.paystate"></el-input> -->
          <template>
            <el-select v-model="dataForm.paystate" placeholder="请选择">
              <el-option
                v-for="item in [
                  { value: '已支付', label: '已支付' },
                  { value: '未支付', label: '未支付' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="serviceman" label="维修人员">
          <template>
            <el-select v-model="dataForm.serviceman" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑订单弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible_2"
      width="520px"
      :before-close="handleClose"
    >
      <el-form
        ref="editForm"
        label-position="right"
        label-width="100px"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item label="订单编号" prop="mainNum">
          <el-input
            auto-complete="off"
            v-model="editForm.mainNum"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆号牌" prop="mainNum">
          <el-input
            auto-complete="off"
            v-model="editForm.car_id"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="维修类别" prop="detail">
          <template>
            <el-select v-model="editForm.sort" placeholder="请选择">
              <el-option
                v-for="item in options5"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="维修详情" prop="detail">
          <el-input
            auto-complete="off"
            v-model="editForm.detail"
            required
          ></el-input>
        </el-form-item>
        <el-form-item prop="accuName" label="用户名">
          <el-input
            auto-complete="off"
            v-model="editForm.accuName"
            required
          ></el-input>
        </el-form-item>

        <el-form-item prop="part" label="使用零件">
          <template>
            <div class="block">
              <el-cascader
                :options="options4"
                :props="props"
                clearable
                v-model="editForm.part"
              ></el-cascader>
            </div>
          </template>
        </el-form-item>
        <el-form-item prop="price" label="价格">
          <el-input auto-complete="off" v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item prop="paystate" label="支付状态">
          <!-- <el-input auto-complete="off" v-model="dataForm.paystate"></el-input> -->
          <template>
            <el-select v-model="editForm.paystate" placeholder="请选择">
              <el-option
                v-for="item in [
                  { value: '已支付', label: '已支付' },
                  { value: '未支付', label: '未支付' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="serviceman" label="维修人员">
          <template>
            <el-select v-model="editForm.serviceman" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_2 = false">取 消</el-button>
        <el-button type="primary" @click="To_Order">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";
export default {
  data() {
    return {
      flag: false,
      findName: "",
      tableData: [],
      tableData2: [],
      //
      editForm: {},
      dialogVisible: false,
      //编辑弹框
      dialogVisible_2: false,
      //维修人员
      options: [],
      //零件
      options2: [],
      //用户名
      options3: [],
      //维修零件
      options4: [],
      //维修大类
      options5: [],
      props: { multiple: true },
      dataForm: {
        mainNum: "",
        detail: "",
        accuName: "",
        price: "",
        part: "",
        paystate: "",
        serviceman: "",
        createTime: "",
        sort: "",
      },
      editData: {},
      // 分页数据
      currentPage: 1,
      pagesize: 6,
      total: 0,
      rules: {},
    };
  },
  methods: {
    //支付状态
    filterTag(value, row) {
      return row.paystate === value;
    },
    //获取数据
    getData: function (val) {
      this.flag = false;
      let pageSize = this.pagesize;
      let pageNum = val ? val : 1;
      axios({
        url: "http://localhost:3000/order",
        method: "post",
        data: {
          mainflag: "配件出库中",
        },
      }).then((data) => {
        // console.log(data);
        //分页操作
        this.total = data.data.length;
        this.tableData2 = data.data;
        this.tableData = data.data.slice(
          pageSize * (pageNum - 1),
          pageSize * (pageNum - 1) + pageSize
        );
      });
    },
    //时间戳
    setTime: function (time = +new Date()) {
      let date = new Date(time + 8 * 3600 * 1000);
      return date.toJSON().substr(0, 19).replace("T", " ");
    },
    //添加订单
    addOrder: function () {
      if (
        this.dataForm.detail == "" ||
        this.dataForm.car_id == "" ||
        this.dataForm.accuName == "" ||
        this.dataForm.part == "" ||
        this.dataForm.price == "" ||
        this.dataForm.paystate == "" ||
        this.dataForm.serviceman == ""
      ) {
        return this.$message.error("请将表单填写完整！");
      }
      this.dialogVisible = false;
      let that = this;
      this.dataForm.createTime = this.setTime();
      let PartName = "";
      //取零件名
      // console.log(this.dataForm.part);
      for (let i = 0; i < this.dataForm.part.length; i++) {
        let Pname = this.dataForm.part[i].pop(); //去数组最后一个元素
        PartName = PartName + "、" + Pname;
      }
      // console.log(PartName);
      //存需要用到的零件名
      this.dataForm.part = PartName.slice(1);
      //取cookie中的用户名
      // this.dataForm.accuntName=Cookies.get('user');
      this.dataForm.accuntName = Cookies.get("userName");
      // console.log(this.dataForm);
      axios({
        url: "http://localhost:3000/order/add",
        data: this.dataForm,
        method: "post",
      }).then((data) => {
        that.getData();
        this.getEmployee();
        this.$refs.dataForm.resetFields(); //清空表单

        // this.tableData = data.data;
      });
    },

    //配件出库
    editorderpost(data) {
      let dataForm = {
        id: data.id,
        partName: data.part,
        mainstate: "维修中",
        //取cookie中的用户名
        accuntName: Cookies.get("userName"),
        createTime: this.setTime(),
      };
      //校验库存
      let Stock = "";
      //取零件名
      let partArr = dataForm.partName.split("、");
      for (let i = 0; i < partArr.length; i++) {
        for (let j = 0; j < this.options2.length; j++) {
          if (this.options2[j].partName == partArr[i]) {
            Stock = this.options2[j].Stock;
            if (Stock < 1) {
              return this.$message.error(
                "库存不足！当前" + partArr[i] + "库存" + Stock
              );
            }
          }
        }
      }

   
      axios({
            data:dataForm,
            method:"post",
            url:"http://localhost:3000/order/edit",

          }).then((res) =>{
            if(res.status == 200){
              this.$message({
                message:'出库成功',
                type:"success",
              });
              this.getData();
            }else{

              this.$message.error("失败")
            }
          });
    },
    //获取零件
    getParts: function () {
      axios({
        url: "http://localhost:3000/parts",
        method: "post",
      }).then((data) => {
        //存零件
        this.options2 = data.data;
      });
    },
    //获取维修类别
    getCar_sort: function () {
      axios({
        url: "http://localhost:3000/carSort",
        method: "post",
      }).then((data) => {
        // console.log(data);
        for (let i = 0; i < data.data.length; i++) {
          let obj = {
            value: data.data[i].sort,
            label: data.data[i].sort,
          };
          this.options5.push(obj);
        }
        // console.log(this.options5);
      });
    },
    //获取维修人员
    getEmployee: function () {
      axios({
        url: "http://localhost:3000/employee",
        method: "post",
      }).then((data) => {
        // console.log(data);
        this.options = [];
        for (let i = 0; i < data.data.length; i++) {
          let obj = {
            value: data.data[i].name,
            label:
              data.data[i].name +
              "(" +
              data.data[i].department +
              ")" +
              "已分配订单" +
              data.data[i].task,
            disabled: data.data[i].department == "维修部" ? false : true,
          };
          this.options.push(obj);
        }
        // console.log(this.options);
      });
    },
    //获取维修零件表
    getCar_serve: function () {
      axios({
        url: "../../static/car_options.json",
        method: "get",
      }).then((data) => {
        // console.log(data);

        this.options4 = data.data.options;
        // console.log(this.options);
      });
    },
    //获取用户姓名
    getUsers: function () {
      axios({
        url: "http://localhost:3000/users",
        method: "post",
      }).then((data) => {
        // console.log(data);
        for (let i = 0; i < data.data.length; i++) {
          let obj = {
            value: data.data[i].userName,
            label: data.data[i].userName,
          };
          this.options3.push(obj);
        }
        // console.log(this.options);
      });
    },
    //编辑订单
    EditOrder(data) {
      // console.log(data);
      this.editForm = {
        id: data.id,
        mainNum: data.mainNum,
        detail: data.detail,
        car_id: data.car_id,
        accuName: data.accuName,
        oldpart: data.part,
        part: data.part,
        price: data.price,
        paystate: data.paystate,
        serviceman: data.serviceman,
        old_serviceman: data.serviceman,
        createTime: data.createTime,
        sort: data.sort,
      };
      // console.log(this.editForm);
      this.dialogVisible_2 = true;
    },
    To_Order() {
      if (this.editForm.oldpart == this.editForm.part) {
        return this.$message.error("请将表单零件填写完整！");
      }
      (this.editForm.accuntName = Cookies.get("userName")),
        (this.editForm.createTime2 = this.setTime());
      let PartName = "";
      //取零件名
      // console.log(this.editForm.part);
      for (let i = 0; i < this.editForm.part.length; i++) {
        let Pname = this.editForm.part[i].pop(); //取数组最后一个元素
        PartName = PartName + "、" + Pname;
      }
      // console.log(PartName);
      // 存需要用到的零件名
      this.editForm.part = PartName.slice(1);
      axios({
        data: this.editForm,
        method: "post",
        url: "http://localhost:3000/order/toedit",
      }).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialogVisible_2 = false;
          this.getData();
          this.getEmployee();
        } else {
          this.$message.error("失败");
        }
      });
    },
    //取消订单
    deleteorder(data) {
      let sendData = data;
      (sendData.accuntName = Cookies.get("userName")),
        (sendData.createTime2 = this.setTime());
      axios({
        data: sendData,
        method: "post",
        url: "http://localhost:3000/order/delete",
      }).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "取消成功",
            type: "success",
          });
          this.getData();
          this.getEmployee();
        } else {
          this.$message.error("失败");
        }
      });
    },

    //查找用户
    findUser: function () {
      this.flag = true;
      return (this.tableData = this.tableData2.filter((item) => {
        return item.accuName.includes(this.findName);
      }));
    },
    //分页
    CurrentChange(val) {
      // console.log(`当前页: ${val}`);
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
    this.getParts();
    this.getEmployee();
    this.getUsers();
    this.getCar_serve();
    this.getCar_sort();
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
