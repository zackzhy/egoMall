<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchBrandList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="品牌名称/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addBrand()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
<!--        <el-table-column type="selection" width="60" align="center"></el-table-column>-->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.supplierId}}</template>
        </el-table-column>
        <el-table-column label="品牌名称" width="370" align="center">
          <template slot-scope="scope">{{scope.row.supplierName}}</template>
        </el-table-column>
        <el-table-column label="品牌地址" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    <div class="batch-operate-container">-->
<!--      <el-select-->
<!--        size="small"-->
<!--        v-model="operateType" placeholder="批量操作">-->
<!--        <el-option-->
<!--          v-for="item in operates"-->
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
        :page-size="5"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog
      :title="isEdit?'编辑品牌信息':'添加品牌信息'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="brandInfo"
               label-width="150px" size="small">

        <el-form-item label="品牌名称">
          <el-input v-model="brandInfo.supplierName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="品牌地址">
          <el-input v-model="brandInfo.address" style="width: 250px"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import {fetchList, updateShowStatus, updateFactoryStatus,
    deleteBrand,updateBrandInfo,createBrandInfo} from '@/api/brand'

  const defaultBrandInfo = {
    supplierId: null,
    supplierName: null,
    address: null,
  };

  export default {
    name: 'brandList',
    data() {
      return {
        totalList: [],
        isEdit: false,
        dialogVisible: false,
        brandInfo: Object.assign({}, defaultBrandInfo),

        operates: [
          {
            label: "显示品牌",
            value: "showBrand"
          },
          {
            label: "隐藏品牌",
            value: "hideBrand"
          }
        ],
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5,
          currentIndex: 0,
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList().then(response => {
          this.listLoading = false;
          this.totalList = response.data.data;
          this.list = this.totalList.slice(this.listQuery.currentIndex,this.listQuery.currentIndex + this.listQuery.pageSize)

          this.total = response.data.data.length;
          // this.totalPage = response.data.totalPage;
          // this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleUpdate(index, row) {
        // this.$router.push({path: '/pms/updateBrand', query: {id: row.id}})
        this.dialogVisible = true;
        this.isEdit = true;
        this.brandInfo = Object.assign({}, row);
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBrand(row.supplierId).then(res=>{
            if (res.data.code === '00000') {
              this.$message.success(res.data.message)
              this.getList();
            }
          })
        });
      },
      getProductList(index, row) {
        console.log(index, row);
      },
      getProductCommentList(index, row) {
        console.log(index, row);
      },
      handleFactoryStatusChange(index, row) {
        var data = new URLSearchParams();
        data.append("ids", row.id);
        data.append("factoryStatus", row.factoryStatus);
        updateFactoryStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.factoryStatus === 0) {
            row.factoryStatus = 1;
          } else {
            row.factoryStatus = 0;
          }
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        ;
        data.append("ids", row.id);
        data.append("showStatus", row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex=currentIndex
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        //this.getList();
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex=currentIndex
      },
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let showStatus = 0;
        if (this.operateType === 'showBrand') {
          showStatus = 1;
        } else if (this.operateType === 'hideBrand') {
          showStatus = 0;
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        let data = new URLSearchParams();
        data.append("ids", ids);
        data.append("showStatus", showStatus);
        updateShowStatus(data).then(response => {
          this.getList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      addBrand() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.brandInfo = Object.assign({}, defaultBrandInfo);
      },

      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateBrandInfo(this.brandInfo.supplierId,this.brandInfo.supplierName,this.brandInfo.address).then(response => {
              if (response.data.code === '00000') {
                this.$message.success(response.data.message)
                this.getList();
              }
              this.dialogVisible = false;
            })
          } else {
            createBrandInfo(this.brandInfo.supplierName,this.brandInfo.address).then(response => {
              if (response.data.code === '00000') {
                this.$message.success(response.data.message)
                this.getList();
              }
              this.dialogVisible = false;
            })
          }
        })
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pagination-container{
  margin-bottom: 26px;
}

</style>


