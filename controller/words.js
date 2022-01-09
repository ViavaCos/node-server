const getRandom = require('../utils/getRandom')
const allWords = require('../db/some-words.json')

class Words {
  constructor(app){
    // 获取鸡汤
    app.get('/getNiceWords', async (req, res) => {
      const result = allWords[getRandom(0, allWords.length - 1)]
      res.send({ code: 200, data: result})
    })
  }
}

module.exports = Words