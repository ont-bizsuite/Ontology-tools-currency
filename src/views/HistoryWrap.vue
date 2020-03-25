<template>
  <div class="hostory_wraps" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="his_area1">
      <div class="ele_item">
        <div class="label_title">发放任务名称</div>
        <div class="actions_areas">
          <el-select v-model="currentEvent" filterable placeholder="请选择">
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
          状态
        </div>
        <div class="input_area">
          <div class="btype inpress" v-if="transPro.evtStatus === 1">
            执行中
          </div>
          <div class="btype" v-else-if="transPro.evtStatus === 2">已完成</div>
          <div class="btype" v-else-if="transPro.evtStatus === 0">未开始</div>
          <div class="btype" v-else></div>
        </div>
      </div>
      <div class="search_area">
        <div class="btns" @click="queryTransPro">查询</div>
      </div>
    </div>
    <div class="his_area2">
      <ul>
        <li>
          总交易笔数：<span>{{ transPro.total }}</span>
        </li>
        <li>
          交易成功：<span>{{ transPro.success }}</span>
        </li>
        <li>
          交易失败：<span>{{ transPro.failed }}</span>
        </li>
      </ul>
      <div class="search_area">
        <div class="btns" @click="handlerStart">失败交易重新执行</div>
      </div>
    </div>
    <div class="his_area3">
      <div class="ele_item">
        <div class="label_title">
          管理员地址余额
        </div>
        <div class="input_area balance_wrap">
          <!-- <input type="text" disabled placeholder="adsfasdfasdf" /> -->
          <div class="balance_item">
            <ul v-if="AdminBalance">
              <li v-for="(item, key) in AdminBalance" :key="key">
                <div class="balance_area">{{ key }}: {{ item }}</div>
                <div class="btn_balance" @click="withdrew">提取余额</div>
              </li>
            </ul>
            <div v-else class="no_balance"></div>
          </div>
        </div>
      </div>
      <div class="search_area">
        <!-- <div class="no_colors" @click="getBalance">刷新余额</div> -->
        <div class="no_colors" @click="withdrew">刷新余额</div>

        <!-- <div class="no_colors saveMon">提取余额</div> -->
      </div>
    </div>
    <div class="his_area4">
      <div class="search_select">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="状态">
            <div>
              <el-select v-model="formInline.status" placeholder="--所有状态--">
                <el-option label="所有状态" :value="6"></el-option>
                <el-option label="未构造交易" :value="0"></el-option>
                <el-option label="构建交易失败" :value="1"></el-option>
                <el-option label="发送失败" :value="2"></el-option>
                <el-option label="转账进行中" :value="3"></el-option>
                <el-option label="交易失败" :value="4"></el-option>
                <el-option label="交易成功" :value="5"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary">筛选</el-button>
          </el-form-item> -->
        </el-form>
        <div class="excel_btn">
          <div class="no_colors">导出Excel</div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
      <div class="ont-pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
    <Dialog-div
      @colseFn="handlerCloseDialog"
      :dialogFormVisible="dialogFormVisible"
    ></Dialog-div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DialogDiv from '@/components/modules/Dialog'

export default {
  components: {
    DialogDiv
  },
  computed: {
    ...mapState({
      netType: state => state.netType,
      eventTypeList: state => state.eventTypeList
    })
  },
  data() {
    return {
      dialogFormVisible: false,
      currentPage: 1,
      currentEvent: '',
      formInline: {
        status: ''
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
      AdminBalance: null
    }
  },
  methods: {
    handlerCloseDialog(params) {
      this.dialogFormVisible = params
      clearInterval(this.timer)
    },
    withdrew() {
      this.dialogFormVisible = true
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
    async queryTransPro() {
      if (!this.currentEvent) {
        this.$message({
          type: 'error',
          message: '请先选择一个事件！'
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
    },
    async handlerStart() {
      if (!this.currentEvent) {
        this.$message({
          type: 'error',
          message: '请先选择一个事件！'
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
    },
    async getBalance() {
      if (!this.currentEvent) {
        this.$message({
          type: 'error',
          message: '请先选择一个事件！'
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
    }
  },
  mounted() {
    this.$store.dispatch('getEventList', this.netType)
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
    line-height: 14px;
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
    transition: all 0.5s;
    &:hover {
      opacity: 0.8;
    }
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
    }
  }
}
.his_area3,
.his_area4 {
  margin-top: 50px;
}
.no_colors {
  padding: 8px 28px;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 33px;
  line-height: 16px;
  border-radius: 17px;
  margin-left: 40px;
  cursor: pointer;
  transition: all 0.6s;
  &:hover {
    background: #fafafa;
  }
}
.saveMon {
  color: #48a3ff;
}
/deep/.el-input__inner {
  border-radius: 0;
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
  font-weight: 600;
  line-height: 17px;
}
.inpress.btype {
  background: #f5f7f6;
}
</style>
