<template>
  <div>
    <router-view/>
  </div>
</template>
<script>

export default {
  name: 'App',
  data() {
    return {}
  }
}
</script>
<style lang="less">
    @import 'assets/css/common.less';

    html, body {
        margin: 0;
        padding: 0;
        background-color: #eff1f4;
        font-size: 14px;
    }

</style>
