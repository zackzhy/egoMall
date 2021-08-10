<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
<!--      <el-button-->
<!--        class="btn-add"-->
<!--        @click="handleAddMenu()"-->
<!--        size="mini">-->
<!--        添加-->
<!--      </el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="menuTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="99" align="center">
          <template slot-scope="scope">{{scope.row.customerAddrId}}</template>
        </el-table-column>
        <el-table-column label="用户编号" width="170" align="center">
          <template slot-scope="scope">{{scope.row.customerId}}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.zipcode}}</template>
        </el-table-column>
        <el-table-column label="地址" width="330" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="是否为默认地址" width="200" align="center">
          <template slot-scope="scope">{{scope.row.isDefault}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList,deleteAddress,updateMenu,updateHidden} from '@/api/menu'

  export default {
    name: "menuList",
    data() {
      return {
        totalList: [],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5,
          currentIndex: 0,
        },
        parentId: 0
      }
    },
    created() {
     // this.resetParentId();
      this.getList();
    },
    watch: {
      $route(route) {
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      handleAddMenu() {
        this.$router.push('/ums/addMenu');
      },
      getList() {
        this.listLoading = true;
        fetchList().then(response => {
          this.listLoading = false;
          this.totalList = response.data.data;
          this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + this.listQuery.pageSize)

          this.total = response.data.data.length;
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        //this.getList();
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex = currentIndex
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex = currentIndex
      },
      handleHiddenChange(index, row) {
        updateHidden(row.id,{hidden:row.hidden}).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/ums/menu', query: {parentId: row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/ums/updateMenu',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该地址', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAddress(row.customerAddrId).then(res => {
            if (res.data.code === '00000') {
              this.$message.success(res.data.message)
              this.getList();
            }
          });
        });
      }
    },
    filters: {
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
