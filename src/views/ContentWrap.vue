<template>
  <div
    class="content_wrap_layout"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="step1_wrap">
      <div class="mainTitle">
        <h2>Step 1</h2>
      </div>
      <div class="subTitle">
        <span>请填写本次发放任务的基本信息</span>
      </div>
      <div class="form_area">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="190px"
          class="demo-ruleForm"
        >
          <el-form-item label="任务名称" prop="eventType">
            <el-input v-model="ruleForm.eventType"></el-input>
          </el-form-item>
          <el-form-item label="发放币种" prop="tokenType">
            <el-select v-model="ruleForm.tokenType" placeholder="--选择币种--">
              <el-option label="ONT" value="ONT"></el-option>
              <el-option label="ONG" value="ONG"></el-option>
              <el-option label="ERC20" value="ERC20"></el-option>
              <el-option label="OEP4" value="OEP4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="showTran"
            label="代币合约地址"
            prop="contractAddress"
          >
            <el-input v-model="ruleForm.contractAddress"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="step2_wrap">
      <div class="mainTitle">
        <h2>Step 2</h2>
      </div>
      <div class="subTitle">
        <span>请上传发放明细文件</span>
        <span class="template_btn" @click="download">发放明细模版</span>
      </div>
      <div class="form_area">
        <div class="ele_item">
          <div class="lable_title">请导入发放明细</div>
          <div class="input_area" @click="submitForm">
            <div class="input_temp">
              <span v-if="!fileName" class="placehodel"
                >浏览文件（.xsl,.xlsx）</span
              >
              <span v-else class="file_name">{{ fileName }}</span>
            </div>
            <span class="upload_icon"></span>
          </div>
          <input
            type="file"
            ref="upload"
            accept=".xls,.xlsx"
            class="outputlist_upload"
            style="display: none;"
          />
        </div>
        <div class="ele_item" style="margin-top: 26px">
          <ul class="data_nav">
            <li>
              发放总额：<span v-if="!TotalCoin">暂无数据</span>
              <span v-else>{{ TotalCoin }}</span>
            </li>
            <li>
              预估手续费：<span v-if="!TotalFee">暂无数据</span
              ><span v-else>{{ TotalFee }}</span>
            </li>
            <li>
              手续费种类：<span v-if="!isShowTypeFee">暂无数据</span
              ><span v-else>{{
                changeForm.tokenType === 'ERC20' ? 'ERC20' : 'ONG'
              }}</span>
            </li>
            <li>
              发放笔数：<span v-if="!TotalData">暂无数据</span
              ><span v-else>{{ TotalData }}</span>
            </li>
          </ul>
          <!-- <span class="eye_icon"></span> -->
        </div>
      </div>
      <div class="table_wrap">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="tableLoading"
        >
          <el-table-column label="序号" align="center" width="70">
            <template scope="scope"
              ><span
                >{{ scope.$index + (currentPage - 1) * pageSize + 1 }}
              </span></template
            >
          </el-table-column>

          <el-table-column prop="address" label="Address"> </el-table-column>
          <el-table-column prop="amount" label="Amount" width="240">
            <template slot-scope="scope">
              {{ scope.row.amount }}
            </template>
          </el-table-column>
        </el-table>
        <div class="ont-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="1"
            layout="total, prev, pager, next, jumper"
            :total="TotalData"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="step3_wrap">
      <div class="mainTitle">
        <h2>Step 3</h2>
      </div>
      <div class="subTitle">
        <span>转入需要发放的Token</span>
      </div>
      <div class="form_area">
        <div class="ele_item">
          <div class="lable_title">
            请将需要批量发放的 Token 存入如下地址
          </div>
          <div class="input_area">
            <input type="text" v-model="tokenAddress" disabled placeholder="" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            需充值发放币种总额
          </div>
          <div class="input_area">
            <input type="text" v-model="TotalCoin" disabled placeholder="" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            需充值手续费总额
          </div>
          <div class="input_area">
            <input type="text" v-model="TotalFee" disabled placeholder="" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            当前地址余额
          </div>
          <div v-if="AdminBalance" class="input_area balances">
            <div
              class="balanceType"
              v-for="(item, key) in AdminBalance"
              :key="key"
            >
              <div class="btype">{{ key }}: {{ item }}</div>
              <span class="depl_btn">提取余额</span>
            </div>
          </div>
          <div class="no_tems" v-else></div>

          <div class="action_area">
            <span class="ref_btn" @click="getBalance">刷新余额</span>
          </div>
        </div>
      </div>
    </div>
    <div class="starts_btn" @click="handlerStart">
      开始转账
    </div>
    
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { mapState } from 'vuex'

