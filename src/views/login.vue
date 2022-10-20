<template>
  <div class="box">
    <el-carousel indicator-position="none" height="100%">
      <el-carousel-item v-for="(item, index) in imgUrl" :key="index">
        <h1 v-html="item.text"></h1>
        <img :src="item.src" alt="" srcset="" />
      </el-carousel-item>
    </el-carousel>
    <div class="outbox">
      <div class="Frombox">
        <!-- 正面 -->
        <el-form ref="formBox" :label-position="labelPosition">
          <h2>Log In</h2>
          <el-form-item label="名称">
            <el-input v-model="form.name" placeholder="User Name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="User Password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 200px" @click="login"
              >Log In</el-button
            >
          </el-form-item>
          <!-- <a class="newAc" href="#" @click="register">新用户创建账户</a> -->
        </el-form>
        <!-- 反面 -->
        <div class="register" style="color: red">
          <el-form ref="formBox" :label-position="labelPosition">
            <h2>Register</h2>
            <el-form-item label="名称">
              <el-input v-model="Rform.name" placeholder="User Name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="Rform.password"
                type="password"
                show-password
                placeholder="User Password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 200px" @click="login"
                >Log In</el-button
              >
            </el-form-item>
            <a class="newAc1" href="#" @click="register">新用户创建账户</a>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import Cookies from "js-cookie";
import { setTime } from "@/common/utils.js";

import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      labelPosition: "right",
      form: {
        username: "",
        password: "",
        createTime2: setTime(),
      },
      Rform:{},

      imgUrl: [
        {
          src: require("../assets/image/01.png"),
          text: "We are qualified &amp; <br> professional.",
        },
        {
          src: require("../assets/image/03.png"),
          text: "Honest Service For<br> You Car Care.",
        },
        {
          src: require("../assets/image/04.png"),
          text: "We are qualified &amp; <br> professional.",
        },
        {
          src: require("../assets/image/02.png"),
          text: "We are qualified &amp; <br> professional.",
        },
      ],
    };
  },
  methods: {
    login: function () {
      axios({
        url: "http://localhost:3000/login",
        method: "post",
        data: this.form,
      }).then((data) => {
        // console.log(data);
        if (data.status == 200) {
          // 存cookie
          Cookies.set("user", data.data.name, { path: "/" });
          Cookies.set("id", data.data.id, { path: "/" });
          Cookies.set("userName", data.data.userName, { path: "/" });
          Cookies.set("tou_img", data.data.tou_img, { path: "/" });
        if (data.data.accountFlag!="1") {
          return this.$message({
            showClose: true,
            message: "账号非法",
            type: "warning",
          });
        }
          //跳转
          this.$router.push("/index");
          //提示信息
          this.$message({
            showClose: true,
            message: "登录成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: "用户名或密码错误",
            type: "warning",
          });
        }
      });
    },
    register() {
      console.log("翻转");
    },
  },
};
</script>

<style scoped>
.outbox {
  perspective: 400px; /* 脱离平面屏幕束缚，元素离观察者眼睛的距离, 只能用在3d动画 */
  -webkit-perspective: 400px;
  width: 200px;
  height: 260px;
  position: absolute;
  top: 20vh;
  z-index: 5;
  left: 65vw;
}
.Frombox {
  transform-style: preserve-3d; /* 动画方式 3d */
  -webkit-transform-style: preserve-3d;
  transition: 1s ease-in-out; /* 运动速度，变速运动 */

  position: relative;
  margin: 100px auto;
  height: 200px;
  width: 200px;
}
.newAc:hover .Frombox{
  -webkit-transform: rotateY(0.5turn); /*  y轴 旋转180度 半圈 */
  transform: rotateY(0.5turn);
}
.register,
.el-form {
  backface-visibility: hidden; /* 隐藏背部元素 */
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;

  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
}
.register {
  transform: rotateY(0.5turn); /* 旋转到背部 */
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  border-radius: 10px;
  color: white;
  width: 400px;
  height: 360px;
  box-shadow: -1px 1px 10px 1px rgb(72, 72, 72);
}
.el-carousel,
.box {
  height: 100%;
}
.el-carousel__item {
  height: 100%;
}
.el-carousel__item h1 {
  position: absolute;
  top: 10vh;
  left: 10vw;
  z-index: 10;
  font-size: 66px;
  color: aliceblue;
}
img {
  width: 100%;
}
.box {
  position: relative;
}
.el-form {
  width: 400px;
  height: 360px;
  /* position: absolute; */
  /* top: 20vh; */
  z-index: 5;
  /* left: 65vw; */
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  border-radius: 10px;
  color: white;
  box-shadow: -1px 1px 10px 1px rgb(72, 72, 72);
}

.el-form h2 {
  color: black;
}
.el-form-item {
  width: 90%;
  margin-left: 20px;
}
.newAc {
  color: rgb(50, 83, 228);
  text-decoration: none;
  font-size: 13px;
}
.newAc:hover {
  color: brown;
}
</style>
