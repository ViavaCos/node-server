const accountInfo = require('../_config/database.js')

// 执行给定的sql语句，执行完成之后，调用callback函数
var mysql = require('mysql');
function exeSql(sql) {
  var p = new Promise((resolve, reject) => {
    var connection = mysql.createConnection(accountInfo);
    connection.connect();
    // connection.query(查询语句，回调函数)
    // fileds:字段
    connection.query(sql, function(error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    connection.end();
  });
  return p;
}

module.exports = exeSql;


// todo修改返回参数格式 code, data