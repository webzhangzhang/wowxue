<template>
  <div>
    <el-table
      border
      center
      ref="table"
      :data="tableData"
      :header-cell-style="{background:'#F3F6FA',color:'#353B45'}"
    >
      <recursion-column 
        v-for="(item, index) in tableHeader"
        :key="`${item.prop}_${index}`"
        :item="item"/>
    </el-table>
  </div>
</template>

<script>
import RecursionColumn from './RecursionColumn.vue'
export default {
  name:'TableView',
  components: { RecursionColumn },
  props:{
    /**
      * * tableData为表格数据
       * tableHeader为表头数据
       * @tableHeader
       * prop 和tabledata一一对应的名称
       * label 表头显示的数据
       * minWidth 最大宽度
       * srot 是否支持排序，不传默认false
       * fixed 表头固定左边还是右边。left & right 不穿默认不固定
       * 存在多级表头的话，就给就加一个childs属性，传一个数组，数组中是小对象
      */
    tableHeader: [Object, Array],
    /**
      * @tableData
       * 里面参数可以所以传但是必须和表头的prop一一对应
       * 参数可以直接传，也可以传对象，
       * 直接传字符串的还，传的只就是显示的数据
       * 传对象的话可以传一下字段
       * {
       * index: '表示显示的数据',
       * color: '当前表格的颜色'
       * }
    */
    tableData: [Object, Array],
      
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less">
  .el-table__header th {
    padding: 0;
    height: 53px;
}
</style>