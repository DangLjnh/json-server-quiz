const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Enable CORS for all routes
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

server.use(middlewares)

// Log all requests
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/blog/:resource/:id/show': '/:resource/:id'
}))

// Use the router
server.use(router)

// Start the server
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000')
  console.log('Available routes:')
  console.log('GET    /api/{resource}')
  console.log('GET    /api/{resource}/{id}')
  console.log('POST   /api/{resource}')
  console.log('PUT    /api/{resource}/{id}')
  console.log('PATCH  /api/{resource}/{id}')
  console.log('DELETE /api/{resource}/{id}')
})

// Export the Server API
module.exports = server
