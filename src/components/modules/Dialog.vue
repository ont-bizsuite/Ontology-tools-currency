<template lang="">
  <div>
    <el-dialog
      ref="DialogRuleForm"
      :before-close="handleClose"
      :title="$t('dialog.mainTitle')"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" :model="ruleForm">
        <el-form-item
          :label="$t('dialog.subTitle')"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('dialog.cancal') }}</el-button>
        <el-button type="primary" @click="submitForm">{{
          $t('dialog.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    withdrawData: {
      type: Object,
      default() {
        return { eventType: '', netType: '', tokenType: '' }
      }
    }
  },
  data() {
    return {
      //   dialogFormVisible: true,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      ruleForm: {
        address: ''
      },
      formLabelWidth: '200px'
    }
  },
  methods: {
    handleClose(done) {
      this.ruleForm.address = ''
      this.$emit('colseFn', false)
    },
    submitForm() {
      if (!new RegExp(/\S/).test(this.ruleForm.address)) {
        return this.$message({
          type: 'error',
          message: 'Please enter the correct address!'
        })
      }
      this.withdraw()
    },
    async withdraw() {
      let params = {
        id: 1,
        jsonrpc: '2.0',
        method: 'getdatabyeventtype',
        params: {
          ...this.withdrawData,
          address: this.ruleForm.address
        }
      }
      console.log(params)

      try {
        let apiRes = await this.$http.withDraw(params)
        console.log(apiRes)
        const { Desc, Error, Result } = apiRes
        if (Desc !== 'SUCCESS' && Error !== 1) {
          this.handleClose()
          return this.$message({
            type: 'error',
            message: Desc
          })
        }
        this.$message({
          type: 'success',
          message: 'Take out successfully, please check later!'
        })
        this.handleClose()
      } catch (error) {
        this.handleClose()
        return this.$message({
          type: 'error',
          message: error
        })
      }
    }
  }
}
</script>
