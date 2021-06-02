const fs = require('fs')
const baseURL = process.cwd() + '/db'

function throwError(error = 'Server Error', code = 500){
  return { code, data: error }
}

// 写入文件
function writeDBFile(DBName, data){
  let newData = Buffer.from(JSON.stringify(data))
  try {
    fs.writeFileSync(`${ baseURL }/${ DBName }.json`, newData)
  } catch (error) {
    return { code: 500, data: error }
  }
}

class DB {
  /**
   * 查询
   * @param DBName 数据库名称
   * @param filterFn 过滤函数
   */
  query(DBName, filterFn){
    try {
      const res =  fs.readFileSync(`${ baseURL }/${ DBName }.json`)
      const result = JSON.parse(res.toString())
      return { code: 200, data: result }
    } catch(err) {
      return { code: 500, data: err }
    }
  }

  /**
   * 执行操作
   * @param DBName 数据库名称
   * @param type 操作类型 UPDATE | INSERT | DELETE
   * @param data 操作的数据
   * @param field 操作的字段 可选
   */
  exec(DBName, type, data, dataField, field, fieldValue){
    const res = this.query(DBName)
    if(res.code !== 200) return res

    switch (type) {
      case 'UPDATE':
        // 查找需要更新的数据
        const curData = res.data.datas.find(item => item[field] == fieldValue)
        if(!curData) return throwError(`UPDATE FIELD: '${field}' cannot be found as '${fieldValue}'.`)
        // 更新数据
        curData[dataField] = data
        curData.modify_date = Date.now()
        // 写入db文件
        const updateRes = writeDBFile(DBName, res.data)
        if(updateRes) return Promise.resolve(updateRes)
        break;

      case 'INSERT':
        const newData = {
          id: res.data.datas[res.data.datas.length - 1].id + 1,
          content: data,
          create_date: Date.now(),
          modify_date:  Date.now(),
          is_finish: 0,
          is_del: 0,
          del_date: null
        }
        res.data.datas.push(newData)
        // 写入db文件
        const insertRes = writeDBFile(DBName, res.data)
        if(insertRes) return Promise.resolve(insertRes)
        break;

      case 'DELETE':
        // 查找需要更新的数据
        const curDelData = res.data.datas.find(item => item[dataField] == data)
        if(!curDelData) return throwError(`DELETE FIELD: '${dataField}' cannot be found as '${data}'.`)
        // 更新数据
        curDelData.del_date = Date.now()
        curDelData.is_del = 1
        // 写入db文件
        const deleteRes = writeDBFile(DBName, res.data)
        if(deleteRes) return Promise.resolve(deleteRes)
        break;
    
      default:
        break;
    }

    return Promise.resolve({ code: 200, data: 'success' })
  }
}

module.exports = DB