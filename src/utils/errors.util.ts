// The error handler and all errors thrown intentionally are defined here

// Import utility functions
import { isDabbuError } from './guards.util'
import { json } from './general.util'
// Import the logger
import Logger from './logger.util'

// Import necessary types
import { Request, Response, NextFunction } from 'express'

// The superclass for custom errors that Dabbu Intel API Server can throw
export class DabbuError extends Error {
	// It must have an HTTP response code, a user-friendly message and a
	// computer-friendly reason
	code: number
	message: string
	reason: string
	isDabbuError: true

	constructor(code: number, message: string, reason: string) {
		super()
		this.code = code
		this.message = message
		this.reason = reason
		this.isDabbuError = true
	}
}

// Bad request; returned if the URL has any typos or mistakes
export class BadRequestError extends DabbuError {
	constructor(message: string) {
		// Log it
		Logger.debug(
			`objects.dabbu-error: BadRequestError thrown: ${message}`,
		)
		super(400, message, 'malformedUrl')
	}
}
// Missing provider specific variable in the request body; but returns a 400
// bad request code
export class MissingParameterError extends DabbuError {
	constructor(message: string) {
		// Log it
		Logger.debug(
			`objects.dabbu-error: MissingParameterError thrown: ${message}`,
		)
		super(400, message, 'missingParam')
	}
}
// Invalid client ID - API key pair in the request header
export class InvalidCredentialsError extends DabbuError {
	constructor(message: string) {
		// Log it
		Logger.debug(
			`objects.dabbu-error: InvalidCredentialsError thrown: ${message}`,
		)
		super(401, message, 'invalidCredentials')
	}
}
// Missing client ID - API key pair in the request header
export class MissingCredentialsError extends DabbuError {
	constructor(message: string) {
		// Log it
		Logger.debug(
			`objects.dabbu-error: MissingCredentialsError thrown: ${message}`,
		)
		super(403, message, 'missingCredentials')
	}
}

// The custom error handler we use on the server
export default function errorHandler(
	error: Error,
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	// Log it
	Logger.debug(`middleware.error: error forwarded to handler`)
	if (isDabbuError(error)) {
		// Log it
		Logger.error(
			`middleware.error: dabbu error thrown - ${json({
				code: error.code,
				error: {
					message: error.message,
					reason: error.reason,
				},
			})}`,
		)
		// If it is a custom error, return the code, message and reason accordingly
		response.status(error.code).json({
			code: error.code,
			error: {
				message: error.message,
				reason: error.reason,
			},
		})
	} else {
		// Log it
		Logger.error(`middleware.error: server crash - ${error}`)
		console.error(error)
		// Else the server has crashed, return an internalServerError
		response.status(500).json({
			code: 500,
			error: {
				message: error.message,
				reason: 'internalServerError',
			},
		})
	}
}
