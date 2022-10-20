<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入零件名" v-model="findName" clearable>
      </el-input>
      <el-button
        type="primary"
        @click="findPart"
        style="margin: 0 0 0 15px"
        plain
        >查询</el-button
      >
      <el-button type="primary" plain @click="dialogVisible = true"
        >新增</el-button
      >
      <el-button type="primary" plain @click="CurrentChange(1)" v-show="flag"
        >重置</el-button
      >
    </div>
    <div class="table_box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="#" width="100" type="index">
        </el-table-column>
        <el-table-column prop="partNum" label="零件编号"> </el-table-column>
        <el-table-column prop="partName" label="零件名称"> </el-table-column>
        <el-table-column prop="purchasePrice" label="买入价格">
        </el-table-column>
        <el-table-column prop="salesPrice" label="出售价格"> </el-table-column>
        <el-table-column prop="Stock" label="库存"> </el-table-column>

        <el-table-column prop="imgurl" label="图片">
          <template slot-scope="scope">
            <img
              :src="require(`../assets/car_parts/` + scope.row.imgurl)"
              alt="图片"
              srcset=""
              style="width: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <el-row slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" plain @click="editPart(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
               <el-popconfirm title="确定取消吗？" @confirm="deletpart(scope.row)">
              <el-button slot="reference" plain type="danger" style="margin-left:10px" >删除</el-button>
            </el-popconfirm>
            <!-- <el-button type="danger" plain @click="deletpart(scope.row)"
              >删除</el-button -->
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
    <!-- 添加零件弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :model="dataForm"
        enctype="multipart/form-data"
      >
        <el-form-item label="零件编号" prop="partNum">
          <el-input auto-complete="off" v-model="dataForm.partNum"></el-input>
        </el-form-item>
        <el-form-item label="零件名称" prop="partName">
          <el-input auto-complete="off" v-model="dataForm.partName"></el-input>
        </el-form-item>
        <el-form-item label="买入价格" prop="purchasePrice">
          <el-input
            auto-complete="off"
            v-model="dataForm.purchasePrice"
          ></el-input>
        </el-form-item>
        <el-form-item prop="salesPrice" label="出售价格">
          <el-input
            auto-complete="off"
            v-model="dataForm.salesPrice"
          ></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="库存">
          <el-input auto-complete="off" v-model="dataForm.stock"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item prop="upload" label="上传图片">
          <el-upload
          action="http://localhost:3000/imgupload"
            list-type="picture-card"
            ref="pictureUpload"
            :headers="headers"
            :data="dataForm"
            @on-uploaded="onUploaded"
            @on-change="onChange"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <!-- 图标区域 -->
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <!-- 图片预览区域 -->
          <el-dialog :visible.sync="up_dialogVisible">
            <img width="100%" :src="dataForm.up_dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPart">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑零件弹框 -->
    <el-dialog
      title="编辑零件"
      :visible.sync="dialogVisible_2"
      width="550px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :model="editData"
      >
        <el-form-item label="零件编号" prop="partNum">
          <el-input auto-complete="off" v-model="editData.partNum"></el-input>
        </el-form-item>
        <el-form-item label="零件名称" prop="partName">
          <el-input auto-complete="off" v-model="editData.partName"></el-input>
        </el-form-item>
        <el-form-item label="买入价格" prop="purchasePrice">
          <el-input
            auto-complete="off"
            v-model="editData.purchasePrice"
          ></el-input>
        </el-form-item>
        <el-form-item prop="salesPrice" label="出售价格">
          <el-input
            auto-complete="off"
            v-model="editData.salesPrice"
          ></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="库存">
          <el-input auto-complete="off" v-model="editData.stock"></el-input>
        </el-form-item>
     
     
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_2 = false" style="width: 20%"
          >取 消</el-button
        >
        <el-button type="primary" @click="editPartpost()" style="width: 20%"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { setTime } from "@/common/utils.js"
