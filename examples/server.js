const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const config = require('./webpack.config')
const app = new Koa()
const compiler = webpack(config)
const static = require('koa-static')
const Router = require('koa-router')

let router = new Router()
function parseData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postData = []
      ctx.req.addListener('data', data => {
        // 有数据传入的时候
        postData.push(data)
      })
      ctx.req.on('end', () => {
        let parseData = Buffer.concat(postData)
        resolve(parseData)
      })
    } catch (e) {
      reject(e)
    }
  })
}
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/'
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(static(__dirname))

app.use(bodyParser())

router.get('/simple/get', async ctx => {
  ctx.body = {
    msg: 'hello world'
  }
})
router.get('/base/get', async ctx => {
  let ctx_query = ctx.query
  ctx.body = {
    ctx_query
  }
})

router.post('/base/buffer', async (ctx, next) => {
          let postData = await parseData(ctx)
          ctx.body = postData
})

router.post('/base/post', async ctx => {
  let ctx_body = ctx.request.body
  ctx.body = ctx_body
})

app.use(router.routes())

const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
