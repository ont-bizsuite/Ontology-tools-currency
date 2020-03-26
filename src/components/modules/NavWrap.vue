<template>
  <div class="nav_wraps">
    <ul>
      <li
        @click="$router.push({ name: 'ContentWrap' })"
        :class="$route.name === 'ContentWrap' ? 'active' : ''"
      >
        {{ $t('layout.nav1') }}
      </li>
      <li
        @click="$router.push({ name: 'HistoryWrap' })"
        :class="$route.name === 'HistoryWrap' ? 'active' : ''"
      >
        {{ $t('layout.nav2') }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.nav_wraps {
  ul {
    li {
      width: 100%;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      text-align: center;
      font-size: 12px;
      color: rgba(30, 30, 30, 1);
      cursor: pointer;
      transition: all 0.6s;
      padding: 0 20px;
      &:hover {
        background: rgba(245, 247, 246, 1);
        color: #000;
      }
    }
    li.active {
      background: rgba(245, 247, 246, 1);
      color: #000;
    }
  }
}
</style>
