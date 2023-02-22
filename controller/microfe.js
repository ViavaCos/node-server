/**
 * 此处为专门写微前端用的接口
 */
 
 class Microfe {
   app = null
   constructor(app) {
     this.app = app

     this.getMicroFrontEndConfig()
   }
   
  // 获取微前端配置信息
   getMicroFrontEndConfig() {
    const configs = [
      {
        name: 'vtodos', // app name registered
        label: '微土豆',
        entry: '//viavacos.live/vTodos/',
        container: '#container-wrapper',
        activeRule: '/vtodos',
      }
    ]

    this.app.get('/getMicroFEConfig', (req, res) => {
      res.send({
        code: 200,
        data: configs
      })
    })
   }
 }
 
 module.exports = Microfe
 