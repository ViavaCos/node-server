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
        entry: '//viavacos.live/subapp/vtodos/',
        container: '#container-wrapper',
        activeRule: '/#/subapp/vtodos/'
      },
      {
        name: 'demo-runner-with-vue2', // app name registered
        label: 'Vue2示例',
        entry: '//viavacos.live//subapp/demo-runner-with-vue2/',
        container: '#container-wrapper',
        activeRule: '/#/subapp/demo-runner-with-vue2/'
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
 