<template>
  <div class="box">
    <el-row :gutter="20">
      <!-- 限制了循环条数4条 -->
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="card_top">
          <div class="carTop_img">
            <img :src="require(`../assets/icon/计费系统.png`)" class="image" />
          </div>
          <div class="box1">
            <span class="zi" style="color: red">
              <i class="el-icon-money"></i> ￥<countTo
                :startVal="startVal"
                :endVal="today_income"
                :duration="3000"
                style="display: inline"
              ></countTo>
            </span>
            <el-tag type="success">今日订单收入</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="card_top">
          <div class="carTop_img">
            <img
              :src="require(`../assets/icon/智能调度平台系统.png`)"
              class="image"
            />
          </div>
          <div class="box1">
            <span class="zi"
              ><i class="el-icon-s-claim"></i
              ><countTo
                :startVal="startVal"
                :endVal="today_order"
                :duration="3000"
                style="display: inline"
              ></countTo
            ></span>
            <el-tag>今日新增订单</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="card_top">
          <div class="carTop_img">
            <img
              :src="require(`../assets/icon/计费平台.png`)"
              class="image"
            />
          </div>
          <div class="box1">
            <span class="zi" style="color: red">
              <i class="el-icon-odometer"></i>￥<countTo
                :startVal="startVal"
                :endVal="month_income"
                :duration="3000"
                style="display: inline"
              ></countTo
            ></span>
            <el-tag type="warning">本月订单收入</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="card_top">
          <div class="carTop_img">
            <img
              :src="require(`../assets/icon/物流生产管理系统.png`)"
              class="image"
            />
          </div>
          <div class="box1">
            <span class="zi"
              ><i class="el-icon-success"></i
              ><countTo
                :startVal="startVal"
                :endVal="month_order"
                :duration="3000"
                style="display: inline"
              ></countTo
            ></span>
            <el-tag type="danger">本月订单量</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- //中间部分 -->
    <el-row :gutter="20" class="row_2">
      <el-col :span="6">
        <!-- //时间线 -->
        <el-card :body-style="{ padding: '0px' }" class="card_mid" >
          <div class="tab_title">时间线</div>
          <div class="box_mid" style=" overflow-y: scroll;padding-top:20px; ">
            <!-- <div id="echart_time" ref="echartTime"></div> -->
             <el-timeline reverse>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.timestamp"
                >
                 <em v-html=activity.content></em> 
                </el-timeline-item>
              </el-timeline>
          </div>
        </el-card>
      </el-col>
      <!-- 最近订单 -->
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="card_mid">
          <div class="tab_title">最近订单</div>
       
          
          <el-table :data="tableData2" stripe style="width: 100%">
            <el-table-column prop="createTime" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="accuName" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="mainNum" label="订单编号" width="150">
            </el-table-column>
            <el-table-column prop="detail" label="维修详情" width="130">
            </el-table-column>
            <el-table-column prop="mainstate" label="维修状态" width="120">
            </el-table-column>
            <el-table-column prop="price" label="价格"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="card_mid">
          <div class="tab_title">当月维修类别数据</div>
          <div class="box_mid">
            <div id="e_1" v-show="e_1Show" style="line-height:248px">订单数据不足...</div>
            <div id="echart_1" ref="chart1" v-show="!e_1Show"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- //底部折线 -->
    <el-row :gutter="20" class="row_2">
      <el-col :span="18">
        <el-card>
          <!-- 维修订单折线图 -->
          <div class="tab_title">每日订单数据</div>
          <div class="box_bot">
            <div id="echart_2" ref="chart2"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="tab_title">维修数据汇总</div>
          <!-- 当日维修数据 -->
          <div class="box_mid">
            <div id="echart_3" ref="chart3"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="copyright">@copyright by ccit zjh</div>
  </div>
</template>

<script>
//引入echart
import * as echarts from "echarts";
import axios from "axios";
//引入数字滚动组件
import countTo from "vue-count-to";

