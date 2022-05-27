<template>
  <div class="content">
    <!-- 顶部搜索 -->
    <div class="search">
      暂时没做，原因是接口需要两到三天可以出
      <el-input placeholder="请输入内容" v-model="inputContent" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="手机号" value="1"></el-option>
          <el-option label="昵称" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- 修改信息弹窗 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.NickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="form.Sex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.Age" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
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
export default {
  data() {
    return {
      inputContent: '',
      select: '1',
      tableData: [], // 列表数据
      gridData: [], // 查看权限的数据
      gridPage: 1, // 当前页
      gridTotal: 1, // 查看列表总页数
      gridLimit: 10, // 查看列表页大小
      dialogTableVisible: false, // 查看权限弹窗的显示隐藏
      dialogFormVisible: false, // 修改信息弹窗的显示隐藏
      formLabelWidth: '120px',
      form: {}, // 正在修改的信息数据
      page: 1, // 当前页
      limit: 10, // 页大小
      total: null // 用户总数，用于分页
    }
  },
  created() {
  },
  methods:{
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
        .el-select /deep/ .el-input {
            width: 100px;
        }
        .input-with-select /deep/ .el-input-group__prepend {
            background-color: #fff;
        }
    }
</style>
