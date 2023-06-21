import express from 'express'

// import { PORT } from './config'
import apiRouter from './routes'

// App Declaration
const app = express()

// Settings
app.set('port', PORT !== '' ? PORT : 3000)

// Middlewares
app.use(express.json())

// Routes
app.use('/', apiRouter)

// Starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'))
})
