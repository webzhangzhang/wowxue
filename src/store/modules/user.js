import {
  login,
  logout
} from '@/api/user'
import {
  getToken
  // setToken,
  // removeToken
} from '@/util/auth'

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
    const {
      mobile,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        mobile: mobile.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response

        localStorage.setItem('loginInfo', JSON.stringify(data))
        commit('SET_TOKEN', data.Token)
        commit('SET_NAME', data.Name)
        commit('SET_AVATAR', data.AvatarAddress)

        // setToken(data.Token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
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
        // removeToken()


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
      // removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
