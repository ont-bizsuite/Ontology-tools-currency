<template>
  <div class="home">
    <div class="top_wrap">
      <div class="left">
        <div class="top_select">
          <div class="select_excel">
            <p>Excel文件 (.xsl,.xlsx)</p>
            <p style="margin-top: 10px;">
              <el-button @click="clickFns" size="small">导入文件</el-button>
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
            <!-- <a href="../assets/template.xlsx">下载模板</a> -->
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
        <p>总额：{{ TotalSum }}</p>
        <p>预估手续费：{{ EstimateFee }}</p>
        <p>钱包地址：{{ accountAddress }}</p>
        <p>发放笔数：{{ tableData.length }}</p>
        <p style="margin-bottom: 20px;">
          地址余额：{{ Balance }}
          <el-button
            style="margin-left: 50px;"
            :loading="balanceLoading"
            @click="getBalance()"
            size="small"
            >刷新余额</el-button
          >
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

export default {
  name: 'home',
  data() {
    return {
      billList: [],
      tableData: [],
      fileName: '',
      ruleForm: {
        // passowrd: '',
        contractAddress: '',
        // privateKey: '',
        // wallet: '',
        eventType: ''
      },
      tokenType: 'ONT',
      rules: {
        passowrd: [
          {
            pattern: /\S/,
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ],
        contractAddress: [
          {
            pattern: /\S/,
            required: true,
            message: '请输入合约地址',
            trigger: 'change'
          }
        ],
        privateKey: [
          {
            pattern: /\S/,
            required: true,
            message: '请输入私钥',
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
      walletFileName: '',
      showF: {
        isWallet: true,
        isPassword: true,
        isContAdd: false,
        isPri: false
      },
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页的数据条数
      totalAmount: 0,
      accountAddress: '',
      options: [],
      historyAction: '',
      EstimateFee: 0,
      TotalSum: 0,
      upLoading: false,
      Balance: 0,
      balanceLoading: false,
      transferLoading: false
    }
  },
  methods: {
    download() {
      window.open('http://172.168.3.174/template.xlsx')
    },
    clickFns() {
      this.$refs.upload.click()
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
          // let nnn = 0
          that.billList.map(value => {
            value.amount = that.getFullNum(value.amount)
            // that.totalAmount += Number(value.amount)
            // nnn = new BigNumber(value.amount).plus(nnn).toString()
          })
          // console.log(nnn)
          // that.totalAmount = nnn
          // this.$refs.upload.value = ''
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
          // console.log(this.dataParams)
          // return
          return this.sendExcel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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

      this.getEventType()
      this.getHistory = ''
      return this.$message.success('上传成功！')
    },
    selectDat(e) {
      let _self = this
      let file = e.target.files
      console.log('文件类型')
      console.log(file)

      if (file.length === 0) {
        return
      }
      _self.walletFileName = file[0].name
      let reader = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message({
          type: 'info',
          message: '您的浏览器不支持FileReader接口'
        })
        return
      }
      reader.readAsText(file[0])
      reader.onload = function(e) {
        console.log(e.target.result)
        _self.ruleForm.wallet = e.target.result
      }
    },
    selectFn() {
      this.$refs.upload_dat.click()
    },
    sort_index(idx) {
      return idx + 1 + (this.currentPage - 1) * this.pageSize
    },
    splitFileName(text) {
      var pattern = /\.{1}[a-z]{1,}$/
      if (pattern.exec(text) !== null) {
        return text.slice(0, pattern.exec(text).index)
      } else {
        return text
      }
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
      // console.log(event)
      if (event) {
        let params = {
          id: 1,
          jsonrpc: '2.0',
          method: 'getdatabyeventtype',
          params: {
            eventType: [event]
          }
        }
        let apires = await this.$http.getHistory(params)
        let data = apires.Result[0]
        this.tableData = [...data.TxInfo]
        this.EstimateFee = data.EstimateFee
        this.accountAddress = data.Admin
        this.TotalSum = data.Sum
        this.Balance = data.AdminBalance
        this.ruleForm.eventType = data.EventType
        this.ruleForm.contractAddress = data.ContractAddress
        this.tokenType = data.TokenType
      }
    },
    async getEventType() {
      let apires = await this.$http.getEventType()
      this.options = apires.Result
    },
    async handlerStart() {
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
    }
  },
  mounted() {
    this.$refs.upload.addEventListener('change', async e => {
      await this.readExcel(e)
      this.$refs.upload.value = ''
    })
    this.getEventType()
  },
  watch: {
    tokenType(val) {
      // this.resetForm('ruleForm')
      this.walletFileName = ''
      this.ruleForm.wallet = ''
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
    dataParams() {
      return {
        id: 1,
        jsonrpc: '2.0',
        method: 'uploadexecl',
        params: {
          billList: [...this.billList],
          ...this.ruleForm,
          tokenType: this.tokenType
          // fileName: this.splitFileName(this.fileName)
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
  .select_wrap {
    margin-top: 50px;
  }
}
</style>
