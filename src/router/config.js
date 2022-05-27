const authRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',  // 登录路由
    name: 'login',
    component: () => import ('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import ('@/views/home'),
    children: [
      // 激活码页面
      {
        path: '/activationCode',
        name: 'activationCode',
        component: () => import ('@/views/home/children/activationCode'),
      },
      // 用户列表
      {
        path: '/userManagement',
        name: 'userManagement',
        component: () => import ('@/views/home/children/userManagement'),
      },
      // 语音测评
      {
        path: '/aiCount',
        name: 'aiCount',
        component: () => import ('@/views/home/children/aiCount'),
      },
      // 目录管理
      {
        path: '/directory',
        name: 'directory',
        component: () => import ('@/views/home/children/directory'),
      }
    ]
  }
]

const baseRoutes = [
  {
    path: '*',  // 404路由
    name: 'NotFound',
    component: () => import ('@/components/ErrorView')
  }
]

const routes = authRoutes.concat(baseRoutes)
export default routes