export default {
  computed: {
    showTran() {
      if (
        this.ruleForm.tokenType === 'ERC20' ||
        this.ruleForm.tokenType === 'OEP4'
      ) {
        return true
      } else {
        return false
      }
    },
    ...mapState({
      netType: state => state.netType
    }),
    dataParams() {
      return {
        id: 1,
        jsonrpc: '2.0',
        method: 'uploadexecl',
        params: {
          billList: [...this.billList],
          ...this.ruleForm,
          netType: this.netType
        }
      }
    }
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      isShowTypeFee: false,
      fullscreenLoading: false,
      ruleForm: {
        eventType: '',
        tokenType: '',
        contractAddress: ''
      },
      rules: {
        eventType: [
          {
            min: 2,
            max: 18,
            pattern: /^[\S]{2,18}$/,
            required: true,
            message: '长度为2～18个字符，且不能有空格!',
            trigger: 'change'
          }
        ],
        tokenType: [
          { required: true, message: '请选择 Token 类型', trigger: 'change' }
        ],
        contractAddress: [
          {
            pattern: /\S/,
            required: true,
            message: '请输入合约地址',
            trigger: 'change'
          }
        ]
      },
      fileName: '',
      billList: [],
      AdminBalance: null,
      tokenAddress: '',
      TotalCoin: '',
      TotalFee: '',
      TotalData: 0,
      changeForm: { eventType: '', tokenType: '', contractAddress: '' },
      currentPage: 1,
      pageSize: 1,
      pageNum: 1
    }
  },
  methods: {
    download() {
      window.open('http://172.168.3.174/template.xlsx', '_blank')
    },
    submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          // alert('submit!')
          // console.log(event)
          // await this.readExcel(event)
          // this.$refs.upload.value = ''
          // this.$refs.upload.addEventListener('change', async e => {
          this.$refs.upload.click()
          //   await this.readExcel(e)
          //   // this.$refs.upload.value = ''
          //   // this.submitForm(e)
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
    readExcel(e) {
      //表格导入
      var that = this
      const files = e.target.files
      // console.log(files)
      if (files.length <= 0) {
        //如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error(
          'The upload format is incorrect. Please upload a file in xls or xlsx format!'
        )
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
          // console.log(this.billList)
          this.sendExcel()
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    async sendExcel() {
      this.fullscreenLoading = true
      try {
        let apires = await this.$http.UploadExcel(this.dataParams)
        console.log('apires', apires)
        this.fullscreenLoading = false
        if (apires.Error !== 1) {
          let str = apires.Result || apires.Desc
          return this.$message.error(str)
        }
        // return
        this.isShowTypeFee = true
        const {
          bill_list,
          token_type,
          admin,
          estimate_fee,
          Sum,
          AdminBalance,
          Total
        } = apires.Result
        // this.tableData = [...bill_list]
        this.tokenAddress = admin
        this.TotalFee = estimate_fee
        this.TotalCoin = Sum
        this.AdminBalance = AdminBalance
        this.TotalData = Total
        this.changeForm = { ...this.ruleForm }
        // this.$store.dispatch('getEventList')
        // this.getHistory = ''
        this.getTableData({
          eventType: this.changeForm.eventType,
          netType: this.netType,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        return this.$message.success('上传成功！')
      } catch (error) {
        this.fullscreenLoading = false
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // this.currentPage = 1
      // this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTableData({
        eventType: this.changeForm.eventType,
        netType: this.netType,
        pageNum: val,
        pageSize: this.pageSize
      })
    },
    async getTableData(data) {
      this.tableLoading = true
      try {
        let apires = await this.$http.queryTableData(data)
        console.log(apires)
        this.tableLoading = false
        if (apires.Error !== 1) {
          let str = apires.Result || apires.Desc
          return this.$message.error(str)
        }
        this.tableData = apires.Result.bill_list
        this.TotalData = apires.Result.Total
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error)
      }
    },
    async getBalance() {
      if (!this.changeForm.eventType) {
        return this.$message({
          type: 'error',
          message: '请先上传数据或选择一个事件!'
        })
      }
      this.fullscreenLoading = true
      try {
        let apires = await this.$http.getBalance({
          eventType: this.changeForm.eventType,
          netType: this.netType
        })
        this.fullscreenLoading = false
        console.log(apires)
        const { Desc, Error, Result } = apires

        if (Desc !== 'SUCCESS' && Error !== 1) {
          return this.$message({
            type: 'error',
            message: Desc
          })
        }
        this.AdminBalance = { ...Result }
        return this.$message({
          type: 'success',
          message: '查询成功'
        })
      } catch (error) {
        this.fullscreenLoading = false
        return this.$message({
          type: 'error',
          message: error
        })
      }
    },
    async handlerStart() {
      let params = {
        id: 1,
        jsonrpc: '2.0',
        method: 'transfer',
        params: {
          eventType: this.changeForm.eventType,
          netType: this.netType
        }
      }
      this.fullscreenLoading = true
      try {
        let apires = await this.$http.startTransfer(params)
        this.fullscreenLoading = false
        const { Desc, Error, Result } = apires
        if (Desc !== 'SUCCESS' || Error !== 1) {
          return this.$message({
            type: 'error',
            message: Desc
          })
        }
        return this.$message({
          type: 'success',
          message: '已开始转账'
        })
      } catch (error) {
        this.fullscreenLoading = false
        this.$message({
          type: 'error',
          message: error
        })
      }
    }
  },
  mounted() {
    this.$refs.upload.addEventListener('change', async e => {
      await this.readExcel(e)
      this.$refs.upload.value = ''
    })
  }
}
</script>
<style lang="less" scoped>
.content_wrap_layout {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  .step1_wrap,
  .step3_wrap,
  .step2_wrap {
    padding-top: 34px;
    .mainTitle {
      display: flex;
      justify-content: flex-start;
      h2 {
        height: 50px;
        font-size: 36px;
        font-weight: 600;
        color: rgba(30, 30, 30, 1);
        line-height: 50px;
        border-bottom: 3px solid #000;
      }
      margin-bottom: 20px;
    }
    .subTitle {
      line-height: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 18px;
        color: rgba(30, 30, 30, 1);
      }
    }
    .form_area {
      margin-top: 60px;
    }
  }
  span.template_btn {
    display: block;
    height: 33px;
    padding: 8px 16px;
    font-size: 12px !important;
    color: #48a3ff !important;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 16.5px;
    line-height: 16px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      background: #fafafa;
    }
  }
  .step2_wrap {
    .form_area {
      .ele_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .lable_title {
          font-size: 12px;
          line-height: 45px;
          width: 190px;
          padding-right: 20px;
          font-weight: 600;
        }
        .input_area {
          flex: 1;
          display: flex;
          justify-content: space-between;
          height: 45px;
          align-items: center;
          cursor: pointer;
          span.upload_icon {
            width: 25px;
            height: 26px;
            background: url(../assets/upload_black.svg) no-repeat center;
            background-size: contain;
            margin-left: 15px;
            cursor: pointer;
            transition: all 0.5s;
            &:hover {
              opacity: 0.6;
            }
          }
          .input_temp {
            flex: 1;
            height: 100%;
            line-height: 45px;
            padding-left: 17px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            span.placehodel {
              font-size: 12px;
              color: rgba(30, 30, 30, 0.3);
            }
            span.file_name {
              color: #000;
              font-size: 12px;
            }
          }
        }
        span.eye_icon {
          width: 25px;
          height: 17px;
          background: url(../assets/check_black.svg) no-repeat center;
          background-size: contain;
          margin-left: 15px;
          cursor: pointer;
          transition: all 0.6s;
        }
        .data_nav {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0.2);
          li {
            width: 25%;
            min-height: 45px;
            font-size: 12px;
            padding: 14px 12px;
            border-right: 1px solid rgba(0, 0, 0, 0.2);
            font-weight: 600;
            line-height: 17px;
            &:nth-last-of-type(1) {
              border-right: none;
            }
          }
        }
      }
    }
  }
  .step3_wrap {
    .form_area {
      .ele_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        .lable_title {
          padding: 10px 12px 10px 0;
          font-size: 12px;
          line-height: 14px;
          min-height: 45px;
          width: 190px;
          padding-right: 20px;
          font-weight: 600;
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
        .balances.input_area {
          justify-content: flex-start;
          flex-direction: column;
          height: auto;
          .balanceType {
            width: 100%;
            height: 45px;
            line-height: 45px;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .btype {
              flex: 1;
              min-height: 45px;
              font-size: 12px;
              padding: 14px 12px;
              border: 1px solid rgba(0, 0, 0, 0.2);
              font-weight: 600;
              line-height: 17px;
              background: #f5f7f6;
            }
            &:nth-last-of-type(1) {
              margin-bottom: 0;
            }
          }
        }
        .no_tems {
          flex: 1;
          height: 45px;
          line-height: 45px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .action_area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            width: 104px;
            height: 33px;
            border-radius: 17px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            text-align: center;
            line-height: 31px;
            font-size: 12px;
            box-sizing: border-box;
            margin-left: 20px;
            cursor: pointer;
            transition: all 0.5s;
            &:hover {
              background: #fafafa;
            }
          }
          span.depl_btn {
            color: #48a3ff;
          }
        }
      }
    }
  }
}
span.depl_btn {
  width: 104px;
  height: 33px;
  border-radius: 17px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 31px;
  font-size: 12px;
  box-sizing: border-box;
  margin-left: 20px;
  cursor: pointer;
  transition: all 0.5s;
  color: #48a3ff;
}
/deep/ .el-form {
  .el-form-item {
    .el-form-item__label {
      font-size: 12px !important;
      color: #000 !important;
      font-weight: 600;
    }
    .el-form-item__content {
      margin-left: 190px !important;
      .el-input__inner {
        border-radius: 0;
        height: 45px;
        padding: 12px;
        line-height: 19px;
      }
      .el-input.is-active .el-input__inner,
      .el-input__inner:focus {
        border-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
.starts_btn {
  margin: 16px 0 120px;
  height: 45px;
  background: rgba(72, 163, 255, 1);
  color: #fff;
  font-size: 12px;
  line-height: 45px;
  text-align: center;
  transition: all 0.6s;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.table_wrap {
  margin-top: 30px;
}
.ont-page {
  text-align: right;
  margin-top: 30px;
}
</style>
