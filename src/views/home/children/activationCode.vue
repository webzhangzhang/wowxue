<template>
  <div>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">生成激活码</el-button>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="postcarget">生成目录</el-button>
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
            {{ scope.row.remark ? scope.row.remark : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="lookActivationCodeList(scope.row.Id)" type="text" size="small" >查看列表</el-button>
          <el-button @click="exportExcel(scope.row.Id)" type="text" size="small" class="down">批量导出</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看权限</el-button>
          <el-button @click="delActivationBatch(scope.row.Id)" type="text" size="small" class="del">删除</el-button>
          <!-- <el-button @click="activationBatchListEnable() : activationBatchListDisable()" type="text" size="small" class="state"> {{ scope.row.state === 0 ? '禁用' : '启用' }}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="isShow"
      align="center"
      :total="tableData.length">
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
        <el-form-item label="对应权限" :label-width="formLabelWidth">
          <el-button @click="CatelogDialog=true">选择目录</el-button>
        </el-form-item>
        <el-form-item label="使用有效期" :label-width="formLabelWidth">
          <el-input class="usetime" v-model="form.validDays" autocomplete="off" width="100px"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input class="usetime" v-model="form.CodeCount" autocomplete="off"></el-input>
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
        <el-table-column property="Id" label="序号" width="150"></el-table-column>
        <el-table-column property="Guid" label="激活码" width="200"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <div>
              {{ scope.row.Status === '0' ? '未激活': scope.row.status === '1' ? '已激活' : '已失效' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="UsedId" label="使用人"></el-table-column>
        <el-table-column property="ActivationDate" label="激活时间"></el-table-column>
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
            <el-button @click="scope.row.IsEnable === 0 ? enable(scope.row.Id): disable(scope.row.Id)" :type="scope.row.IsEnable === 0 ? 'danger' : 'primary'">
              {{ scope.row.IsEnable === 0 ? '禁用': '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import elTree from '@/components/treeElement'
// import moment from 'moment'
// moment.locale('zh-cn')
import {
  getActivationBatchList,
  getActivationCodeList,
  activationCodeEnable,
  activationCodeDisable,
  deleteActivationBatch,
  activationBatchEnable,
  activationBatchDisable,
  activationBatchAdd,
  postcate
} from '@/api/activationCode'
export default {
  name: 'Home',
  components: { elTree },
  data() {
    return {
      isShow: true,
      dialogFormVisible: false, // 生成激活码弹窗
      dialogLookVisible: false, // 查看列表弹窗
      activationCodeList: [{ // 查看列表
        Id: 1,
        Guid: '765765',
        Status: 0, // 0-未激活，1-已激活，2-已失效
        UsedId: 23456, // 使用人编号
        ActivationDate: 65465465, // 激活时间
        StartDate: 87687687687,
        EndDate: 765564456,
        IsEnable: 1, // 0-禁用，1-启用
      }],
      formLabelWidth: '120px',
      CatelogDialog: false, // 选择权限
      value1: '', // 激活有效期
      value2: '', // 使用有效期
      tableData: [{ // 激活码批次列表
        Id: 1,
        BatchName: 'woshiname',
        StartDate: 123123112,
        EndDate: 123123123,
        ValidDays: 20,
        CodeCount: 100,
        Remark: 'nonono'
      }],
      form: {
        batchName: '',
        validDays: null,
        codeCount: null,
        catalogIds: '', // fixli 暂时不知道如何使用
        catalogNames: '', // fixli 暂时不知道如何使用
        remark: ''
      },
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      CatelogIds: [],
    }
  },
  created() {
    this.getActivationBatch()
  },
  methods:{
    // 生成目录 fixli
    postcarget() {
      let data = {
        catalogName: '语文',
        parentId: 1
      }
      postcate(data)
    },
    // 生成激活码
    activationAdd() {
      let data = {
        batchName: this.form.batchName,
        startDate: moment(this.value1[0]).utc().format(),
        endDate: moment(this.value1[1]).utc().format(),
        validDays: +this.form.validDays,
        codeCount: +this.form.codeCount,
        // catalogIds: "string",
        // catalogNames: "string",
        remark: this.form.remark
      }
      console.log(data)
      activationBatchAdd(data).then(res => {
        console.log(res)
        this.$message.success('添加成功')
      })
    },
    // 获取激活码批次
    getActivationBatch() {
      let params = {
        page: 1,
        limit: 10
      }
      getActivationBatchList(params).then(res => {
        if (res.StatusCode === '200') {
          res.Data.forEach(item => {
            item.StartDate = moment(item.StartDate).format('YYYY/MM/DD hh:mm:ss')
            item.EndDate = moment(item.EndDate).format('YYYY/MM/DD hh:mm:ss')
          })
          this.tableData = res.Data
          if (this.tableData.length > 10) {
            this.isShow = false
          }
          console.log(res)
        }
      })
    },
    // 删除激活码批次
    delActivationBatch(id) {
      deleteActivationBatch(id)
    },
    // 激活码批次启用
    activationBatchListEnable(id) {
      activationBatchEnable(id)
    },
    // 激活码批次禁用
    activationBatchListDisable(id) {
      activationBatchDisable(id)
    },
    // 查看列表
    lookActivationCodeList(id) {
      let params = {
        page: 1,
        limit: 10,
        Id: id
      }
      getActivationCodeList(params).then(res => {
        if (res.StatusCode === '200') {
          res.Data.forEach(item => {
            item.StartDate = moment(item.StartDate).format('YYYY/MM/DD hh:mm:ss')
            item.EndDate = moment(item.EndDate).format('YYYY/MM/DD hh:mm:ss')
            item.ActivationDate = moment(item.ActivationDate).format('YYYY/MM/DD hh:mm:ss')
          })
          // this.activationCodeList = res.Data
          this.dialogLookVisible = true
        }
      })
    },
    // 激活码启用
    enable(id) {
      let data = { id: id}
      activationCodeEnable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message('成功')
        } else {
          this.$message('失败')
        }
      })
    },
    // 激活码禁用
    disable(id) {
      let data = { id: id}
      activationCodeDisable(data).then(res => {
        if (res.StatusCode === '200') {
          this.$message('成功')
        } else {
          this.$message('失败')
        }
      })
    },
    // 导出
    exportExcel(id) {
      // let data = { batchId: id}
      var aEle = document.createElement("a")// 创建a标签
      aEle.download = 'a.txt'// 设置下载文件的文件名
      aEle.href = 'http://magicstory.wowxue.com/api/ActivationCode/Export?activityId=' + id
      aEle.target = '_blank'//这里必须加上，否则a标签默认_self就与window.location.href效果一样了
      aEle.click()// 设置点击事件
      // activationCodeExport(id) // 下载暂时不可行，注释fixli
    },
    click() {
    //   this.$router.push({name:'app'})
    },
    checksSave(data) {
      if (data.type == 'mulu') {
        // this.ruleForm.CatelogIds = JSON.stringify(data.checks);
        this.ruleForm.CatelogIds = data.checks.join()
        this.CatelogNmaes = data.names
        this.CatelogDialog = false
      } else {
        // this.ruleForm.KnowledgepointIds = JSON.stringify(data.checks);
        this.ruleForm.KnowledgepointIds = data.checks.join()
        this.KnowledgeNmaes = data.names
        this.KnowledgeDialog = false
      }

    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-button--mini, /deep/ .el-button--mini.is-round {
    margin-bottom: 20px;
}
.usetime /deep/ .el-input__inner {
  width: 200px;
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
