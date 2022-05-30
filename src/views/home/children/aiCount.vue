<template>
  <div class="content">
    <!-- 顶部搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="inputContent" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="手机号" value="1"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <el-button class="reset" @click="resetData">清空</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      empty-text="-">
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="MobilePhone"
        label="账号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="EvaluationCount"
        label="次数">
      </el-table-column>
    </el-table>
    <!-- 列表分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      hide-on-single-page
      align="center"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { getMemberEvaluationList } from '@/api/activationCode'
export default {
  data() {
    return {
      inputContent: '', // 搜索输入的内容，暂时无用
      select: '1',
      tableData: [], // 列表数据
      page: 1, // 当前页
      limit: 10, // 页大小
      total: null, // 查看列表总页数
    }
  },
  created() {
    this.getList()
  },
  methods:{
    // 获取数据
    getList() {
      let params = {
        page: this.page,
        limit: this.limit
      }
      if (this.select === '1') {
        params.mobile = this.inputContent
      }
      getMemberEvaluationList(params).then(res => {
        if (res.StatusCode === '200') {
          this.tableData = res.Data.List
          this.total = res.Data.Count
        } else {
          this.$message.error(res.StatusMessage)
        }
      })
    },
    // 重置信息
    resetData() {
      this.inputContent = ''
      this.select = '1'
    },
    // 列表分页
    handleCurrentChange(val) {
      this.page = val
    },
  }
}
</script>
<style lang="less" scoped>
    .search {
        margin-bottom: 10px;
        width: 400px;
        display: flex;
        .reset {
          margin-left: 10px;
        }
        .el-select /deep/ .el-input {
            width: 100px;
        }
        .input-with-select /deep/ .el-input-group__prepend {
            background-color: #fff;
        }
    }
</style>
