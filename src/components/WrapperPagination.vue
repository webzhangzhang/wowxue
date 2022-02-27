<!--组件模板-->
<template>
  <section class="wrapper-pagination">
    <slot name="prepend"/>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :page-sizes="[5,10,20,50]"
      :current-page="pageNos"
      :page-size="pageSize"
      :total="total"
    />
  </section>
</template>
<script>
// import { type } from 'os'
export default {
  props: {
    /**
     * 页面在调用这个回调的时候，一定要接收参数并且赋值给父组件里面页码数据
     * 详见@/view/demo/apppage.vue
     */
    fetchData: { // 换页触发
      type:Function,
    },
    total: { // 总计
      type: Number,
      default: 1
    },
    size: { // 一页几条数据
      type: Number,
      default: 10
    },
    paramsName: {
      type: [Number, Array],
      default: () => ['page', 'pageSize']
    },
    pageNos: { // 第几页 
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.pageSize = this.size
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.fetchPage()
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo
      this.fetchPage()
    },
    fetchPage() {
      const params = {}
      params[this.paramsName[0]] = this.pageNo
      params[this.paramsName[1]] = this.pageSize
      this.fetchData(params)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper-pagination {
	text-align: center;
	margin-top: 45px;
}

</style>