export default {
  data() {
    return {
      currentDate: new Date(),
      //测试数据
      tableData2: [],
      //顶部卡片展示‘
      startVal: 0,
      today_order: 0,
      today_income: 0,
      month_order: 0,
      month_income: 0,
      //当月维修分类数据展示判断
      e_1Show:true,
      //本周维修数据
      week_date: [],
      week_count: [],
      //本月维修分类数据
      month_sort: [],
      sort_data: [],
      //chart3所有维修分类数据
      All_sort: [],
      //时间线
      activities: []
    };
  },
  components: { countTo },
  mounted() {
    this.order1();
    this.getWeek();
    this.getToday();
    this.getMonth();
    this.getMonthSort();
    this.getSort();
    this.getTimeline();
  },
  updated() {
    // this.initEchart();
  },
  methods: {
    //获取订单数据
    order1: function () {
      axios({
        method: "POST",
        url: "http://localhost:3000/worktable",
      }).then((data) => {
        // console.log(data);
        this.tableData2 = data.data;

        setTimeout(this.initEchart, 0.5 * 1000);
      });
    },
    //获取时间线记录
    getTimeline(){
      axios({
        method:'post',
        url:'http://localhost:3000/timeline'
      }).then((data)=>{
          // console.log(data);
          let leng=data.data.length;
          data.data[leng-1].color='#0bbd87';
          this.activities=data.data.slice(-15);
      })
    },
    //获取今日数据
    getToday() {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/today",
      }).then((data) => {
        // console.log(data);
        this.today_order = data.data.length;
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].paystate == "已支付") {
            this.today_income += data.data[i].price;
          }
        }
        // this.tableData=data.data
      });
    },
    //获取本月数据
    getMonth() {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/month",
      }).then((data) => {
        // console.log(data,"本月");
        this.month_order = data.data.length;
        if (this.month_order>=3) {
          this.e_1Show=false;
        }
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].paystate == "已支付") {
            this.month_income += data.data[i].price;
          }
        }
        this.tableData=data.data
      });
    },
    //获取本月维修分类数据
    getMonthSort() {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/month/sort",
      }).then((data) => {
        // console.log(data,"本月分类");
        this.month_order=data.data.length;

        for (let i = 0; i < data.data.length; i++) {
          let obj = {
            name: data.data[i].sort,
            max: 10,
          };
          this.month_sort.push(obj);
          this.sort_data.push(data.data[i].sum);
        }
      });
    },
    //获取所有维修分类数据
    getSort() {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/sort",
      }).then((data) => {
        // console.log(data);
        this.All_sort = data.data;
      });
    },
    //获取本周数据
    getWeek() {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/week",
      }).then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          this.week_date.push(data.data[i].date);
          this.week_count.push(data.data[i].count);
        }
        // console.log(this.week_date);
        // console.log(this.week_count);
      });
    },
    initEchart: function () {
      let getchart_1 = echarts.init(this.$refs.chart1);
      let getchart_2 = echarts.init(this.$refs.chart2);
      let getchart_3 = echarts.init(this.$refs.chart3);
      // let getchart_4 = echarts.init(this.$refs.echartTime);
      //最近维修类别数据雷达图
      var option_1 = {
        tooltip: {
          trigger: "item",
          // config:ture
        },
        radar: {
          // shape: 'circle',
          splitNumber: 5,
          radius: 90, //圆的半径
          // indicator: [
          //   { name: "底盘减震", max: 10 },
          //   { name: "发动机冷却", max: 10 },
          //   { name: "启动点火", max: 10 },
          //   { name: "玻璃更换", max: 10 },
          //   { name: "蓄电池/电瓶", max: 10 },
          //   { name: "发动机渗油", max: 10 },
          //   { name: "汽车贴膜", max: 10 },
          //   { name: "大灯改装", max: 10 },
          //   { name: "车载电器", max: 10 },
          // ],
          indicator: this.month_sort,
          axisName: {
            color: "#fff",
            fontSize: "10px",
            backgroundColor: "#2ca9e1",
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        series: [
          {
            name: "维修类别",
            type: "radar",
            color: "skyblue",
            //数据
            data: [
              {
                // value: [40, 10, 20, 15],
                value: this.sort_data,
                areaStyle: {
                  color: "rgba(255, 228, 52, 0.6)",
                },
              },
            ],
            emphasis: {
              // 高亮时的样式
              lineStyle: {
                width: 5,
              },
              opacity: 1,
            },
          },
        ],
      };
      //每日订单数据
      let option_2 = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}单",
        },
          tooltip: {
            trigger: 'axis'
          },
        grid: {
          x: "50px",
          y: "30px",
          width: "90%",
          height: "80%",
        },
        xAxis: {
          type: "category",
          data: this.week_date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.week_count,
            type: "line",
          },
        ],
      };

      let option_3 = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "1%",
          left: "center",
        },
        series: [
          {
            name: "维修数据汇总",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "65%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "24",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.All_sort,
          },
        ],
      };
    

      getchart_1.setOption(option_1);
      getchart_2.setOption(option_2);
      getchart_3.setOption(option_3);
      
    },
  },
};
</script>

<style scoped>
.card_top {
  height: 150px;
  /* width: 300px; */
}
.el-card {
  border-radius: 15px;
  border: none;
  box-shadow: 0px 5px 6px 0px #ccc;
}
.box1 {
  width: 55%;
}
.box1 span {
  display: block;
  text-align: left;
  line-height: 25px;
  /* font-size: 24px; */
}
.zi {
  font-size: 30px;
}
.el-tag {
  height: 26px;
  line-height: 26px !important;
  margin-top: 15px;
}
.image {
  width: 100%;
  display: inline;
  /* float: right; */
  border-radius: 15px;
  /* box-shadow: 0px 2px 3px 1px #ccc; */
}
.carTop_img {
  width: 35%;
}
/* .carTop_img img{
  width: 120%;
  height: 135px;
} */
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.card_top:hover {
  transform: scale(1.03);
}
/* .card_mid {
  width: 300px;
  height: 288px;
} */
.row_2 {
  margin-top: 15px;
}
/* 时间线 */
.el-timeline-item{
  /* width: 89%; */
  text-align: left;
}
.tab_title {
  border-bottom: 1px solid #ccc;
  color: rgb(116, 113, 113);
  font-weight: 500;
  line-height: 36px;
  text-align: start;
  padding-left: 12px;
}
.el-table{
  height: 288px;
}
/* //mid雷达图 */
.box_mid,
.timeLine {
  width: 100%;
  height: 288px;
  box-sizing: border-box;
  /* margin: 10px 0; */
}
#echart_1,
#echart_2,
#echart_3,
#echart_time {
  width: 100%;
  height: 100%;
}
.box_bot {
  width: 100%;
  height: 288px;
}
.copyright {
  line-height: 36px;
}
</style>
