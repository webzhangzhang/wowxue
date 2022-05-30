<template>
  <div class="con">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="clickAdd">生成激活码</el-button>
    <!-- 激活码批次列表 -->
    <el-table
      :data="tableData"
      border
      empty-text="-"
      style="width: 100; margin-bottom: 20px;">
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="Id"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="BatchName"
        label="激活码名称"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        label="激活有效期"
        width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.StartDate }} -
            <div>{{ scope.row.EndDate }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="ValidDays"
        label="使用有效期"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="CodeCount"
        label="数量"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
        width="300">
        <template slot-scope="scope">
          <div>
            {{ scope.row.Remark ? scope.row.Remark : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="lookActivationCodeList(scope.row.Id)" type="text" size="small" >查看列表</el-button>
          <el-button @click="exportExcel(scope.row.Id)" type="text" size="small" class="down">批量导出</el-button>
          <el-button @click="lookPermiss(scope.row)" type="text" size="small">查看权限</el-button>
          <el-button @click="delActivationBatch(scope.row.Id)" type="text" size="small" class="del">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="isShow"
      align="center"
      @current-change="codeCurrentChange"
      :total="codeTotal">
    </el-pagination>
    <!-- 生成激活码弹窗 -->
    <el-dialog title="生成激活码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="激活码名称" :label-width="formLabelWidth">
          <el-input v-model="form.batchName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="激活有效期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对应权限" :label-width="formLabelWidth" class="cata">
          <el-button @click="showMulu">选择目录</el-button>
          <div v-if="cateNameShow">
            <span v-for="item in catalogNames" :key="item" class="cataName">{{ item }}</span>
          </div>
        </el-form-item>
        <el-form-item label="使用有效期" :label-width="formLabelWidth">
          <div class="use">
            <el-input class="usetime" v-model="form.validDays" autocomplete="off" type="number" width="100px"></el-input>
            <span class="usetimetip">使用有效期不得超过三年</span>
          </div>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input class="usetime" v-model="form.codeCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="activationAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 目录 -->
    <el-dialog title="选择目录" :visible.sync="CatelogDialog" width="400px" class="muluTree">
      <el-tree
        :data="menuData"
        show-checkbox
        :expand-on-click-node="false"
        node-key="Id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        check-on-click-node
        :default-checked-keys="CatelogIds"
        @check="getId">
      </el-tree>
      <div style="text-align:right;" v-if="showSureBtn">
        <el-button type="primary" @click="checksSave">确定</el-button>
        <el-button type="" @click="resetChecked">重置</el-button>
      </div>
    </el-dialog>
    <!-- 查看列表弹窗 -->
    <el-dialog title="查看列表" :visible.sync="dialogLookVisible" width="1000px">
      <el-table :data="activationCodeList">
        <el-table-column property="Id" label="序号" width="50"></el-table-column>
        <el-table-column property="Guid" label="激活码" width="200"></el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ scope.row.Status === 0 ? '未激活': scope.row.status === 1 ? '已激活' : '已失效' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="UsedId" label="使用人" width="100"></el-table-column>
        <el-table-column label="激活时间" property="ActivationDate"></el-table-column>
        <el-table-column label="使用有效期">
          <template slot-scope="scope">
            <div>
              {{ scope.row.StartDate }} -
              <div>{{ scope.row.EndDate }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="scope.row.IsEnable === false ? enable(scope.row.Id): disable(scope.row.Id)" :type="scope.row.IsEnable === true ? 'danger' : 'primary'">
              {{ scope.row.IsEnable === false? '启用': '禁用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :hide-on-single-page="isShow"
        align="center"
        @current-change="handleCurrentChange"
        :total="activationTotal">
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script>
// import elTree from '@/components/treeElement'
import { debounce } from '@/util/common'
// import moment from 'moment'
// moment.locale('zh-cn')
import {
  getActivationBatchList,
  activationCodeExport,
  getActivationCodeList,
  activationCodeEnable,
  activationCodeDisable,
  deleteActivationBatch,
  activationBatchEnable,
  activationBatchDisable,
  activationBatchAdd,
  getCatalogClassificationListTree
} from '@/api/activationCode'
export default {
  name: 'Home',
  // components: { elTree },
  data() {
    return {
      isShow: true,
      cateNameShow: false, // 选择的目录名称是否显示，有则显示，没有则隐藏
      menuData: [],
      defaultProps: {
        label:'CatalogName', // 作为对应节点的名字显示
        children:'Children' // 指定子树为节点对象的某个属性值
      },
      codeTotal: null, // 激活码列表总量
      activationTotal: null, // 查看列表总数
      dialogFormVisible: false, // 生成激活码弹窗
      dialogLookVisible: false, // 查看列表弹窗
      activationCodeList: [{ // 查看列表
        Id: null,
        Guid: '',
        Status: null, // 0-未激活，1-已激活，2-已失效
        UsedId: null, // 使用人编号
        ActivationDate: null, // 激活时间
        StartDate: null,
        EndDate: null,
        IsEnable: null, // 0-禁用，1-启用
      }],
      formLabelWidth: '120px',
      CatelogDialog: false, // 选择权限
      value1: '', // 激活有效期
      value2: '', // 使用有效期
      tableData: [{ // 激活码批次列表
        Id: 1,
        BatchName: '',
        StartDate: null,
        EndDate: null,
        ValidDays: null,
        CodeCount: null,
        Remark: ''
      }],
      form: {
        batchName: '',
        validDays: null,
        codeCount: null,
        catalogIds: '',
        catalogNames: '',
        remark: ''
      },
      catalogNames: [], // 选择目录的数组
      CatelogIds: [], // 已经选择的目录，用于回显
      showSureBtn: true, // 查看权限隐藏确定按钮
      lookListPage: 1,
      currentLookId: null,
      lookListCodePage:1,
      ispost: true // 是否发送请求，默认可以发送
    }
  },
  created() {
    this.getActivationBatch()
    this.getCategory()
  },
  methods:{
    // 获取全部目录数据
    getCategory(){
      getCatalogClassificationListTree().then(res => {
        if (res.StatusCode === '200') {
          this.menuData = res.Data
        } else {
          this.$message.error(res.StatusMessage)
        }
      })
    },
    // 点击生成激活码按钮
    clickAdd() {
      this.dialogFormVisible = true
      this.catalogNames = []
      this.CatelogIds = []
      this.form = {
        batchName: '',
        validDays: null,
        codeCount: null,
        catalogIds: '',
        catalogNames: '',
        remark: ''
      }
    },
    // 点击选择目录，显示目录弹窗
    showMulu() {
      this.CatelogDialog = true
      this.showSureBtn = true
      this.catalogNames = []
      this.CatelogIds = []
    },
    // 点击复选框
    getId(val, num) {
      this.CatelogIds = num.checkedKeys
      this.catalogNames = []
      for (let index = 0; index < num.checkedNodes.length; index++) {    
        this.catalogNames.push(num.checkedNodes[index].CatalogName)
      }
    },
    // 重置目录选中状态
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
      this.catalogNames = []
      this.CatelogIds = []
    },
    // 生成激活码
    activationAdd : debounce(function() {
      // let names = ''
      // this.catalogNames.forEach((item, index) => {
      //   if (index !== 0) {
      //     names = names + ',' + item
      //   } else {
      //     names = item.name
      //   }
      // })
      if (+this.form.validDays > 1095) {
        this.$message.info('使用有效期不得超过3年')
      } else {
        let data = {
          batchName: this.form.batchName,
          startDate: moment(this.value1[0]).format(),
          endDate: moment(this.value1[1]).format(),
          validDays: +this.form.validDays,
          codeCount: +this.form.codeCount,
          catalogIds: this.CatelogIds.toString(),
          catalogNames: this.catalogNames.toString(),
          remark: this.form.remark
        }
        activationBatchAdd(data).then(res => {
          if (res.StatusCode === '200') {
            this.$message.success('添加成功')
            this.dialogFormVisible = false
            this.getActivationBatch()
            this.initData()
          } else {
            this.$message.error('添加失败，请联系管理员')
          }
        })
      }
    }),
    // 获取激活码批次
    getActivationBatch() {
      let params = {
        page: this.lookListCodePage,
        limit: 10
      }
      getActivationBatchList(params).then(res => {
        if (res.StatusCode === '200') {
          res.Data.List.forEach(item => {
            item.StartDate = moment(item.StartDate)._i.replace('T', ' ')
            item.EndDate = moment(item.EndDate)._i.replace('T', ' ')
          })
          this.tableData = res.Data.List
          this.codeTotal = res.Data.Count
          if (this.tableData.length > 10) {
            this.isShow = false
          }
        }
      })
    },
    // 查看权限
    lookPermiss(data) {
      this.CatelogIds = []
      this.showSureBtn = false
      let that = this
      this.$nextTick(() => {
        that.$refs.tree.setCheckedKeys([])
        that.CatelogIds = data.CatalogIds.split(',')
      })
      this.CatelogDialog = true
    },
    // 删除激活码批次
    delActivationBatch(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteActivationBatch(id).then(res => {
          if (res.StatusCode === '200') {
            this.$message.success('删除成功')
            this.getActivationBatch()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })          
      })
    },
    // 激活码批次启用
    activationBatchListEnable(id) {
      activationBatchEnable(id).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('启用成功')
        }
      })
    },
    // 激活码批次禁用
    activationBatchListDisable(id) {
      activationBatchDisable(id).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('禁用成功')
        }
      })
    },
    // 查看列表
    lookActivationCodeList(id) {
      this.currentLookId = id
      let params = {
        page: this.lookListPage,
        limit: 10,
        batchid: this.currentLookId
      }
      getActivationCodeList(params).then(res => {
        if (res.StatusCode === '200') {
          res.Data.List.forEach(item => {
            item.StartDate = moment(item.StartDate).format('YYYY/MM/DD hh:mm:ss')
            item.EndDate = moment(item.EndDate).format('YYYY/MM/DD hh:mm:ss')
            item.ActivationDate = item.ActivationDate? moment(item.ActivationDate).format('YYYY/MM/DD hh:mm:ss') : '-'
          })
          this.activationCodeList = res.Data.List
          this.activationTotal = res.Data.Count
          this.dialogLookVisible = true
        }
      })
    },
    // 激活码启用
    enable(id) {
      let data = new FormData()
      data.append('id', id)
      activationCodeEnable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('成功')
          this.lookActivationCodeList(this.currentLookId)
        } else {
          this.$message.error('失败')
        }
      })
    },
    // 激活码禁用
    disable(id) {
      let that = this
      this.$confirm('此操作将收回用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = new FormData()
        data.append('id', id)
        activationCodeDisable(data).then(res => {
          if (res.StatusCode === '200') {
            this.$message.success('成功')
            this.lookActivationCodeList(that.currentLookId)
          } else {
            this.$message.error('失败')
          }
        })
      })
    },
    // 导出
    exportExcel(id) {
      let params = { batchId: id}
      activationCodeExport(params).then(res => {
        if (res. StatusCode === '200') {
          window.open(res.Data)
        }
      })
    },
    // 保存目录
    checksSave() {
      this.CatelogDialog = false
      this.cateNameShow = true
    },
    // 查看列表分页
    handleCurrentChange(val) {
      this.lookListPage = val
      this.lookActivationCodeList(this.currentLookId)
    },
    // 激活码分页
    codeCurrentChange(val) {
      this.lookListCodePage = val
      this.getActivationBatch()
    },
    // 初始化数据
    initData() {
      this.form = {
        batchName: '',
        validDays: null,
        codeCount: null,
        catalogIds: '',
        catalogNames: '',
        remark: ''
      }
      this.activationCodeList = [{
        Id: null,
        Guid: '',
        Status: null,
        UsedId: null,
        ActivationDate: null,
        StartDate: null,
        EndDate: null,
        IsEnable: null,
      }]
      this.catalogNames = []
      this.value1 = ''
    }
  }
}
</script>
<style lang="less" scoped>
.muluTree /deep/ .el-dialog__body {
  height:  400px;
  overflow: auto;
}
/deep/ .el-button--mini, /deep/ .el-button--mini.is-round {
    margin-bottom: 20px;
}
.usetime {
  width: 220px;
  /deep/ .el-input__inner {
    width: 200px;
  }
}
.usetimetip {
  font-size: 12px;
}
.down {
    color: #5c887a;
}
.del {
    color: #f56c6c;
}
.state {
    color: #e6a23c
}
.cata {
  /deep/ .el-form-item__content {
    display: flex;
    justify-content: flex-start;
    .cataName {
      margin-left: 10px;
    }
  }
}
.use {
  display: flex;
  justify-content: flex-start;
}
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
