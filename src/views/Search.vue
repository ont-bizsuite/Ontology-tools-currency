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
        <el-form-item label="事件类型" prop="eventType">
          <el-checkbox-group v-model="ruleForm.eventType">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="eventType"
            ></el-checkbox>
            <el-checkbox label="地推活动" name="eventType"></el-checkbox>
            <el-checkbox label="线下主题活动" name="eventType"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="eventType"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
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
            <el-select v-model="formInline.status" placeholder="状态列表">
              <el-option label="所有状态" :value="3"></el-option>
              <el-option label="转账成功" :value="1"></el-option>
              <el-option label="转账失败" :value="0"></el-option>
              <el-option label="转账中" :value="2"></el-option>
            </el-select>
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
      >
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column align="center" prop="status" width="160" label="状态">
          <template slot-scope="scope">
            <el-tag
              type="success"
              disable-transitions
              v-if="scope.row.status === 1"
              >转账成功</el-tag
            >
            <el-tag
              v-else-if="scope.row.status === 2"
              type="primary"
              disable-transitions
              >转账中</el-tag
            ><el-tag v-else type="danger" disable-transitions>转账失败</el-tag>
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
      tableData: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      formInline: {
        status: ''
      },
      originData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          status: 0
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          status: 1
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          status: 2
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          status: 3
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          status: 1
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          status: 2
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          status: 1
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          status: 2
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          status: 3
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          status: 1
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          status: 3
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          status: 1
        }
      ]
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
    onSubmit() {
      console.log('submit!')
      if (this.formInline.status === 3) {
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
      return arr.filter(item => item.status == type)
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
      require.ensure([], () => {
        const { export_json_to_excel } = require('../assets/js/Export2Excel')
        const tHeader = ['date', 'name', 'address', 'status']
        const filterVal = ['date', 'address', 'address', 'status']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  mounted() {
    if (this.formInline.status) {
      this.tableData = this.fliterStatus(
        this.originData,
        this.formInline.status
      )
    } else {
      this.tableData = this.originData
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
