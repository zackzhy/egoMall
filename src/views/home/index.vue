<template>
  <div class="app-container">
    <img :src="app_main_bg" class="app-main-bg">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日订单总数</div>
            <div class="total-value">{{tyOrderCount}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">{{tyOrderAmount}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">{{yyOrderAmount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{tmOrderCount}}</div>
              <div>
                <span class="color-success" style="font-size: 14px">{{tmCountRate}}</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{twOrderCount}}</div>
              <div>
                <span class="color-danger" style="font-size: 14px">{{twCountRate}}</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{tmOrderAmount}}</div>
              <div>
                <span class="color-success" style="font-size: 14px">{{tmAmountRate}}</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{twOrderAmount}}</div>
              <div>
                <span class="color-danger" style="font-size: 14px">{{twAmountRate}}</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {fetchList} from '@/api/order'
import {str2Date} from '@/utils/date';
import app_main_bg from '@/assets/images/app_main_bg.jpg';
import img_home_order from '@/assets/images/home_order.png';
import img_home_today_amount from '@/assets/images/home_today_amount.png';
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
import {getDate} from "../../utils/date";

const DATA_FROM_BACKEND = {
  columns: ['date', 'orderCount', 'orderAmount'],
  rows: [
    {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
    {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
    {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
    {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
    {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
    {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
    {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
    {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
    {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
    {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
    {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
    {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
    {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
    {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
    {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
  ]
};
export default {
  name: 'home',
  data() {
    return {
      tyOrderCount: 0,
      tyOrderAmount: 0,
      yyOrderAmount: 0,
      tmOrderCount: 0,
      twOrderCount: 0,
      tmOrderAmount: 0,
      twOrderAmount: 0,
      tmCountRate: 0,
      twCountRate: 0,
      tmAmountRate: 0,
      twAmountRate: 0,
      app_main_bg,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            end.setDate(end.getDate()+1)
            let start = new Date();
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            const end = new Date();
            end.setDate(end.getDate()+1)
            let start = new Date();
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderCountDate: '',
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: {right: ['orderAmount']},
        labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}
      },
      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
      orderList: []
    }
  },
  created() {
    this.initOrderCountDate();
    this.getOrderList()
    this.getData();
  },
  methods: {
    getOrderList(){
      fetchList().then(response => {
        this.loading = true;
        let originalOrderData = response.data.data;
        for (let i = 0; i < originalOrderData; i++) {
          let dateJson = new Date(originalOrderData[i].payTime).toJSON();
          let datetime = new Date(+new Date(dateJson) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          originalOrderData[i].payTime = datetime
        }
        this.orderList = originalOrderData;
        console.log("length:"+this.orderList.length)
      });
    },
    handleDateChange() {
      this.getData();
    },
    initOrderCountDate() {
      let today = new Date();
      let end=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
      let start=new Date();
      start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },
    getData() {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'orderCount', 'orderAmount'],
          rows: []
        };

        let today = new Date();
        let end=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
        let start=new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7);

        this.tmOrderAmount=0
        this.tmOrderCount=0
        this.twOrderAmount=0
        this.twOrderCount=0
        this.yyOrderAmount=0
        this.tyOrderAmount=0
        this.tyOrderCount=0
        let lwOrderCount=0
        let lmOrderCount=0
        let lwOrderAmount=0
        let lmOrderAmount=0
        for(let i=0;i<this.orderList.length;i++)
        {
          let payDate=new Date(this.orderList[i].payTime)
          let tWeekTime=payDate.getTime()-1000 * 60 * 60 * 24 * payDate.getDay()
          let tMonthTime=payDate.getTime()-1000 * 60 * 60 * 24 * payDate.getDate()
          let lWeekTime=tWeekTime-1000 * 60 * 60 * 24 * 7
          let lMonthTime=tMonthTime - 1000 * 60 * 60 * 24 * 30

          if(payDate.getDate()==end.getDate()-1){
            this.tyOrderCount++
            this.tyOrderAmount+=this.orderList[i].orderMoney
          }
          if(payDate.getDate()==end.getDate()-2)
          {
            this.yyOrderAmount+=this.orderList[i].orderMoney
          }
          if(payDate.getTime()<end.getTime()&&payDate.getTime()>tWeekTime)
          {
            this.twOrderCount++
            this.twOrderAmount+=this.orderList[i].orderMoney
          }
          if(payDate.getTime()<end.getTime()&&payDate.getTime()>tMonthTime)
          {
            this.tmOrderCount++
            this.tmOrderAmount+=this.orderList[i].orderMoney
          }
          if(payDate.getTime()<tWeekTime&&payDate.getTime()>lWeekTime)
          {
            lwOrderCount++
            lwOrderAmount+=this.orderList[i].orderMoney
          }
          if(payDate.getTime()<tMonthTime&&payDate.getTime()>lMonthTime)
          {
            lmOrderCount++
            lmOrderAmount+=this.orderList[i].orderMoney
          }
          this.tmCountRate=Math.round((this.tmOrderCount-lmOrderCount) / lmOrderCount * 10000) / 100 + "%";
          this.tmAmountRate=Math.round((this.tmOrderAmount-lmOrderAmount) / lmOrderAmount * 10000) / 100 + "%";
          this.twCountRate=Math.round((this.twOrderCount-lwOrderCount) / lwOrderCount * 10000) / 100 + "%";
          this.twAmountRate=Math.round((this.tmOrderCount-lwOrderAmount) / lwOrderAmount * 10000) / 100 + "%";
        }


        let end2= this.orderCountDate[1]
        let start2=this.orderCountDate[0];
        for(let i=0;i<(end2.getTime()-start2.getTime())/(1000 * 60 * 60 * 24);i++){
          let s=new Date(start2.getTime()+1000 * 60 * 60 * 24 * i)
          let e=new Date(s.getTime()+1000 * 60 * 60 * 24)
          let orderCount=0
          let orderAmount=0
          for(let j=0;j<this.orderList.length;j++){
            let payDate=new Date(this.orderList[j].payTime)
            if(payDate.getTime()>s.getTime()&&payDate.getTime()<e.getTime()){
              orderCount++
              orderAmount+=this.orderList[j].orderMoney
            }

          }
          this.chartData.rows.push(
            new Object({'date':getDate(s),'orderCount':orderCount,'orderAmount':orderAmount}));
        }

        console.log(this.chartData.rows)
        this.dataEmpty = false;
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.app-main-bg {
  margin-top: -45px;
  width: 100%;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  width: 253px;
  border: 1px solid #DCDFE6;
  padding: 10px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #DCDFE6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}

.address-content {
  padding: 20px;
  font-size: 18px
}
</style>
