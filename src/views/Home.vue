<template>
  <div class="home">
    <div class="select_excel">
      <p>Excel文件 (.xsl,.xlsx)</p>
      <p style="margin-top: 10px;">
        <el-button @click="clickFns" size="small">选择文件</el-button>
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

    <div class="from_area">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="币种">
          <el-radio-group v-model="tokenType">
            <el-radio label="ONG">ONG</el-radio>
            <el-radio label="ONT">ONT</el-radio>
            <el-radio label="ERC20">ERC20</el-radio>
            <el-radio label="OEP4">OEP4</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="showF.isWallet">
          <p class="select_names">钱包文件(.dat)</p>
          <p style="margin-top: 10px;">
            <el-button size="small" @click="selectFn">选择文件</el-button>
          </p>
          <p class="file_name">{{ walletFileName }}</p>
          <input
            type="file"
            ref="upload_dat"
            accept=".dat"
            class="outputlist_upload"
            @change="selectDat"
            style="display: none"
          />
        </div>
        <el-form-item v-if="showF.isPassword" label="钱包密码" prop="passowrd">
          <el-input type="password" v-model="ruleForm.passowrd"></el-input>
        </el-form-item>
        <el-form-item
          v-if="showF.isContAdd"
          label="合约地址"
          prop="contractAddress"
        >
          <el-input v-model="ruleForm.contractAddress"></el-input>
        </el-form-item>
        <el-form-item v-if="showF.isPri" label="私钥" prop="privateKey">
          <el-input type="privateKey" v-model="ruleForm.privateKey"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <p class="tips">注意：请仔细核对数据后，再开始转账</p>
    <div class="table_wrap">
      <el-table
        :data="
          billList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
        <el-table-column prop="address" label="Address"> </el-table-column>
        <el-table-column prop="amount" label="Amount" width="240">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="billList.length"
      >
      </el-pagination>
    </div>
    <div>
      <el-button @click="submitForm('ruleForm')" type="primary"
        >开始转账</el-button
      >
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import XLSX from 'xlsx'

export default {
  name: 'home',
  data() {
    return {
      billList: [],
      fileName: '',
      ruleForm: {
        passowrd: '',
        contractAddress: '',
        privateKey: '',
        wallet: ''
      },
      tokenType: 'ONG',
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
      pageSize: 10 // 每页的数据条数
    }
  },
  methods: {
    clickFns() {
      this.$refs.upload.click()
    },
    readExcel(e) {
      //表格导入
      var that = this
      const files = e.target.files
      console.log(files)
      if (files.length <= 0) {
        //如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      console.log(files)

      that.fileName = files[0].name
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          console.log(ev)
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) //生成json表格内容
          console.log(ws)
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
          if (this.tokenType !== 'ERC20') {
            if (!this.ruleForm.wallet) {
              return this.$message({
                type: 'error',
                message: '请上传一个钱包文件（.dat）!'
              })
            }
          }
          console.log(' submit!!')
          console.log(this.dataParams)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
        return num
      }

      return num.toFixed(18).replace(/\.?0+$/, '')
    }
  },
  mounted() {
    this.$refs.upload.addEventListener('change', e => {
      this.readExcel(e)
    })
  },
  watch: {
    tokenType(val) {
      this.resetForm('ruleForm')
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
          fileName: this.splitFileName(this.fileName)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 20px;
  .file_name {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    margin-top: 6px;
  }
  .table_wrap {
    width: 800px;
    // margin: 0 auto;
    margin-top: 50px;
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
