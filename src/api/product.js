import request from '@/utils/request'

export function fetchList(pageNum, pageSize) {
  return request({
    url: '/goods/allProductDetailInfo',
    method: 'get',
    params: {pageNum, pageSize}
  })
}

export function fetchSelectedList(categoryName, description,
  productName, productTypeName, supplierName) {
  return request({
    url: '/search/partMatch',
    method: 'get',
    params: {categoryName, description,
      productName, productTypeName, supplierName}
  })
}

export function getTotal() {
  return request({
    url: '/goods/allProductDetailInfo/sum',
    method: 'get',
  })
}

export function updateProInfo(productId, picUrl, description, price, inventory, productName,restTime) {
  return request({
    url: '/goods/editProductInfo',
    method: 'post',
    params: {productId, picUrl, description, price, inventory, productName,restTime}
  })
}

export function createProInfo(productId, productName, picUrl, description, price,
  inventory, productTypeId, restTime, categoryId, supplierId) {
  return request({
    url: '/goods/addProduct',
    method: 'post',
    params: {productId, productName, picUrl, description, price,
      inventory, productTypeId, restTime, categoryId, supplierId}
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/product/simpleList',
    method: 'get',
    params: params
  })
}

export function deleteProduct(productId) {
  return request({
    url: '/goods/deleteProduct/'+productId,
    method: 'delete',
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/product/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: '/product/updateInfo/' + id,
    method: 'get',
  })
}

