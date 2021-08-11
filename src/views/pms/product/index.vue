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
          <el-form-item label="商品名称：">
            <el-input clearable style="width: 203px" v-model="listQuery.productName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌名称：">
            <el-select v-model="listQuery.supplierName"
                       placeholder="请选择品牌名称"
                       clearable>
              <el-option
                v-for="item in supplierList"
                :key="item.supplierName"
                :label="item.supplierName"
                :value="item.supplierName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类：">
            <!--            <el-cascader-->
            <!--              clearable-->
            <!--              v-model="selectProductCateValue"-->
            <!--              :options="productCateOptions">-->
            <!--            </el-cascader>-->
            <el-select v-model="listQuery.categoryName"
                       placeholder="请选择商品分类" style="width: 203px"
                       clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.categoryName"
                :label="item.categoryName"
                :value="item.categoryName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型：">
            <el-select v-model="listQuery.productTypeName"
                       placeholder="请选择商品类型"
                       clearable>
              <el-option
                v-for="item in typeList"
                :key="item.productTypeName"
                :label="item.productTypeName"
                :value="item.productTypeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述：">
            <el-input clearable style="width: 203px" v-model="listQuery.description" placeholder="商品描述"></el-input>
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
  deleteProduct,
  getTotal,
  fetchSelectedList
} from '@/api/product'
import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
import {fetchList as fetchProductAttrList} from '@/api/productAttr'
import {fetchList as fetchBrandList, getTotal as getBrandTotal} from '@/api/brand'
import {fetchTypeList, getTypeTotal} from '@/api/productCate'
import {fetchListWithChildren, fetchList as fetchCategoryList} from '@/api/productCate'
import {fetchSelectList} from "../../../api/flashSession";

const defaultListQuery = {
  keyword: null,
  productName: "",
  categoryName: "",
  description: "",
  productTypeName: "",
  supplierName: "",
  pageNum: 1,
  pageSize: 5,
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
      dialogVisible: false,
      isEdit: false,
      isSelected: false,
      proInfo: Object.assign({}, defaultProInfo),
      selectSupplierNameList: [],
      selectProductTypeNameList: [],
      selectCategoryList: [],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      brandTotal: 0,
      cateTotal: 0,
      typeTotal: 0,
      total: null,
      listLoading: true,
    }
  },
  created() {
    this.getList();
    this.getBrandList();
    this.getProductCateList();
    this.getTypeList();
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
          this.proInfo.restTime = null
        }
        if (this.isEdit) {
          updateProInfo(this.proInfo.productId, this.proInfo.picUrl,
            this.proInfo.description, this.proInfo.price, this.proInfo.inventory,
            this.proInfo.productName, this.proInfo.restTime).then(response => {
            if (response.data.code === '00000') {

              this.$message.success(response.data.message)
              if(this.isSelected)
              {
                this.getSelectedList()
              }
              else{
                this.getList();
              }
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
              if(this.isSelected)
              {
                this.getSelectedList()
              }
              else{
                this.getList();
              }
            }
            this.dialogVisible = false;
          })
        }
      })
    },

    getSelectedList() {
      this.listLoading = true;
      fetchSelectedList(this.listQuery.categoryName, this.listQuery.description,
        this.listQuery.productName, this.listQuery.productTypeName, this.listQuery.supplierName).then(response => {
          this.listLoading = false;
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].restTime == null) {
              response.data.data[i].restTime = '非秒杀商品'
            } else {
              let dateee = new Date(response.data.data[i].restTime).toJSON();
              let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
              response.data.data[i].restTime = date
            }
          }
          this.totalList = response.data.data;
          this.total = response.data.data.length
          this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + this.listQuery.pageSize)
        }
      );
    },

    getList() {
      this.listLoading = true;
      fetchList(this.listQuery.pageNum, this.listQuery.pageSize).then(response => {
          this.listLoading = false;


          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].restTime == null) {
              response.data.data[i].restTime = '非秒杀商品'
            } else {
              let dateee = new Date(response.data.data[i].restTime).toJSON();
              let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
              response.data.data[i].restTime = date
            }
          }
          this.list = response.data.data;
          // console.log(this.listQuery.currentIndex)
          // this.list = this.totalList.slice(this.listQuery.currentIndex, this.listQuery.currentIndex + defaultListQuery.pageSize)

          // this.total = response.data.data.length;


          // console.log("total:" + this.total)
        }
      );
      getTotal().then(res => {
        if (res.data.code === '00000') {
          this.total = res.data.data
        }
      });
    },

    getBrandList() {
      getBrandTotal().then(res => {
        if (res.data.code === '00000') {
          this.brandTotal = res.data.data
          fetchBrandList(1, this.brandTotal).then(res => {
            if (res.data.code === '00000') {
              this.supplierList = res.data.data
            }
          });
        }

      });
    },
    getProductCateList() {
      fetchCategoryList(1, 100).then(res => {
        if (res.data.code === '00000') {
          this.cateTotal = res.data.data.length
        }
        fetchCategoryList(1, this.cateTotal).then(res => {
          if (res.data.code === '00000') {
            this.categoryList = res.data.data
          }
        });

      });

    },

    getTypeList() {
      getTypeTotal().then(res => {
        if (res.data.code === '00000') {
          this.typeTotal = res.data.data
          fetchTypeList(1, this.typeTotal).then(res => {
            if (res.data.code === '00000') {
              this.typeList = res.data.data
            }
          });
        }

      });
    },

    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.isSelected = true;
      this.getSelectedList();
    }
    ,
    handleAddProduct() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.proInfo = Object.assign({}, defaultProInfo);
    }
    ,

    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      if (this.isSelected) {
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex = currentIndex
      } else {
        this.getList()
      }
    },

    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      if (this.isSelected) {
        let currentIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
        console.log(currentIndex)
        this.list = this.totalList.slice(currentIndex, currentIndex + this.listQuery.pageSize)
        this.listQuery.currentIndex = currentIndex
      } else {
        this.getList();
      }
    },

    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery.description=''
      this.listQuery.productName=''
      this.listQuery.supplierName=''
      this.listQuery.categoryName=''
      this.listQuery.productTypeName=''
      this.isSelected=false
      this.listQuery.pageNum=1
      this.getList()
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
  }
}
</script>
<style>
.pagination-container {
  margin-bottom: 26px;
}

</style>


