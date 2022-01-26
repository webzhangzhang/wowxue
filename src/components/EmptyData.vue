<template>
  <div class="empty">
    <div style="height:100%">
      <div :style="{backgroundImage: `url(${image})`}"/>
      <p>暂时没有和您相关的数据</p>
    </div>
  </div>
</template>
<script>
import noData from '@/assets/image/noData.png'

export default {
  name: 'EmptyData',
  data() {
    return {
      image: noData
    }
  }
}
</script>
<style lang="less" scoped>

	.empty {
		background-color: #fff;
		width: 100%;
		height: 515px;
		display: flex;
		justify-content: center;
		align-items: center;
		& > div {
			div {
				display: block;
				width: 159px;
				height: 130px;
				margin: 0 auto;
				margin-bottom: 30px;
				margin-top: 100px;
				background-size: contain;
			}
			p {
				color: rgb(106, 106, 106);
				font-size: 18px;
				margin-bottom: 0;
			}
		}
	}
</style>
