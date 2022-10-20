<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入用户姓名" v-model="findName" clearable>
      </el-input>
      <el-button type="primary" style="margin: 0 0 0 15px" plain
        @click="findOrder">查询</el-button
      >
       <el-button type="primary" plain @click="CurrentChange(1)" v-show="flag"
        >重置</el-button
      >
    </div>
     <div class="table_box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="#" width="50" type="index">
        </el-table-column>
        <el-table-column prop="mainNum" label="订单编号">
        </el-table-column>

        <el-table-column prop="detail" label="维修详情" >
        </el-table-column>
        <el-table-column prop="sort" label="维修类别"> </el-table-column>

        <el-table-column prop="createTime" label="日期" >
        </el-table-column>
        <el-table-column prop="accuName" label="客户姓名" width="80" >
        </el-table-column>
           <el-table-column prop="serviceman" label="维修人员" width="80"> </el-table-column>
        <el-table-column prop="mainstate" label="维修状态" >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.mainstate === '维修中' ? 'warning' :'primary' "
              disable-transitions
              >{{ scope.row.mainstate}}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="price" label="维修价格" >
        </el-table-column>
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
              :type="scope.row.paystate === '已支付' ? 'success' :'primary' "
              disable-transitions
              >{{ scope.row.paystate}}</el-tag
            >
          </template>
        </el-table-column>
         <el-table-column prop="" label="操作" width="140">
        <el-row slot-scope="scope">
          <!-- 编辑 -->
        <el-dropdown trigger="hover"  :hide-on-click="false">
          <!-- 操作 -->
           <span style=" cursor: pointer; color: #409EFF">
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="orderingTO(scope.row)" >维修完成</el-dropdown-item>
            <el-dropdown-item @click.native="editOrdered(scope.row)" :disabled="scope.row.paystate ==='已支付' ? true :false ">完成支付</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <!-- 删除 -->
           <el-popconfirm title="确定取消吗？" @confirm="deleteordering(scope.row)">
              <el-button slot="reference"  type="text" style="margin-left:20px" >取消</el-button>
            </el-popconfirm>
          <!-- <el-button type="text"  style="margin-left:20px" @click="deleteordering(scope.row)">取消</el-button> -->
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
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { setTime } from "@/common/utils.js"
import axios from "axios";
export default {
  data() {
    return {
      flag:false,
      findName: "",
      tableData: [],
      tableData2: [],
       // 分页数据
      currentPage: 1,
      pagesize: 6,
      total: 0,
    };
  },
  methods: {
    //支付状态
     filterTag(value, row) {
        return row.paystate === value;
      },
    getData: function (val) {
      this.flag=false;
      let pageSize=this.pagesize;
      let pageNum=val? val:1;
      axios({
        url: "http://localhost:3000/order",
        method: "post",
        data: {
          mainflag: "维修中",
        },
      }).then((data) => {
        // console.log(data);
         //分页操作
        this.total=data.data.length;
        this.tableData2=data.data;
        this.tableData = data.data.slice(pageSize*(pageNum-1),pageSize*(pageNum-1)+pageSize);
      });
    },
    //维修完成
    orderingTO(data){
      let dataForm ={
        id:data.id,
        serviceman:data.serviceman,
        mainstate:"已完成",
         //取cookie中的用户名
        accuntName:Cookies.get('userName'),
        createTime:setTime()
      }
      axios({
            data:dataForm,
            method:"post",
            url:"http://localhost:3000/ordering/edit",

          }).then((res) =>{
            if(res.status == 200){
              this.$message({
                message:'维修完成',
                type:"success",
              });
              this.getData();
            }else{
              
              this.$message.error("失败")
            }
          });
        this.dialogVisible_2=false;

      },

 //维修中//订单支付完成
    editOrdered(data){
      let dataForm ={
        id:data.id,
        paystate:"已支付",
         //取cookie中的用户名
        accuntName:Cookies.get('userName'),
        createTime:setTime()
      }
      axios({
            data:dataForm,
            method:"post",
            url:"http://localhost:3000/ordered/edit",

          }).then((res) =>{
            if(res.status == 200){
              this.$message({
                message:'修改完成',
                type:"success",
              });
              this.getData();
            }else{
              
              this.$message.error("失败")
            }
          });
        this.dialogVisible_2=false;

      },
    //取消订单
          deleteordering(data){
                 let sendData=data;
                sendData.accuntName=Cookies.get('user'),
                sendData.createTime2=setTime()
              axios({
                data:sendData,
                method:"post",
                url:"http://localhost:3000/order/delete",
              }).then((res) =>{
                if(res.status == 200){
                  this.$message({
                    message:'取消成功',
                    type:"success",
                  });
                  this.getData();
                }else{
                  
                  this.$message.error("失败")
                }
              });
        },

    //查找用户
    findOrder:function() {
      this.flag=true;
      return this.tableData= this.tableData2.filter(item => {
        return item.accuName.includes(this.findName)
      });
    },
    //分页
      CurrentChange(val){
        console.log(`当前页: ${val}`);
        this.getData(val);
      },
      //分页结束
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
