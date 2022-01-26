<template>
  <div>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">生成激活码</el-button>
    <el-table
      :data="tableData"
      border
      empty-text="-"
      style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="num"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="name"
        label="激活码名称"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="time1"
        label="激活有效期"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="time2"
        label="使用有效期"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="number"
        label="数量"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="remark"
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
          <el-button @click="dialogLookVisible = true" type="text" size="small" >查看列表</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small" class="down">批量导出</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看权限</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small" class="del">删除</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small" class="state"> {{ scope.row.state === 0 ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 生成激活码弹窗 -->
    <el-dialog title="生成激活码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="激活码名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
          <el-date-picker
            v-model="value2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="form.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 目录 -->
    <el-dialog title="选择目录" :visible.sync="CatelogDialog" width="400px">
      <elTree :showtype="'mulu'" :ischeck="true" :check-ids="CatelogIds" @checksSave="checksSave"></elTree>
    </el-dialog>
    <!-- 查看列表弹窗 -->
    <el-dialog title="查看列表" :visible.sync="dialogLookVisible" width="1000px">
      <el-table :data="gridData">
        <el-table-column property="num" label="序号" width="150"></el-table-column>
        <el-table-column property="jihuoma" label="激活码" width="200"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status === '1' ? '已激活': scope.row.status === '2' ? '已失效' : '未激活' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="people" label="使用人"></el-table-column>
        <el-table-column property="time1" label="激活时间"></el-table-column>
        <el-table-column property="time2" label="使用有效期"></el-table-column>
        <el-table-column property="state" label="操作">
          <template slot-scope="scope">
            <el-button>
              {{ scope.row.state === 0 ? '禁用': '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLookVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogLookVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elTree from '@/components/treeElement'
import { getActivationCodeList } from '@/api/activationCode'
export default {
  name: 'Home',
  components: { elTree },
  data() {
    return {
      dialogFormVisible: false, // 生成激活码弹窗
      dialogLookVisible: false, // 查看列表弹窗
      gridData: [{
        num: '1',
        jihuoma: '12323123',
        status: '1',
        people: '李文豪',
        time1: '1312',
        time2: '12312',
        state: 0
      }], // 查看列表mock
      formLabelWidth: '120px',
      CatelogDialog: false, // 选择权限
      value1: '', // 激活有效期
      value2: '', // 使用有效期
      tableData: [{
        num: '1',
        name: '我是测试数据，没有备注',
        time1: '2022/01/30-2022/02/20',
        time2: '20',
        number: '10',
        remark: '',
        state: 0
      },
      {
        num: '1',
        name: '我是测试数据，没有备注',
        time1: '2022/01/30-2022/02/20',
        time2: '20',
        number: '10',
        remark: '',
        state: 1
      }],
      form: {
        name: '',
        time1: '',
        permissions: '', // 权限
        time2: '',
        number: '',
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
    console.log('in')
    this.getActivationCode()
  },
  methods:{
    getActivationCode() {
      let params = {
        page: 1,
        limit: 10
      }
      getActivationCodeList(params).then(res => {
        console.log(res)
      })
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
