<template>
  <div class="table-page">
    <h3>测试table-view和分页</h3> 
    <table-view
      :table-data="data"
      :table-header="header"
      :name="'测试表格'"
      center
    ></table-view>  
    <wrapper-pagination
      :page-nos="currentPage"
      v-if="totel > pageSize"
      :total="totel"
      :size="pageSize"
      :fetch-data="nextPage"
    ></wrapper-pagination> 
  </div>
</template>
<script>

export default {
  name: 'AppPage',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totel:28,
      showTop: false,
      data: [
        {group: {index: 1, color: 'red'}, 
          name: '张三',
          'yw-qcks': 1,
          'yw-qcpm': 2,
          'yw-hcks': 9,
          'yw-hcpm': 7,
          'sx-qcks': 1,
          'sx-qcpm': 2,
          'sx-hcks': 5,
          'sx-hcpm': 1,
          'yu-qcks': 1,
          'yu-qcpm': 3,
          'yu-hcks': 6,
          'yu-hcpm': 4,
        },
        {group: '2', name: '李四','yw-qcks': 1,
          'yw-qcpm': 2,
          'yw-hcks': 9,
          'yw-hcpm': 7,
          'sx-qcks': 1,
          'sx-qcpm': 2,
          'sx-hcks': 5,
          'sx-hcpm': 1,
          'yu-qcks': 1,
          'yu-qcpm': 3,
          'yu-hcks': 6,
          'yu-hcpm': 4,},
        {group: '3', name: '王二麻子','yw-qcks': 1,
          'yw-qcpm': 2,
          'yw-hcks': 9,
          'yw-hcpm': 7,
          'sx-qcks': 1,
          'sx-qcpm': 2,
          'sx-hcks': 5,
          'sx-hcpm': 1,
          'yu-qcks': 1,
          'yu-qcpm': 3,
          'yu-hcks': 6,
          'yu-hcpm': 4,
        },
        {group: '4', name: '茅十八','yw-qcks': 1,
          'yw-qcpm': 2,
          'yw-hcks': 9,
          'yw-hcpm': 7,
          'sx-qcks': 1,
          'sx-qcpm': 2,
          'sx-hcks': 5,
          'sx-hcpm': 1,
          'yu-qcks': 1,
          'yu-qcpm': 3,
          'yu-hcks': 6,
          'yu-hcpm': 4,
        }
      ],
      header: [
        {prop: 'name', label: '名字',fixed:true},
        {label: '语文',childs:[
          {prop:'yw-qcks', label: '前次考试'},
          {prop:'yw-qcpm', label: '前次排名'},
          {prop:'yw-hcks', label: '后次考试'},
          {prop:'yw-hcpm', label: '后次排名'}
        ]},
        {label: '数学',childs:[
          {prop:'sx-qcks', label: '前次考试'},
          {prop:'sx-qcpm', label: '前次排名'},
          {prop:'sx-hcks', label: '后次考试'},
          {prop:'sx-hcpm', label: '后次排名'}
        ]},
        {label: '英语',childs:[
          {prop:'yu-qcks', label: '前次考试'},
          {prop:'yu-qcpm', label: '前次排名'},
          {prop:'yu-hcks', label: '后次考试'},
          {prop:'yu-hcpm', label: '后次排名'}
        ]},
      ]
    }
  },
  methods:{
    nextPage({page, pageSize}){
      this.currentPage = page
      this.pageSize = pageSize
      this.$message({
        message:'哈哈哈哈换页了',
        type: 'success'
      })
    }   
  },
}
</script>

<style lang="less" scoped>
  .table-page {
    width: 58%;
    text-align: center;
  }


</style>
