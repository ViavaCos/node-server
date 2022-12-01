/**
 * 此处为专门写各种测试用的接口
 */

const fs = require("fs")
const path = require("path")

class Test {
  app = null
  constructor(app) {
    this.app = app

    this.verifyCommand()
    this.fileUpload()
    this.returnReadableStreamImg()
  }

  // 验证指令
  verifyCommand(){
    this.app.get('/verifyCommand', async (req, res) => {
      const { command } = req.query

      // 入参校验
      if(command == undefined || !command) {
        return res.status(500).send({
        code: 500,
        msg: `The field command is required.`
        })
      }

      if(command == "0223") {
        return res.status(200).send({
        code: 200,
        msg: `Successed.`
        })
      } else {
        return res.status(500).send({
        code: 500,
        msg: `The command is incorrect.`
        })
      }
    })
  }

  // 文件上传
  fileUpload(){
    // 文件上传配置
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
    const uploadMiddleWare = [
      upload.single('file'),
      upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
    ]

    this.app.post('/upload', ...uploadMiddleWare, (req, res) => {
      res.send('upload')
    })
  }

  // 返回二进制的图片文件流
  returnReadableStreamImg(){
    this.app.get('/img', async (req, res) => {
      const result = await fs.readFileSync(path.resolve(process.cwd(), "./uploads/test.jpg"))
      res.send(result)
    })
  }
}

module.exports = Test