import axios from "axios";
export default {
  data() {
    return {
      flag: false,
      findName: "",
      dialogVisible: false,
      dialogVisible_2: false,
      //上传
      up_dialogVisible: false,
      disabled: false,
      action_url: "http://localhost:3000/addPart/imgupload",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      //
      tableData: [],
      tableData2: [],
      dataForm: {
        file: "",
        partNum: "",
        partName: "",
        purchasePrice: "",
        salesPrice: "",
        stock: "",
        up_dialogImageUrl: "",
      },
      editData: {},
      // 分页数据
      currentPage: 1,
      pagesize: 6,
      total: 0,
    };
  },
  methods: {
    filterTag(value, row) {
      return row.department === value;
    },
    //获取全部数据
    getData: function (val) {
      this.currentPage=1;
      this.flag = false;
      let pageSize = this.pagesize;
      let pageNum = val ? val : 1;
      axios({
        url: "http://localhost:3000/parts",
        method: "post",
      }).then((data) => {
        // console.log(data);
        this.total = data.data.length;
        this.tableData2 = data.data;
        this.tableData = data.data.slice(
          pageSize * (pageNum - 1),
          pageSize * (pageNum - 1) + pageSize
        );
      });
    },
    //查找零件
    findPart: function () {
      this.flag = true;
      return (this.tableData = this.tableData2.filter((item) => {
        return item.partName.includes(this.findName);
      }));
    },

    //添加零件
    addPart() {
        if (this.dataForm.partName==""||this.dataForm.purchasePrice==""||this.dataForm.stock==""||this.dataForm.salesPrice==""||this.dataForm.partNum==""||this.dataForm.password=="") {
             return this.$message.error("请填将表单写完整");
       
      }
      // console.log(this.dataForm);
      //时间
      function settime(time = +new Date()) {
        var date = new Date(time + 8 * 3600 * 1000);
        return date.toJSON().substr(0, 19).replace("T", " ");
      }
      // 新建表单数据对象
      // let param=new FormData();
      // //获取上传添加的图片文件
      const file = this.$refs.pictureUpload.uploadFiles[0];
     
     for (let i = 0; i < this.tableData2.length; i++) {
       if (this.dataForm.partName==this.tableData2[i].partName) {
        return this.$message.error("该零件已存在！")
     }
       
     }
     
      //表单
      let formData = {
        partNum: this.dataForm.partNum,
        partName: this.dataForm.partName,
        purchasePrice: this.dataForm.purchasePrice,
        salesPrice: this.dataForm.salesPrice,
        stock: this.dataForm.stock,
        createtime: settime(),
         //取cookie中的用户名
        accuntName:Cookies.get('userName'),
        createTime2:setTime()
      };
      // const headerConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
      console.log(formData);
      axios({
         url:"http://localhost:3000/addPart",
         method:"post",
          data:formData
      }).then((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.dialogVisible = false;
          this.$refs.dataForm.resetFields(); //清空表单
          this.$refs.pictureUpload.clearFiles(); //清空上传图片
          this.getData();
        }
        // this.getData();
      });
    },
    // 图片上传部分
    //图片删除
    handleRemove(file) {
      // console.log(file);
      // 删除掉dom上的图片数组
      this.$refs.pictureUpload.uploadFiles = [];
      // this.infoFrom.out_img = '';
    },
    //预览
    handlePictureCardPreview(file) {
      this.up_dialogImageUrl = file.url;
      this.up_dialogVisible = true;
    },
    //图片下载
    handleDownload(file) {
      // console.log(file);
    },
    // 上传成功
    onUploaded(res) {
      this.fileList = res;
      console.log(this.fileList);
    },
    // 无论成功失败都会触发
    onChange(res) {
      let data = JSON.parse(res.data);
      if (data.code == 0) {
        console.log(data);
        uni.showToast({
          icon: "none",
          title: data.msg,
        });
      }
    },
    //图片上传部分结束
    
    // 编辑零件
    editPart(partData){
      console.log(partData);
      this.editData={
        id:partData.id,
        stock:partData.Stock,
        createTime:partData.createTime,
        imgurl:partData.imgurl,
        partName:partData.partName,
        partNum:partData.partNum,
        partcategoryId:partData.partcategoryId,
        purchasePrice:partData.purchasePrice,
        salesPrice:partData.salesPrice,
        //取cookie中的用户名
        accuntName:Cookies.get('userName'),
        createTime2:setTime()

      }
    
      this.dialogVisible_2=true;

    },
    //编辑请求
     editPartpost(){
      axios({
            data:this.editData,
            method:"post",
            url:"http://localhost:3000/parts/edit",

          }).then((res) =>{
            if(res.status == 200){
              this.$message({
                message:'修改成功',
                type:"success",
              });
              this.getData();
            }else{
              
              this.$message.error("失败")
            }
          });
        this.dialogVisible_2=false;

      },
    //删除零件
    deletpart(data) {
         let dataForm ={
            id:data.id,
            //取cookie中的用户名
            accuntName:Cookies.get('userName'),
            createTime2:setTime()
          }
        axios({
          data: dataForm,
          method: "post",
          url: "http://localhost:3000/part/delete",
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
    //分页
    CurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getData(val);
    },
    //分页结束
    //添加弹框关闭
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
.table_box img{
  height: 40px;
  width: 40px;
}
</style>
