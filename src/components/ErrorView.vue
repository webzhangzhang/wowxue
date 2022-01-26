<template>
  <section class="error-view">
    <section>
      <div class="error-image" :style="{backgroundImage: `url(${image})`}"/>
      <p @click="click()" class="return">回到首页 >></p>
      <p :style="{fontSize: 20, marginBottom: 0,}">页面加载出错，请刷新或联系客服</p>
    </section>
  </section>
</template>

<script>
import errorView from '@/assets/image/errorView.png'

export default {
  name: 'ErrorView',
  data() {
    return {
      image: errorView
    }
  },
  methods: {
    click() {
      this.$router.push({name: 'home'})
    }
  }
}
</script>

<style lang="less" scoped>
	.error-view {
		width: 100%;
		height: 770px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: #fff;
		p{
			font-size: 20px;
			color: #3e4c52!important
		}
		p.return{
			cursor: pointer;
			width: 120px;
			margin-left: 90px;
		}
		p.return:hover{
			color: #76caec!important;
		}
		.error-image {
			margin: 0 auto;
			background-size: contain;
			background-repeat: no-repeat;
			width: 160px;
			height: 130px;
			display: block;
			margin-left: 80px;
		}
	}
	
</style>
