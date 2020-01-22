<template>
  <div class="search_wrap">
    <div class="form_area_result">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="事件名称" prop="eventType">
          <div style="padding-left: 100px; width: 100%; max-width: 900px;">
            <el-select
              v-model="ruleForm.eventType"
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
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="seLoading"
            type="primary"
            @click="submitForm('ruleForm')"
            >立即查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_area_result">
      <div class="search_select">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="转账状态">
            <div>
              <el-select v-model="formInline.status" placeholder="状态列表">
                <el-option label="所有状态" :value="6"></el-option>
                <el-option label="未构造交易" :value="0"></el-option>
                <el-option label="构建交易失败" :value="1"></el-option>
                <el-option label="发送失败" :value="2"></el-option>
                <el-option label="转账进行中" :value="3"></el-option>
                <el-option label="交易失败" :value="4"></el-option>
                <el-option label="交易成功" :value="5"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">筛选</el-button>
          </el-form-item>
        </el-form>
        <div class="excel_btn">
          <el-button @click="exportToExcel">导出Excel</el-button>
        </div>
      </div>

      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        style="width: 100%"
        id="outTable"
      >
        <el-table-column fixed prop="EventType" label="事件名称" width="180">
        </el-table-column>
        <el-table-column prop="TokenType" label="Token 类型" width="180">
        </el-table-column>
        <el-table-column
          prop="Address"
          label="Address"
          width="320"
        ></el-table-column>
        <el-table-column
          prop="Amount"
          label="Amount"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="TxHash"
          label="TxHash"
          width="320"
        ></el-table-column>
        <el-table-column
          prop="TxTime"
          label="交易时间"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="TxResult"
          width="160"
          label="状态"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tag
              type="info"
              disable-transitions
              v-if="scope.row.TxResult === 1"
              >构建交易失败</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 2"
              type="danger"
              disable-transitions
              >发送失败</el-tag
            >
            <el-tag v-else-if="scope.row.TxResult === 3" disable-transitions
              >转账进行中</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 4"
              type="danger"
              disable-transitions
              >交易失败</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 5"
              type="success"
              disable-transitions
              >交易成功</el-tag
            >
            <el-tag v-else type="warning" disable-transitions
              >未构造交易</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { export_json_to_excel } from '../assets/js/Export2Excel'
import moment from 'moment'
import { mapState } from 'vuex'

const actions = new Map([
  [1, ['构建交易失败']],
  [2, ['发送失败']],
  [3, ['转账进行中']],
  [4, ['交易失败']],
  [5, ['交易成功']],
  ['default', ['未构建交易']]
])
const filterAction = status => {
  let action = actions.get(status) || actions.get('default')
  return action[0]
}

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      ruleForm: {
        eventType: []
      },
      rules: {
        eventType: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个事件名称',
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      formInline: {
        status: ''
      },
      originData: [],
      seLoading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.searchHistory()
        }
      })
    },
    onSubmit() {
      if (this.formInline.status === 6) {
        this.tableData = this.originData
      } else {
        this.tableData = this.fliterStatus(
          this.originData,
          this.formInline.status
        )
      }
      this.currentPage = 1
    },
    fliterStatus(arr, type) {
      return arr.filter(item => item.TxResult == type)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    exportToExcel() {
      //excel数据导出
      const tHeader = [
        '事件名称',
        'Token 类型',
        'address',
        'amount',
        'TxHash',
        '交易时间',
        '状态',
        '日志'
      ]
      const filterVal = [
        'EventType',
        'TokenType',
        'Address',
        'Amount',
        'TxHash',
        'TxTime',
        'TxResult',
        'ErrorDetail'
      ]
      const data = this.formatJson(filterVal, this.excelData)
      export_json_to_excel(tHeader, data, moment().format('X'))
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async searchHistory() {
      this.tableData = []
      this.seLoading = true
      let apires = await this.$http.getHistory(this.dataParams)
      this.seLoading = false
      let arr = []
      apires.Result.map((item, index) => {
        arr.push(...item.TxInfo)
      })
      arr.map((item, index) => {
        item.TxTime =
          item.TxTime !== 0
            ? moment(item.TxTime * 1000).format('YYYY-MM-DD hh:mm:ss')
            : ''
      })
      this.originData = [...arr]
      this.tableData = [...this.originData]
      this.formInline.status = ''
      this.currentPage = 1
    }
  },
  computed: {
    ...mapState({
      eventTypeList: state => state.eventTypeList
    }),
    excelData() {
      let arr = []
      this.tableData.map((item, index) => {
        arr.push({ ...item })
      })
      arr.map((item, index) => {
        item.TxResult = filterAction(item.TxResult)
      })
      return [...arr]
    },
    dataParams() {
      return {
        id: 1,
        jsonrpc: '2.0',
        method: 'getdatabyeventtype',
        params: {
          eventType: [...this.ruleForm.eventType]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search_wrap {
  .form_area_result,
  .table_area_result {
    margin-top: 50px;
  }
  .el-pagination {
    margin: 50px;
    text-align: center;
  }
  .search_select {
    // text-align: right;
    display: flex;
    justify-content: flex-end;
    .excel_btn {
      margin-left: 24px;
    }
  }
}
</style>
