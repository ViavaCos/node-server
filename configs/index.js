// AES秘钥 (16位的十六进制数)
// const AES_SECRET_KEY = '1234123412ABCDEF';

/**
 * 根据范围生成随机数
 * @param {number} end   截止长度
 * @param {number} start 起始长度，默认值0
 * @returns 
 */
function getRandomByRange(end, start = 0) {
  return Math.round(Math.random() * (end - start) + start)
}

/**
 * 随机生成uuid
 * @param {number} length 字符长度
 * @returns 随机字符
 */
function generateUuid (length = 16) {
  const SMALL_LETTER = 'abcdefghijklmnopqrstuvwxyz'
  const BIG_LETTER = SMALL_LETTER.toUpperCase()
  const NUMBER = '0123456789'
  const randomSource = [SMALL_LETTER, BIG_LETTER, NUMBER]

  let resultStr = ''
  for (let index = 0; index < length; index++) {
    const currentSource = randomSource[getRandomByRange(randomSource.length - 1)]

    resultStr += currentSource[getRandomByRange(currentSource.length - 1)]
  }

  return resultStr
}


// 这里用随机的不好
// const AES_SECRET_KEY = generateUuid();

// todo 这里暂时硬编码，实际开发中请从配置中心获取
const AES_SECRET_KEY = '6B5HuSyvfVY2MFZz';

module.exports = {
  AES_SECRET_KEY
}
