// Routes related to extracting info from the provided files

// Use express to handle HTTP requests
import * as Express from 'express'
// Use multer to handle file upload for POST and PUT requests
import Multer from 'multer'
// Use the env paths library to get the local cache path
import EnvPaths from 'env-paths'
const cachePath = EnvPaths('Dabbu Intel API Server', {
	suffix: '',
}).cache

// Import the DataController to parse the request and call the appropriate
// provider module as specified in the request
import * as DataController from '../controllers/data.controller'

// Import the auth middleware
import AuthHandler from '../utils/auth.util'

// Define where multer should store the uploaded files
const multer = Multer({
	dest: `${cachePath}/uploads/`,
})

// All the routes for the /data endpoint
const router = Express.Router()

// If the user makes a POST request to /data/extract-info, extract important
// info from the file
router.post(
	'/extract-info/',
	multer.array('content'),
	AuthHandler,
	DataController.extractInfo,
)

export default router
