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
// Compromise, the NLP library used to extract topics from data
const nlp = require('compromise')
// Pdf parse, the library used to extract data from PDF files
const getTextFromPdf = require('pdf-parse')
// Office parser, the library used to extract data from office files
const officeParser = require('officeparser')
// Used to detect mime types based on file content
const fileTypes = require('file-type')

// Files library, used to do all file operations across platforms
const fs = require('fs-extra')
// Path library
const path = require('path')

// Logging methods and utils
const { info, error, json } = require('../utils.js')

// MARK: Config and Globals

// Define the router object, which we will add our routes to
const router = express.Router()
// Define where multer should store the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${path.normalize(`./.cache/_intel/`)}`)
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + Date.now())
  },
})

const upload = multer({ storage: storage })

// MARK: Routes

// Extract a list of topics, emails and places from the files posted
// (individually)
router.post(`/`, upload.array('content'), (req, res, next) => {
  info(
    `(Extract) Post request called with params: ${json(
      req.params
    )} and queries: ${json(req.query)}`
  )

  // Check what files have been sent
  if (req.files) {
    let files = []
    for (const fileMeta of req.files) {
      files.push({
        name: fileMeta.originalname,
        path: fileMeta.path,
      })
    }
    processFiles(files)
      .then((result) => {
        res.status(200).json({
          code: 200,
          content: result, // Send it back with a 200 response code
        })
      })
      .catch((err) => {
        error(err)
        next(err) // Forward the error to our error handler
      })
  } else if (req.body.content) {
    // If there are no files check if there are URIs to files
  } else {
    // Ask for some files at least
    next(
      new BadRequestError(
        "Please upload the files as multipart form data, or specify an array of URIs to the files in the 'content' field of the request body"
      )
    ) // Pass the error to our error handler
  }
})

// MARK: Functions

// Get the file's extension
async function getFileExt(filePath) {
  let ext = ((await fileTypes.fromFile(filePath)) || {}).ext
  if (!ext) {
    ext = path.extname(filePath).toLowerCase().substr(1)
  }
  return ext
}

// Extract the text from a file
async function extractTextFromFile(filePath) {
  let text = ''
  let ext = await getFileExt(filePath)
  switch (ext) {
    case 'docx':
    case 'pptx':
    case 'xlsx':
    case 'odt':
    case 'odp':
    case 'ods':
      text = await new Promise((resolve, reject) => {
        officeParser.parseOffice(filePath, function (data, err) {
          if (err) reject(err)
          if (data) resolve(data)
        })
      })
      break
    case 'pdf':
      text = await getTextFromPdf(await fs.readFile(filePath))
      break
    default:
      text = ((await fs.readFile(filePath)) || '').toString('ascii')
      break
  }
  return text
}

function extractTopicsPeopleAndPlacesFromText(name, text, results) {
  // Extract the keywords from the text
  const keywords = nlp(text).topics().json()
  // Create a copy of the results to add on to
  let newResults = results
  // Loop through them
  for (const keyword of keywords) {
    // Get the tags associated with each word in the text
    let terms = keyword.terms
    // Get the topic or person or place
    let topicWords = []
    let personWords = []
    let placeWords = []
    for (const term of terms) {
      // Sort the results
      if (
        term.tags &&
        term.tags.indexOf('Person') !== -1 &&
        (term.tags.indexOf('FirstName') !== -1 ||
          term.tags.indexOf('LastName') !== -1)
      ) {
        // If the tags contain Person, add it to the people
        // results
        personWords.push(term.text)
      } else if (term.tags && term.tags.indexOf('Place') !== -1) {
        // If the tags contain Place, add it to the people
        // results
        placeWords.push(term.text)
      } else if (
        term.tags &&
        term.tags.indexOf('ProperNoun') !== -1 &&
        term.tags.indexOf('Person') === -1
      ) {
        // If the tags contain ProperNoun, add it to the topic
        // results
        topicWords.push(term.text)
      }
    }

    if (topicWords.length > 0) {
      newResults.topics.push({
        text: topicWords.join(' '),
        file: name,
      })
    }

    if (personWords.length > 0) {
      newResults.people.push({
        text: personWords.join(' '),
        file: name,
      })
    }

    if (placeWords.length > 0) {
      newResults.places.push({
        text: placeWords.join(' '),
        file: name,
      })
    }
  }

  return newResults
}

// Put together the above functions and run them for each file
async function processFiles(files) {
  // Check if there are any files
  if (files) {
    // If there are, loop through them and get topics, people and places
    let results = {
      topics: [],
      people: [],
      places: [],
    }

    // Loop through the files
    for (const file of files) {
      // Extract the text from the file
      const text = await extractTextFromFile(file.path)
      // Proccess that text using the NLP library and add the results
      results = extractTopicsPeopleAndPlacesFromText(
        file.name,
        text,
        results
      )
    }

    // Return successfully
    return results
  } else {
    // Return null if there are no files
    return null
  }
}

// MARK: Exports

exports.router = router
