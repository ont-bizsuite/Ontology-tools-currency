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
        <el-form-item label="转账说明" prop="eventType">
          <div style="padding-left: 100px; width: 100%; max-width: 900px;">
            <el-checkbox-group v-model="ruleForm.eventType">
              <el-checkbox
                v-for="(item, index) in eventTypeList"
                :key="index"
                :label="item"
                name="eventType"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="seLoading"
            type="primary"
            @click="submitForm('ruleForm')"
            >立即查询</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
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
                <el-option label="构建失败" :value="0"></el-option>
                <el-option label="未发送" :value="1"></el-option>
                <el-option label="发送失败" :value="2"></el-option>
                <el-option label="发送成功" :value="3"></el-option>
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
        <el-table-column fixed prop="EventType" label="事件类型" width="180">
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
              >未发送</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 2"
              type="warning"
              disable-transitions
              >发送失败</el-tag
            >
            <el-tag v-else-if="scope.row.TxResult === 3" disable-transitions
              >发送成功</el-tag
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
            <el-tag v-else type="danger" disable-transitions>构建失败</el-tag>
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
// import { export2Excel } from '../common/js/util'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { export_json_to_excel } from '../assets/js/Export2Excel'
import moment from 'moment'
export default {
  data() {
    return {
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      ruleForm: {
        eventType: []
      },
      rules: {
        eventType: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个事件类型',
            trigger: 'change'
          }
        ]
      },
      eventTypeList: [],
      tableData: [],
      value: '',
      formInline: {
        status: ''
      },
      originData: [],
      culumns: [
        {
          title: 'date',
          key: 'date'
        },
        {
          title: 'name',
          key: 'name'
        },
        {
          title: 'address',
          key: 'address'
        },
        {
          title: 'status',
          key: 'status'
        }
      ],
      seLoading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.searchHistory()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmit() {
      console.log('submit!')
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
        '事件类型',
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
      this.excelData.map((item, index) => {
        let str = ''
        switch (item.TxResult) {
          case 1:
            str = '未发送'
            break
          case 2:
            str = '发送失败'
            break
          case 3:
            str = '发送成功'
            break
          case 4:
            str = '交易失败'
            break
          case 5:
            str = '交易成功'
            break
          default:
            str = '构建失败'
            break
        }
        item.TxResult = str
      })
      // console.log(list)
      const data = this.formatJson(filterVal, this.excelData)
      export_json_to_excel(tHeader, data, moment().format('X'))
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    exportData() {
      export2Excel(this.culumns, this.tableData)
    },
    async getEventType() {
      let apires = await this.$http.getEventType()
      console.log(apires)
      this.eventTypeList = [...apires.Result]
    },
    async searchHistory() {
      this.tableData = []
      let params = {
        id: 1,
        jsonrpc: '2.0',
        method: 'getdatabyeventtype',
        params: {
          eventType: [...this.ruleForm.eventType]
        }
      }
      this.seLoading = true
      let apires = await this.$http.getHistory(params)
      console.log(apires)
      this.seLoading = false
      let arr = []
      apires.Result.map((item, index) => {
        arr.push(...item.TxInfo)
      })
      arr.map((item, index) => {
        item.TxTime = moment(item.TxTime * 1000).format('YYYY-MM-DD hh:mm:ss')
      })
      this.originData = [...arr]
      this.tableData = [...this.originData]
      this.formInline.status = ''
      // if (this.formInline.status === 0 || this.formInline.status) {
      //   console.log(111)
      //   this.tableData = this.fliterStatus(
      //     this.originData,
      //     this.formInline.status
      //   )
      // } else {
      //   this.tableData = this.originData
      // }
      this.currentPage = 1
    }
  },
  computed: {
    excelData() {
      let arr = []
      this.tableData.map((item, index) => {
        arr.push({ ...item })
      })
      return [...arr]
    }
  },
  mounted() {
    this.getEventType()
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
