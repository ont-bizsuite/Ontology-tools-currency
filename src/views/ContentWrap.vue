<template>
  <div class="content_wrap_layout">
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
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="发放币种" prop="region">
            <el-select v-model="ruleForm.region" placeholder="--选择币种--">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代币合约地址" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
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
        <span class="template_btn">发放明细模版</span>
      </div>
      <div class="form_area">
        <div class="ele_item">
          <div class="lable_title">请导入发放明细</div>
          <div class="input_area">
            <div class="input_temp">
              <span class="placehodel">浏览文件（.xsl,.xlsx）</span>
              <span class="file_name">aaa</span>
            </div>
            <span class="upload_icon"></span>
          </div>
        </div>
        <div class="ele_item" style="margin-top: 26px">
          <ul class="data_nav">
            <li>发放总额：<span>暂无数据</span></li>
            <li>预估手续费：<span>暂无数据</span></li>
            <li>手续费种类：<span>暂无数据</span></li>
            <li>发放笔数：<span>暂无数据</span></li>
          </ul>
          <span class="eye_icon"></span>
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
            <input type="text" placeholder="adsfasdfasdf" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            需充值发放币种总额
          </div>
          <div class="input_area">
            <input type="text" disabled placeholder="adsfasdfasdf" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            需充值手续费总额
          </div>
          <div class="input_area">
            <input type="text" placeholder="adsfasdfasdf" />
          </div>
        </div>
        <div class="ele_item">
          <div class="lable_title">
            当前地址余额
          </div>
          <div class="input_area">
            <input type="text" placeholder="adsfasdfasdf" />
          </div>
          <div class="action_area">
            <span class="ref_btn">刷新余额</span>
            <span class="depl_btn">提取余额</span>
          </div>
        </div>
      </div>
    </div>
    <div class="starts_btn">
      开始转账
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
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
          span.upload_icon {
            width: 25px;
            height: 26px;
            background: url(../assets/upload_black.svg) no-repeat center;
            background-size: contain;
            margin-left: 15px;
            cursor: pointer;
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
</style>
