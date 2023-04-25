/**
 * 随机区数
 * @params {number} start 开始
 * @params {number} end 结束
 */
function getRandom(start, end){
  return Math.round(Math.random() * (end - start) + start)
}

module.exports = getRandom