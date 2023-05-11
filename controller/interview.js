/**
 * 此处为专门写面试相关的接口
 */

const Baisc = require('./basic')
const exeSql = require('../utils/exeSql.js')
const getRandom = require('../utils/getRandom')
const separator = '】|【' // 答案分隔符

class Interview extends Baisc {

  constructor(app){
    super(app)

    this.getQuestionTypes()
    this.getQuestionTypesAndNums()
    this.getRandomQuestionByTypes()
    this.getAllQuestionByType()
    this.getQuestionDetailById()
  }

  /**
   * 格式化问题答案
   * @param {*} answer 
   * @returns {String|Array<String>}
   */
  formatQuestionAnswer(answer) {

    if (!answer) return ''

    return answer.includes(separator) ? answer.split(separator) : answer
  }

  /**
   * 获取问题类型
   */
  getQuestionTypes() {
    this.app.get('/getQuestionTypes', (req, res) => {
      exeSql('SELECT question_type FROM questions_info group by question_type').then(result => {
        const typesArr = result.map(i => i.question_type)
        res.send({ code:200, data: typesArr })
      }).catch(err => {
        res.status(500).send({code: 500, msg: err})
      })
    })
  }

  /**
 * 获取问题类型和对应的数量
 */
  getQuestionTypesAndNums() {
    this.app.get('/getQuestionTypesAndNums', (req, res) => {
      exeSql('SELECT question_type,COUNT(*) FROM questions_info group by question_type').then(result => {
        const typesArr = result.map(i => ({
          type_name: i.question_type,
          type_num: i["COUNT(*)"]
        }))
        res.send({ code:200, data: typesArr })
      }).catch(err => {
        res.status(500).send({code: 500, msg: err})
      })
    })
  }

  /**
   * 根据问题类型随机获取问题
   */
  getRandomQuestionByTypes() {
    this.app.get('/getRandomQuestionByTypes', (req, res) => {
      const { types, doneIds } = req.query
      if (!types || typeof types !== 'string') {
        return res.status(500).send({code: 400, msg: 'Type is invalid.'})
      }

      const typesArr = types.split(',')
      const len = typesArr.length
      const resultType = len === 1
        ? typesArr[0]
        : typesArr[getRandom(0, len - 1)]

      const sqlStatement = `
        SELECT
          question_id,
          question_type,
          question_description,
          question_answer 
        FROM
          questions_info 
        WHERE
          question_type = '${resultType}' 
        AND
          question_is_del = 0
          ${ doneIds ? `AND question_id not in (${doneIds})` : '' }
      `
      exeSql(sqlStatement).then(result => {
        const len = result.length
        const singleResult = len <= 1 ? result[0] || {} : result[getRandom(0, len - 1)]
        const formattedAnswer = this.formatQuestionAnswer(singleResult.question_answer)

        singleResult.question_answer = formattedAnswer
        singleResult.is_no_more = formattedAnswer ? 0 : 1

        res.send({ code:200, data: singleResult })
      }).catch(err => {
        res.status(500).send({code: 500, msg: err})
      })
    })
  }

  /**
   * 根据问题类型获取所有问题
   */
  getAllQuestionByType() {
    this.app.get('/getAllQuestionByType', (req, res) => {
      const { type } = req.query
      if (!type || typeof type !== 'string') {
        return res.status(500).send({code: 400, msg: 'Type is invalid.'})
      }

      const sqlStatement = `
        SELECT
          question_id,
          question_type,
          question_description
        FROM
          questions_info 
        WHERE
          question_type = '${type}' 
        AND
          question_is_del = 0
      `
      exeSql(sqlStatement).then(result => {
        res.send({ code:200, data: result })
      }).catch(err => {
        res.status(500).send({code: 500, msg: err})
      })
    })
  }

  /**
   * 根据问题类型获取所有问题
   */
  getQuestionDetailById() {
    this.app.get('/getQuestionDetailById', (req, res) => {
      const { id } = req.query
      if (!id) {
        return res.status(500).send({code: 400, msg: 'Type is invalid.'})
      }

      const sqlStatement = `
        SELECT
          question_id,
          question_type,
          question_description,
          question_answer
        FROM
          questions_info 
        WHERE
          question_id = '${id}' 
        AND
          question_is_del = 0
      `
      exeSql(sqlStatement).then(result => {
        res.send({ code:200, data: result })
      }).catch(err => {
        res.status(500).send({code: 500, msg: err})
      })
    })
  }
}

module.exports = Interview