<template>
  <div class="home">
    <div class="top_wrap">
      <div class="left">
        <div class="top_select">
          <div class="select_excel">
            <p>Excel文件 (.xsl,.xlsx)</p>
            <p style="margin-top: 10px;">
              <el-button @click="$refs.upload.click()" size="small"
                >导入文件</el-button
              >
            </p>
            <p class="file_name">{{ fileName }}</p>
            <input
              type="file"
              ref="upload"
              accept=".xls,.xlsx"
              class="outputlist_upload"
              style="display: none;"
            />
          </div>
          <div class="down_tep">
            <el-button @click="download">下载模板</el-button>
          </div>
        </div>

        <div class="from_area">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="事件名称" prop="eventType">
              <el-input
                type="eventType"
                v-model="ruleForm.eventType"
              ></el-input>
            </el-form-item>
            <el-form-item label="币种">
              <el-radio-group v-model="tokenType">
                <el-radio label="ONT">ONT</el-radio>
                <el-radio label="ONG">ONG</el-radio>
                <el-radio label="ERC20">ERC20</el-radio>
                <el-radio label="OEP4">OEP4</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="showF.isContAdd"
              label="合约地址"
              prop="contractAddress"
            >
              <el-input v-model="ruleForm.contractAddress"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-bottom: 20px">
          <el-button
            @click="submitForm('ruleForm')"
            type="primary"
            :loading="upLoading"
            >上传数据</el-button
          >
        </div>
      </div>
      <div class="right">
        <div class="select_wrap">
          <el-select
            v-model="historyAction"
            placeholder="选择历史事件名称"
            @change="handlerSelect(historyAction)"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <p>
          <el-row>
            <el-col :span="4">总额：</el-col>
            <el-col :span="20">{{ TotalSum }}</el-col>
          </el-row>
        </p>
        <p>
          <el-row>
            <el-col :span="4">预估手续费：</el-col>
            <el-col :span="20">{{ EstimateFee }}</el-col>
          </el-row>
        </p>
        <p>
          <el-row>
            <el-col :span="4">钱包地址：</el-col>
            <el-col :span="20">{{ accountAddress }}</el-col>
          </el-row>
        </p>
        <p>
          <el-row>
            <el-col :span="4">发放笔数：</el-col>
            <el-col :span="20">{{ tableData.length }}</el-col>
          </el-row>
        </p>
        <p style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="4">地址余额：</el-col>
            <el-col :span="20"
              >{{ Balance }}
              <el-button
                style="margin-left: 50px;"
                :loading="balanceLoading"
                @click="getBalance()"
                size="small"
                >刷新余额</el-button
              >
              <el-button
                @click="openAddressModel"
                size="small"
                :loading="withdrawLoading"
                style="margin-left: 20px;"
                >取出余额</el-button
              >
            </el-col>
          </el-row>
        </p>
      </div>
    </div>

    <p class="tips">注意：请仔细核对数据后，再开始转账</p>

    <div class="table_wrap">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        style="width: 100%"
        v-loading="tableLoading"
      >
        <el-table-column
          :index="sort_index"
          align="center"
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column prop="Address" label="Address"> </el-table-column>
        <el-table-column prop="Amount" label="Amount" width="240">
          <template slot-scope="scope">
            {{ scope.row.Amount }}
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
    <div v-if="accountAddress">
      <el-button
        :loading="transferLoading"
        @click="handlerStart()"
        type="primary"
        >开始转账</el-button
      >
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import XLSX from 'xlsx'
import { BigNumber } from 'bignumber.js'
import { mapState } from 'vuex'

