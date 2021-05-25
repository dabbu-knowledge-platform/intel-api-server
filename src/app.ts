// Use express to handle HTTP requests
import * as Express from 'express'
// Use helmet to add basic security to the server
import * as Helmet from 'helmet'

// Import all the routes
import DataRouter from './routes/data.route'
import AuthRouter from './routes/auth.route'

// Import types and utility functions
import ErrorHandler from './utils/errors.util'
import { MorganMiddleware } from './utils/logger.util'

// Create an express server
const app = Express.default()

// Enable this to get IP addresses
app.enable('trust proxy')

// Tell the server to accept JSON and Multipart Form Data
// (x-www-form-urlencoded) in the HTTP request body
app.use(Express.urlencoded({ extended: true }))
app.use(Express.json())

// Use Helmet middleware
app.use(Helmet.default())

// Use the logging middleware
app.use(MorganMiddleware)

// Register all routes
app.use('/intel-api/v1/clients/', AuthRouter)
app.use('/intel-api/v1/data/', DataRouter)

// Register the error handler
app.use(ErrorHandler)

export default app
