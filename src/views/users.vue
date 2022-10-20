<template>
  <div class="box">
    <div class="top_box">
      <el-input placeholder="请输入姓名" v-model="findName" clearable>
      </el-input>
      <el-button
        type="primary"
        style="margin: 0 0 0 15px"
        plain
        @click="findUser"
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
        <el-table-column prop="userName" label="姓名"> </el-table-column>
        <el-table-column prop="accountNum" label="账户名"> </el-table-column>
        <el-table-column prop="password" label="密码"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="carId" label="车牌号"> </el-table-column>
        <!-- <el-table-column prop="carImg" label="车辆图片"> </el-table-column> -->
        <el-table-column prop="carImg" label="车辆图片">
          <template slot-scope="scope">
            <img
              :src="require(`../assets/car_images/` + scope.row.carImg)"
              alt="图片"
              srcset=""
              style="width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="adress" label="地址"> </el-table-column>
        <el-table-column prop="" label="操作" width="180">
          <el-row slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" plain @click="editUser(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-popconfirm
              title="确定删除吗？"
              @confirm="deleteuser(scope.row)"
            >
              <el-button
                slot="reference"
                plain
                type="danger"
                style="margin-left: 10px"
                >删除</el-button
              >
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
    <!-- 添加用户弹框 -->
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
      >
        <el-form-item label="用户名" prop="name">
          <el-input auto-complete="off" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="account">
          <el-input
            auto-complete="off"
            v-model="dataForm.account"
            placeholder="数字或字母组合"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input auto-complete="off" v-model="dataForm.password"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio v-model="dataForm.sex" label="男">男</el-radio>
          <el-radio v-model="dataForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input auto-complete="off" v-model="dataForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="carId" label="车牌号">
          <el-input auto-complete="off" v-model="dataForm.carId"></el-input>
        </el-form-item>

        <el-form-item prop="adress" label="地址">
          <el-input auto-complete="off" v-model="dataForm.adress"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item prop="upload" label="上传图片">
          <el-upload
            action="http://localhost:3000/users/imgUpload"
            list-type="picture-card"
            ref="pictureUpload"
            :headers="headers"
            :data="dataForm"
            @on-uploaded="onUploaded"
            @on-change="handleChange"
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
        <el-button type="submit" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisible_2"
       width="500px"
    >
      <el-form
        ref="addRoleForm"
        label-position="right"
        label-width="100px"
        :model="editData"
      >
        <el-form-item label="姓名">
          <el-input auto-complete="off" v-model="editData.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="editData.sex" label="男">男</el-radio>
          <el-radio v-model="editData.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item prop="roleDesc" label="邮箱">
          <el-input auto-complete="off" v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="车牌号">
          <el-input auto-complete="off" v-model="editData.carId"></el-input>
        </el-form-item>

        <el-form-item prop="roleDesc" label="地址">
          <el-input auto-complete="off" v-model="editData.adress"></el-input>
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
      //图片上传
      //编辑用户图片（旧图片）
      carimageUrl:'',
      up_dialogVisible: false,
      disabled: false,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      uploadFile: [],
      dataForm: {
        name: "",
        sex: "",
        email: "",
        carId: "",
        carBrand: "",
        adress: "",
      },
      editData: {},
      // 分页数据
      currentPage: 1,
      pagesize: 8,
      total: 0,
    };
  },
  methods: {
    filterTag(value, row) {
      return row.department === value;
    },
    // 获取数据列表
    getData: function (val) {
      this.flag = false;
      let pageSize = this.pagesize;
      let pageNum = val ? val : 1;
      axios({
        url: "http://localhost:3000/users",
        method: "post",
      }).then((data) => {
        console.log(data.data);
        this.total = data.data.length;
        this.tableData2 = data.data;
        this.tableData = data.data.slice(
          pageSize * (pageNum - 1),
          pageSize * (pageNum - 1) + pageSize
        );
      });
    },

    //添加用户
    addUser: function () {
      if (this.dataForm.name==""||this.dataForm.sex==""||this.dataForm.email==""||this.dataForm.carId==""||this.dataForm.account==""||this.dataForm.password=="") {
             return this.$message.error("请填将表单写完整");
       
      }

      (this.dialogVisible = false),
        // console.log(this.dataForm);
        axios({
          url: "http://localhost:3000/users/add",
          data: this.dataForm,
          method: "post",
        }).then((data) => {
          console.log(data);
          if (data.status == 200) {
            if (data.data.meta == "用户名已被占用"||data.data.meta =="该车牌已被占用") {
             return this.$message.error(data.data.meta);
            }
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getData();
            this.$refs.dataForm.resetFields(); //清空表单
            this.$refs.pictureUpload.clearFiles(); //清空上传图片
          }

          // this.tableData = data.data;
        });
    },
    //查找用户
    findUser: function () {
      this.flag = true;
      return (this.tableData = this.tableData2.filter((item) => {
        return item.userName.includes(this.findName);
      }));
    },
    // 编辑用户
    editUser(userData) {
      console.log(userData);
      this.editData = {
        id: userData.id,
        userName: userData.userName,
        password: userData.password,
        mobile: userData.mobile,
        email: userData.email,
        carId: userData.carId,
        sex: userData.sex,
        carBrand: userData.carBrand,
        adress: userData.adress,
        carImg: userData.carImg,
      };
       this.carimageUrl=userData.carImg;
      this.dialogVisible_2 = true;
    },
    // 编辑请求
    editUserpost() {
      axios({
        data: this.editData,
        method: "post",
        url: "http://localhost:3000/users/edit",
      }).then((res) => {
        console.log(res);
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
    //删除用户
    deleteuser(data) {
      axios({
        data: data,
        method: "post",
        url: "http://localhost:3000/users/delete",
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

    // 图片上传部分
    handleChange(file) {
      console.log("236");
      if (file) {
        this.form.imageUrl = URL.createObjectURL(file.raw);
        console.log(file.raw);
        this.uploadFile.push(file.raw);
      }
    },

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
   //图片
    handleAvatarSuccess(res, file) {
      setTimeout(() => {
      // console.log("上传成功");
        let imageUrl = URL.createObjectURL(file.raw);
        console.log(imageUrl);
      }, 1000);
    
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
.avatar{
  width: 250px;
  height: 150px;
}
/* .formBox{
  width: 500px;
  height: 400px;
  position: fixed;
  background: rgb(247, 119, 119);
} */
</style>
