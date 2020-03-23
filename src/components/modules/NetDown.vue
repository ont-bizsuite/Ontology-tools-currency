<template>
  <div class="lang">
    <el-dropdown>
      <span class="el-dropdown-link">
        MainNet
        <div class="ball_box"></div>
      </span>
      <el-dropdown-menu
        class="lang_zh"
        slot="dropdown"
        :visible-arrow="false"
        :divided="true"
      >
        <el-dropdown-item command="mainNet"
          ><div class="openKG">MainNet</div></el-dropdown-item
        >
        <el-dropdown-item command="testNet"
          ><div class="openKG">TestNet</div></el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
// import LangStorage from '../helpers/lang'
// import $ from 'jquery'

export default {
  filters: {
    langStyle: function(value) {
      if (value === 'en') {
        return 'EN'
      } else {
        return 'ZH'
      }
    }
  },
  methods: {
    handleCommand: function(command) {
      let self = this
      self.$i18n.locale = command
      localStorage.setItem('user_lang', command)
      console.log(111)
      // $('html,body').animate({ scrollTop: 0 }, 1)
      // setTimeout(() => {
      //   self.$router.go(0)
      // }, 200)
    }
  }
  // computed: {
  //   isLocal: function() {
  //     return this.$i18n.locale
  //   }
  // }
}
</script>

<style lang="less" scoped>
.lang {
  outline: none;
  font-size: 14px;
  .el-dropdown {
    cursor: pointer;
    .el-dropdown-link {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      width: 84px;
      height: 53px;
      outline: none;
      font-weight: 500;
      color: #000;
      font-size: 10px;
      transition: all 0.5s;
      border-radius: 13px;
      padding: 0 10px;
      line-height: 53px;
      position: relative;
      .ball_box {
        width: 10px;
        height: 10px;
        background: url(../../assets/exchange_black.svg) no-repeat center;
        background-size: cover;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.el-dropdown-menu {
  padding: 0;
  margin: 0;
  top: 52px !important;
  z-index: 99999 !important;
  transform: translateX(10px);
  .el-dropdown-menu__item {
    width: 116px;
    height: 45px;
    font-size: 13px;
    line-height: 45px;
    font-weight: 400;
    color: #000;
    opacity: 0.6;
    outline: none;
    transition: all 0.1s;
    text-align: center;
    &:hover {
      background-color: #fafafa;
      opacity: 1;
    }
  }
}
div.openKG {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // i {
  //   width: 14px;
  //   height: 14px;
  //   background: url(../../assets/images/openlogo.svg) no-repeat center;
  //   background-size: cover;
  // }
}
.el-popper[x-placement^='bottom'] {
  margin: 0;
}

.el-dropdown-menu.lang_zh {
  font-family: 'PingFang SC Bold', 'PingFang SC', 'Microsoft Yahei',
    Helvetica Neue, Helvetica, Arial, sans-serif;
}

.el-dropdown-menu.lang_en {
  font-family: 'Roboto-Regular', 'Graphik-regular', 'DINPro-Medium',
    'PingFangSC-Regular', 'Microsoft YaHei', 'Arial', sans-serif;
}
</style>
