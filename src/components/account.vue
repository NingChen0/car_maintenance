<template>
  <div class="account">
    <div class="box">
      <div class="box1">
        <!-- <img src="../assets/admin.jpg" alt="" srcset="" /> -->

        <el-tooltip
          class="item"
          effect="dark"
          content="点击更换头像"
          placement="left-end"
          ><el-upload
            class="tou_up"
            action="http://localhost:3000/adminImg"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="require(`@/assets/adminImg/` + this.imageUrl)"
              class="avatar"
              @click="adminImg"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <img :src="require(`@/assets/` + this.tou_img)" alt="" srcset="" class="touImg"/> -->
        </el-tooltip>
      </div>

      <div class="box2">
        <div class="name">你好, {{ name }}!</div>
        <div class="time">{{ date | formatDateTime }}</div>
      </div>
      <el-popover placement="bottom" width="200" trigger="click">
        <el-button type="primary" @click="editPost(true)">编辑</el-button>
        <a><el-button @click="logout" :plain="true"> 退出</el-button></a>
        <div class="el-icon-setting icon" slot="reference"></div>
      </el-popover>
    </div>
    <!-- //编辑账户弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <h3>编辑账户</h3>
      <el-form label-width="80px">
        <el-form-item label="账户名称">
          <el-input v-model="dataForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="原密码">
          <el-input v-model="dataForm.Oldpwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="dataForm.Newpwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ToeditPost">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "account",
  data() {
    return {
      id: "",
      dialogVisible: false,
      date: new Date(),
      name: "",
      tou_img: "",
      dataForm: {},
      imageUrl: "",
       headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
  },

  methods: {
    
    //获取账户信息
    getaccount:function(){
      let id = this.id;
        axios({
        url: "http://localhost:3000/getAccount",
        data: { id: id },
        method: "post",
      }).then((data) => {
        // this.dataForm = data.data[0];
        // console.log(data,"i");
        
      });
    },

    //修改头像
    adminImg:function () {
       let id = this.id;
       let imageUrl = this.imageUrl;
       var that=this;
        axios({
        url: "http://localhost:3000/adminImg",
        data: { id: id ,
                imageUrl:imageUrl
          },
        method: "post",
      }).then((data) => {
        // console.log(data);
        // console.log(this.imageUrl,"df的g");
          
      });
    },
    // 编辑请求
    editPost: function (flag) {
      this.dialogVisible = flag;
      let id = this.id;
      axios({
        url: "http://localhost:3000/reqAccount",
        data: { id: id },
        method: "post",
      }).then((data) => {
        this.dataForm = data.data[0];
        this.imageUrl=this.dataForm.tou_img
        // console.log(this.dataForm,"恒星");
        // console.log(this.imageUrl,"恒星2");
        
        // this.$refs.dataForm.resetFields();//清空表单

        // this.tableData = data.data;
      });
    },
    //确定提交请求
    ToeditPost: function () {
      let that = this;
      console.log(that.dataForm.Oldpwd);
      if (
        that.dataForm.Oldpwd == undefined ||
        that.dataForm.userName == undefined ||
        that.dataForm.Newpwd == undefined
      ) {
        return this.$message.error("请将表单填写完整");
      }
      this.dialogVisible = false;
      let Oldpwd = this.dataForm.Oldpwd;
      let password = this.dataForm.password;
      if (Oldpwd != password) {
        return this.$message.error("原密码错误");
      }
      // console.log(id);
      axios({
        url: "http://localhost:3000/editAccount",
        data: this.dataForm,
        method: "post",
      }).then((data) => {
        // this.dataForm=data.data[0];
        // console.log(this.data);
        this.logout();
        // this.$refs.dataForm.resetFields();//清空表单
        this.$message({
          message: "修改成功,请重新登录",
          type: "success",
        });
      });
    },
    //退出
    logout: function () {
      //清空token
      window.localStorage.removeItem("token");
      //跳转到登录页
      this.$router.push("/login");

      this.$message({
        message: "退出成功",
        type: "info",
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //图片
    handleAvatarSuccess(res, file) {
      setTimeout(() => {
      // console.log("上传成功");

        this.editPost(false);
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
  },
  filters: {
    formatDateTime(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    },
  },
  mounted() {
    var that = this;
    this.timer = setInterval(() => {
      that.date = new Date(); //修改数据date
    }, 1000);
    //取cookie
    that.name = Cookies.get("userName");
    // that.imageUrl = Cookies.get("tou_img");
    that.id = Cookies.get("id");
     setTimeout(() => {
        that.editPost(false);
      }, 1500);;

  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); //在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>

<style scoped>
img {
  height: 40px;
  width: 40px;
  border-radius: 5px;
}
.box {
  width: 200px;
  height: 60px !important;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.tou_up {
  background: rgb(255, 255, 255);
  width: 100%;
  border-radius: 19px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  margin-top: 28px;
}
.touImg:hover .tou_up {
  display: block;
}
.name {
  font-size: 15px;
  font-weight: 600;
  height: 20px;
  margin-top: -18px;
}
.time {
  font-size: 12px;
  height: 14px;
}
.box2,
.box1 {
  height: 40px !important;
  text-align: left;
}
.icon {
  transition: all 0.5s;
}
.icon:hover {
  transform: rotate(120deg);
}
.el-popper {
  width: 120px !important;
}
a {
  text-decoration: none;
  color: rgb(0, 0, 0);
  margin-left: 20px;
}
</style>
