<template>
  <div>
    <div>你好</div>
    <!-- 
        测试路由跳转（兄弟组建）
     -->
    <div @click="click()">点击跳转</div>
    <!-- 
        测试请求接口
     -->
    <el-button @click="testClickGet()">测试接口按钮GET</el-button>
    <el-button @click="testClickPost()">测试接口按钮POST(只传data参数)</el-button>
    <el-button @click="testClickPost1()">测试接口按钮POST(既要传data参数也要传params参数)</el-button>
    <!-- 
        父子路由加载
     -->
    <router-view></router-view>
  </div>
</template>
<script>

// import { testGet, testPost, testPost1 } from '@/api/test'

export default {
  name: 'Home2',
  data() {
    return {
            
    }
  },
  methods:{
    click() {
      this.$router.push({name:'routerChild'})
    },
    /**
         * 下面都是进行了模拟请求。用的时候解开注释和上面的接口引入，换上自己的参数和请求即可
         */
    testClickGet() {
      // let params = {examId: 42918, org: 2}
      // testGet(params).then(res => {
      //     console.log(res)
      // }).catch(err => {
      //     console.log(err)
      // })
      this.$message({
        type: 'success',
        message: '请求成功'
      })
    },
    testClickPost() {
      // let params = {examid: '43002-12180',grade: '高一',org: 2}
      // let data = {"fields":["total","manfen","manfenCount","zeroCount","max","min","reliability","standardDeviation","mean","sampleCorrelation","difficulty","discrimination","median","scoreRate","contrifactor","skewness"]}
      // testPost(params, data).then(res => {
      //     console.log(res)
      // }).catch(err => {
      //     console.log(err)
      // })
      this.$message({
        type: 'success',
        message: '请求成功'
      })
    },
    testClickPost1() {
      // let data = {overLk: true}
      // testPost1(data).then(res => {
      //     console.log(res)
      // }).catch(err => {
      //     console.log(err)
      // })
      this.$message({
        type: 'success',
        message: '请求成功'
      })
    }
  },
}
</script>
<style lang="less" scoped>
  
</style>
