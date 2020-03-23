<template>
  <div class="home_layout">
    <div class="header_wrap"><Header-div></Header-div></div>
    <div class="body_wrap">
      <div class="left_nav_wrap">
        <NavWrap-div></NavWrap-div>
      </div>
      <div class="right_content_wrap">
        <Content-div></Content-div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderDiv from '@/components/modules/Header'
import NavWrapDiv from '@/components/modules/NavWrap'
import ContentDiv from './ContentWrap'
// NavWrap
export default {
  components: { HeaderDiv, NavWrapDiv, ContentDiv }
}
</script>

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
      height:calc(100vh - 54px);
    }
  }
}
</style>
