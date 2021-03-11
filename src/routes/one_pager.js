/* Dabbu Files API Server - internal.js
 * Copyright (C) 2021  gamemaker1
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
// Multer, the library used to handle file upload for POST and PUT requests
const multer = require('multer')

// Path library
const path = require('path')

// Logging methods and utils
const { info, json } = require('../utils.js')

// MARK: Config and Globals

// Define the router object, which we will add our routes to
const router = express.Router()
// Define where multer should store the uploaded files
const upload = multer({ dest: path.normalize(`./_dabbu/_intel/`) })

// MARK: Routes

// Generate a one-pager of all the files posted (together)
router.post(`/`, upload.array('content'), (req, res, next) => {
  info(
    `(One Pager) Post request called with params: ${json(
      req.params
    )} and queries: ${json(req.query)}`
  )

  console.log(req.files)

  // Do nothing ... YET
  res.sendStatus(200)
})

// MARK: Exports

exports.router = router
