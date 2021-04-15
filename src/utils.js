/* Dabbu Intel API Server - utils.js
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

// MARK: Imports for all functions

// Files library, used to do all file operations across platforms
const fs = require('fs-extra')

// MARK: Functions

// Print out an informational message
exports.info = (message) => {
  const date = new Date().toISOString()
  if (!process.env.DO_NOT_LOG_TO_CONSOLE)
    console.log(` INFO  | ${date} | ${message}`)
  let stream = fs.createWriteStream(`./_dabbu/intel_api_server.log`, {
    flags: 'a',
  })
  stream.write(`INFO  | ${date} | ${message}\n`)
  stream.end()
}

// Print out a provider log
exports.debug = (provider, message) => {
  if (process.env.debug || process.env.DEBUG) {
    const date = new Date().toISOString()
    if (!process.env.DO_NOT_LOG_TO_CONSOLE)
      console.log(` DEBUG  | ${date} | ${provider} | ${message}`)
    let stream = fs.createWriteStream(`./_dabbu/intel_api_server.log`, {
      flags: 'a',
    })
    stream.write(`DEBUG  | ${date} | ${provider} | ${message}\n`)
    stream.end()
  }
}

// Print out an error
exports.error = (err) => {
  const date = new Date().toISOString()
  if (!process.env.DO_NOT_LOG_TO_CONSOLE)
    console.log(` ERROR | ${date} | ${this.json(err, true)}`)
  let stream = fs.createWriteStream(`./_dabbu/intel_api_server.log`, {
    flags: 'a',
  })
  stream.write(`ERROR | ${date} | ${this.json(err)}\n`)
  stream.write('\n')
  stream.end()
}

// Format JSON
exports.json = (string, decorate = false) => {
	if (decorate) {
		return JSON.stringify(string, null, 4)
	}

	return JSON.stringify(string)
}

// Get a platform-independent path
const path = require('path')
exports.diskPath = (...folders) => {
	return path.normalize(folders.join('/'))
}