export default {
  name: 'home',
  data() {
    return {
      billList: [],
      tableData: [],
      fileName: '',
      ruleForm: {
        contractAddress: '',
        eventType: ''
      },
      tokenType: 'ONT',
      rules: {
        contractAddress: [
          {
            pattern: /\S/,
            required: true,
            message: '请输入合约地址',
            trigger: 'change'
          }
        ],
        eventType: [
          {
            min: 2,
            max: 18,
            pattern: /^[\S]{2,18}$/,
            required: true,
            message: '长度为2～18个字符，且不能有空格!',
            trigger: 'change'
          }
        ]
      },
      showF: {
        isWallet: true,
        isPassword: true,
        isContAdd: false,
        isPri: false
      },
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      accountAddress: '',
      historyAction: '',
      EstimateFee: 0,
      TotalSum: 0,
      Balance: 0,
      upLoading: false,
      balanceLoading: false,
      transferLoading: false,
      withdrawLoading: false,
      tableLoading: false
    }
  },
  methods: {
    download() {
      window.open('http://172.168.3.174/template.xlsx')
    },
    readExcel(e) {
      //表格导入
      var that = this
      const files = e.target.files
      // console.log(files)
      if (files.length <= 0) {
        //如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }

      that.fileName = files[0].name
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) //生成json表格内容

          that.billList = [] //清空接收数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = {
              address: ws[i].address,
              amount: ws[i].amount
            }
            that.billList.push(sheetData)
          }
          that.billList.map(value => {
            value.amount = that.getFullNum(value.amount)
          })
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
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
    submitForm(formName) {
      if (this.billList.length <= 0) {
        return this.$message({
          type: 'error',
          message: '请上传一个 Excel 文件!'
        })
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.options.includes(this.ruleForm.eventType)) {
            return this.$message({
              type: 'error',
              message: '检测到有重复事件名称，请重新输入！'
            })
          }
          this.upLoading = true
          return this.sendExcel()
        }
      })
    },
    async sendExcel() {
      let apires = await this.$http.UploadExcel(this.dataParams)

      this.upLoading = false
      if (apires.Error !== 1) {
        let str = apires.Result || apires.Desc
        return this.$message.error(str)
      }
      const { BillList, EstimateFee, Admin, Sum, AdminBalance } = apires.Result
      this.tableData = [...BillList]
      this.EstimateFee = EstimateFee
      this.accountAddress = Admin
      this.TotalSum = Sum
      this.Balance = AdminBalance

      this.$store.dispatch('getEventList')
      this.getHistory = ''
      return this.$message.success('上传成功！')
    },
    sort_index(idx) {
      return idx + 1 + (this.currentPage - 1) * this.pageSize
    },
    getFullNum(num) {
      //处理非数字
      if (isNaN(num)) {
        return num
      }
      //处理不需要转换的数字
      var str = '' + num
      if (!/e/i.test(str)) {
        return num + ''
      }

      return num.toFixed(18).replace(/\.?0+$/, '')
    },
    async handlerSelect(event) {
      if (event) {
        let params = {
          id: 1,
          jsonrpc: '2.0',
          method: 'getdatabyeventtype',
          params: {
            eventType: [event]
          }
        }
        try {
          this.tableLoading = true
          let apires = await this.$http.getHistory(params)
          this.tableLoading = false
          let data = apires.Result[0]
          this.tableData = [...data.TxInfo]
          this.EstimateFee = data.EstimateFee
          this.accountAddress = data.Admin
          this.TotalSum = data.Sum
          this.Balance = data.AdminBalance
          this.ruleForm.eventType = data.EventType
          this.ruleForm.contractAddress = data.ContractAddress
          this.tokenType = data.TokenType
        } catch (error) {
          this.tableLoading = false
        }
      }
    },
    async handlerStart() {
      // if (this.TotalSum > this.Balance) {
      //   return this.$message({
      //     type: 'error',
      //     message: '地址余额小于总额！'
      //   })
      // }

      let params = {
        id: 1,
        jsonrpc: '2.0',
        method: 'transfer',
        params: {
          eventType: this.ruleForm.eventType
        }
      }
      this.transferLoading = true
      let apires = await this.$http.startTransfer(params)
      this.transferLoading = false
      const { Desc, Error, Result } = apires
      if (Desc !== 'SUCCESS' || Error !== 1) {
        return this.$message({
          type: 'error',
          message: Desc
        })
      }
      this.$message({
        type: 'success',
        message: '已开始转账'
      })
    },
    async getBalance() {
      if (!this.accountAddress) {
        return this.$message({
          type: 'error',
          message: '选择一个事件名称!'
        })
      }
      this.balanceLoading = true
      let apires = await this.$http.getBalance(this.ruleForm.eventType)
      // console.log(apires)
      const { Desc, Error, Result } = apires
      this.balanceLoading = false
      if (Desc !== 'SUCCESS' && Error !== 1) {
        return this.$message({
          type: 'error',
          message: Desc
        })
      }
      this.Balance = Result
      return this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    openAddressModel() {
      if (!this.accountAddress) {
        return this.$message({
          type: 'error',
          message: '选择一个事件名称!'
        })
      }
      this.$prompt('请输入地址', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入地址'
      })
        .then(({ value }) => {
          let params = {
            id: 1,
            jsonrpc: '2.0',
            method: 'withdraw',
            params: {
              eventType: this.ruleForm.eventType,
              address: value
            }
          }
          console.log(params)
          this.withdrawLoading = true
          this.withdraw(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    async withdraw(params) {
      let apiRes = await this.$http.withDraw(params)
      console.log(apiRes)
      this.withdrawLoading = false
      const { Desc, Error, Result } = apiRes
      if (Desc !== 'SUCCESS' && Error !== 1) {
        return this.$message({
          type: 'error',
          message: Desc
        })
      }
      this.$message({
        type: 'success',
        message: '取出成功，请稍后查看！'
      })
    }
  },
  mounted() {
    this.$refs.upload.addEventListener('change', async e => {
      await this.readExcel(e)
      this.$refs.upload.value = ''
    })
  },
  watch: {
    tokenType(val) {
      switch (val) {
        case 'ERC20':
          this.showF.isWallet = false
          this.showF.isPassword = false
          this.showF.isContAdd = true
          this.showF.isPri = true
          break
        case 'OEP4':
          this.showF.isWallet = true
          this.showF.isPassword = true
          this.showF.isContAdd = true
          this.showF.isPri = false
          break
        default:
          this.showF.isWallet = true
          this.showF.isPassword = true
          this.showF.isContAdd = false
          this.showF.isPri = false
          break
      }
    }
  },
  computed: {
    ...mapState({
      options: state => state.eventTypeList
    }),
    dataParams() {
      return {
        id: 1,
        jsonrpc: '2.0',
        method: 'uploadexecl',
        params: {
          billList: [...this.billList],
          ...this.ruleForm,
          tokenType: this.tokenType
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 20px;
  .top_wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .left,
    .right {
      width: 100%;
      max-width: 600px;
    }
    .right {
      .select_wrap {
        margin-bottom: 20px;
      }
      p {
        font-size: 14px;
        line-height: 24px;
      }
    }
    .left {
      margin-right: 20px;
      .top_select {
        display: flex;
        justify-content: space-between;
        .select_excel {
          width: 70%;
        }
      }
    }
  }
  .file_name {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    margin-top: 6px;
  }
  .table_wrap {
    width: 800px;
    // margin: 0 auto;
    margin-top: 20px;
  }
  .el-pagination {
    margin: 50px;
    text-align: center;
  }
  .from_area {
    width: 600px;
    // height: 400px;
    margin-top: 10px;
  }
  .select_names {
    font-size: 14px;
    color: #606266;
  }
  p.tips {
    color: red;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 10px;
  }
}
</style>
