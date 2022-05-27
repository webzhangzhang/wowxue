<template>
  <div class="con">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">生成激活码</el-button>
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
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对应权限" :label-width="formLabelWidth" class="cata">
          <el-button @click="CatelogDialog=true">选择目录</el-button>
          <div v-if="cateNameShow">
            <span v-for="item in catalogNames" :key="item.id" class="cataName">{{ item.name }}</span>
          </div>
        </el-form-item>
        <el-form-item label="使用有效期" :label-width="formLabelWidth">
          <div class="use">
            <el-input class="usetime" v-model="form.validDays" autocomplete="off" width="100px"></el-input>
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
    <el-dialog title="选择目录" :visible.sync="CatelogDialog" width="400px">
      <elTree :showtype="'mulu'" :ischeck="true" :check-ids="CatelogIds" @checksSave="checksSave"></elTree>
    </el-dialog>
    <!-- 查看列表弹窗 -->
    <el-dialog title="查看列表" :visible.sync="dialogLookVisible" width="1000px">
      <el-table :data="activationCodeList">
        <el-table-column property="Id" label="序号" width="50"></el-table-column>
        <el-table-column property="Guid" label="激活码" width="200"></el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ scope.row.Status === '0' ? '未激活': scope.row.status === '1' ? '已激活' : '已失效' }}
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
import elTree from '@/components/treeElement'
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
  activationBatchAdd
} from '@/api/activationCode'
export default {
  name: 'Home',
  components: { elTree },
  data() {
    return {
      isShow: true,
      cateNameShow: false, // 选择的目录名称是否显示，有则显示，没有则隐藏
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
        catalogIds: '', // fixli 暂时不知道如何使用
        catalogNames: '', // fixli 暂时不知道如何使用
        remark: ''
      },
      catalogNames: [], // 选择目录的数组
      treeData: [],
      CatelogIds: [], // 已经选择的目录，用于回显
      lookListPage: 1,
      currentLookId: null,
      lookListCodePage:1,
      ispost: true // 是否发送请求，默认可以发送
    }
  },
  created() {
    this.getActivationBatch()
  },
  methods:{
    // 生成激活码
    activationAdd : debounce(function() {
      let names = ''
      this.catalogNames.forEach((item, index) => {
        if (index !== 0) {
          names = names + ',' + item.name
        } else {
          names = item.name
        }
      })
      let data = {
        batchName: this.form.batchName,
        startDate: moment(this.value1[0]).utc().format(),
        endDate: moment(this.value1[1]).utc().format(),
        validDays: +this.form.validDays,
        codeCount: +this.form.codeCount,
        catalogIds: this.form.catalogIds,
        catalogNames: names,
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
            item.StartDate = moment(item.StartDate).format('YYYY/MM/DD hh:mm:ss')
            item.EndDate = moment(item.EndDate).format('YYYY/MM/DD hh:mm:ss')
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
      this.CatelogIds = data.CatalogIds.split(',')
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
      let data = new FormData()
      data.append('id', id)
      activationCodeDisable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message.success('成功')
          this.lookActivationCodeList(this.currentLookId)
        } else {
          this.$message.error('失败')
        }
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
    checksSave(data) {
      this.catalogNames = []
      if (data.type == 'mulu') {
        this.form.catalogIds = data.checks.join()

        for (let index = 0; index < data.names.length; index++) {    
          this.catalogNames.push({id: index, name: data.names[index]})      
        }
        this.CatelogDialog = false
        this.cateNameShow = true
      } else {
        this.ruleForm.KnowledgepointIds = data.checks.join()
        this.KnowledgeNmaes = data.names
        this.KnowledgeDialog = false
        this.cateNameShow = true
      }
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
