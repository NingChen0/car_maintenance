import Vue from 'vue'
import VueRouter from 'vue-router'
//login
import Login from '../views/login.vue'
//主页
import Index from '../views/index.vue'
//工作台
import Worktable from '../views/worktable.vue'
// order
import Order from '../views/order/order.vue'
import Ordering from '../views/order/ordering.vue'
import Ordered from '../views/order/ordered.vue'
// 员工管理
import Employee from '../views/employee.vue'
// 用户管理
import Users from '../views/users.vue'
// 机位管理
import Placement from '../views/placement.vue'
// 机位管理
import Parts from '../views/parts.vue'
//备选主页
import Home from '../views/home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {title: '主页'}, 
    redirect:'/login'
  },
  {
    path:'/home',
    name:'home2',
    component:Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    meta: {title: '主页'}, 
    component: Index,
    redirect:'/worktable',
    children:[
      //工作台
      {
        path:'/worktable',
        name:'worktable',
        meta: {title: '首页 / 工作台'}, 
        component:Worktable
      },
      //订单
      {
        path: '/order',
        name: 'order',
        meta: {title: '订单管理 / 未处理订单'}, 
        component: Order
      },
      {
        path: '/ordering',
        name: 'ordering',
        meta: {title: '订单管理 / 正处理订单'}, 
        component: Ordering
      },
      {
        path: '/ordered',
        name: 'ordered',
        meta: {title: '订单管理 / 已完成订单'}, 

        component: Ordered
      },
      //员工管理
      {
          path: '/employee',
          name: 'employee',
        meta: {title: '员工管理'}, 
        component: Employee
      },
        //用户管理
        {
          path: '/users',
          name: 'users',
        meta: {title: '用户管理'}, 
        component: Users
      },
        //机位管理
        {
          path: '/placement',
          name: 'placement',
        meta: {title: '机位管理'}, 
        component: Placement
      },
        //零件管理
        {
          path: '/parts',
          name: 'parts',
        meta: {title: '零件管理'}, 
        component: Parts
      },
      
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
