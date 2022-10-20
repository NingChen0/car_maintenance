<template>
  <div class="home">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      menu-trigger="click"
      background-color="rgba(211, 145, 38,0.001)"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1" >
         <div @click="open(1)"  class="nav_t">
            订单管理
        </div>
      </el-menu-item>
      <el-menu-item index="2">
          <div @click="open(2)"  class="nav_t">
            员工管理
        </div></el-menu-item>
      <el-menu-item index="3"><div @click="open(3)" class="nav_t" >
            用户管理
        </div></el-menu-item>
      <el-menu-item index="4"><div @click="open(4)"  class="nav_t">
            机位管理
        </div></el-menu-item>
      <el-menu-item index="5"><div @click="open(5)"  class="nav_t">
            零件管理
        </div></el-menu-item>
      <el-menu-item index="6" class="right" style="margin-left:350px">账户
        </el-menu-item>
        <el-menu-item index="7" class="right"
        ><button><a href="/login">退出</a></button>
        </el-menu-item>
    </el-menu>
    <!-- //抽屉 -->
     <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" direction="ttb">
          <span>我来啦!</span>
    </el-drawer>
     <!-- 抽屉end -->
  </div>
</template>
<script>
import ziDrawer from '@/components/drawer.vue'
export default {
  
  data() {
    return {
    m:0,
     drawer: false,
    };
  },
  methods:{
      open:function(n) {
        //   console.log('点');
        //   console.log("n="+n);
        //   console.log("m="+this.m);
          if (this.m!=n) {
            this.drawer=true;
              
          }
          if (this.m==n) {
            this.drawer=false;
              return this.m=0;
          }
          this.m=n;
         
      }
  },
  components:{
      ziDrawer
  }
};
</script>

<style scoped>
.home {
  height: 100%;
  background: url("../assets/bmw.jpg") no-repeat;
  background-size: cover;
}
.el-menu {
  height: 13%;
  width: 75%;
  margin: 0 auto;
  font-weight: 600;
  z-index: 20000;
}
.el-menu--horizontal > .el-menu-item {
  height: 100%;
  padding-top: 2vh;
  font-size: 16px;
}

.el-menu-item:hover {
  background-color: #3cb2e458 !important;
}
.el-drawer__wrapper{
    top: 94px;
}

.el-drawer.ttb{
    width: 90%;
    margin: 0 auto;
    height: 80% !important;
}
.nav_t{
    height: 100%;
}
</style>
