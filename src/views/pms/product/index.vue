<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <!--        <el-table-column type="selection" width="60" align="csenter"></el-table-column>-->
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          prop="restTime"
          label="是否秒杀"
          width="150"
          :filters="[{ text: '非秒杀商品', value: '非秒杀商品' }, { text: '秒杀商品', value: '秒杀商品' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.restTime === '非秒杀商品' ? 'success' : 'danger'"
              disable-transitions>{{ scope.row.restTime }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="商品名称" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="商品分类" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="108" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productTypeName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" width="86" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.supplierName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="58" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="商品库存" width="61" align="center">
          <template slot-scope="scope">{{ scope.row.inventory }}</template>
        </el-table-column>
        <el-table-column label="商品描述" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
            <!--            <p>-->
            <!--              <el-button-->
            <!--                size="mini"-->
            <!--                @click="handleShowLog(scope.$index, scope.row)">日志-->
            <!--              </el-button>-->
            <!--             -->
            <!--            </p>-->
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
      :title="isEdit?'编辑商品':'添加商品'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="proInfo"
               label-width="150px" size="small">
        <el-form-item label="图片URL">
          <el-input v-model="proInfo.picUrl" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="proInfo.productName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="proInfo.price" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input v-model="proInfo.inventory" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="proInfo.description" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-input v-if="isEdit" v-model="proInfo.categoryName" style="width: 250px" disabled></el-input>
          <el-select v-else v-model="newPdtAddiInfo.categoryId"
                     placeholder="请选择商品分类">
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品型号">
          <el-input v-if="isEdit" v-model="proInfo.productTypeName" style="width: 250px" disabled></el-input>
          <el-select v-else v-model="newPdtAddiInfo.productTypeId"
                     placeholder="请选择商品型号">
            <el-option
              v-for="item in typeList"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-if="isEdit" v-model="proInfo.supplierName" style="width: 250px" disabled></el-input>
          <el-select v-else v-model="newPdtAddiInfo.supplierId"
                     placeholder="请选择品牌">
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为秒杀商品">
          <template>
            <el-radio v-model="radioVal" label="1">是</el-radio>
            <el-radio v-model="radioVal" label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="秒杀时间" v-if="radioVal=='1'">
          <el-date-picker
            v-model="proInfo.restTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions0">
          </el-date-picker>
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
import {
  fetchList,
  updateDeleteStatus,
  updateNewStatus,
  updateRecommendStatus,
  updatePublishStatus,
  updateProInfo,
  createProInfo,
  deleteProduct
} from '@/api/product'
import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
import {fetchList as fetchProductAttrList} from '@/api/productAttr'
import {fetchList as fetchBrandList} from '@/api/brand'
import {fetchTypeList} from '@/api/productCate'
import {fetchListWithChildren, fetchList as fetchCategoryList} from '@/api/productCate'

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
const defaultProInfo = {
  id: null,
  productId: null,
  picUrl: null,
  productName: null,
  categoryName: null,
  productTypeName: null,
  supplierName: null,
  price: null,
  inventory: null,
  description: null,
  restTime: null,
};
export default {
  name: "productList",
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      totalList: [],
      newPdtAddiInfo: {
        categoryId: null,
        productTypeId: null,
        supplierId: null
      },
      categoryList: [],
      typeList: [],
      supplierList: [],
      radioVal: '2',

      editSkuInfo: {
        // dialogVisible:false,
        productId: null,
        productSn: '',
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null
      },
      operates: [
        {
          label: "商品上架",
          value: "publishOn"
        },
        {
          label: "商品下架",
          value: "publishOff"
        },
        {
          label: "设为推荐",
          value: "recommendOn"
        },
        {
          label: "取消推荐",
          value: "recommendOff"
        },
        {
          label: "设为新品",
          value: "newOn"
        },
        {
          label: "取消新品",
          value: "newOff"
        },
        {
          label: "转移到分类",
          value: "transferCategory"
        },
        {
          label: "移入回收站",
          value: "recycle"
        }
      ],
      dialogVisible: false,
      isEdit: false,
      proInfo: Object.assign({}, defaultProInfo),
      selectSupplierNameList: [],
      selectProductTypeNameList: [],
      selectCategoryList: [],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
      verifyStatusOptions: [{
        value: 1,
        label: '审核通过'
      }, {
        value: 0,
        label: '未审核'
      }]
    }
  },
  created() {
    this.getList();
    this.getBrandList();
    this.getProductCateList();
    this.getTypeList();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }

    }
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return '审核通过';
      } else {
        return '未审核';
      }
    }
  },
  methods: {
    filterTag(value, row) {
      if (value == '非秒杀商品') {
        return row.restTime === value;
      } else {
        return row.restTime !== "非秒杀商品"
      }
    },

    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.radioVal == '2') {
         this.proInfo.restTime=null
        }
        if (this.isEdit) {
          updateProInfo(this.proInfo.productId, this.proInfo.picUrl,
            this.proInfo.description, this.proInfo.price, this.proInfo.inventory,
            this.proInfo.productName, this.proInfo.restTime).then(response => {
            if (response.data.code === '00000') {

              this.$message.success(response.data.message)
              this.getList();
            }
            this.dialogVisible = false;
          })
        } else {
          createProInfo(this.proInfo.productId, this.proInfo.productName, this.proInfo.picUrl,
            this.proInfo.description, this.proInfo.price,
            this.proInfo.inventory, this.newPdtAddiInfo.productTypeId, this.proInfo.restTime,
            this.newPdtAddiInfo.categoryId, this.newPdtAddiInfo.supplierId).then(response => {
            if (response.data.code === '00000') {
              this.$message.success(response.data.message)
              this.getList();
            }
            this.dialogVisible = false;
          })
        }
      })
    },
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    getList() {
      this.listLoading = true;
      fetchList().then(response => {
          this.listLoading = false;

          this.totalList = response.data.data;
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].restTime == null) {
              response.data.data[i].restTime = '非秒杀商品'
            } else {
              let dateee = new Date(response.data.data[i].restTime).toJSON();
              let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
              response.data.data[i].restTime = date
            }
          }
          console.log(this.listQuery.currentIndex)
          this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + defaultListQuery.pageSize)

          this.total = response.data.data.length;


          // console.log("total:" + this.total)
        }
      )
      ;
    },
    getBrandList() {
      fetchBrandList().then(res => {
        if (res.data.code === '00000') {
          this.supplierList = res.data.data
        }
      })
      // fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
      //   this.brandOptions = [];
      //   let brandList = response.data.list;
      //   for (let i = 0; i < brandList.length; i++) {
      //     this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
      //   }
      // });
    }
    ,
    getProductCateList() {
      fetchCategoryList().then(res => {
        if (res.data.code === '00000') {
          this.categoryList = res.data.data
        }
      })
    },

    getTypeList(){
      fetchTypeList().then(res => {
        if (res.data.code === '00000') {
          this.typeList = res.data.data
        }
      })
    },

    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, {keyword: this.editSkuInfo.keyword}).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
      if (row.productAttributeCategoryId != null) {
        fetchProductAttrList(row.productAttributeCategoryId, {type: 0}).then(response => {
          this.editSkuInfo.productAttr = response.data.list;
        });
      }
    }
    ,
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {keyword: this.editSkuInfo.keyword}).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
    }
    ,
    handleEditSkuConfirm() {
      if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        });
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    }
    ,
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
    ,
    handleAddProduct() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.proInfo = Object.assign({}, defaultProInfo);
    }
    ,
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: '请选择操作类型',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的商品',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.$confirm('是否要进行该批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
    }
    ,
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      //this.getList();
      let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
      this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
      this.listQuery.currentIndex = currentIndex
    }
    ,
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      //this.getList();
      let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
      this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
      this.listQuery.currentIndex = currentIndex
    }
    ,
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    }
    ,
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    }
    ,
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    }
    ,
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    }
    ,
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.productId).then(res => {
          if (res.data.code === '00000') {
            this.$message.success(res.data.message)
            this.getList();
          }
        })
      });
    }
    ,
    handleUpdateProduct(index, row) {
      //this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
      this.dialogVisible = true;
      this.isEdit = true;
      this.proInfo = Object.assign({}, row);
      if (row.restTime !== '非秒杀商品') {
        this.radioVal = '1'
        console.log(this.proInfo.restTime)
      } else {
        console.log(this.proInfo.restTime)
        this.radioVal = '2'
        this.proInfo.restTime = ''
      }
    }
    ,
    handleShowProduct(index, row) {
      console.log("handleShowProduct", row);
    }
    ,
    handleShowVerifyDetail(index, row) {
      console.log("handleShowVerifyDetail", row);
    }
    ,
    handleShowLog(index, row) {
      console.log("handleShowLog", row);
    }
    ,
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('publishStatus', publishStatus);
      updatePublishStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    }
    ,
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('newStatus', newStatus);
      updateNewStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    }
    ,
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('recommendStatus', recommendStatus);
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    }
    ,
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('deleteStatus', deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      });
      this.getList();
    }
  }
}
</script>
<style>
.pagination-container{
  margin-bottom: 26px;
}

</style>


