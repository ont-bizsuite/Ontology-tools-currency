<template lang="">
  <div>
    <el-dialog
      ref="DialogRuleForm"
      :before-close="handleClose"
      title="提取余额"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" :model="ruleForm">
        <el-form-item
          label="请输入地址"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('colseFn', false)
    },
    submitForm() {
       if (!new RegExp(/\S/).test(this.ruleForm.address)) {
           return this.$message({
          type: 'error',
          message: 'Please enter the correct address!'
        })
       }
    }
  }
}
</script>
