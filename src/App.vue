<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/">主页</el-menu-item>
      <el-menu-item index="/search">查询</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '/'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  watch: {
    $route: function(val) {
      this.activeIndex = val.name === 'home' ? '/' : '/search'
    }
  },
  mounted() {
    this.$store.dispatch('getEventList')
  }
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  max-width: 1440px;
  padding: 0 20px;
  margin: 0 auto;
}
</style>
