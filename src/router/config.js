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
      {
        path: '/activationCode', // 激活码页面
        name: 'activationCode',
        component: () =>
        import ('@/views/home/children/activationCode'),
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