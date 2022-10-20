<template>
  <div class="box">
    <el-container style="height: 100%">
      <el-aside width="200px">
          <!-- 侧边栏导航菜单 -->
          <div class="SystemName">
            <img src="../assets/logo2.png" alt="" srcset="">
          </div>
          <el-menu
            default-active="worktable"
            class="el-menu-vertical-demo"
            router
            background-color="#fff"
            text-color="#000"
            active-text-color="#0095d9"
          >
          <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-monitor"></i>
                <span>首页</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="worktable">工作台</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="order">未处理订单</el-menu-item>
                <el-menu-item index="ordering">处理中理订单</el-menu-item>
                <el-menu-item index="ordered">已处理订单</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/employee">
              <i class="el-icon-menu"></i>
              <span slot="title">员工管理</span>
            </el-menu-item>
            <el-menu-item index="/users">
              <i class="el-icon-document"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <!-- <el-menu-item index="/placement">
              <i class="el-icon-c-scale-to-original"></i>
              <span slot="title">机位管理</span>
            </el-menu-item> -->
            <el-menu-item index="/parts">
              <i class="el-icon-cpu"></i>
              <span slot="title">零件管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 侧边栏导航菜单end -->
     
      <el-container>
         <!-- 顶部 -->
      <el-header>
        <el-row>
          <el-col :span="20"><div >
            <!-- 面包屑 -->
           <breadCrumb/>
            </div></el-col>
          <el-col :span="1">
            <!-- 账户 -->
            <account/>
          </el-col>
        
        </el-row>
      </el-header>
      <!-- 顶部end -->

        <!--主体展示部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script >
 import breadCrumb from '@/components/breadcrumb.vue'
import Account from '@/components/account.vue';


export default {
  
  methods: {},
  components:{
    breadCrumb,
    Account
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
.el-header {
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid #ccc;
  color: rgb(0, 0, 0);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: rgb(255, 255, 255);
  border-right: 1px solid #ccc;
  color: #333;
  width: 180px !important;
  text-align: left;
}
.SystemName img{
  width: 120px;
  height: 60px;
  padding-left:20px ;
}

.el-main {
  background-color: rgb(255, 255, 255);
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
.el-menu {
  height: 120px;
  width: 100%;
  border: none;
  
}
.el-submenu .el-menu-item{
  min-width: 150px !important;
}

body > .el-container {
  height: 100%;
}


</style>
