<template>
  <div class="content">
    <el-button type="primary" size="medium" class="add" @click="addMenu" :disabled="canClick">添加目录</el-button>
    <div class="content-menu">
      <!-- 左侧目录树 -->
      <div class="menu-left">
        <div class="menu-all" @click="showFistMenuAll">全部</div>
        <el-tree :data="menuData" accordion :props="showMenuName" @node-click="handleNodeClick"></el-tree>
      </div>
      <!-- 右侧展开目录 -->
      <div class="menu-right">
        <el-table
          :data="rightData"
          border
          empty-text="-">
          <el-table-column
            align="center"
            prop="CatalogName"
            label="名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="AppCode"
            label="APPID">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editTreeList(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteMenu(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 编辑弹出框 -->
      <el-dialog title="编辑目录" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="100px" :rules="rules" ref="addCateForm">
          <el-form-item v-if="false" label="父级名称">
          </el-form-item>
          <el-form-item label="目录名称" prop="CatalogName">
            <el-input v-model="form.CatalogName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="APPID" prop="AppCode">
            <el-input v-model="form.AppCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增目录 -->
      <el-dialog title="新增目录" :visible.sync="adddialogFormVisible">
        <el-form :model="addform" label-width="100px" :rules="rules" ref="addCateForm">
          <el-form-item label="父级名称" prop="parName">
            <el-input v-model="addform.parName" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="目录名称" prop="catalogName">
            <el-input v-model="addform.catalogName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="APPID" prop="appCode">
            <el-input v-model="addform.appCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adddialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import WangEditor from '@/components/WangEditor'
import {
  getCatalogClassificationListTree,
  getCatalogClassificationUpdate,
  getCatalogClassificationAdd,
  getCatalogClassificationDelete
} from '@/api/activationCode'
export default {
  name: 'Menu',
  data() {
    return {
      menuData: [], // 目录全部数据
      showMenuName: {
        label:'CatalogName', // 作为对应节点的名字显示
        children:'Children' // 指定子树为节点对象的某个属性值
      },
      currentId: 0, // 当前右侧显示的数据id
      currentName: '无', // 当前右侧显示的数据父级name
      currentAPPid: null, // 当前右侧显示的appid
      isAll: false,
      rightData: [], // 右侧数据
      dialogFormVisible: false, // 编辑显示隐藏
      form: {
        CatalogName: '',
        AppCode: null
      }, // 编辑的表单
      rules: {
        CatalogName: [
          { required: true, message: '请输入目录名称'}
        ]
      },
      canClick: false, // 是否可以点击新增按钮，最多两层
      adddialogFormVisible: false, // 新增显示隐藏
      addform: {
        parName: '无',
        parentId: 0,
        catalogName: '',
        appCode: '',
        sortNumber: 111,
        remark: ''
      }, // 新增的表单
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    // 获取全部目录数据
    getCategory(isshow){
      getCatalogClassificationListTree().then(res => {
        if (res.StatusCode === '200') {
          this.menuData = res.Data
          // 当点击节点进行修改之后更新页面数据
          if (isshow) {
            for (let index = 0; index < this.menuData.length; index++) {
              if (this.menuData[index].Children.length > 0) {
                for (let idx = 0; idx < this.menuData[index].Children.length; idx++) {
                  if (this.currentId === this.menuData[index].Children[idx].Id && !this.isAll) {
                    this.rightData = this.menuData[index].Children[idx].Children
                  }
                }
              } else {
                this.rightData = this.menuData
              }
            }
          }
        } else {
          this.$message.error(res.StatusMessage)
        }
      })
    },
    // 点击全部，显示所有一级目录
    showFistMenuAll() {
      this.canClick = false
      this.rightData = this.menuData
      this.currentName = '无'
      this.currentAPPid = ''
      this.currentId = 0
      this.isAll = true
    },
    // 编辑
    editTreeList(row) {
      this.form = { ...row }
      this.dialogFormVisible = true
    },
    // 提交编辑信息
    submitForm() {
      let params = {
        catalogName: this.form.CatalogName,
        parentId: this.form.ParentId,
        sortNumber: this.form.SortNumber? this.form.SortNumber : 111,
        appCode: this.form.AppCode,
        remark: this.form.remark ? this.form.remark : '',
        id: this.form.Id
      }
      getCatalogClassificationUpdate(params).then(res => {
        if (res.StatusCode === '200') {
          this.dialogFormVisible = false
          this.$message.success('更新成功')
          this.getCategory(true)
        } else {
          this.$message.error(res.StatusMessage)
        }
      })
    },
    // 点击节点
    handleNodeClick(data, node) {
      // 第三层不可以添加子集
      if (node.level === 3) {
        this.canClick = true
      } else {
        this.canClick = false
      }
      this.currentId = data.Id
      this.currentName = data.CatalogName
      this.currentAPPid = data.AppCode
      this.rightData = data.Children
      this.isAll = false
    },
    // 添加目录
    addMenu() {
      this.adddialogFormVisible = true
      this.addform = {
        parName: this.currentName,
        parentId: this.currentId,
        catalogName: '',
        appCode: '',
        sortNumber: 111,
        remark: ''
      }
    },
    // 提交新增目录
    submitAdd() {
      let { parentId, catalogName, appCode, sortNumber, remark } = this.addform
      let data = { parentId, catalogName, appCode, sortNumber, remark }
      getCatalogClassificationAdd(data).then(res => {
        if (res.StatusCode === '200') {
          this.adddialogFormVisible = false
          this.$message.success('新增成功')
          this.getCategory(true)
          this.resetForm()
        } else {
          this.$message.error(res.StatusMessage)
        }
      })
    },
    // 重置addForm表单
    resetForm() {
      this.addform = {
        parName: '无',
        parentId: 0,
        catalogName: '',
        appCode: '',
        sortNumber: 111,
        remark: ''
      }
    },
    // 删除目录
    deleteMenu(row) {
      this.$confirm('此操作将删除此条目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getCatalogClassificationDelete(row.Id).then(res => {
          if (res.StatusCode === '200') {
            this.adddialogFormVisible = false
            this.$message.success('删除成功')
            this.getCategory(true)
          } else {
            this.$message.error(res.StatusMessage)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    .add {
        margin-bottom: 10px;
    }
}
.content-menu {
    display: flex;
    border: 1px solid #ccc;
    background-color: #fff;
    .menu-left {
        /deep/ .el-tree {
            width: 300px;
        }
        width: 300px;
        border-right: 1px solid #ccc;
        .menu-all {
            padding-left: 24px;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
        }
    }
    .menu-right {
        width: 100%;
    }
}
</style>
