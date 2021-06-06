const express = require('express')
const DB = require('./utils/db.js')

const port = 3001 // 设置端口号
const app = express()
const db = new DB()

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

// 获取todos
app.get('/getTodosList', (req, res) => {
  const { code, data } = db.query('todos')
  const { keywords } = req.query
  if(code === 200){
    // 排除已经物理删除的todo 
    let datas = data.datas.filter(item => !item.is_del)
    
    if(keywords.trim()) {
      datas = datas.filter(item => item.content.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()))
    }
    res.send({ code, data: datas.reverse() })
  } else {
    res.status(code).send({code, msg: 'System Error.'})
  }
})

// 更新todos
app.post('/updateTodo', async (req, res) => {
  const { id, content } = req.body

  // 入参校验
  if(id === undefined || content === undefined) {
    return res.status(500).send({
      code: 500,
      msg: `The field '${id === undefined ? 'id' : 'content'}' is required.`
    })
  }

  // 更新数据
  const updateRes = await db.exec('todos', 'UPDATE', content, 'content', 'id', id)

  if(updateRes.code == 200) {
    res.send(updateRes)
  } else {
    res.status(500).send(updateRes)
  }
})

// 完成todos
app.post('/finishTodo', async (req, res) => {
  const { id, is_finish } = req.body

  // 入参校验
  if(id === undefined || is_finish === undefined) {
    return res.status(500).send({
      code: 500,
      msg: `The field '${id === undefined ? 'id' : 'is_finish'}' is required.`
    })
  }

  // 更新数据
  const updateRes = await db.exec('todos', 'UPDATE', +is_finish, 'is_finish', 'id', id)

  if(updateRes.code == 200) {
    res.send(updateRes)
  } else {
    res.status(500).send(updateRes)
  }
})

// 新增todos
app.post('/addTodo', async (req, res) => {
  const { content } = req.body
  const addRes = await db.exec('todos', 'INSERT', content)
  if(addRes.code == 200) {
    res.send(addRes)
  } else {
    res.status(500).send(addRes)
  }
})

// 删除todos
app.delete('/deleteTodo', async (req, res) => {
  const { id } = req.body
  const deleteRes = await db.exec('todos', 'DELETE', id, 'id')
  if(deleteRes.code == 200) {
    res.send(deleteRes)
  } else {
    res.status(500).send(deleteRes)
  }
})

app.listen(port, function(){
  console.log(`Server is running in port: ${port}!`)
})
