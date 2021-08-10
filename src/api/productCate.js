import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/goods/category',
    method: 'get'
  })
}

export function fetchTypeList() {
  return request({
    url: '/goods/type',
    method: 'get'
  })
}

//等待接口
export function deleteCategory(categoryId) {
  return request({
    url: '/goods/category/' + categoryId,
    method: 'delete'
  })
}

//等待接口
export function updateProCate(categoryId, categoryName) {
  return request({
    url: '/goods/category/update',
    method: 'post',
    params: {categoryId, categoryName}
  })
}

//等待接口
export function createProCate(categoryName) {
  return request({
    url: '/goods/category/add',
    method: 'post',
    params: {categoryName}
  })
}


export function deleteProductCate(id) {
  return request({
    url: '/productCategory/delete/' + id,
    method: 'post'
  })
}

export function createProductCate(data) {
  return request({
    url: '/productCategory/create',
    method: 'post',
    data: data
  })
}

export function updateProductCate(id, data) {
  return request({
    url: '/productCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProductCate(id) {
  return request({
    url: '/productCategory/' + id,
    method: 'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/productCategory/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateNavStatus(data) {
  return request({
    url: '/productCategory/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren() {
  return request({
    url: '/productCategory/list/withChildren',
    method: 'get'
  })
}
