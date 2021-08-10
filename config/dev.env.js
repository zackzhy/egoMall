'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://bobooi.com:8080/mall/"'
  //BASE_API: '"http://admin-api.macrozheng.com"'
})
