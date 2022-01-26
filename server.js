const express = require('express')
const fallback = require('express-history-api-fallback')
const proxy = require('http-proxy-middleware')
const compression = require('compression')
const config = require('config')

const app = express()

// 设置跨域
app.all('*', (req, res, next) => {
    console.log('------in')
    const origin = req.headers['origin']
    const CORS = config.get('cors')
    if (CORS.includes(origin) || CORS.includes('*')) {
        res.header('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
    } else {
        next()
    }
})


// 这是基本用法，如果还要对请求进行过滤的话，还要加上app.use(compression({filter: shouldCompress}))
app.use(compression())


// API 转发
const options = (target) => {
	return {
		target: target,
		changeOrigin: true,
        proxyTimeout: 100 * 60 * 1000,
        timeout: 100 * 60 * 1000,
        logLevel: 'info',
		pathRewrite: {
			'^/report/api': '/api', //暂时使用直接请求的方式，未用到
			'^/report/obt': '/obt',
			'^/report/mod': '/mod',
			'^/report/excel': '/api',
            '^/report/task': '/task',
            '^/report/tool': '/api',
            '^/report/pri': '/pri'
        },
        onProxyRes(proxyRes, req) {
            const statusCode = proxyRes.statusCode
            const statusMessage = proxyRes.statusMessage
            console.log(`[HPM] Res "${statusCode}" ${statusMessage} ${req.originalUrl} `)
        },
        onError(err, req, res) {
            console.error('[HPM] Resp Error', err)
            res.status(503)
            res.json({ error: 'proxy error', message: '请求接口失败' })
        }
	}
}

app.use('/api', proxy(options(config.target)))
app.use('/report/mod', proxy(options(config.targetMod)))
app.use('/report/obt', proxy(options(config.targetObt)))
app.use('/report/excel', proxy(options(config.targetExcel)))
app.use('/report/task', proxy(options(config.targetTaskServer)))
app.use('/report/tool', proxy(options(config.targetTool)))
app.use('/report/pri', proxy(options(config.targetPri)))


// 静态资源转发
const root = `${__dirname}/dist`
app.use(express.static(root))
app.use(fallback('index.html', { root }))

const port = process.env.HTTP_PORT || config.port

/* eslint no-console: "off" */
app.listen(port, () => console.log(`Proxy server listening on port ${port}!  mode ${process.env.NODE_ENV}`))
