import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Register from "@/components/Register";
import Users from "@/components/view/Users";
import Welcome from "@/components/Welcome";
import Book from "@/components/view/Book";
Vue.use(VueRouter)

const routes = [
  {path: "/", redirect: '/login'},
  {path: "/login", component:Login},
  {path: "/Home", component:Home,
    redirect: 'Welcome',
    children:[{path:'/Users', component:Users},
      {path:'/Welcome', component:Welcome},
      {path:'/1', component:Book},
      {path:'/2', component:Users}],
  },
  {path: "/Register", component:Register},
]


const router = new VueRouter({
  routes
})
//登入验证实现
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  if(to.path === '/Register') return next();
  const tokenstr = window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})
export default router
