<template> 
  <div class="app-container">
<!--    <el-card class="filter-container" shadow="never">-->
<!--      <div>-->
<!--        <i class="el-icon-search"></i>-->
<!--        <span>筛选搜索</span>-->
<!--        <el-button-->
<!--          style="float:right"-->
<!--          type="primary"-->
<!--          @click="handleSearchList()"-->
<!--          size="small">-->
<!--          查询搜索-->
<!--        </el-button>-->
<!--        <el-button-->
<!--          style="float:right;margin-right: 15px"-->
<!--          @click="handleResetSearch()"-->
<!--          size="small">-->
<!--          重置-->
<!--        </el-button>-->
<!--      </div>-->
<!--      <div style="margin-top: 15px">-->
<!--        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">-->
<!--          <el-form-item label="输入搜索：">-->
<!--            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="收货人：">-->
<!--            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="收货人姓名/手机号码"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="提交时间：">-->
<!--            <el-date-picker-->
<!--              class="input-width"-->
<!--              v-model="listQuery.createTime"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              type="date"-->
<!--              placeholder="请选择时间">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="订单状态：">-->
<!--            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>-->
<!--              <el-option v-for="item in statusOptions"-->
<!--                         :key="item.value"-->
<!--                         :label="item.label"-->
<!--                         :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="订单分类：">-->
<!--            <el-select v-model="listQuery.orderType" class="input-width" placeholder="全部" clearable>-->
<!--              <el-option v-for="item in orderTypeOptions"-->
<!--                         :key="item.value"-->
<!--                         :label="item.label"-->
<!--                         :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="订单来源：">-->
<!--            <el-select v-model="listQuery.sourceType" class="input-width" placeholder="全部" clearable>-->
<!--              <el-option v-for="item in sourceTypeOptions"-->
<!--                         :key="item.value"-->
<!--                         :label="item.label"-->
<!--                         :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </el-card>-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
<!--        <el-table-column type="selection" width="60" align="center"></el-table-column>-->
        <el-table-column label="编号" width="50" align="center">
          <template slot-scope="scope">{{ scope.row.orderId }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="171" align="center">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="用户编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.customerId }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="143" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="商品名称" width="186" align="center">
          <template slot-scope="scope">￥{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="商品类型名" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.productTypeName }}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="81" align="center">
          <template slot-scope="scope">{{ scope.row.productCnt }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="90" align="center">
          <template slot-scope="scope">{{ scope.row.orderMoney }}</template>
        </el-table-column>
        <el-table-column label="支付金额" width="87" align="center">
          <template slot-scope="scope">{{ scope.row.payMoney }}</template>
        </el-table-column>
        <el-table-column label="优惠金额" width="87" align="center">
          <template slot-scope="scope">{{ scope.row.districtMoney }}</template>
        </el-table-column>
        <el-table-column label="订单信息" width="286" align="center">
          <template slot-scope="scope">{{ scope.row.orderAddr }}</template>
        </el-table-column>
        <el-table-column label="支付时间" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.payTime }}</template>
        </el-table-column>
<!--        <el-table-column label="操作" width="100" align="center" fixed="right">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
<!--    <div class="batch-operate-container">-->
<!--      <el-select-->
<!--        size="small"-->
<!--        v-model="operateType" placeholder="批量操作">-->
<!--        <el-option-->
<!--          v-for="item in operateOptions"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-button-->
<!--        style="margin-left: 20px"-->
<!--        class="search-button"-->
<!--        @click="handleBatchOperate()"-->
<!--        type="primary"-->
<!--        size="small">-->
<!--        确定-->
<!--      </el-button>-->
<!--    </div>-->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[8,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import {fetchList, closeOrder, deleteOrder, getTotal} from '@/api/order'
import {formatDate} from '@/utils/date';
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 8,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null,
  currentIndex: null,
};
export default {
  name: "orderList",
  components: {LogisticsDialog},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      totalList: [],
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      statusOptions: [
        {
          label: '待付款',
          value: 0
        },
        {
          label: '待发货',
          value: 1
        },
        {
          label: '已发货',
          value: 2
        },
        {
          label: '已完成',
          value: 3
        },
        {
          label: '已关闭',
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: '正常订单',
          value: 0
        },
        {
          label: '秒杀订单',
          value: 1
        }
      ],
      sourceTypeOptions: [
        {
          label: 'PC订单',
          value: 0
        },
        {
          label: 'APP订单',
          value: 1
        }
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1
        },
        {
          label: "关闭订单",
          value: 2
        },
        {
          label: "删除订单",
          value: 3
        }
      ],
      logisticsDialogVisible: false
    }
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatPayType(value) {
      if (value === 1) {
        return '支付宝';
      } else if (value === 2) {
        return '微信';
      } else {
        return '未支付';
      }
    },
    formatSourceType(value) {
      if (value === 1) {
        return 'APP订单';
      } else {
        return 'PC订单';
      }
    },
    formatStatus(value) {
      if (value === 1) {
        return '待发货';
      } else if (value === 2) {
        return '已发货';
      } else if (value === 3) {
        return '已完成';
      } else if (value === 4) {
        return '已关闭';
      } else if (value === 5) {
        return '无效订单';
      } else {
        return '待付款';
      }
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleViewOrder(index, row) {
      this.$router.push({path: '/oms/orderDetail', query: {id: row.id}})
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({path: '/oms/deliverOrderList', query: {list: [listItem]}})
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的订单',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: '选中订单中没有可以发货的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$router.push({path: '/oms/deliverOrderList', query: {list: list}})
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
      // let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
      // this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
      // this.listQuery.currentIndex = currentIndex
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
      // let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
      // this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
      // this.listQuery.currentIndex = currentIndex
    },
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === '') {
        this.$message({
          message: '操作备注不能为空',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let params = new URLSearchParams();
      params.append('ids', this.closeOrder.orderIds);
      params.append('note', this.closeOrder.content);
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery.pageNum, this.listQuery.pageSize).then(response => {
          this.listLoading = false;
          this.list = response.data.data;
          // this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + defaultListQuery.pageSize)
          for (let i = 0; i < response.data.data.length; i++) {
            let dateee = new Date(response.data.data[i].payTime).toJSON();
            let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            response.data.data[i].payTime = date
          }

          //this.total = response.data.data.length;
        }
      );
      getTotal().then(res => {
        if (res.data.code === '00000') {
          this.total = res.data.data
        }
      });
    },
    deleteOrder(ids) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteOrder(params).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      })
    }
    ,
    covertOrder(order) {
      let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      };
      return listItem;
    }
  }
}
</script>
<style scoped>
.input-width {
  width: 203px;
}

.pagination-container{
  margin-bottom: 26px;
}

</style>


