/*
import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  let localToken = window.sessionStorage.getItem('token')
  if (localToken !== undefined && localToken !== 'undefined') {
    //window.sessionStorage.setItem('token', token);
    // console.log("响应拦截里的："+token)
    //console.log("请求拦截里的："+localToken)
    config.headers.authorization = window.sessionStorage.getItem('token')
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// service.interceptors.request.use(config => {
//   let authorization = window.sessionStorage.getItem("authorization")
//   if (null !== authorization&&  typeof authorization!=='undefined') {
//     config.headers['authorization'] = window.sessionStorage.getItem("authorization")
//   }
//   return config
// }, err => {
//   Message.error({
//     showClose: true,
//     message: err.response ? err.response : '网络请求异常'
//   });
// })

// respone拦截器
service.interceptors.response.use(
  response => {
    /!**
     * code为非200是抛错 可结合自己业务进行修改
     *!/
    let token = response.headers.authorization
    if (token !== undefined && token !== 'undefined') {
      window.sessionStorage.setItem('token', token);
      // console.log("响应拦截里的："+token)
    }
    const res = response.data
    if (res.code !== '00000') {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })

    }
      return response
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
  }
)

export default service
*/

import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000 // 请求超时时间
})

service.interceptors.request.use(config => {
  let authorization = window.sessionStorage.getItem("authorization")
  if (null !== authorization&&  typeof authorization!=='undefined'&&authorization!==undefined) {
    config.headers['authorization'] = window.sessionStorage.getItem("authorization")
  }
  return config
}, err => {
  Message.error({
    showClose: true,
    message: err.response ? err.response : '网络请求异常'
  });
})

service.interceptors.response.use(res => {
  let authorization=res.headers.authorization
  if (null !== authorization&& typeof authorization!=='undefined'&&authorization!==undefined) {
    window.sessionStorage.setItem("authorization", authorization)
  }
// 统一异常提示
  if (res.data.code !== "00000") {
    Message.error(res.data.message)
  }
  return res
}, err => {
  Message.error({
    showClose: true,
    message: err.response ? err.response.data.message : '网络异常'
  });
  //return Promise.reject(err)
})

export default service
