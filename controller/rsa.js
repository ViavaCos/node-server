/**
 * 此处为专门写RSA加密用的接口
 */

const NodeRSA = require('node-rsa')
const CryptoJS = require('crypto-js')

const { AES_SECRET_KEY } = require('../configs/index')

const RSA = new NodeRSA({b: 1024})
// encryptjs默认加密方式
RSA.setOptions({ encryptionScheme: "pkcs1" });
// 生成RSA秘钥对
function generateRSAKey () {
  // 公钥
  const publicKey = RSA.exportKey('pkcs8-public')
  // 私钥
  const privateKey = RSA.exportKey('pkcs1')

  return { publicKey, privateKey }
}

// 生成RSA秘钥对
const { publicKey, privateKey } = generateRSAKey();

const AES = {
  // 加密
  encrypt: function (content, secretKey) {
    const AESKey = CryptoJS.enc.Utf8.parse(secretKey)
    const srcs = CryptoJS.enc.Utf8.parse(content)
    const encrypted = CryptoJS.AES.encrypt(srcs, AESKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  },

  // 解密
  decrypt: function (content, secretKey) {
    const AESKey = CryptoJS.enc.Utf8.parse(secretKey)
    const base64 = CryptoJS.enc.Base64.parse(content)
    const src = CryptoJS.enc.Base64.stringify(base64)
    const decrypt = CryptoJS.AES.decrypt(src, AESKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    const decodedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decodedStr
  }
}

class MYRSA {
  app = null
  constructor(app) {
    this.app = app

    this.getSecretKey()
    this.sendSecretKey()
    this.login()
  }

  // 获取服务端RSA公钥
  getSecretKey() {
    this.app.get('/getSecretKey', (req, res) => {
        res.send({
          code: 200,
          data: publicKey
        })
    })
  }

  // 接受客户端加密后的RSA公钥并返回加密后的AES秘钥
  sendSecretKey() {
    this.app.post('/sendSecretKey', (req, res) => {
        const { key: encodedClientRSAKey } = req.body.data || {}
        
        const RSAEecodor = new NodeRSA(privateKey)
        // jsencrypt自身使用的是pkcs1加密方案
        RSAEecodor.setOptions({ encryptionScheme: "pkcs1" });
        const clientRSAKey = RSAEecodor.decrypt(encodedClientRSAKey, "utf8")
        
        // 用客户端rsa公钥对AES秘钥进行加密后传给客户端
        const RSAEncodor = new NodeRSA(clientRSAKey)
        // jsencrypt自身使用的是pkcs1加密方案
        RSAEncodor.setOptions({ encryptionScheme: "pkcs1" });
        const encodedAESKey = RSAEncodor.encrypt(AES_SECRET_KEY, 'base64')
        
        res.send({
            code: 200,
            data: encodedAESKey
        })
    })
  }

  // 登录
  login () {
    this.app.post('/login', (req, res) => {
      const { username: encryptedName, password: encryptedPwd } = req.body.data || {}

      // 解析用户名和密码
      const username = AES.decrypt(encryptedName, AES_SECRET_KEY)
      const password = AES.decrypt(encryptedPwd, AES_SECRET_KEY)

      if(!username || !password) {
        res.statusCode = 400
        res.end('Login faild')
        return;
      }

      res.send({
        code: 200,
        data: {
          username,
          password
        }
      })
    })
  }
}

module.exports = MYRSA
