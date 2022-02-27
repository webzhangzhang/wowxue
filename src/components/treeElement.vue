<template>
  <div class="">
    <div v-if="ischeck">
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :data="dataSource"
        :props="dataProps"
        show-checkbox
        node-key="Id"
        class="permission-tree"
      />
      <div style="text-align:right;">
        <el-button type="primary" @click="getCheckedKeys">确定</el-button>
        <el-button type="" @click="resetChecked">重置</el-button>
      </div>
    </div>
    <div v-else>
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :expand-on-click-node="false"
        :data="dataSource"
        :props="dataProps"
        node-key="Id"
        class="permission-tree"
        @node-click="nodeClick"
      />
    </div>     
  </div>
  
  
</template>
<script>
import {
  CatelogList
} from '@/api/activationCode'

export default {
  name: 'Eltree',
  props: {
    showtype: {
      type: String,
      default: 'normal'
    },
    ischeck: {
      type: Boolean,
      default: true
    },
    checkIds: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      dataSource:[],
      checkStrictly: false,
      dataProps: {
        children: 'Children',
        label: 'CatalogName',
        id: 'Id',
      }
    }
  },
  watch: {
    checkIds: function() {
      this.setCheckedKeys()
    }
  },
  created() {
    if (this.showtype=='mulu') {
      this.getCategory()
    }
    else if(this.showtype=='zhishidian'){
      this.getKnowledge()
    }
    else if(this.showtype=='fenlei'){
      this.getFenlei()
    }
    else{
      console.log('err')
    }
  },
  mounted() {
    if (this.ischeck) {
      this.setCheckedKeys()
    } else{
      console.log('err')
    }
  },
  methods: {
    getFenlei(){
    },
    getCategory(){
      let Data = {
        page: 1,
        limit: 1000
      }
      CatelogList(Data).then(res => {
        if (res.StatusCode === '200') {
          this.dataSource = res.Data.List
        }
      })
    },
    getKnowledge(){
    },
    getCheckedKeys() {
      var names=[]
      var getCheckedNodes = this.$refs.tree.getCheckedNodes()
      for(var i in getCheckedNodes){
        names.push(getCheckedNodes[i].CatalogName)
      }
       
      var checks= this.$refs.tree.getCheckedKeys()
      var data={
        type:this.showtype,
        checks:checks,
        names:names,
      }
      this.$emit('checksSave', data)
    },
    setCheckedKeys() {
      var checkIds = this.checkIds
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkIds)
      })
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    nodeClick(a) {
      this.$emit('nodeClick', a.Id)
    },

  }
}
</script>
<style scoped>

</style>
