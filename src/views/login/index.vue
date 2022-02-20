<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">机构管理系统</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          prefix-icon="el-icon-user"
          placeholder="手机号"
          name="mobile"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            prefix-icon="el-icon-lock"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
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
      otherQuery: {}
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
    // window.addEventListener('storage', this.afterQRScan)
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
    if (this.loginForm.mobile === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
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
          let data = {
            loginName: this.loginForm.mobile,
            loginPassword: this.loginForm.password
          }
          this.$store.dispatch('user/login', data)
            .then(() => {
              console.log(this.$store.state, 'SET_TOKEN')
              this.$router.push({ path:"/activationCode"})
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
.login-container {
  background-color: #2d3a4b;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .title {
    font-size: 26px;
    color: #eee;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: 700;
  }
}
.login-container /deep/ .el-input input {
    background: transparent;
    border-radius: 5px;
    padding: 12px 5px 12px 30px;
    color: #fff;
    height: 47px;
    caret-color: #fff;
}
/deep/ .el-button {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.login-container /deep/ .el-form-item {
  border: 1px solid hsla(0,0%,100%,.1);
  background: rgba(0,0,0,.1);
  border-radius: 5px;
  color: #2d3a4b;
}
/deep/ .el-icon-user {
  color: #fff;
}
</style>
