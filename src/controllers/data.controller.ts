// Use the office-text-extractor library to extract text from files
import extractText from 'office-text-extractor'
// The library used to extract keywords
import Lda from 'lda'

// Helper function to return keywords in an object format
function extractTopics(text: string): Array<string> {
	// Separate the text into sentences
	const sentences = text.split('\n')
	// Run the LDA library on it (10 clusters of five terms each)
	const result = Lda(sentences, 10, 5)

	// Get an array of keywords from it
	const finalResult: Array<string> = []
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

// Helper function to extract emails from text
function extractEmails(text: string): Array<string> {
	// The regex to extract emails
	// https://github.com/gajus/extract-email-address/blob/b03017003379dca189e30512158309d2ba3eddbb/src/extractEmail.js#L10
	let matches =
		text.match(
			/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))/g,
		) || []

	// Remove duplicates (definitely required, if the same email is
	// mentioned more than once)
	matches = [...new Set(matches)]
	matches = matches.map((match) => match)

	// Return sucessfully
	return matches
}

// Helper function to check if a certain keyword exists
function extractUserKeywords(
	text: string,
	keywordTopicMap: Record<string, string | Array<string>>,
): Array<string> {
	// If a regex from the keywordTopicMap is found in the text, return that topic
	let topics: Array<string> = []
	// Run the regex
	for (const [topic, regexes] of Object.entries(keywordTopicMap)) {
		if (typeof regexes === 'string') {
			if (new RegExp(regexes).test(text)) {
				topics = [...topics, topic]
			}
		}

		if (Array.isArray(regexes)) {
			for (const regex of regexes) {
				if (new RegExp(regex).test(text)) {
					topics = [...topics, topic]
				}
			}
		}
	}

	// Return sucessfully
	return topics
}

// Import the logger
import Logger from '../utils/logger.util'
// Import necessary types
import { Request, Response, NextFunction } from 'express'
import { MissingParameterError } from '../utils/errors.util'
// Import utility functions
import { json } from '../utils/general.util'

// The handlers for the various operations on the /data route

// Extract info request (POST)
export async function extractInfo(
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<void> {
	// Always forward errors to error handling middleware
	try {
		if (!request.files || !Array.isArray(request.files)) {
			throw new MissingParameterError(
				'Missing files under `content` field in request body',
			)
		}

		// The topics extracted from all files
		const topics: Record<string, Array<string>> = {}
		// The emails (people) extracted from all files
		const people: Record<string, Array<string>> = {}

		// The following if statement is required to keep typescript happy,
		// even though we already check this is in the first if statement
		// above
		if (Array.isArray(request.files)) {
			for (const file of request.files) {
				// First get the text from the file
				const text = await extractText(file.path)

				// Skip the extraction process if the text is null
				if (!text) {
					continue
				}

				// Then run the topic extractor
				const extractedTopics = extractTopics(text)
				// Add the topics to the list
				for (const topic of extractedTopics) {
					if (topics[topic]) {
						topics[topic] = [...topics[topic], file.originalname]
					} else {
						topics[topic] = [file.originalname]
					}
				}

				// Then run the email extractor
				const extractedEmails = extractEmails(text)
				// Add the topics to the list
				for (const email of extractedEmails) {
					if (people[email]) {
						people[email] = [...people[email], file.originalname]
					} else {
						people[email] = [file.originalname]
					}
				}

				// Then run the topic extractor
				const userTopics = extractUserKeywords(
					text,
					JSON.parse(request.body.keywords || '{}'),
				)
				// Add the topics to the list
				for (const topic of userTopics) {
					if (topics[topic]) {
						topics[topic] = [...topics[topic], file.originalname]
					} else {
						topics[topic] = [file.originalname]
					}
				}
			}
		}

		response.status(200).send({
			code: 200,
			content: {
				topics,
				people,
			},
		})
	} catch (error) {
		Logger.error(`controller.data.extractInfo: caught error: ${error}`)
		// If an error is caught, forward it to the error handler
		next(error)
	}
}
