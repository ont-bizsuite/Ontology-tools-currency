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
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #f5f6f7 !important;
}
.el-pagination {
  padding: 0 !important;
  .el-pagination__jump {
    margin-left: 40px;
    .el-pagination__editor {
      padding-right: 0;
      margin-right: 0;
      margin-left: 10px;
    }
    .el-input {
      width: auto;
      min-width: 75px;
    }
    .el-input__inner {
      padding: 0 8px;
    }
  }
  .el-icon {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
.el-table {
  tr {
    th {
      .cell {
        font-size: 12px;
      }
    }
  }
  td {
    .cell {
      font-size: 12px;
    }
  }
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
      min-width: 104px;
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
  .el-dialog__header {
    padding: 40px 60px 10px;
  }
  .el-dialog__body {
    padding: 50px 60px;
  }
  .el-dialog__headerbtn {
    top: 40px;
    right: 60px;
  }
  .el-dialog__footer {
    padding: 10px 60px 40px;
  }
}
</style>
