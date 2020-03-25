<template>
  <div id="app">
    <div class="home_layout">
      <div class="header_wrap"><Header-div></Header-div></div>
      <div class="body_wrap">
        <div class="left_nav_wrap">
          <NavWrap-div></NavWrap-div>
        </div>
        <div class="right_content_wrap">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderDiv from '@/components/modules/Header'
import NavWrapDiv from '@/components/modules/NavWrap'
import ContentDiv from './views/ContentWrap'
export default {
  components: { HeaderDiv, NavWrapDiv, ContentDiv },
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
    // this.$store.dispatch('getEventList')
  }
}
</script>

<style lang="less">
#nprogress .bar {
  background: #1787eb !important; //自定义颜色
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-select {
  width: 100%;
}
.el-select .el-input__suffix {
  right: 10px;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: rgba(0, 0, 0, 0.5) !important;
}
.el-select-dropdown__item.selected {
  color: #000 !important;
}
</style>
<style lang="less" scoped>
.home_layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .header_wrap {
    width: 100%;
    height: 54px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  .body_wrap {
    flex: 1;
    overflow-y: auto;
    display: flex;
    .left_nav_wrap {
      width: 104px;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
    }
    .right_content_wrap {
      flex: 1;
      overflow-y: auto;
      height: calc(100vh - 54px);
    }
  }
}
/deep/ .el-dialog {
  .el-form-item__label {
    font-size: 12px;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
