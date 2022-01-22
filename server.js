const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')

const Todos = require('./controller/todos.js')
const Words = require('./controller/words.js')

const port = 3001 // 设置端口号
const app = express()

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // console.log(file);
    const fileName = file.originalname.split('.')[0]
    const ext = file.originalname.split('.')[1]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${fileName}-${uniqueSuffix}.${ext}`)
  }
})
const upload = multer({ storage: storage })



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

const uploadMiddleWare = [
  upload.single('file'),
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
]

app.post('/upload', ...uploadMiddleWare, (req, res) => {
  res.send('upload')
})

new Todos(app)
new Words(app)

// app.listen(port, function(){
//   console.log(`Server is running in port: ${port}!`)
// })

const options = {
  key: fs.readFileSync('./cert/viavacos.live.key'),
  cert: fs.readFileSync('./cert/viavacos.live_bundle.crt')
}

http.createServer(app).listen(3001)
https.createServer(options, app).listen(3002)