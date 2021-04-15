/* Dabbu Files API Server - internal.js
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

/* eslint promise/prefer-await-to-then: 0 */

// MARK: Imports

// Express JS, the library used to run the server and respond to HTTP requests
const express = require('express')
// Multer, the library used to handle file upload for POST and PUT requests
const multer = require('multer')

// The library used to extract text out of MS Office and PDF files
const extractText = require('office-text-extractor')
// The library used to extract keywords
const lda = require('lda')
// Helper function to return keywords in an object format
const extractTopics = (sentences) => {
	// Run the LDA library on it (10 clusters of five terms each)
	const result = lda(sentences, 10, 5)

	// Get an array of keywords from it
	const finalResult = []
	// Add two keywords from each cluster
	for (const terms of result) {
		let i = 0
		if (terms[i]) {
			while (terms[i] && finalResult.includes(terms[i].term)) {
				i += 1
			}

			if (terms[i]) {
				finalResult.push(terms[i].term)
				i += 1
			}
		}

		if (terms[i]) {
			while (terms[i] && finalResult.includes(terms[i].term)) {
				i += 1
			}

			if (terms[i]) {
				finalResult.push(terms[i].term)
			}
		}
	}

	// Return the final array of keywords
	return finalResult
}

// The library used to detect names of a country
const detectPlace = require('country-in-text-detector').detect

// Files library, used to do all file operations across platforms
const fs = require('fs-extra')
// Path library
const path = require('path')

// Custom errors we throw
const { BadRequestError } = require('../errors.js')
// Logging methods and utils
const { info, error, json } = require('../utils.js')

// MARK: Config and Globals

// Define the router object, which we will add our routes to
// eslint-disable-next-line new-cap
const router = express.Router()
// Define where multer should store the uploaded files
const upload = multer({ dest: path.normalize(`./_dabbu/_intel/`) })

// MARK: Routes

// Extract a list of topics, emails and places from the files posted
// (individually)
router.post(`/`, upload.array('content'), (request, response, next) => {
	info(
		`(Extract) Post request called with params: ${json(
			request.params
		)} and queries: ${json(request.query)}`
	)

	// Check what files have been sent
	if (request.files) {
		const files = []
		for (const fileMeta of request.files) {
			files.push({
				name: fileMeta.originalname,
				path: fileMeta.path
			})
		}

		processFiles(files)
			.then((result) => {
				response.status(200).json({
					code: 200,
					content: result // Send it back with a 200 response code
				})
			})
			.catch((error_) => {
				error(error_)
				next(error_) // Forward the error to our error handler
			})
	} else if (request.body.content) {
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

// Extract key phrases from text
async function extractCommonWords(name, text) {
	// Check if the text is non null
	if (!text) return null
	// Extract the topics from the text
	let results = extractTopics(text.split('\n'))

	// Remove duplicates (not required, but to be safe)
	results = [...new Set(results)]

	// Convert it to an array of objects and add the file name
	results = results.map((term) => {
		return {
			text: term,
			file: name
		}
	})

	// Return sucessfully
	return results
}

// Extract emails from text
async function extractEmails(name, text) {
	// Check if the text is non null
	if (!text) return null
	// The regex to extract emails
	// https://github.com/gajus/extract-email-address/blob/b03017003379dca189e30512158309d2ba3eddbb/src/extractEmail.js#L10
	let matches =
		text.match(
			/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))/g
		) || []

	// Remove duplicates (definitely required, if the same email is
	// mentioned more than once)
	matches = [...new Set(matches)]

	// Convert it to an array of objects and add the file name
	matches = matches.map((match) => {
		return {
			email: match,
			file: name
		}
	})

	// Return sucessfully
	return matches
}

// Extract places from text
// FLAW: Does NOT work for all places
async function extractPlaces(name, text) {
	// Check if the text is non null
	if (!text) return null
	let matches = detectPlace(text)

	// Convert it to an array of objects and add the file name
	matches = matches.map((match) => {
		return {
			place: match.name,
			type: match.type,
			country: match.iso3166,
			file: name
		}
	})

	// Return sucessfully
	return matches
}

// Put together the above functions and run them for each file
async function processFiles(files) {
	// Check if there are any files
	if (files) {
		// If there are, loop through them and get topics, people and places
		const results = {
			topics: [],
			people: [],
			places: []
		}
		for (const file of files) {
			// Extract the text from the file
			// eslint-disable-next-line no-await-in-loop
			const text = await extractText(path.normalize(file.path))
			// Proccess that text using the NLP library and add the results
			results.topics.push(
				// eslint-disable-next-line no-await-in-loop
				...((await extractCommonWords(file.name, text)) || [])
			)
			// eslint-disable-next-line no-await-in-loop
			results.people.push(...((await extractEmails(file.name, text)) || []))
			// eslint-disable-next-line no-await-in-loop
			results.places.push(...((await extractPlaces(file.name, text)) || []))
		}

		// Return successfully
		return results
	}

	// Return null if there are no files
	return null
}

// MARK: Exports

exports.router = router
