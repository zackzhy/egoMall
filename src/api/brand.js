import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/goods/allSupplierInfo',
    method:'get',
  })
}

//等待接口
export function deleteBrand(supplierId) {
  return request({
    url:'/goods/supplier/'+supplierId,
    method:'delete',
  })
}

//等待接口
export function createBrandInfo(supplierName, address) {
  return request({
    url:'/goods/supplier/add',
    method:'post',
    params: {supplierName, address}
  })
}

//等待接口
export function updateBrandInfo(supplierId, supplierName, address) {
  return request({
    url:'/goods/supplier/update',
    method:'post',
    params: {supplierId, supplierName, address}
  })
}

export function createBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

