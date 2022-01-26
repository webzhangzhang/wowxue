<template>
  <div>
    sss
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
    }
  },
  methods:{
    click() {
      this.$router.push({name:'app'})
    }
  }
}
</script>
<style lang="less" scoped>
.content {
    width: 100%;
    height: 660px;
    padding-top: 110px;
    text-align: center;
    background: #fff;
    h1{
        color: #2c3e50;
        font-size: 54px;
        margin-top: 0;
    }
    p.welcome{
        color: #6a8bad;
        font-size: 28px;
    }
    p a{
        display: inline-block;
        padding: 13px 30px;
        padding-bottom: 25px;
        height: 31px;
        font-size: 30px;
        margin: 0 auto;
        color: #fff;
        background: #3eaf7c;
        text-decoration: none;
        border-radius: 5px;
        cursor: pointer;
    }

}
</style>
