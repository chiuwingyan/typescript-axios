const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const config = require('./webpack.config')
const app = new Koa()
const compiler = webpack(config)
const static = require('koa-static')
const Router = require('koa-router');

let router = new Router();

app.use(webpackDevMiddleware(compiler,{
  publicPath: '/__build__/'
}))

app.use(webpackHotMiddleware(compiler))

app.use(static(__dirname))

app.use(bodyParser())

router.get('/simple/get', async ctx => {
    ctx.body = {
      msg: 'hello world'
    }
});

app.use(router.routes())

const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
