const express = require('express')
const Todos = require('./controller/todos.js')

const port = 3001 // 设置端口号
const app = express()

app.all('*', (req, res, next) => {
  // 允许各种非同源访问
  res.setHeader('Access-Control-Allow-Origin', '*')
  // 允许各种请求方式
  res.setHeader('Access-Control-Allow-Methods', '*')
  next()
})

// 入参解析
app.use(express.json()) // application/json
app.use(express.urlencoded({extended: true})) // application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Welcome to this todos.')
})

new Todos(app)

app.listen(port, function(){
  console.log(`Server is running in port: ${port}!`)
})
