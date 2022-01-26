# App-vue

```ss
# 安装依赖
npm install
# or
yarn install

# 启动开发
npm run start
# or
yarn start

# 打包测试
npm run build:test
# or
yarn build:test

# 打包生产
npm run build
# or
yarn build


```
### 主要依赖：
- [Vue](https://cn.vuejs.org/v2/guide/)：基本框架
- [vue-router](https://router.vuejs.org/zh/guide/)：页面路由
- [vuex](https://vuex.vuejs.org/zh/guide/)：全局状态、数据流管理
- [axios](http://www.axios-js.com/zh-cn/docs/): http 请求工具
- [@vue/cli](https://cli.vuejs.org/)：项目初始化，工程化封装（webpack，babel，eslint，less等）
- [js-cookie](https://github.com/js-cookie/js-cookie)：浏览器cookie操作
- [element-ui](http://element.eleme.io/#/zh-CN/component/installation)：组件库
- [file-saver](https://github.com/eligrey/FileSaver.js)：前端文件导出下载
- [ESLint](https://eslint.bootcss.com/): 代码校验工具

#### 代理服务依赖：
- express](https://github.com/expressjs/express)：基本框架
- [express-history-api-fallback](https://github.com/sebdeckers/express-history-api-fallback)：适配vue-router h5 history路由模式
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)：接口代理中间件

#### 开发
使用`vue-cli-service`启动`dev-server`，默认在[8080](localhost:8080)端口，具体配置可在GUI页面或`vue.config.js`中修改或配置。
```sh
yarn dev # 接口代理到本地，默认为localhost:3000
yarn dev-test # 接口代理到 test-fenxi.haofenshu.com
yarn dev-prod # 接口代理到 fenxi.haofenshu.com
# npm run dev / dev-test / dev-prod
```

### 项目结构
```sh
.
├── .editorconfig        # 统一ide配置以优化代码分割
├── vue.config.js        # @vue/cli 配置文件
├── public               # 根模板目录
│   ├── ...
│   └── index.html
├── assets               # 样式及图片资源
│   ├── image            # 图片资源
│   │   └── ...
│   └── css              # 全局css及自定义组件库样式文件
│   │   └── ...
├── src                  # 项目源文件
│   ├── App.vue          # vue根组件
│   ├── assets           # 资源及公共css文件
│   │   └── ...
│   ├── components       # 全局自定义组件
│   │   ├── index.js     # Components模块入口
│   │   └── ...
│   ├── util             # 工具函数模块
│   │   └── ...
│   ├── lib              # 功能代码库
│   │   ├── constant.js  # 常量
│   │   ├── index.js     # Lib模块入口
│   │   └── ...
│   ├── main.js          # 整体入口模块
│   ├── router.js        # 项目路由模块
│   ├── store            # 全局状态及数据流管理模块
│   │   ├── index.js     # vuex入口，导入modules及声明getters
│   │   ├── mutations.js # mutation方法常量名声明文件
│   │   ├── modules      # vuex模块目录，声明state、mutations、actions
│   │   │   └── ...
│   │   └── ...
│   └── views            # 页面模块
│       ├── Home.vue     # 主页面
│       └── ...
└── test                 # 测试相关文件
    └── ...
```
