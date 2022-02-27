import {
  login,
  logout
  // getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/util/auth'
// import router, {
//   resetRouter
// } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}


const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      let param = new FormData()
      param.append('loginName', userInfo.loginName)
      param.append('loginPassword', userInfo.loginPassword)
      login(param).then(response => {
        const {
          Data
        } = response
        localStorage.setItem('loginInfo', JSON.stringify(Data))
        commit('SET_TOKEN', Data.AccessToken)
        commit('SET_NAME', Data.NickName)
        // commit('SET_AVATAR', Data.AvatarAddress)

        setToken(Data.AccessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // getInfo({
  //   commit,
  //   state
  // }) {
  //   return new Promise((resolve, reject) => {
      
  //   })
  // },

  // user logout



  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {

      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')

        commit('SET_ROLES', [])
        removeToken()
        // resetRouter()


        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {
          root: true
        })


        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // const {
    //   roles
    // } = await dispatch('getInfo')

    // resetRouter()

    // generate accessible routes map based on roles
    // const accessRoutes = await dispatch('permission/generateRoutes', roles, {
    //   root: true
    // })
    // dynamically add accessible routes
    // router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
