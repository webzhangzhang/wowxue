<template>
  <el-table-column 
    :fixed="item.fixed"
    :label="item.label"
    :prop="item.prop && item.prop.index === undefined ? item.prop : item.prop && item.prop.index"
    :sortable="item.sort"
    :min-width="item.minWidth"
    align="center"
  >
    <template v-if="item.childs">
      <recursion-column v-for="child in item.childs" :key="`${child.prop}`" :item="child"/>
    </template>
    <template slot-scope="{row}">
      <span :style="{color: row[item.prop] && row[item.prop].color ? row[item.prop].color : ''}">{{ row[item.prop]&&row[item.prop].index === undefined ? row[item.prop] : row[item.prop].index }}</span>
    </template>
  </el-table-column>
</template>
 
<script>
export default {
  name: 'RecursionColumn',
  props: {
    item: [Object]
  }
}
</script>

<style lang="less" scoped>

</style>