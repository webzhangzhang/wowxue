<template>
  <div class="content">
    <!-- 顶部搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="inputContent" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="手机号" value="1"></el-option>
          <el-option label="昵称" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <el-button class="reset" @click="resetData">清空</el-button>
    </div>
    <!-- 中间表格 -->
    <el-table
      :data="tableData"
      border
      empty-text="-"
      style="width: 100; margin-bottom: 20px;">
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="MobilePhone"
        label="账号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="NickName"
        label="昵称">
      </el-table-column>
      <el-table-column
        align="center"
        label="性别">
        <template slot-scope="scope">
          <div>
            {{ scope.row.Sex === 0? '女' : scope.row.Sex === 1? '男' : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="Age"
        label="年龄">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showChangeDialog(scope.row)" type="text" size="small" >修改</el-button>
          <el-button @click="lookPermiss(scope.row.Id)" type="text" size="small">查看权限</el-button>
          <el-button @click="resetPassword(scope.row.Id)" type="text" size="small" >重置密码</el-button>
          <el-button @click="scope.row.IsEnable === false ? enable(scope.row.Id): disable(scope.row.Id)" :type="scope.row.IsEnable === true ? 'danger' : 'primary'">
            {{ scope.row.IsEnable === false? '启用': '禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改信息弹窗 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.NickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="form.Sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.Age" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDataChange">取 消</el-button>
        <el-button type="primary" @click="changeUserMessage">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看权限弹窗 -->
    <el-dialog title="查看权限" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="CodeNumber" label="激活码"></el-table-column>
        <el-table-column property="CreateDate" label="激活时间"></el-table-column>
        <el-table-column property="ExperiationDate" label="使用有效期"></el-table-column>
        <el-table-column property="EquipmentNumber" label="设备信息"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        align="center"
        @current-change="CurrentChange"
        :total="total">
      </el-pagination>
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
import {
  getMemberList,
  postMemberUpdate,
  MemberEnable,
  MemberDisable,
  MemberViewPermissions,
  MemberViewResetPassword
} from '@/api/activationCode'
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
      total: null, // 用户总数，用于分页
      options: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      value: ''
    }
  },
  created() {
    this.getList()
  },
  methods:{
    // 获取用户列表 // 搜索也是这个方法
    getList() {
      let params = {
        page: this.page,
        limit: this.limit
      }
      if (this.select === '1') {
        params.mobile = this.inputContent
      }
      if (this.select === '2') {
        params.nickName = this.inputContent
      }
      getMemberList(params).then(res => {
        res.Data.List.forEach(item => {
          if (item.Sex === 0) {
            item.Sex = 0
          } else if (item.Sex === 1) {
            item.Sex = 1
          } else {
            item.Sex = 3
          }
        })
        this.tableData = res.Data.List
        this.total = res.Data.Count
      })
    },
    // 显示修改弹窗
    showChangeDialog(row) {
      let deepCopy = {...row}
      this.form = deepCopy
      this.form.Sex? this.form.Sex = '男' : this.form.Sex = '女'
      this.dialogFormVisible = true
    },
    // 修改信息
    changeUserMessage() {
      let params = {
        id: this.form.Id,
        guid: this.form.Guid,
        realName: this.form.RealName,
        nickName: this.form.NickName,
        mobilePhone: this.form.MobilePhone,
        age: +this.form.Age
      }
      if (this.form.Sex === '女' || this.form.Sex === '0') {
        params.sex = 0
      } else {
        params.sex = 1
      }
      if (params.age < 0) {
        this.$message.info('年龄不能小于0')
      } else if (params.age > 150) {
        this.$message.info('年龄不能大于150')
      } else{
        postMemberUpdate(params).then(res => {
          if (res.StatusCode === '200') {
            this.$message.success('成功')
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error('失败')
          }
        })
      }
    },
    // 启用
    enable(id) {
      let data = new FormData()
      data.append('id', id)
      MemberEnable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('成功')
          this.getList()
        } else {
          this.$message.error('失败')
        }
      })
    },
    // 禁用
    disable(id) {
      let data = new FormData()
      data.append('id', id)
      MemberDisable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('成功')
          this.getList()
        } else {
          this.$message.error('失败')
        }
      })
    },
    // 查看权限
    lookPermiss(id) {
      let data = {
        memberId: id,
        page: this.gridPage,
        limit: 10
      }
      MemberViewPermissions(data).then(res => {
        if (res.StatusCode === '200') {
          this.dialogTableVisible = true
          res.Data.List.forEach(item => {
            item.CreateDate = moment(item.CreateDate).format('YYYY/MM/DD hh:mm:ss')
            item.ExperiationDate = moment(item.ExperiationDate).format('YYYY/MM/DD hh:mm:ss')
          })
          this.gridData = res.Data.List
          this.gridTotal = res.Data.Count
        }
      })
    },
    // 重置密码
    resetPassword(id) {
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = new FormData()
        data.append('id', id)
        MemberViewResetPassword(data).then(res => {
          if (res.StatusCode === '200') {
            this.$message.success('重置成功')
          }
        })
      })
    },
    // 列表分页
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    // 查看权限分页
    CurrentChange(val) {
      this.gridData = val
      this.lookPermiss()
    },
    // 取消修改
    resetDataChange() {
      this.dialogFormVisible = false
      this.form = {}
    },
    // 重置信息
    resetData() {
      this.inputContent = ''
      this.select = '1'
      this.getList()
    }
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
