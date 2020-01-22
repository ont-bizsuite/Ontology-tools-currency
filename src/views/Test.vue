<template>
  <div>
    <el-select
      v-model="value2"
      multiple
      filterable
      remote
      reserve-keyword
      style="margin-left: 20px;"
      placeholder="请选择"
    >
      <el-option
        v-for="item in eventTypeList"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项7',
          label: '北京烤鸭'
        },
        {
          value: '选项8',
          label: '北京烤鸭'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        },
        {
          value: '选项6',
          label: '北京烤鸭'
        }
      ],
      value1: [],
      value2: [],
      ruleForm: {
        eventType: []
      },
      eventTypeList: []
    }
  },
  async mounted() {
    let apires = await this.$http.getEventType()
    console.log(apires.Result)
    this.eventTypeList = [...apires.Result]
  }
}
</script>
