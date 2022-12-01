const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')

const Todos = require('./controller/todos.js')
const Words = require('./controller/words.js')
const Test = require('./controller/test.js')

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


new Todos(app) // 微土豆
new Words(app) // 鸡汤
new Test(app) // 测试

// app.listen(port, function(){
//   console.log(`Server is running in port: ${port}!`)
// })

// 配置CA证书
const options = {
  key: fs.readFileSync('./cert/viavacos.live.key'),
  cert: fs.readFileSync('./cert/viavacos.live_bundle.crt')
}

http.createServer(app).listen(3001)
https.createServer(options, app).listen(3002)