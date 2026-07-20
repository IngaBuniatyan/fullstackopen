const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')

server.use(jsonServer.defaults())
server.use(jsonServer.bodyParser)
server.use((request, response, next) => {
  if (
    request.method === 'POST' &&
    request.path === '/anecdotes' &&
    (!request.body.content || request.body.content.length < 5)
  ) {
    return response.status(400).json({
      error: 'anecdote must be at least 5 characters long',
    })
  }

  return next()
})
server.use(router)

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001')
})
