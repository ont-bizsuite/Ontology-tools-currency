<template>
  <div class="home_header_wrap">
    <h1>{{$t('home')}}</h1>
    <div class="dropDown_wrap"><Net-div></Net-div><Lang-div></Lang-div></div>
  </div>
</template>

<script>
import LangDiv from './DropDown'
import NetDiv from './NetDown'

export default {
  components: { LangDiv, NetDiv }
}
</script>

<style lang="less" scoped>
.home_header_wrap {
  width: 100%;
  max-width: 780px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  h1 {
    font-size: 18px;
    font-weight: 600;
  }
  .dropDown_wrap {
    position: absolute;
    height: 100%;
    right: -62px;
    top: 0;
    display: flex;
    justify-content: flex-start;
  }
}
</style>
