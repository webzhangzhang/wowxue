<template>
  <div>
    <div>routerChild</div>
  </div>
</template>
<script>

export default {
  name: 'RouterChild',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      undoneEvents: {
        oneBlock: true,
        followerGroup: true,
        twoBlock: true,
        threeBlock: true,
        fourBlock: true,
        fiveBlock: true
      },
      showTop: false
    }
  },
}
</script>
<style lang="less" scoped>
  
</style>
