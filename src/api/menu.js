import request from '@/utils/request'

export function fetchList(pageNum, pageSize) {
  return request({
    url: '/user/allAddressInfo',
    method: 'get',
    params: {pageNum, pageSize}
  })
}

export function getTotal() {
  return request({
    url: 'user/allAddressInfo/sum',
    method: 'get',
  })
}

export function deleteAddress(customerAddrId) {
  return request({
    url: '/user/address' + customerAddrId,
    method: 'delete'
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

export function updateMenu(id, data) {
  return request({
    url: '/menu/update/' + id,
    method: 'post',
    data: data
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export function updateHidden(id, params) {
  return request({
    url: '/menu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

