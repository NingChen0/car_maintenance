// import router from '@/router/index'
// // import 'element-ui/lib/theme-chalk/index.css'
// // import '@fortawesome/fontawesome-free/css/all.min.css'
// // import NProgress from 'nprogress'
// // import 'nprogress/nprogress.css'
 
// // NProgress.configure({
// //   easing: 'ease', // 动画方式
// //   speed: 500, // 递增进度条的速度
// //   showSpinner: false, // 是否显示加载ico
// //   trickleSpeed: 200, // 自动递增间隔
// //   minimum: 0.3 // 初始化时的最小百分比
// // })
// // 白名单
// const whiteList = ['/login'] // no redirect whitelist
 
// // 导航守卫
// router.beforeEach((to, from, next) => {
// //   NProgress.start()
//   if (to.meta.requireAuth) {
//     // 判断该路由是否需要登录权限
//     if (localStorage.getItem('token') !== null) {
//       // 判断本地是否存在token
//       next()
//       // 这里是待会获取异步路由的地方
//     } else {
//       // 未登录,跳转到登陆页面
//       next({
//         path: '/login'
//       })
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       if (localStorage.getItem('token') !== null) {
//         // 判断本地是否存在token
//         next(`/?redirect=${to.path}`)
//       } else {
//         next(`/login?redirect=${to.path}`)
//       }
//     }
//   }
// })
 
// router.afterEach(() => {
//   // 在即将进入新的页面组件前，关闭掉进度条
// //   NProgress.done()
// })