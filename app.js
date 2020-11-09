const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cloudbase = require('@cloudbase/node-sdk')

// 云开发初始化
const manager = cloudbase.init({
  env: process.env.ENV_ID,
})

// 云数据初始化
const db = manager.database()

// 本地服务初始化
const app = express()

// 中间件
app.use(bodyParser.json())

app.use(cors())

app.use(helmet())

app.use(morgan('dev'))

// Router
app.post('/login', async (req, res) => {
  //获取用户名和密码
  let { username, password } = req.body

  // 创建云数据库
  // await db.createCollection('test_user')

  // 添加数据
  let result = await manager.database
    .collection('test_user')
    .add({ username: username, password: password })

  if (!result.id) {
    res.send('注册失败')
  } else {
    res.send('注册成功')
  }
})

// app.post('/todos', async (req, res) => {
//   console.log('req', req)

//   // 创建云数据库
//   await db.createCollection('test_movies')

//   const result = await db.collection('todos').add([
//     {
//       name: 'The Moon and Six pence',
//       category: 'Novel',
//       saling: false,
//       sales: 30,
//     },
//     {
//       name: '吾輩は猫である',
//       category: 'Novel',
//       saling: false,
//       sales: 90,
//     },
//   ])

//   if (result.id) {
//     res.sendDate(result)
//   } else {
//     res.send('失败')
//   }
// })

app.post('/add_book', async (req, res) => {
  let { category, name, sailing, sales } = req.body

  // 创建集合
  // await db.createCollection('books')

  // 插入数据
  let result = await db.collection('books').add({
    category: category,
    name: name,
    sailing: sailing,
    sales: sales,
  })

  if (result) {
    res.send({
      code: 1,
      message: '插入成功',
      data: result,
    })
  } else {
    res.send({
      code: -1,
      message: '插入失败',
    })
  }
})

app.get('/books', async (req, res) => {
  let result = await db.collection('books').get()

  res.send({
    code: 1,
    message: '成功',
    ...result,
  })
})

// exports.main = serverless(app)
module.exports = app
