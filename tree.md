vue-apps
├── config                不同环境基础路径配置
│   ├── beta.json
│   ├── development.json
│   ├── production.json
│   ├── sandbox.json
│   └── test.json
├── public                资源配置，入口文件等
│   ├── deflate.js
│   ├── favicon.png
│   ├── index.ejs
│   ├── z-worker.js
│   └── zipT.js
├── src
│   ├── App.vue
│   ├── api                 接口封装
│   │   ├── test.js
│   │   └── token.js
│   ├── assets              静态资源
│   │   ├── css
│   │   ├── files
│   │   ├── fonts
│   │   └── image
│   ├── components           公用组建
│   │   ├── EmptyData.vue
│   │   ├── ErrorView.vue
│   │   ├── Footer.vue
│   │   └── Tootip.vue
│   ├── feConfig              不同环境的一些配置，埋点，请求基础路径
│   │   ├── beta.js
│   │   ├── development.js
│   │   ├── production.js
│   │   ├── sandbox.js
│   │   └── test.js
│   ├── lib                   处理一些引入数据
│   │   ├── README-EXCEL.md
│   │   ├── index.js
│   │   ├── permission.js     处理出外部链接跳转到当前项目时的验证和token处理
│   │   └── xlsx.js
│   ├── router
│   │   ├── config.js
│   │   └── index.js
│   ├── store
│   │   ├── index.js
│   │   ├── modules
│   │   └── mutations.js
│   ├── util                    工具函数
│   │   ├── auth.js             权限相关存取token
│   │   ├── index.js
│   │   └── request.js          封装axios
│   ├── views
│   │   ├── demo                测试demo
│   │   └── test                测试模块
│   └── main.js
├── package-lock.json
├── package.json
├── pm2-beta.json
├── pm2-sandbox.json
├── pm2-test.json
├── pm2.json
├── tree1.md
├── vue.config.js
├── yarn-error.log
├── server.js
└── yarn.lock
