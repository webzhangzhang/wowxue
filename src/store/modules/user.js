import { getToken } from '@/util/auth'
const state={
  token: getToken(),
  user: {},
  auth: {},
  obtUser: {},
}
const mutations={
  SET_TOKEN: (state, token) => {
    state.token = token
  },
}
export default {
  namespaced: true,
  state,
  mutations,
}
