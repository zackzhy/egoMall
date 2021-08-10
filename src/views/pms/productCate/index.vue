<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.categoryId }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
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
      :title="isEdit?'编辑商品分类':'添加商品分类'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="productCateInfo"
               label-width="150px" size="small">
        <el-form-item label="分类名称">
          <el-input v-model="productCateInfo.categoryName" style="width: 250px"></el-input>
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
import {fetchList, deleteProductCate, updateShowStatus, updateNavStatus,
  deleteCategory,updateProCate,createProCate} from '@/api/productCate'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
  currentIndex: 0,
};

const defaultCateInfo = {
  categoryId: null,
  categoryName: null,
};

export default {
  name: "productCateList",
  data() {
    return {
      productCateInfo: Object.assign({}, defaultCateInfo),
      totalList: [],
      isEdit: false,
      dialogVisible: false,

      list: null,
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      parentId: 0
    }
  },
  created() {
    // this.resetParentId();
    this.getList();
  },
  // watch: {
  //   $route(route) {
  //     this.resetParentId();
  //     this.getList();
  //   }
  // },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddProductCate() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.productCateInfo = Object.assign({}, defaultCateInfo);
    },
    getList() {
      this.listLoading = true;
      fetchList().then(response => {
        this.listLoading = false;
        this.totalList = response.data.data;
        this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + defaultListQuery.pageSize)

        this.total = response.data.data.length;
        // console.log("total:" + this.total)
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      //this.getList();
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
    handleNavStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id)
      data.append('ids', ids);
      data.append('navStatus', row.navStatus);
      updateNavStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id)
      data.append('ids', ids);
      data.append('showStatus', row.showStatus);
      updateShowStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleShowNextLevel(index, row) {
      this.$router.push({path: '/pms/productCate', query: {parentId: row.id}})
    },
    handleTransferProduct(index, row) {
      console.log('handleAddProductCate');
    },
    // handleUpdate(index, row) {
    //   this.$router.push({path:'/pms/updateProductCate',query:{id:row.id}});
    // },
    handleUpdate(index, row) {
      //this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
      this.dialogVisible = true;
      this.isEdit = true;
      this.productCateInfo = Object.assign({}, row);
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(row.categoryId).then(res => {
          if (res.data.code === '00000') {
            this.$message.success(res.data.message)
            this.getList();
          }
        })
      })
    },

    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateProCate(this.productCateInfo.categoryId, this.productCateInfo.categoryName).then(response => {
            if (response.data.code === '00000') {
              this.$message.success(response.data.message)
              this.getList();
            }
            this.dialogVisible = false;
          })
        } else {
          createProCate(this.productCateInfo.categoryName).then(response => {
            if (response.data.code === '00000') {
              this.$message.success(response.data.message)
              this.getList();
            }
            this.dialogVisible = false;
          })
        }
      })
    },
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
