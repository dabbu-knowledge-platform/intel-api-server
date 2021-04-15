/* Dabbu Intel API Server - app.js
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

// Custom error handler used to send back user and computer friendly messages to clients.
const { errorHandler } = require('./errors.js')

// MARK: Routes

// Extracting topics, people and places
const extractInfoRoute = require('./routes/extract-info.js').router
// Generating one pagers for a topic, person or place
const onePagerRoute = require('./routes/one-pager.js').router

// MARK: Config and Globals

// The prefix to all requests
const rootURL = '/intel-api/v1'

// MARK: Server

// Create an express server and add the required routes and middleware
function createServer() {
	// Create an express server
	const app = express()

	// Tell the server to accept JSON in the HTTP request body
	app.use(express.json())

	// Display the port we are running on if they come to /
	app.get(`/`, (request, response) =>
		response.send(
			`Dabbu Intel API Server v${
				require('../package.json').version
			} running on port ${process.env.DABBU_INTEL_API_SERVER_PORT}`
		)
	)

	// Route calls to extract information to the extract info router
	app.use(`${rootURL}/extract-info/`, extractInfoRoute)

	// Route calls to generate a one pager to the one pager router
	app.use(`${rootURL}/one-pager/`, onePagerRoute)

	// Use a custom error handler to return user and computer friendly responses
	app.use(errorHandler)

	// Return the created server
	return app
}

// MARK: Exports

// Export a method that listens on the given port with the given providers
module.exports = async (
	// The port to run the server on
	port
) => {
	// If no port is specified, check for environment variables or then 8080
	if (port === null || port === undefined || typeof port !== 'number') {
		port = process.env.PORT || process.env.port || 8080
	}

	// Set the environment variable DABBU_INTEL_API_SERVER_PORT
	process.env.DABBU_INTEL_API_SERVER_PORT = port

	// Create the server
	const app = createServer()
	// Return the server instance
	return new Promise((resolve, reject) => {
		resolve(app.listen(port))
	})
}
