import Vue from 'vue'
import VueRouter from 'vue-router'
import Shouye from '@/components/Shouye'
import Login from '@/components/Login'
import Regist from '@/components/Regist'
import Index from '@/components/Index'
import userManage from '@/components/userManage'
import billManage from '@/components/billManage'
import conferenceDetail from "@/components/conferenceDetail";
import conf_submit from "@/components/conf_submit";
import host_conf_list from "../components/host_conf_list";
import host_submit from "../components/host_submit";
import host from "../components/host";
import reviewerManager from "../components/reviewerManager";
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: '根',
    redirect: '/caiwu/login',
    component:Login,
    children:[
      {
        path: 'caiwu',
        name: '项目平台',
        redirect: '/caiwu/login',
      },{
        path: 'caiwu/login',
        name: '登录页',
        component:Login,

      },

    ]
  },
  {
    path: '/caiwu/Regist',
    name: 'Regist',
    component: Regist
  },
  {
    path: '/caiwu/Shouye',
    name: 'Shouye',
    component: Shouye,
    meta: {
      requireAuth: true
    },
  },
  {
    path: '/caiwu/management',
    name: '功能管理',
    component: Index,
    redirect:"/caiwu/management/userManage",
    icons: 'el-icon-menu',
    children: [
      {
        path: 'userManage',
        name: '用户管理',
        icons: 'el-icon-s-order',
        component: userManage,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'host_conf_list',
        name: '主持会议列表',
        icons: 'el-icon-s-order',
        component: host_conf_list,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'host_submit',
        name: '举办会议',
        icons: 'el-icon-key',
        component: host_submit,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'reviewerManager',
        name: '发票管理',
        icons: 'el-icon-key',
        component: reviewerManager,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'billManage',
        name: '发票管理',
        icons: 'el-icon-key',
        component: billManage,
        meta: {
          requireAuth: true
        },
      },
      {
        path: 'conferenceDetail',
        name:  '会议详情',
        component: conferenceDetail,
        meta: {
          requireAuth: true
        }
      },{
        path: 'conf_submit',
        name:  '投稿',
        component: conf_submit,
        meta: {
          requireAuth: true
        }
      }],
  },
  {
    path: '/caiwu/host',
    name: '主持人页面',
    component: host,
    redirect:"/caiwu/host/host_conf_list",
    icons: 'el-icon-menu'

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router


//还是在router.js中 我们这里就放在 export default router 的后面
router.beforeEach((to, from, next) => {
//登录拦截


  if(to.meta.requireAuth) {
    let isLogin = sessionStorage.getItem("UserIsLogin");
    // console.log("isLogin:"+isLogin);
    if (isLogin == 1) {
      next() //已登录则放行
    }else {
      // console.log("未登录，请登录！")
      next('/caiwu/login') //否则跳转到登录面
    }
  }
  else{//否则放行
    next()
  }
})
