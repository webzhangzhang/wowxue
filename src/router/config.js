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
        path: '/activationCode',
        name: 'activationCode',
        component: () =>
        import ('@/views/home/children/activationCode'),
      }
    ]
  },
  {
    path: '/demo',  // 测试测试路由加载和请求
    name: 'demo',
    component: () =>
    import ('@/views/demo/index'),
    children: [
      {
        path: '/demo', // 测试路由
        name: 'app',
        component: () =>
        import ('@/views/demo/apppage'),
      }
    ]
  },
  {
    path: '/routerChild',  // 测试路由
    name: 'routerChild',
    component: () => import ('@/views/demo/routerChild')
  },
  {
    path: '/nodata',  // 没有数据路由
    name: 'nodata',
    component: () => import ('@/components/EmptyData')
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