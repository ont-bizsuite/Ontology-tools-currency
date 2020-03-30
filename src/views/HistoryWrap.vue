<template>
  <div class="hostory_wraps" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="his_area1">
      <div class="ele_item">
        <div class="label_title">{{ $t('wraps.enentName') }}</div>
        <div class="actions_areas">
          <el-select
            v-model="currentEvent"
            filterable
            placeholder="Please select event name"
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
      </div>
      <div class="ele_item">
        <div class="label_title">
          {{ $t('history.status') }}
        </div>
        <div class="input_area">
          <div class="btype inpress" v-if="transPro.evtStatus === 1">
            {{ $t('common.evtStatus1') }}
          </div>
          <div class="btype" v-else-if="transPro.evtStatus === 2">
            {{ $t('common.evtStatus2') }}
          </div>
          <div class="btype" v-else-if="transPro.evtStatus === 0">
            {{ $t('common.evtStatus3') }}
          </div>
          <div class="btype" v-else></div>
        </div>
      </div>
      <div class="search_area">
        <div
          :class="$i18n.locale === 'en' ? 'btns enwidth' : 'btns'"
          @click="queryTransPro"
        >
          {{ $t('history.query') }}
        </div>
      </div>
    </div>
    <div class="his_area2">
      <ul>
        <li>
          {{ $t('history.totlalTrasn') }}<span>{{ transPro.total }}</span>
        </li>
        <li>
          {{ $t('history.successsTras') }}<span>{{ transPro.success }}</span>
        </li>
        <li>
          {{ $t('history.failTrans') }}<span>{{ transPro.failed }}</span>
        </li>
      </ul>
      <div class="search_area">
        <div
          :class="$i18n.locale === 'en' ? 'btns enwidth' : 'btns'"
          @click="handlerStart"
        >
          {{ $t('history.refer') }}
        </div>
      </div>
    </div>
    <div class="his_area3">
      <div class="ele_item balance_layout">
        <div class="label_title">
          {{ $t('history.adminBa') }}
        </div>
        <div class="input_area balance_wrap">
          <div class="balance_item">
            <ul v-if="AdminBalance">
              <li v-for="(item, key) in AdminBalance" :key="key">
                <div class="balance_area">{{ key }}: {{ item }}</div>
                <div class="btn_balance" @click="withdrew(key)">
                  {{ $t('wraps.withDrew') }}
                </div>
              </li>
            </ul>
            <div v-else class="no_balance"></div>
          </div>
        </div>
      </div>
      <div class="search_area">
        <div class="no_colors" @click="getBalance">
          {{ $t('wraps.refreBa') }}
        </div>
        <!-- <div class="no_colors" @click="withdrew">{{ $t('wraps.refreBa') }}</div> -->

        <!-- <div class="no_colors saveMon">提取余额</div> -->
      </div>
    </div>
    <div class="his_area4">
      <div class="search_select">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item :label="$t('history.status')">
            <div>
              <el-select
                @change="handleSelectChange"
                v-model="formInline.status"
                placeholder="-- All --"
              >
                <el-option
                  :label="$t('common.allStatus')"
                  :value="6"
                ></el-option>
                <el-option
                  :label="$t('common.notGener')"
                  :value="0"
                ></el-option>
                <el-option
                  :label="$t('common.generFail')"
                  :value="1"
                ></el-option>
                <el-option
                  :label="$t('common.sendFail')"
                  :value="2"
                ></el-option>
                <el-option :label="$t('common.inpro')" :value="3"></el-option>
                <el-option
                  :label="$t('common.failSend')"
                  :value="4"
                ></el-option>
                <el-option :label="$t('common.sucSend')" :value="5"></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <div class="excel_btn">
          <div class="no_colors" @click="handlerExport">
            {{ $t('history.exports') }}
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed label="Index" align="left" width="58">
          <template scope="scope"
            ><span
              >{{ scope.$index + (currentPage - 1) * pageSize + 1 }}
            </span></template
          >
        </el-table-column>
        <el-table-column
          fixed
          prop="TokenType"
          align="left"
          label="Token Type"
          width="96"
        >
        </el-table-column>
        <el-table-column
          prop="Amount"
          align="left"
          label="Token Amount"
          width="112"
        >
          <template slot-scope="scope">
            <div style="text-align: right; padding-right:2px">
              {{ scope.row.Amount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="Address" label="Address" width="130">
          <template slot-scope="scope">
            {{ scope.row.Address | subStr }}
            <i
              v-if="scope.row.Address"
              @click="doCopy(scope.row.Address)"
              class="copyIcon"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="TxHash" label="Txhash" width="130">
          <template slot-scope="scope">
            {{ scope.row.TxHash | subStr }}
            <i
              v-if="scope.row.TxHash"
              @click="doCopy(scope.row.TxHash)"
              class="copyIcon"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="TxTime" label="Transaction Time" width="129">
        </el-table-column>
        <el-table-column
          prop="TxResult"
          label="Status"
          fixed="right"
          width="190"
          align="left"
        >
          <template slot-scope="scope">
            <el-tag
              type="info"
              disable-transitions
              v-if="scope.row.TxResult === 1"
              >{{ $t('common.generFail') }}</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 2"
              type="danger"
              disable-transitions
              >{{ $t('common.sendFail') }}</el-tag
            >
            <el-tag v-else-if="scope.row.TxResult === 3" disable-transitions>{{
              $t('common.inpro')
            }}</el-tag>
            <el-tag
              v-else-if="scope.row.TxResult === 4"
              type="danger"
              disable-transitions
              >{{ $t('common.failSend') }}</el-tag
            >
            <el-tag
              v-else-if="scope.row.TxResult === 5"
              type="success"
              disable-transitions
              >{{ $t('common.sucSend') }}</el-tag
            >
            <el-tag v-else type="warning" disable-transitions>{{
              $t('common.notGener')
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="ont-pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalAmout"
        >
        </el-pagination>
      </div>
    </div>
    <Dialog-div
      @colseFn="handlerCloseDialog"
      :dialogFormVisible="dialogFormVisible"
      :withdrawData="withdrawData"
    ></Dialog-div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DialogDiv from '@/components/modules/Dialog'
import moment from 'moment'
import { export_json_to_excel } from '../assets/js/Export2Excel'

const actions = new Map([
  [1, ['Failed to generate transaction']],
  [2, ['Failed transfers']],
  [3, ['In progress']],
  [4, ['Failed transactions']],
  [5, ['Confirmed transactions']],
  ['default', ['Transactions not generated']]
])
const filterAction = status => {
  let action = actions.get(status) || actions.get('default')
  return action[0]
}

export default {
  components: {
    DialogDiv
  },
  computed: {
    ...mapState({
      netType: state => state.netType,
      eventTypeList: state => state.eventTypeList,
      successEvent: state => state.successEvent
    })
  },
  data() {
    return {
      dialogFormVisible: false,
      currentPage: 1,
      currentEvent: '',
      formInline: {
        status: 6
      },
      tableData: [],
      transPro: {
        failed: 0,
        notSend: 0,
        sendFailed: 0,
        success: 0,
        total: 0,
        transfering: 0,
        evtStatus: null
      },
      fullscreenLoading: false,
      AdminBalance: null,
      pageSize: 10,
      pageNum: 1,
      totalAmout: 0,
      withdrawData: {}
    }
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    exportToExcel(arr) {
      //excel数据导出
      const tHeader = [
        'Event Name',
        'Token Type',
        'address',
        'amount',
        'TxHash',
        'Transaction Time',
        'Status',
        'Log'
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
      const data = this.formatJson(filterVal, arr)
      export_json_to_excel(tHeader, data, moment().format('X'))
    },
    handlerExport() {
      if (!this.currentEvent) {
        return this.$message({
          type: 'error',
          message: 'Please select event name'
        })
      }
      let params = {
        eventType: this.currentEvent,
        netType: this.netType,
        pageNum: 0,
        pageSize: 0,
        status: 6
      }
      this.getTableData(params, true)
    },
    handleSelectChange() {
      if (!this.currentEvent) {
        return this.$message({
          type: 'error',
          message: 'Please select event name'
        })
      }
      this.pageNum = 1
      this.currentPage = 1
      let params = {
        eventType: this.currentEvent,
        netType: this.netType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.formInline.status
      }
      this.getTableData(params)
    },
    handlerCloseDialog(params) {
      this.dialogFormVisible = params
      this.getBalance()
    },
    withdrew(data) {
      this.withdrawData = {
        eventType: this.currentEvent,
        netType: this.netType,
        tokenType: data
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // this.currentPage = 1
      // this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      let params = {
        eventType: this.currentEvent,
        netType: this.netType,
        pageNum: val,
        pageSize: this.pageSize,
        status: this.formInline.status
      }
      this.getTableData(params)
    },
    async queryTransPro() {
      if (!this.currentEvent) {
        return this.$message({
          type: 'error',
          message: 'Please select event name'
        })
      }
      try {
        let apires = await this.$http.queryTransferProgress({
          eventType: this.currentEvent,
          netType: this.netType
        })
        console.log(apires)
        if (apires.Desc === 'SUCCESS' && apires.Error === 1) {
          this.transPro = { ...apires.Result }
        }
      } catch (error) {}
      this.getBalance()
      this.tableData = []
      this.pageNum = 1
      this.formInline.status = 6
      let params = {
        eventType: this.currentEvent,
        netType: this.netType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.formInline.status
      }
      this.getTableData(params)
    },
    async handlerStart() {
      if (!this.currentEvent) {
        return this.$message({
          type: 'error',
          message: 'Please select event name'
        })
      }
      let params = {
        id: 1,
        jsonrpc: '2.0',
        method: 'transfer',
        params: {
          eventType: this.currentEvent,
          netType: this.netType
        }
      }
      try {
        let apires = await this.$http.startTransfer(params)
        const { Desc, Error, Result } = apires
        if (Desc !== 'SUCCESS' || Error !== 1) {
          return this.$message({
            type: 'error',
            message: Desc
          })
        }
        return this.$message({
          type: 'success',
          message: 'Transfer started'
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
      }
    },
    async getBalance() {
      if (!this.currentEvent) {
        return this.$message({
          type: 'error',
          message: 'Please select event name'
        })
      }
      try {
        let apires = await this.$http.getBalance({
          eventType: this.currentEvent,
          netType: this.netType
        })
        console.log(apires)
        const { Desc, Error, Result } = apires

        if (Desc !== 'SUCCESS' && Error !== 1) {
          return this.$message({
            type: 'error',
            message: Desc
          })
        }
        this.AdminBalance = { ...Result }
      } catch (error) {
        return this.$message({
          type: 'error',
          message: error
        })
      }
    },
    async getTableData(params, isExpor = false) {
      try {
        let apires = await this.$http.getHistoryInfo(params)
        console.log('apires', apires.Result.TxInfo)
        if (apires.Error !== 1) {
          let str = apires.Result || apires.Desc
          return this.$message.error(str)
        }
        let arr = []
        apires.Result.TxInfo.map((item, index) => {
          arr.push({ ...item })
        })
        arr.map((item, index) => {
          item.TxTime =
            item.TxTime !== 0
              ? moment(item.TxTime * 1000).format('YYYY-MM-DD hh:mm:ss')
              : ''
        })
        console.log(arr)
        if (!isExpor) {
          this.tableData = [...arr]
          this.totalAmout = apires.Result.Total
        } else {
          console.log('expor')
          arr.map((item, index) => {
            item.TxResult = filterAction(item.TxResult)
          })
          this.exportToExcel(arr)
        }
      } catch (error) {}
    },
    doCopy(m) {
      this.$copyText(m)
      this.$message.success('copied')
    }
  },
  filters: {
    subStr(str) {
      if (!str) {
        return ''
      }
      return str.length > 12
        ? str.substring(0, 5) + '...' + str.substring(str.length - 5)
        : str
    }
  },
  async mounted() {
    await this.$store.dispatch('getEventList')
    if (this.successEvent) {
      this.currentEvent = this.successEvent
      this.queryTransPro()
    }
  }
}
</script>
<style lang="less" scoped>
.hostory_wraps {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 36px 0 120px;
}
.ele_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  .label_title {
    padding: 10px 12px 10px 0;
    font-size: 12px;
    line-height: 24px;
    min-height: 45px;
    width: 190px;
    padding-right: 20px;
    font-weight: 600;
  }
  .actions_areas {
    flex: 1;
    height: 45px;
  }
  .input_area {
    flex: 1;
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    input {
      display: block;
      flex: 1;
      height: 45px;
      border: 1px solid #dcdfe6;
      padding: 10px 12px;
      box-sizing: border-box;
      outline: none;
      transition: all 0.5s;
      color: #000;
      &:focus {
        border: 1px solid rgba(0, 0, 0, 1);
      }
      &:disabled {
        background: #f5f7f6;
      }
    }
  }
  .input_area.balance_wrap {
    justify-content: flex-start;
    min-height: 45px;
    height: auto;
    .balance_item {
      flex: 1;
      ul {
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          .balance_area {
            flex: 1;
            min-height: 45px;
            font-size: 12px;
            padding: 14px 12px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            font-weight: 600;
            line-height: 17px;
            background: #f5f7f6;
          }
          .btn_balance {
            min-width: 124px;
            text-align: center;
            padding: 8px 28px;
            font-size: 12px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            height: 33px;
            line-height: 16px;
            border-radius: 17px;
            margin-left: 40px;
            cursor: pointer;
            transition: all 0.6s;
            color: #48a3ff;
            &:hover {
              background: #fafafa;
              border: 1px solid rgba(0, 0, 0, 1);
            }
          }
          &:nth-last-of-type(1) {
            margin-bottom: 0;
          }
        }
      }
    }
    .no_balance {
      flex: 1;
      height: 45px;
      line-height: 45px;
      display: flex;
      align-items: center;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
}
.balance_layout.ele_item {
  align-items: flex-start;
}
.search_area {
  display: flex;
  justify-content: flex-end;
  .btns {
    min-width: 140px;
    height: 33px;
    background: rgba(72, 163, 255, 1);
    border-radius: 17px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    line-height: 18px;
    padding: 8px 22px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.5s;
    &:hover {
      opacity: 0.8;
    }
  }
  .enwidth.btns {
    min-width: 180px;
  }
}
.his_area2 {
  margin-top: 50px;
  ul {
    margin-bottom: 20px;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    li {
      width: 33.33%;
      min-height: 45px;
      font-size: 12px;
      padding: 14px 12px;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
      font-weight: 600;
      line-height: 17px;
      &:nth-last-of-type(1) {
        border-right: none;
      }
      span {
        margin-left: 4px;
        font-weight: 400;
      }
    }
  }
}
.his_area3,
.his_area4 {
  margin-top: 50px;
}
.no_colors {
  min-width: 124px;
  padding: 8px 28px;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 33px;
  line-height: 16px;
  border-radius: 17px;
  margin-left: 40px;
  cursor: pointer;
  transition: all 0.6s;
  text-align: center;
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.6);
    background: #fafafa;
  }
}
.saveMon {
  color: #48a3ff;
}
/deep/.el-input__inner {
  border-radius: 0;
  height: 45px;
  padding: 12px;
  line-height: 19px;
}
.search_select {
  // text-align: right;
  display: flex;
  justify-content: space-between;
  .excel_btn {
    margin-left: 24px;
  }
}
.ont-pages {
  text-align: right;
  margin-top: 30px;
}
.btype {
  flex: 1;
  min-height: 45px;
  font-size: 12px;
  padding: 14px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-weight: 400;
  line-height: 17px;
}
.inpress.btype {
  background: #f5f7f6;
}
i.copyIcon {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url(../assets/copy.svg) no-repeat center;
  background-size: contain;
  margin-left: 6px;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    opacity: 0.8;
  }
}
</style>
