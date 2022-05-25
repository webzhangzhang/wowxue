<template>
  <div class="login-container">
    <el-container>
      <el-aside width="200px">
        <div class="asd-header">绘本管理系统</div>
        <el-menu
          router
          :default-active="defaultMenu"
          background-color="#304156"
          text-color="#fff"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item index="/activationCode" @click="getIndex()">
            <i class="el-icon-menu"></i>
            <span slot="title">激活码管理</span>
          </el-menu-item>
          <el-menu-item index="/userManagement" @click="getIndex()">
            <i class="el-icon-menu"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/userManagement" @click="getIndex()">
            <i class="el-icon-menu"></i>
            <span slot="title">语音测评</span>
          </el-menu-item>
          <el-menu-item index="/directory" @click="getIndex()">
            <i class="el-icon-menu"></i>
            <span slot="title">目录管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <el-popover
            placement="top"
            width="160"
            v-model="visible">
            <p>是否退出？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="reload">确定</el-button>
            </div>
            <div class="header-right" slot="reference">
              <div style="position: relative;">
                {{ nickName }}
              </div>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value=="") {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('The password can not be less than 3 digits'))
      } else {
        callback()
      }
    }
    return {
      defaultMenu: '/activationCode', // 默认打开的menu
      loginForm: {
        mobile: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      nickName: '', // 用户名
      visible: false // 是否显示退出按钮
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.nickName = JSON.parse(localStorage.getItem('loginInfo')).NickName
    var _this = this
    document.onkeydown = function(e) {   //按下回车提交
      console.log(e)
      let key = window.event.keyCode
      //事件中keycode=13为回车事件
      if (key == 13) {
        _this.handleLogin()
      }
    }
  },
  mounted() {
    // if (this.loginForm.mobile === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 获取点击的侧边栏index
    getIndex(index) {
      this.defaultMenu = index
    },
    reload() {
      this.$store.dispatch('user/logout')
      this.$router.replace({ path: '/login' })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 6 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              console.log(res)
              this.$router.push({ path:"/"})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
         
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.abs {
  position: absolute;
  top: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px 30px;
}
    /deep/ .el-aside {
        height: 100vh;
        background-color: #304156;
    }
    .header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: right;
      border-bottom: 1px solid #ccc;
      .header-right {
        display: flex;
        align-items: center;
        justify-content: right;
        width: 200px;
        height: 100%;
      }
    }
    .asd-header {
      height: 50px;
      background-color: #2b2f3a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
</style>
