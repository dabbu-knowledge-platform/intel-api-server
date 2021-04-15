/* Dabbu Intel API Server - server.js
 * Copyright (C) 2021 Dabbu Knowledge Platform <dabbuknowledgeplatform@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// MARK: Imports

// Express JS, the library used to run the server and respond to HTTP requests
const express = require('express')

// Extended file system library
const fs = require('fs-extra')

// Custom error handler used to send back user and computer friendly messages to clients.
const { errorHandler } = require('./errors.js')
// Logging methods and utils
const { info } = require('./utils.js')

// MARK: Config and Globals

// The prefix to all requests
const rootURL = '/intel-api/v1'

// Create an express server
const app = express()

// Initialise the routes
// Extracting topics, people and places
const extractInfoRoute = require('./routes/extract-info.js').router
// Generating one pagers for a topic, person or place
const onePagerRoute = require('./routes/one-pager.js').router

// MARK: Input processing

// Parse the command line arguments and run the server
// The port to run the server on (also check for env variables for port)
let port = process.env.PORT || process.env.port || 8079

// Get the command line args
const args = process.argv.slice(2)
// Check if the port has been mentioned
if (args[0]) port = args[0] || process.env.PORT || process.env.port || 8079

// MARK: Server

// Tell the server to accept JSON in the HTTP request body
app.use(express.json())

// Initialise the server on the given port
const server = app.listen(port, () => {
	// Info(`Dabbu  Copyright (C) 2021 Dabbu Knowledge Platform <dabbuknowledgeplatform@gmail.com>\n      This program comes with ABSOLUTELY NO WARRANTY.\n      This is free software, and you are welcome to\n      redistribute it under certain conditions; look\n      at the LICENSE file for more details.`)
	// Print out the server version and the port it's running on
	info(`===============================`)
	info(`Dabbu Intel API Server v${require('../package.json').version}`)
	info(`Server listening on port ${port}`)
})

// Display the port we are running on if they come to /
app.get(`/`, (request, response) =>
	response.send(
		`Dabbu Intel API Server v${
			require('../package.json').version
		} running on port ${port}`
	)
)

// Route calls to extract information to the extract info router
app.use(`${rootURL}/extract-info/`, extractInfoRoute)

// Route calls to generate a one pager to the one pager router
app.use(`${rootURL}/one-pager/`, onePagerRoute)

// Use a custom error handler to return user and computer friendly responses
app.use(errorHandler)

// When the user presses CTRL+C, gracefully exit
process.on('SIGINT', async () => {
	info('SIGINT signal received: closing Dabbu Intel API Server')
	// Acknowledge the SIGINT
	info('SIGINT signal received: closing Dabbu Files API Server')
	// Delete the .cache directory
	await fs.remove('./_dabbu/_intel/')
	// Tell the user
	info('Removed cache. Exiting..')
	// Call close on the server created when we called app.listen
	server.close()
	// Tell the user
	info('Server closed')
	// Exit
	process.exit(0)
})
